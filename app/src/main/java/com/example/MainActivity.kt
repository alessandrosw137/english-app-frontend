package com.example

import android.Manifest
import android.annotation.SuppressLint
import android.app.AlarmManager
import android.app.AlertDialog
import android.app.DownloadManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.ActivityInfo
import android.content.pm.PackageManager
import android.content.res.Configuration
import android.graphics.Color
import android.graphics.Typeface
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.print.PrintAttributes
import android.print.PrintDocumentAdapter
import android.print.PrintManager
import android.provider.MediaStore
import android.speech.tts.TextToSpeech
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.webkit.CookieManager
import android.webkit.JavascriptInterface
import android.webkit.PermissionRequest
import android.webkit.URLUtil
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import java.util.Calendar
import java.util.Locale

class MainActivity : ComponentActivity(), TextToSpeech.OnInitListener {

    private lateinit var webView: WebView
    private var tts: TextToSpeech? = null
    private var ttsReady = false

    // Hardware acceleration explicitly enabled for WebGL and smooth rendering
    private val hardwareAccelerated: Boolean = true

    // Pending permission request for WebChromeClient (Speaking Coach / Microphone capture)
    private var pendingPermissionRequest: PermissionRequest? = null

    // Track offline fallback state to avoid infinite reload loops
    private var isOfflineFallbackLoaded: Boolean = false

    // State flag for mandatory in-app force update
    private var isForceUpdateActive: Boolean = false

