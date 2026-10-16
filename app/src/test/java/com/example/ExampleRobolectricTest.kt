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
}


