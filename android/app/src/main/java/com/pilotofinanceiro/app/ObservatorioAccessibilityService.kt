package com.pilotofinanceiro.app
import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.content.Intent
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import org.json.JSONObject
import java.util.concurrent.ConcurrentLinkedQueue
class ObservatorioAccessibilityService : AccessibilityService() {
    companion object {
        val PLATAFORMAS_MONITORADAS = listOf("br.com.ubercab", "com.taxis99")
        val filaEventos = ConcurrentLinkedQueue<JSONObject>()
        val REGEX_VALOR = Regex("""R\$\s*([\d,.]+)""")
        val REGEX_DISTANCIA = Regex("""(\d+[,.]?\d*)\s*km""")
        val REGEX_TEMPO = Regex("""(\d+)\s*min""")
        val REGEX_SURGE = Regex("""(\d+[,.]\d+)x""")
    }
    private var plataformaAtual: String? = null
    private var timestampOferta: Long = 0
    private var dadosOfertaAtual: JSONObject? = null
    override fun onServiceConnected() {
        super.onServiceConnected()
        serviceInfo = AccessibilityServiceInfo().apply {
            eventTypes = AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED or AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED or AccessibilityEvent.TYPE_VIEW_TEXT_CHANGED or AccessibilityEvent.TYPE_VIEW_CLICKED
            feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC
            notificationTimeout = 100
            flags = AccessibilityServiceInfo.FLAG_REPORT_VIEW_IDS or AccessibilityServiceInfo.FLAG_REQUEST_ENHANCED_WEB_ACCESSIBILITY
            packageNames = PLATAFORMAS_MONITORADAS.toTypedArray()
        }
    }
    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        event ?: return
        val pacote = event.packageName?.toString() ?: return
        if (pacote !in PLATAFORMAS_MONITORADAS) return
        plataformaAtual = when (pacote) { "br.com.ubercab" -> "uber"; "com.taxis99" -> "99"; else -> return }
        when (event.eventType) {
            AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED -> verificarTelaOferta(event)
            AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED -> { if (dadosOfertaAtual != null) atualizarDadosOferta(event) }
            AccessibilityEvent.TYPE_VIEW_CLICKED -> capturarDecisao(event)
        }
    }
    private fun verificarTelaOferta(event: AccessibilityEvent) {
        val root = rootInActiveWindow ?: return
        val texto = extrairTextoCompleto(root)
        val ind = if (plataformaAtual == "uber") listOf("Aceitar","Recusar","km de distância","min de viagem") else listOf("Aceitar corrida","Recusar","km","minutos")
        if (ind.count { texto.contains(it, ignoreCase = true) } >= 2) {
            timestampOferta = System.currentTimeMillis()
            dadosOfertaAtual = extrairDadosOferta(texto).apply { put("plataforma", plataformaAtual); put("timestamp_oferta", timestampOferta) }
        }
    }
    private fun atualizarDadosOferta(event: AccessibilityEvent) {
        val root = rootInActiveWindow ?: return
        val novos = extrairDadosOferta(extrairTextoCompleto(root))
        novos.keys().forEach { key -> if (!dadosOfertaAtual!!.has(key.toString()) || dadosOfertaAtual!!.get(key.toString()) == null) dadosOfertaAtual!!.put(key.toString(), novos.get(key.toString())) }
    }
    private fun capturarDecisao(event: AccessibilityEvent) {
        dadosOfertaAtual ?: return
        val texto = event.text?.joinToString(" ")?.lowercase() ?: ""
        val decisao = when { texto.contains("aceitar") || texto.contains("accept") -> "aceito"; texto.contains("recusar") || texto.contains("decline") -> "recusado"; else -> return }
        dadosOfertaAtual?.apply { put("decisao", decisao); put("timestamp_decisao", System.currentTimeMillis()); put("tempo_resposta_ms", System.currentTimeMillis() - timestampOferta) }
        filaEventos.offer(dadosOfertaAtual)
        sendBroadcast(Intent("com.pilotofinanceiro.app.NOVA_CORRIDA").apply { putExtra("dados", dadosOfertaAtual.toString()) })
        dadosOfertaAtual = null
    }
    private fun extrairDadosOferta(texto: String): JSONObject {
        val d = JSONObject()
        REGEX_VALOR.find(texto)?.groupValues?.get(1)?.let { d.put("valor_ofertado", it.replace(",",".").toDoubleOrNull()) }
        REGEX_DISTANCIA.find(texto)?.groupValues?.get(1)?.let { d.put("distancia_km", it.replace(",",".").toDoubleOrNull()) }
        REGEX_TEMPO.find(texto)?.groupValues?.get(1)?.let { d.put("tempo_estimado_min", it.toIntOrNull()) }
        REGEX_SURGE.find(texto)?.groupValues?.get(1)?.let { d.put("multiplicador_surge", it.replace(",",".").toDoubleOrNull()) }
        return d
    }
    private fun extrairTextoCompleto(node: AccessibilityNodeInfo?): String {
        node ?: return ""
        val sb = StringBuilder()
        if (!node.text.isNullOrEmpty()) sb.append(node.text).append(" ")
        if (!node.contentDescription.isNullOrEmpty()) sb.append(node.contentDescription).append(" ")
        for (i in 0 until node.childCount) sb.append(extrairTextoCompleto(node.getChild(i)))
        return sb.toString()
    }
    override fun onInterrupt() {}
    override fun onDestroy() { super.onDestroy(); dadosOfertaAtual = null }
}
