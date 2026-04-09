package com.pilotofinanceiro.app
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
class ObservatorioModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private var broadcastReceiver: BroadcastReceiver? = null
    override fun getName(): String = "ObservatorioModule"
    @ReactMethod fun iniciarColeta(promise: Promise) {
        try {
            val intent = Intent(reactApplicationContext, ColetaForegroundService::class.java).apply { action = ColetaForegroundService.ACTION_INICIAR }
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) reactApplicationContext.startForegroundService(intent) else reactApplicationContext.startService(intent)
            promise.resolve(true)
        } catch (e: Exception) { promise.reject("ERRO_INICIAR", e.message) }
    }
    @ReactMethod fun pararColeta(promise: Promise) {
        try {
            reactApplicationContext.stopService(Intent(reactApplicationContext, ColetaForegroundService::class.java).apply { action = ColetaForegroundService.ACTION_PARAR })
            promise.resolve(true)
        } catch (e: Exception) { promise.reject("ERRO_PARAR", e.message) }
    }
    @ReactMethod fun verificarPermissaoAcessibilidade(promise: Promise) {
        try {
            val manager = reactApplicationContext.getSystemService(Context.ACCESSIBILITY_SERVICE) as android.view.accessibility.AccessibilityManager
            val ativo = manager.getEnabledAccessibilityServiceList(android.accessibilityservice.AccessibilityServiceInfo.FEEDBACK_ALL_MASK).any { it.resolveInfo.serviceInfo.name.contains("ObservatorioAccessibilityService") }
            promise.resolve(ativo)
        } catch (e: Exception) { promise.reject("ERRO_VERIFICAR", e.message) }
    }
    @ReactMethod fun obterEventosDaFila(promise: Promise) {
        try {
            val eventos = WritableNativeArray()
            val fila = ObservatorioAccessibilityService.filaEventos
            while (fila.isNotEmpty()) { fila.poll()?.let { eventos.pushString(it.toString()) } }
            promise.resolve(eventos)
        } catch (e: Exception) { promise.reject("ERRO_FILA", e.message) }
    }
    @ReactMethod fun addListener(eventName: String) {}
    @ReactMethod fun removeListeners(count: Int) {}
    override fun initialize() {
        super.initialize()
        broadcastReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                val dados = intent?.getStringExtra("dados") ?: return
                reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit("novaCorrida", dados)
            }
        }
        val filter = IntentFilter("com.pilotofinanceiro.app.NOVA_CORRIDA")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) reactApplicationContext.registerReceiver(broadcastReceiver, filter, Context.RECEIVER_NOT_EXPORTED)
        else reactApplicationContext.registerReceiver(broadcastReceiver, filter)
    }
    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        broadcastReceiver?.let { try { reactApplicationContext.unregisterReceiver(it) } catch (_: Exception) {} }
    }
}
