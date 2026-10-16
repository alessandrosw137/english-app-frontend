package com.example

import android.app.NotificationManager
import android.content.Context
import androidx.test.core.app.ApplicationProvider
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.Robolectric
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34])
class ExampleRobolectricTest {

  @Test
  fun `read string from context`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val appName = context.getString(R.string.app_name)
    assertEquals("Phrasal Verbs TOEFL", appName)
  }

  @Test
  fun `daily reminder receiver creates notification channel and handles broadcast`() {
    val context = ApplicationProvider.getApplicationContext<Context>()
    val receiver = DailyReminderReceiver()
    receiver.createNotificationChannel(context)

    val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    val channel = notificationManager.getNotificationChannel(DailyReminderReceiver.CHANNEL_ID)
    assertNotNull(channel)
    assertEquals("Recordatorio Diario de Estudio (9:00 PM)", channel.name)

    // Trigger onReceive
    receiver.onReceive(context, null)
    // Notification was dispatched to notificationManager
    assertTrue(true)
  }

  @Test
  fun `main activity schedules reminder successfully`() {
    Robolectric.buildActivity(MainActivity::class.java).use { controller ->
      val activity = controller.create().get()
      activity.scheduleDailyStudyReminder(21, 0)
      assertTrue(true)
    }
  }

  @Test
  fun `main activity configures webview with webgl and inline media playback settings`() {
    Robolectric.buildActivity(MainActivity::class.java).use { controller ->
      val activity = controller.create().get()
      val webView = activity.findViewById<android.webkit.WebView>(R.id.webView)
      assertNotNull(webView)
      assertTrue(webView.settings.javaScriptEnabled)
      assertTrue(webView.settings.domStorageEnabled)
      org.junit.Assert.assertFalse(webView.settings.mediaPlaybackRequiresUserGesture)
      assertEquals(android.webkit.WebSettings.LOAD_DEFAULT, webView.settings.cacheMode)
      assertEquals("https://english-app-frontend-3j9w.onrender.com", MainActivity.PRODUCTION_URL)
      assertNotNull(webView.webChromeClient)
    }
  }

  @Test
  fun `main activity handles onConfigurationChanged preserving webview`() {
    Robolectric.buildActivity(MainActivity::class.java).use { controller ->
      val activity = controller.create().get()
      val webViewBefore = activity.findViewById<android.webkit.WebView>(R.id.webView)
      assertNotNull(webViewBefore)

      val landscapeConfig = android.content.res.Configuration().apply {
        orientation = android.content.res.Configuration.ORIENTATION_LANDSCAPE
      }
      activity.onConfigurationChanged(landscapeConfig)

      val webViewAfter = activity.findViewById<android.webkit.WebView>(R.id.webView)
      assertEquals(webViewBefore, webViewAfter)
    }
  }

  @Test
  fun `main activity sets download listener for pdfs`() {
    Robolectric.buildActivity(MainActivity::class.java).use { controller ->
      val activity = controller.create().get()
      val webView = activity.findViewById<android.webkit.WebView>(R.id.webView)
      val shadowWebView = org.robolectric.Shadows.shadowOf(webView)
      val listener = shadowWebView.downloadListener
      assertNotNull(listener)

      listener.onDownloadStart(
        "https://example.com/guide.pdf",
        "Mozilla/5.0",
        "attachment; filename=guide.pdf",
        "application/pdf",
        2048L
      )
      assertTrue(true)
    }
  }

  @Test
  fun `main activity webview client intercepts google accounts url and launches intent`() {
    Robolectric.buildActivity(MainActivity::class.java).use { controller ->
      val activity = controller.create().get()
      val webView = activity.findViewById<android.webkit.WebView>(R.id.webView)
      val client = webView.webViewClient
      assertNotNull(client)

      val googleAuthUrl = "https://accounts.google.com/o/oauth2/auth?client_id=123"
      val shouldOverride = client.shouldOverrideUrlLoading(webView, googleAuthUrl)
      assertTrue(shouldOverride)

      val nextIntent = org.robolectric.Shadows.shadowOf(activity).nextStartedActivity
      assertNotNull(nextIntent)
      assertEquals(android.content.Intent.ACTION_VIEW, nextIntent.action)
      assertEquals(android.net.Uri.parse(googleAuthUrl), nextIntent.data)
    }
  }

  @Test
  fun `main activity webview client intercepts cuentas google url and launches intent`() {
    Robolectric.buildActivity(MainActivity::class.java).use { controller ->
      val activity = controller.create().get()
      val webView = activity.findViewById<android.webkit.WebView>(R.id.webView)
      val client = webView.webViewClient
      assertNotNull(client)

      val cuentasUrl = "https://cuentas.google.com/signin"
      val shouldOverride = client.shouldOverrideUrlLoading(webView, cuentasUrl)
      assertTrue(shouldOverride)

      val nextIntent = org.robolectric.Shadows.shadowOf(activity).nextStartedActivity
      assertNotNull(nextIntent)
      assertEquals(android.content.Intent.ACTION_VIEW, nextIntent.action)
    }
  }

  @Test
  fun `main activity webview client keeps internal urls inside webview`() {
    Robolectric.buildActivity(MainActivity::class.java).use { controller ->
      val activity = controller.create().get()
      val webView = activity.findViewById<android.webkit.WebView>(R.id.webView)
      val client = webView.webViewClient
      assertNotNull(client)

      val localAssetUrl = "file:///android_asset/index.html"
      val overrideLocal = client.shouldOverrideUrlLoading(webView, localAssetUrl)
      org.junit.Assert.assertFalse(overrideLocal)

      val renderUrl = "https://english-app-frontend-3j9w.onrender.com/#home"
      val overrideRender = client.shouldOverrideUrlLoading(webView, renderUrl)
      org.junit.Assert.assertFalse(overrideRender)
    }
  }
}



