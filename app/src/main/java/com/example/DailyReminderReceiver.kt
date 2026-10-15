package com.example

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat

class DailyReminderReceiver : BroadcastReceiver() {

    companion object {
        const val CHANNEL_ID = "daily_study_reminder_channel"
        const val NOTIFICATION_ID = 2026
    }

    override fun onReceive(context: Context, intent: Intent?) {
        createNotificationChannel(context)

        val activityIntent = Intent(context, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            activityIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle("🔥 ¡Mantén tu Racha en English Master!")
            .setContentText("Son las 9:00 PM: Tu reto diario de 5 minutos te espera. ¡No pierdas tu racha!")
            .setStyle(
                NotificationCompat.BigTextStyle()
                    .bigText("Son las 9:00 PM: Tu sesión de 5 minutos está lista. Repasa tus Phrasal Verbs, suma XP y mantén encendida tu racha de estudio diaria.")
            )
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .build()

        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager
        notificationManager?.notify(NOTIFICATION_ID, notification)
    }

    fun createNotificationChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "Recordatorio Diario de Estudio (9:00 PM)"
            val descriptionText = "Avisos diarios para proteger y aumentar tu racha de estudio"
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                description = descriptionText
            }
            val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as? NotificationManager
            notificationManager?.createNotificationChannel(channel)
        }
    }
}
