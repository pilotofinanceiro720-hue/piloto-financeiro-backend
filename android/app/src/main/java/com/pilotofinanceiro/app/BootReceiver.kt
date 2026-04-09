package com.pilotofinanceiro.app
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action !in listOf(Intent.ACTION_BOOT_COMPLETED, "android.intent.action.QUICKBOOT_POWERON", Intent.ACTION_LOCKED_BOOT_COMPLETED)) return
        val serviceIntent = Intent(context, ColetaForegroundService::class.java).apply { action = ColetaForegroundService.ACTION_INICIAR }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) context.startForegroundService(serviceIntent) else context.startService(serviceIntent)
    }
}
