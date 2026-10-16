package com.example

import android.Manifest
import android.annotation.SuppressLint
import android.app.AlarmManager
import android.app.DownloadManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.content.res.Configuration
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.print.PrintAttributes
import android.print.PrintDocumentAdapter
import android.print.PrintManager
import android.speech.tts.TextToSpeech
import android.view.View
import android.view.WindowManager
import android.webkit.JavascriptInterface
import android.webkit.PermissionRequest
import android.webkit.URLUtil
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import java.io.File
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

    companion object {
        private const val PREFS_NAME = "phrasal_verbs_offline_prefs"
        const val PRODUCTION_URL = "https://english-app-frontend-3j9w.onrender.com"
        const val LOCAL_ASSET_URL = "file:///android_asset/index.html"
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

        // Configure WebView settings for full WebGL support, inline audio/video, and resilience
        @Suppress("DEPRECATION")
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            cacheMode = WebSettings.LOAD_DEFAULT
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

        android.webkit.WebView.setWebContentsDebuggingEnabled(true)

        // Native Android DownloadManager listener for PDF files and offline assets
        webView.setDownloadListener { url, userAgent, contentDisposition, mimetype, _ ->
            try {
                val fileName = URLUtil.guessFileName(url, contentDisposition, mimetype)
                val request = DownloadManager.Request(Uri.parse(url))
                request.setMimeType(mimetype)
                request.addRequestHeader("User-Agent", userAgent)
                request.setDescription("Descargando archivo...")
                request.setTitle(fileName)
                request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName)
                val dm = getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
                dm.enqueue(request)
                Toast.makeText(applicationContext, "Descargando PDF...", Toast.LENGTH_SHORT).show()
            } catch (e: Throwable) {
                android.util.Log.e("DownloadListener", "Error initiating download: ${e.message}")
                Toast.makeText(applicationContext, "Error al iniciar descarga", Toast.LENGTH_SHORT).show()
            }
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

        // Expose native TextToSpeech, SharedPreferences, and Notification bridge to JavaScript
        webView.addJavascriptInterface(AndroidNativeBridge(), "AndroidBridge")

        // Intercept Android Back Button so user can navigate back in WebView history if canGoBack() is true
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
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
        webView.destroy()
        tts?.stop()
        tts?.shutdown()
        super.onDestroy()
    }
}
