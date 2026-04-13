import React, { useEffect, useState, useRef } from 'react'
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, NativeEventEmitter, NativeModules, Animated } from 'react-native'

const { ObservatorioModule } = NativeModules

interface Corrida {
  valor_ofertado: number
  distancia_km: number
  tempo_estimado_min: number
  km_busca?: number
  plataforma: string
}

interface Criterios {
  rsKmMin: number
  rsHoraMin: number
  valorMin: number
  kmBuscaMax: number
  comissao: number
}

const CRITERIOS_DEFAULT: Criterios = {
  rsKmMin: 1.30,
  rsHoraMin: 50,
  valorMin: 10,
  kmBuscaMax: 2.0,
  comissao: 16.3,
}

function calcular(c: Corrida, cr: Criterios) {
  const rsKm = c.valor_ofertado / c.distancia_km
  const rsHora = c.valor_ofertado / (c.tempo_estimado_min / 60)
  const liquido = c.valor_ofertado * (1 - cr.comissao / 100)
  const okRsKm = rsKm >= cr.rsKmMin
  const okRsHora = rsHora >= cr.rsHoraMin
  const okValor = c.valor_ofertado >= cr.valorMin
  const okBusca = (c.km_busca ?? 0) <= cr.kmBuscaMax
  const pts = [okRsKm, okRsHora, okValor, okBusca].filter(Boolean).length
  const score = Math.round((pts / 4) * 100)
  const veredito = pts === 4 ? 'ACEITAR' : pts >= 2 ? 'AVALIAR' : 'RECUSAR'
  return { rsKm, rsHora, liquido, okRsKm, okRsHora, okValor, okBusca, score, veredito }
}

export default function OverlayAnalisador() {
  const [corrida, setCorrida] = useState<Corrida | null>(null)
  const [criterios] = useState<Criterios>(CRITERIOS_DEFAULT)
  const [config, setConfig] = useState(false)
  const slideAnim = useRef(new Animated.Value(400)).current

  useEffect(() => {
    if (!ObservatorioModule) return
    const emitter = new NativeEventEmitter(ObservatorioModule)
    const sub = emitter.addListener('novaCorrida', (dados: string) => {
      try {
        const parsed = JSON.parse(dados) as Corrida
        if (parsed.valor_ofertado && parsed.distancia_km) {
          setCorrida(parsed)
          Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 100, friction: 8 }).start()
        }
      } catch {}
    })
    return () => sub.remove()
  }, [])

  const fechar = () => {
    Animated.timing(slideAnim, { toValue: 400, duration: 250, useNativeDriver: true }).start(() => setCorrida(null))
  }

  if (!corrida) return null

  const r = calcular(corrida, criterios)
  const corVeredito = r.veredito === 'ACEITAR' ? '#2ECC40' : r.veredito === 'AVALIAR' ? '#f9a825' : '#e74c3c'
  const emojiVeredito = r.veredito === 'ACEITAR' ? '✅' : r.veredito === 'AVALIAR' ? '⚠️' : '❌'

  return (
    <Modal transparent animationType="none" visible statusBarTranslucent>
      <View style={s.backdrop}>
        <Animated.View style={[s.panel, { transform: [{ translateY: slideAnim }] }]}>

          <View style={s.handle}><View style={s.handleBar} /></View>

          <View style={s.header}>
            <View style={s.platRow}>
              <View style={[s.platDot, { backgroundColor: corrida.plataforma === 'uber' ? '#000' : '#E30613' }]} />
              <Text style={s.platName}>{corrida.plataforma.toUpperCase()}</Text>
            </View>
            <View style={[s.veredito, { borderColor: corVeredito }]}>
              <Text style={[s.vereditoTxt, { color: corVeredito }]}>{emojiVeredito} {r.veredito}</Text>
            </View>
            <TouchableOpacity onPress={fechar} style={s.closeBtn}><Text style={s.closeTxt}>✕</Text></TouchableOpacity>
          </View>

          <ScrollView style={s.body} showsVerticalScrollIndicator={false}>

            <View style={s.valorDestaque}>
              <Text style={[s.valorBruto, { color: corVeredito }]}>R$ {corrida.valor_ofertado.toFixed(2).replace('.', ',')}</Text>
              <Text style={s.valorLiq}>Líquido estimado: <Text style={{ color: '#2ECC40' }}>R$ {r.liquido.toFixed(2).replace('.', ',')}</Text></Text>
            </View>

            <View style={s.scoreCard}>
              <Text style={s.scoreLabel}>🎯 Pontuação da corrida</Text>
              <Text style={[s.scorePct, { color: corVeredito }]}>{r.score}%</Text>
            </View>

            <View style={s.formulasGrid}>
              {[
                { label: 'R$/km rodado', icon: '🛣️', resultado: `R$ ${r.rsKm.toFixed(2).replace('.', ',')}`, meta: `≥ R$${criterios.rsKmMin.toFixed(2)}`, ok: r.okRsKm },
                { label: 'R$/hora', icon: '⏱️', resultado: `R$ ${r.rsHora.toFixed(1).replace('.', ',')}`, meta: `≥ R$${criterios.rsHoraMin}`, ok: r.okRsHora },
                { label: 'Km busca', icon: '📍', resultado: `${corrida.km_busca?.toFixed(1) ?? '—'} km`, meta: `≤ ${criterios.kmBuscaMax} km`, ok: r.okBusca },
                { label: 'Valor mínimo', icon: '💰', resultado: `R$ ${corrida.valor_ofertado.toFixed(2).replace('.', ',')}`, meta: `≥ R$${criterios.valorMin}`, ok: r.okValor },
              ].map((f, i) => (
                <View key={i} style={[s.formulaCard, { borderTopColor: f.ok ? '#2ECC40' : '#e74c3c' }]}>
                  <Text style={s.formulaLabel}>{f.icon} {f.label}</Text>
                  <Text style={[s.formulaResultado, { color: f.ok ? '#2ECC40' : '#e74c3c' }]}>{f.resultado}</Text>
                  <Text style={s.formulaMeta}>Meta: {f.meta}</Text>
                  <Text style={s.formulaCheck}>{f.ok ? '✅' : '❌'}</Text>
                </View>
              ))}
            </View>

            <View style={s.dadosCard}>
              <View style={s.dadosRow}><Text style={s.dadosLabel}>🛣️ Distância</Text><Text style={s.dadosVal}>{corrida.distancia_km.toFixed(1).replace('.', ',')} km</Text></View>
              <View style={s.dadosRow}><Text style={s.dadosLabel}>⏱️ Tempo</Text><Text style={s.dadosVal}>{corrida.tempo_estimado_min} min</Text></View>
            </View>

            <View style={s.calcCard}>
              <Text style={s.calcTitle}>Cálculo</Text>
              <Text style={s.calcLine}>R$/km = {corrida.valor_ofertado.toFixed(2)} ÷ {corrida.distancia_km} = <Text style={{ color: r.okRsKm ? '#2ECC40' : '#e74c3c' }}>{r.rsKm.toFixed(2)}</Text></Text>
              <Text style={s.calcLine}>R$/hora = {corrida.valor_ofertado.toFixed(2)} ÷ {(corrida.tempo_estimado_min / 60).toFixed(2)} = <Text style={{ color: r.okRsHora ? '#2ECC40' : '#e74c3c' }}>{r.rsHora.toFixed(1)}</Text></Text>
              <Text style={s.calcLine}>Líquido = {corrida.valor_ofertado.toFixed(2)} × {(1 - criterios.comissao / 100).toFixed(3)} = <Text style={{ color: '#2ECC40' }}>{r.liquido.toFixed(2)}</Text></Text>
            </View>

            <View style={s.actions}>
              <TouchableOpacity onPress={fechar} style={s.btnRecusar}><Text style={s.btnRecusarTxt}>❌ Recusar</Text></TouchableOpacity>
              <TouchableOpacity onPress={fechar} style={s.btnAceitar}><Text style={s.btnAceitarTxt}>✅ Aceitar corrida</Text></TouchableOpacity>
            </View>

          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  )
}