    // Broadcast receiver to notify user when background DownloadManager finishes downloading
    private val downloadCompleteReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (intent?.action == DownloadManager.ACTION_DOWNLOAD_COMPLETE) {
                runOnUiThread {
                    Toast.makeText(this@MainActivity, "Descarga completada en la carpeta Descargas", Toast.LENGTH_LONG).show()
                }
            }
        }
    }

    companion object {
        private const val PREFS_NAME = "phrasal_verbs_offline_prefs"
        const val PRODUCTION_URL = "https://english-app-frontend-3j9w.onrender.com"
        const val LOCAL_ASSET_URL = "file:///android_asset/index.html"
        const val CURRENT_APP_VERSION = 1
    }

    // Permission launcher for Android 13+ (POST_NOTIFICATIONS)
    private val notificationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) {
            scheduleDailyStudyReminder(21, 0)
        }
    }

    // Permission launcher for Microphone (RECORD_AUDIO for Speaking Coach in Cuentos)
    private val audioPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        pendingPermissionRequest?.let { req ->
            if (isGranted) {
                req.grant(req.resources)
            } else {
                if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) {
                    req.grant(req.resources)
                } else {
                    req.deny()
                }
            }
            pendingPermissionRequest = null
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Enable hardware acceleration at Window level for high-performance WebGL and 3D Canvas
        if (hardwareAccelerated) {
            window.setFlags(
                WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
                WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED
            )
        }

        // Clean up any corrupt or misconfigured WebView cache directories and ensure structure exists
        try {
            val defaultWebViewDir = File(cacheDir, "WebView/Default")
            val httpCacheDir = File(defaultWebViewDir, "HTTP Cache")
            val badNestedCodeCache = File(httpCacheDir, "Code Cache")
            if (badNestedCodeCache.exists()) {
                httpCacheDir.deleteRecursively()
            }
            // Ensure proper code cache directories exist at both valid and expected Chromium fallback paths
            File(defaultWebViewDir, "Code Cache/wasm").mkdirs()
            File(defaultWebViewDir, "Code Cache/js").mkdirs()
            File(httpCacheDir, "Code Cache/wasm").mkdirs()
            File(httpCacheDir, "Code Cache/js").mkdirs()
        } catch (_: Throwable) {}

        setContentView(R.layout.activity_main)

        // Pre-warm Android native TextToSpeech engine in en-US
        tts = TextToSpeech(applicationContext, this)

        webView = findViewById(R.id.webView)

        // Enable hardware layer on WebView for accelerated WebGL 3D rendering
        if (hardwareAccelerated) {
            webView.setLayerType(View.LAYER_TYPE_HARDWARE, null)
        }

        // Handle window insets gracefully for system status bar & navigation bar
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.rootLayout)) { view, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            view.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // Configure WebView settings with strict NO_CACHE to ensure always querying live Render app
        @Suppress("DEPRECATION")
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            cacheMode = WebSettings.LOAD_NO_CACHE
            mediaPlaybackRequiresUserGesture = false

            // WebGL & Rendering configurations
            loadsImagesAutomatically = true
            javaScriptCanOpenWindowsAutomatically = true
            loadWithOverviewMode = true
            useWideViewPort = true
            displayZoomControls = false
            builtInZoomControls = false
            setSupportZoom(false)

            allowFileAccess = true
            allowContentAccess = true
            allowFileAccessFromFileURLs = true
            allowUniversalAccessFromFileURLs = true
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        }

        // Strictly clear cache to guarantee loading latest deployed changes
        webView.clearCache(true)

        android.webkit.WebView.setWebContentsDebuggingEnabled(true)

        // Native Android Download listener for Blobs, Base64 data URIs, and HTTP/HTTPS PDFs
        webView.setDownloadListener { url, userAgent, contentDisposition, mimetype, _ ->
            try {
                if (url.startsWith("blob:") || url.startsWith("data:")) {
                    handleBlobOrDataDownload(url, mimetype, contentDisposition)
                } else if (url.startsWith("http://") || url.startsWith("https://")) {
                    handleHttpDownload(url, userAgent, contentDisposition, mimetype)
                }
            } catch (e: Throwable) {
                android.util.Log.e("DownloadListener", "Error in download listener: ${e.message}", e)
                Toast.makeText(applicationContext, "Error al iniciar descarga", Toast.LENGTH_SHORT).show()
            }
        }

        // Register download complete broadcast receiver
        val filter = IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(downloadCompleteReceiver, filter, Context.RECEIVER_EXPORTED)
        } else {
            registerReceiver(downloadCompleteReceiver, filter)
        }

        // WebChromeClient with automatic microphone permissions for Cuentos Speaking Coach
        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest?) {
                if (request == null) return
                runOnUiThread {
                    val resources = request.resources
                    val needsAudio = resources.contains(PermissionRequest.RESOURCE_AUDIO_CAPTURE)
                    if (needsAudio) {
                        if (ContextCompat.checkSelfPermission(this@MainActivity, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) {
                            request.grant(resources)
                        } else {
                            pendingPermissionRequest = request
                            audioPermissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
                        }
                    } else {
                        // Grant any other requested web resource (e.g. protected media, video capture)
                        request.grant(resources)
                    }
                }
            }

            override fun onPermissionRequestCanceled(request: PermissionRequest?) {
                super.onPermissionRequestCanceled(request)
                if (pendingPermissionRequest == request) {
                    pendingPermissionRequest = null
                }
            }

            override fun onConsoleMessage(consoleMessage: android.webkit.ConsoleMessage?): Boolean {
                android.util.Log.e("WebConsole", "${consoleMessage?.message()} [line ${consoleMessage?.lineNumber()} of ${consoleMessage?.sourceId()}]")
                return true
            }
        }

        // WebViewClient to keep all navigation inside WebView, inject environment config, and fallback to local assets on error
        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                val apiKey = BuildConfig.GEMINI_API_KEY
                view?.evaluateJavascript("window.GEMINI_API_KEY = '$apiKey';", null)
            }

            private fun handleShouldOverrideUrl(url: String): Boolean {
                if (url.isBlank()) return false

                // Recursos internos que permanecen dentro del WebView
                if (url.startsWith("file:///android_asset/") ||
                    url.startsWith("data:") ||
                    url.startsWith("blob:")
                ) {
                    return false
                }

                // Interceptar URLs de autenticación de Google (OAuth) o enlaces externos
                val isGoogleAuth = url.contains("accounts.google.com") || url.contains("cuentas.google.com")
                val isAppHost = url.startsWith("https://english-app-frontend-3j9w.onrender.com")

                if (isGoogleAuth || !isAppHost) {
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                    startActivity(intent)
                    return true
                }
                return false
            }

            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: ""
                return handleShouldOverrideUrl(url)
            }

            @Suppress("DEPRECATION")
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                return handleShouldOverrideUrl(url ?: "")
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                if (request?.isForMainFrame == true) {
                    val failingUrl = request.url?.toString() ?: ""
                    if (!failingUrl.startsWith("file:///android_asset/") && !isOfflineFallbackLoaded) {
                        isOfflineFallbackLoaded = true
                        view?.post {
                            view.loadUrl(LOCAL_ASSET_URL)
                        }
                    }
                }
            }

            @Suppress("DEPRECATION")
            override fun onReceivedError(
                view: WebView?,
                errorCode: Int,
                description: String?,
                failingUrl: String?
            ) {
                super.onReceivedError(view, errorCode, description, failingUrl)
                if (failingUrl != null && !failingUrl.startsWith("file:///android_asset/") && !isOfflineFallbackLoaded) {
                    isOfflineFallbackLoaded = true
                    view?.post {
                        view.loadUrl(LOCAL_ASSET_URL)
                    }
                }
            }
        }

        // Expose native TextToSpeech, SharedPreferences, File Downloads, and Notification bridge to JavaScript
        webView.addJavascriptInterface(AndroidNativeBridge(), "AndroidBridge")
        webView.addJavascriptInterface(AndroidNativeBridge(), "AndroidInterface")

        // Intercept Android Back Button so user can navigate back in WebView history if canGoBack() is true
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (isForceUpdateActive) {
                    // Prevent leaving the force update screen
                    return
                }
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })

        // Request runtime permissions and schedule daily study reminder
        checkAndRequestAppPermissions()

        // Asynchronous check for mandatory in-app force update
        checkForAppUpdate()

        // Resilient loading: if savedInstanceState is present, restore WebView state without reloading; otherwise load URL
        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState)
        } else {
            if (isNetworkAvailable()) {
                webView.loadUrl(PRODUCTION_URL)
            } else {
                isOfflineFallbackLoaded = true
                webView.loadUrl(LOCAL_ASSET_URL)
            }
        }
    }

    private fun handleBlobOrDataDownload(url: String, mimetype: String, contentDisposition: String) {
        val cleanFileName = if (contentDisposition.isNotBlank()) {
            URLUtil.guessFileName(url, contentDisposition, mimetype)
        } else {
            "Document_${System.currentTimeMillis()}.${if (mimetype.contains("pdf", ignoreCase = true)) "pdf" else "bin"}"
        }

        if (url.startsWith("data:")) {
            saveBase64ToDownloads(url, mimetype, cleanFileName)
        } else {
            // Blob URL: fetch blob content via JavaScript and stream to AndroidBridge
            val safeMime = if (mimetype.isBlank()) "application/pdf" else mimetype
            val js = """
                (function() {
                    try {
                        var xhr = new XMLHttpRequest();
                        xhr.open('GET', '$url', true);
                        xhr.responseType = 'blob';
                        xhr.onload = function() {
                            if (this.status === 200 || this.status === 0) {
                                var reader = new FileReader();
                                reader.onloadend = function() {
                                    if (window.AndroidBridge && window.AndroidBridge.saveBlob) {
                                        window.AndroidBridge.saveBlob(reader.result, '$safeMime', '$cleanFileName');
                                    }
                                };
                                reader.readAsDataURL(this.response);
                            }
                        };
                        xhr.onerror = function() {
                            fetch('$url')
                                .then(function(res) { return res.blob(); })
                                .then(function(blob) {
                                    var reader = new FileReader();
                                    reader.onloadend = function() {
                                        if (window.AndroidBridge && window.AndroidBridge.saveBlob) {
                                            window.AndroidBridge.saveBlob(reader.result, '$safeMime', '$cleanFileName');
                                        }
                                    };
                                    reader.readAsDataURL(blob);
                                })
                                .catch(function(err) {
                                    console.error('Blob download error:', err);
                                });
                        };
                        xhr.send();
                    } catch (e) {
                        console.error('Blob fetch exception:', e);
                    }
                })();
            """.trimIndent()
            webView.evaluateJavascript(js, null)
        }
    }

    private fun handleHttpDownload(url: String, userAgent: String, contentDisposition: String, mimetype: String) {
        val fileName = "MasterENG_Glosario.pdf"
        val request = DownloadManager.Request(Uri.parse(url)).apply {
            setMimeType(if (mimetype.isNotBlank()) mimetype else "application/pdf")
            addRequestHeader("User-Agent", userAgent)
            val cookie = CookieManager.getInstance().getCookie(url)
            if (!cookie.isNullOrBlank()) {
                addRequestHeader("Cookie", cookie)
            }
            setDescription("Descargando archivo...")
            setTitle(fileName)
            setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
            setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName)
        }
        val dm = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
        dm.enqueue(request)
        Toast.makeText(this@MainActivity, "Descarga completada en la carpeta Descargas", Toast.LENGTH_LONG).show()
    }

    fun saveBase64ToDownloads(base64Data: String, mimeType: String?, fileName: String?) {
        try {
            val pureBase64 = if (base64Data.contains(",")) {
                base64Data.substringAfter(",")
            } else {
                base64Data
            }
            val bytes = android.util.Base64.decode(pureBase64, android.util.Base64.DEFAULT)
            val resolvedMime = if (mimeType.isNullOrBlank()) "application/pdf" else mimeType
            val resolvedName = if (!fileName.isNullOrBlank()) {
                fileName
            } else {
                val ext = if (resolvedMime.contains("pdf", ignoreCase = true)) "pdf" else "bin"
                "Document_${System.currentTimeMillis()}.$ext"
            }
            saveBytesToDownloads(bytes, resolvedName, resolvedMime)
        } catch (e: Throwable) {
            android.util.Log.e("DownloadListener", "Error decoding base64 blob: ${e.message}", e)
            runOnUiThread {
                Toast.makeText(this@MainActivity, "Error al procesar archivo", Toast.LENGTH_SHORT).show()
            }
        }
    }

    fun saveBytesToDownloads(bytes: ByteArray, fileName: String, mimeType: String) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val contentValues = ContentValues().apply {
                    put(MediaStore.MediaColumns.DISPLAY_NAME, fileName)
                    put(MediaStore.MediaColumns.MIME_TYPE, mimeType)
                    put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
                }
                val resolver = applicationContext.contentResolver
                val uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, contentValues)
                if (uri != null) {
                    resolver.openOutputStream(uri)?.use { os ->
                        os.write(bytes)
                        os.flush()
                    }
                } else {
                    throw Exception("MediaStore insert returned null URI")
                }
            } else {
                val dir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
                if (!dir.exists()) dir.mkdirs()
                val file = File(dir, fileName)
                file.outputStream().use { os ->
                    os.write(bytes)
                    os.flush()
                }
            }
            runOnUiThread {
                Toast.makeText(this@MainActivity, "Descarga completada en la carpeta Descargas", Toast.LENGTH_LONG).show()
            }
        } catch (e: Throwable) {
            android.util.Log.e("DownloadListener", "Error writing to downloads: ${e.message}", e)
            runOnUiThread {
                Toast.makeText(this@MainActivity, "Error al guardar descarga", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun checkForAppUpdate() {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val url = URL("$PRODUCTION_URL/api/app/version")
                val connection = (url.openConnection() as HttpURLConnection).apply {
                    requestMethod = "GET"
                    connectTimeout = 5000
                    readTimeout = 5000
                    setRequestProperty("Accept", "application/json")
                }
                val responseCode = connection.responseCode
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    val responseBody = connection.inputStream.bufferedReader().use { it.readText() }
                    val json = JSONObject(responseBody)
                    val forceUpdate = json.optBoolean("forceUpdate", false)
                    val minRequiredVersion = json.optInt("minRequiredVersion", 0)
                    val remoteVersion = when {
                        json.has("remoteVersion") -> json.getInt("remoteVersion")
                        json.has("version") -> json.getInt("version")
                        json.has("versionCode") -> json.getInt("versionCode")
                        else -> CURRENT_APP_VERSION
                    }
                    val updateUrl = when {
                        json.has("updateUrl") -> json.getString("updateUrl")
                        json.has("update_url") -> json.getString("update_url")
                        json.has("download_url") -> json.getString("download_url")
                        json.has("apk_url") -> json.getString("apk_url")
                        json.has("url") -> json.getString("url")
                        else -> PRODUCTION_URL
                    }
                    if (forceUpdate || minRequiredVersion > CURRENT_APP_VERSION || remoteVersion > CURRENT_APP_VERSION) {
                        withContext(Dispatchers.Main) {
                            showForceUpdateModal(updateUrl)
                        }
                    }
                }
            } catch (e: Throwable) {
                android.util.Log.d("AppVersionCheck", "Version check skipped or offline: ${e.message}")
            }
        }
    }

    private fun showForceUpdateModal(updateUrl: String) {
        isForceUpdateActive = true

        // 1. Add full-screen native overlay view to completely block interaction with WebView underneath
        val rootLayout = findViewById<FrameLayout>(R.id.rootLayout)
        val overlayView = LinearLayout(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setBackgroundColor(Color.parseColor("#0F172A"))
            setPadding(64, 64, 64, 64)
            isClickable = true
            isFocusable = true

            val titleView = TextView(this@MainActivity).apply {
                text = "Actualización Requerida"
                setTextColor(Color.WHITE)
                textSize = 22f
                typeface = Typeface.DEFAULT_BOLD
                gravity = Gravity.CENTER
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    bottomMargin = 24
                }
            }
            addView(titleView)

            val msgView = TextView(this@MainActivity).apply {
                text = "Hay una versión más reciente de MasterENG disponible para tu teléfono."
                setTextColor(Color.parseColor("#E2E8F0"))
                textSize = 16f
                gravity = Gravity.CENTER
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    bottomMargin = 48
                }
            }
            addView(msgView)

            val btnUpdate = Button(this@MainActivity).apply {
                text = "Actualizar"
                setBackgroundColor(Color.parseColor("#3B82F6"))
                setTextColor(Color.WHITE)
                textSize = 16f
                typeface = Typeface.DEFAULT_BOLD
                setPadding(48, 24, 48, 24)
                setOnClickListener {
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(updateUrl)).apply {
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK
                    }
                    startActivity(intent)
                }
            }
            addView(btnUpdate)
        }
        rootLayout.addView(overlayView)

        // 2. Present a non-dismissible modal AlertDialog
        val dialog = AlertDialog.Builder(this)
            .setTitle("Actualización Requerida")
            .setMessage("Hay una versión más reciente de MasterENG disponible para tu teléfono.")
            .setCancelable(false)
            .setPositiveButton("Actualizar") { _, _ ->
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(updateUrl)).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                }
                startActivity(intent)
            }
            .create()
        dialog.setCanceledOnTouchOutside(false)
        dialog.show()
    }

    private fun isNetworkAvailable(): Boolean {
        return try {
            val connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as? ConnectivityManager
            val network = connectivityManager?.activeNetwork ?: return false
            val capabilities = connectivityManager.getNetworkCapabilities(network) ?: return false
            capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
        } catch (_: Throwable) {
            false
        }
    }

    private fun checkAndRequestAppPermissions() {
        // Notification permission for Android 13+ (TIRAMISU)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            } else {
                scheduleDailyStudyReminder(21, 0)
            }
        } else {
            scheduleDailyStudyReminder(21, 0)
        }

        // Microphone permission for Speaking Coach
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            audioPermissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
        }
    }

    fun scheduleDailyStudyReminder(hour: Int = 21, minute: Int = 0) {
        DailyReminderReceiver().createNotificationChannel(this)

        val alarmManager = getSystemService(Context.ALARM_SERVICE) as? AlarmManager ?: return
        val intent = Intent(this, DailyReminderReceiver::class.java)
        val pendingIntent = PendingIntent.getBroadcast(
            this,
            100,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val calendar = Calendar.getInstance().apply {
            timeInMillis = System.currentTimeMillis()
            set(Calendar.HOUR_OF_DAY, hour)
            set(Calendar.MINUTE, minute)
            set(Calendar.SECOND, 0)
            set(Calendar.MILLISECOND, 0)
            if (timeInMillis <= System.currentTimeMillis()) {
                add(Calendar.DAY_OF_YEAR, 1)
            }
        }

        alarmManager.setInexactRepeating(
            AlarmManager.RTC_WAKEUP,
            calendar.timeInMillis,
            AlarmManager.INTERVAL_DAY,
            pendingIntent
        )
    }

    fun triggerTestNotification() {
        DailyReminderReceiver().onReceive(this, null)
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val result = tts?.setLanguage(Locale.US)
            ttsReady = (result != TextToSpeech.LANG_MISSING_DATA && result != TextToSpeech.LANG_NOT_SUPPORTED)
            if (ttsReady) {
                // Speech rate optimized to 0.95 for clear comprehension
                tts?.setSpeechRate(0.95f)
            }
        }
    }

    inner class AndroidNativeBridge {
        @JavascriptInterface
        fun getApiKey(): String = BuildConfig.GEMINI_API_KEY

        @JavascriptInterface
        fun isTTSReady(): Boolean = ttsReady

        @JavascriptInterface
        fun speak(text: String): Boolean {
            if (ttsReady && text.isNotBlank()) {
                val res = tts?.speak(text.trim(), TextToSpeech.QUEUE_FLUSH, null, "PV_TTS")
                return res == TextToSpeech.SUCCESS
            }
            return false
        }

        @JavascriptInterface
        fun stop() {
            if (ttsReady) {
                tts?.stop()
            }
        }

        // Microphone status and request helpers for Speaking Coach
        @JavascriptInterface
        fun hasAudioPermission(): Boolean {
            return ContextCompat.checkSelfPermission(this@MainActivity, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED
        }

        @JavascriptInterface
        fun requestAudioPermission() {
            runOnUiThread {
                if (ContextCompat.checkSelfPermission(this@MainActivity, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                    audioPermissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
                }
            }
        }

        // Screen orientation controller for 3D world and user toggle
        @JavascriptInterface
        fun setScreenOrientation(mode: String) {
            runOnUiThread {
                try {
                    when (mode.lowercase().trim()) {
                        "landscape" -> requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
                        "portrait" -> requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR_PORTRAIT
                        "reverse_landscape" -> requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_REVERSE_LANDSCAPE
                        "reverse_portrait" -> requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_REVERSE_PORTRAIT
                        "sensor" -> requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR
                        "unspecified" -> requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
                        "toggle" -> toggleScreenOrientation()
                        else -> requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED
                    }
                } catch (e: Throwable) {
                    android.util.Log.e("Orientation", "Error setting orientation: ${e.message}")
                }
            }
        }

        @JavascriptInterface
        fun toggleScreenOrientation(): String {
            val isLandscape = resources.configuration.orientation == Configuration.ORIENTATION_LANDSCAPE
            val newMode = if (isLandscape) "portrait" else "landscape"
            runOnUiThread {
                try {
                    requestedOrientation = if (isLandscape) {
                        ActivityInfo.SCREEN_ORIENTATION_SENSOR_PORTRAIT
                    } else {
                        ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
                    }
                } catch (e: Throwable) {
                    android.util.Log.e("Orientation", "Error toggling orientation: ${e.message}")
                }
            }
            return newMode
        }

        @JavascriptInterface
        fun getScreenOrientation(): String {
            return if (resources.configuration.orientation == Configuration.ORIENTATION_LANDSCAPE) "landscape" else "portrait"
        }

        // SharedPreferences permanent offline storage backup
        @JavascriptInterface
        fun saveData(key: String, value: String) {
            getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .edit()
                .putString(key, value)
                .apply()
        }

        @JavascriptInterface
        fun getData(key: String, defaultValue: String): String {
            return getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .getString(key, defaultValue) ?: defaultValue
        }

        // Notification scheduling bridge
        @JavascriptInterface
        fun scheduleReminder(hour: Int, minute: Int) {
            runOnUiThread {
                scheduleDailyStudyReminder(hour, minute)
            }
        }

        @JavascriptInterface
        fun testNotification() {
            runOnUiThread {
                triggerTestNotification()
            }
        }

        // Direct Blob and Base64 download handler for PDF files and exported study guides
        @JavascriptInterface
        fun downloadBase64Pdf(base64Data: String, filename: String) {
            val cleanName = if (filename.isNotBlank()) {
                if (filename.endsWith(".pdf", ignoreCase = true)) filename else "$filename.pdf"
            } else {
                "MasterENG_Glosario.pdf"
            }
            saveBase64ToDownloads(base64Data, "application/pdf", cleanName)
        }

        @JavascriptInterface
        fun saveBlob(base64Data: String, mimeType: String?, fileName: String?) {
            saveBase64ToDownloads(base64Data, mimeType, fileName)
        }

        @JavascriptInterface
        fun getBase64FromBlobData(base64Data: String, mimeType: String?, fileName: String?) {
            saveBase64ToDownloads(base64Data, mimeType, fileName)
        }

        // Native Android Print Framework bridge for PDF generation & saving
        @JavascriptInterface
        fun printDocument(jobName: String) {
            runOnUiThread {
                try {
                    val printManager = getSystemService(Context.PRINT_SERVICE) as? PrintManager
                    val cleanJobName = if (jobName.isNotBlank()) jobName.trim() else "Glossary_Study_Guide"
                    val printAdapter: PrintDocumentAdapter = webView.createPrintDocumentAdapter(cleanJobName)
                    val printAttributes = PrintAttributes.Builder()
                        .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                        .setResolution(PrintAttributes.Resolution("pdf", "PDF", 300, 300))
                        .setMinMargins(PrintAttributes.Margins.NO_MARGINS)
                        .build()
                    printManager?.print(cleanJobName, printAdapter, printAttributes)
                } catch (e: Throwable) {
                    e.printStackTrace()
                }
            }
        }
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        // La actividad no se destruye ni reinicia ante cambios de orientación (Portrait / Landscape).
        // Se preserva la instancia activa del WebView sin recargas ni pérdida de contexto WebGL o sesiones.
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        webView.saveState(outState)
    }

    override fun onRestoreInstanceState(savedInstanceState: Bundle) {
        super.onRestoreInstanceState(savedInstanceState)
        webView.restoreState(savedInstanceState)
    }

    override fun onResume() {
        super.onResume()
        webView.onResume()
    }

    override fun onPause() {
        super.onPause()
        webView.onPause()
        tts?.stop()
    }

    override fun onDestroy() {
        try {
            unregisterReceiver(downloadCompleteReceiver)
        } catch (_: Throwable) {}
        webView.destroy()
        tts?.stop()
        tts?.shutdown()
        super.onDestroy()
    }
}
