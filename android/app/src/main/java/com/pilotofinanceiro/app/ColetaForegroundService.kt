package com.pilotofinanceiro.app
import android.app.*
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
class ColetaForegroundService : Service() {
    companion object {
        const val ACTION_INICIAR = "com.pilotofinanceiro.app.INICIAR_COLETA"
        const val ACTION_PARAR = "com.pilotofinanceiro.app.PARAR_COLETA"
        const val CHANNEL_ID = "piloto_coleta_channel"
        const val NOTIFICATION_ID = 1001
    }
    override fun onCreate() { super.onCreate(); criarCanalNotificacao() }
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) { ACTION_INICIAR -> iniciarColeta(); ACTION_PARAR -> pararColeta() }
        return START_STICKY
    }
    private fun iniciarColeta() {
        startForeground(NOTIFICATION_ID, NotificationCompat.Builder(this, CHANNEL_ID).setContentTitle("Piloto Financeiro").setContentText("Coletando dados de corridas...").setSmallIcon(android.R.drawable.ic_menu_compass).setPriority(NotificationCompat.PRIORITY_LOW).setOngoing(true).build())
    }
    private fun pararColeta() { stopForeground(true); stopSelf() }
    private fun criarCanalNotificacao() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            getSystemService(NotificationManager::class.java).createNotificationChannel(NotificationChannel(CHANNEL_ID, "Coleta de Dados", NotificationManager.IMPORTANCE_LOW).apply { description = "Indica que a coleta de dados do motorista está ativa"; setShowBadge(false) })
        }
    }
    override fun onBind(intent: Intent?): IBinder? = null
    override fun onDestroy() { super.onDestroy(); stopForeground(true) }
}
