package com.example

import android.Manifest
import android.annotation.SuppressLint
import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.view.View
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import android.print.PrintAttributes
import android.print.PrintDocumentAdapter
import android.print.PrintManager
import java.io.File
import java.util.Calendar
import java.util.Locale

class MainActivity : ComponentActivity(), TextToSpeech.OnInitListener {

    private lateinit var webView: WebView
    private var tts: TextToSpeech? = null
    private var ttsReady = false

    companion object {
        private const val PREFS_NAME = "phrasal_verbs_offline_prefs"

        init {
            try {
                android.system.Os.setenv("MESA_DEBUG", "silent", true)
                android.system.Os.setenv("MESA_LOG_FILE", "/dev/null", true)
                android.system.Os.setenv("MESA_SILENT", "1", true)
                android.system.Os.setenv("LIBGL_ALWAYS_SOFTWARE", "1", true)
                android.system.Os.setenv("GALLIUM_DRIVER", "llvmpipe", true)
                android.system.Os.setenv("EGL_LOG_LEVEL", "fatal", true)
                android.system.Os.setenv("DRM_SHIM_DEBUG", "0", true)
            } catch (_: Throwable) {}
        }
    }

    // Permission launcher for Android 13+ (POST_NOTIFICATIONS)
    private val notificationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) {
            scheduleDailyStudyReminder(21, 0)
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

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
        try {
            webView.setLayerType(View.LAYER_TYPE_SOFTWARE, null)
        } catch (_: Throwable) {}

        // Handle window insets gracefully for system status bar & navigation bar
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.rootLayout)) { view, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            view.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // Configure WebView settings for maximum offline performance & persistence
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            mediaPlaybackRequiresUserGesture = false
            loadWithOverviewMode = true
            useWideViewPort = true
            cacheMode = WebSettings.LOAD_NO_CACHE
            displayZoomControls = false
            builtInZoomControls = false
        }

        // WebChromeClient for alert, prompt and console compatibility
        webView.webChromeClient = WebChromeClient()

        // WebViewClient to keep all navigation inside local WebView
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: ""
                if (url.startsWith("file:///android_asset/") || url.startsWith("data:")) {
                    return false
                }
                return false
            }
        }

        // Expose native TextToSpeech, SharedPreferences, and Notification bridge to JavaScript
        webView.addJavascriptInterface(AndroidNativeBridge(), "AndroidBridge")

        // Intercept Android Back Button so user can navigate back in web views/campaigns or history
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                webView.evaluateJavascript("if (typeof window.handleAndroidBack === 'function') { window.handleAndroidBack(); } else { 'false'; }") { handled ->
                    val isHandled = handled == "true" || handled == "\"true\""
                    if (!isHandled) {
                        if (webView.canGoBack()) {
                            webView.goBack()
                        } else {
                            isEnabled = false
                            onBackPressedDispatcher.onBackPressed()
                        }
                    }
                }
            }
        })

        // Schedule daily study reminder at 9:00 PM (21:00) to protect user's streak
        checkAndScheduleDailyReminder()

        // Load the local offline HTML application from assets
        webView.loadUrl("file:///android_asset/index.html")
    }

    private fun checkAndScheduleDailyReminder() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            } else {
                scheduleDailyStudyReminder(21, 0)
            }
        } else {
            scheduleDailyStudyReminder(21, 0)
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