const s = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  panel: { backgroundColor: '#161616', borderTopLeftRadius: 22, borderTopRightRadius: 22, maxHeight: '90%', borderTopWidth: 1, borderColor: '#2a2a2a' },
  handle: { alignItems: 'center', paddingVertical: 10 },
  handleBar: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#333' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 10, borderBottomWidth: 1, borderColor: '#222', gap: 8 },
  platRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  platDot: { width: 10, height: 10, borderRadius: 5 },
  platName: { fontFamily: 'Rajdhani', fontSize: 18, fontWeight: '700', color: '#fff', letterSpacing: 1 },
  veredito: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  vereditoTxt: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  closeBtn: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  closeTxt: { color: '#888', fontSize: 11 },
  body: { padding: 16 },
  valorDestaque: { alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, borderColor: '#222', marginBottom: 10 },
  valorBruto: { fontSize: 36, fontFamily: 'Rajdhani', fontWeight: '700' },
  valorLiq: { fontSize: 11, color: '#888', marginTop: 2 },
  scoreCard: { backgroundColor: '#1a1a1a', borderRadius: 10, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#222' },
  scoreLabel: { fontSize: 11, color: '#666' },
  scorePct: { fontSize: 18, fontFamily: 'Rajdhani', fontWeight: '700' },
  formulasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 10 },
  formulaCard: { backgroundColor: '#1e1e1e', borderRadius: 10, padding: 10, width: '47%', borderTopWidth: 2, borderWidth: 1, borderColor: '#2a2a2a', position: 'relative' },
  formulaLabel: { fontSize: 9, color: '#666', marginBottom: 4 },
  formulaResultado: { fontFamily: 'Rajdhani', fontSize: 19, fontWeight: '700' },
  formulaMeta: { fontSize: 9, color: '#555', marginTop: 2 },
  formulaCheck: { position: 'absolute', top: 6, right: 6, fontSize: 11 },
  dadosCard: { backgroundColor: '#1a1a1a', borderRadius: 10, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#222' },
  dadosRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  dadosLabel: { fontSize: 10, color: '#666' },
  dadosVal: { fontFamily: 'Rajdhani', fontSize: 13, fontWeight: '600', color: '#ccc' },
  calcCard: { backgroundColor: '#141414', borderRadius: 8, padding: 10, marginBottom: 14, borderWidth: 1, borderColor: '#1e1e1e' },
  calcTitle: { fontSize: 8, color: '#444', letterSpacing: 1.5, marginBottom: 5, textTransform: 'uppercase' },
  calcLine: { fontSize: 9, color: '#555', lineHeight: 16 },
  actions: { flexDirection: 'row', gap: 8, paddingBottom: 8 },
  btnRecusar: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: 'rgba(229,57,53,0.1)', borderWidth: 1, borderColor: '#e53935', alignItems: 'center' },
  btnRecusarTxt: { fontFamily: 'Rajdhani', fontSize: 13, fontWeight: '700', color: '#ef5350', letterSpacing: 1 },
  btnAceitar: { flex: 2, padding: 12, borderRadius: 10, backgroundColor: '#2e7d32', alignItems: 'center' },
  btnAceitarTxt: { fontFamily: 'Rajdhani', fontSize: 13, fontWeight: '700', color: '#fff', letterSpacing: 1 },
})
