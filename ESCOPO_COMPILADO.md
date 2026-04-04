# 📋 ESCOPO COMPILADO - ROTA DO LUCRO

## 🎯 VISÃO GERAL DO PROJETO

**Nome:** Rota do Lucro  
**Tipo:** Aplicativo Mobile (React Native + Expo)  
**Plataforma:** iOS, Android, Web  
**Objetivo:** Assistente financeiro automático para motoristas de apps de mobilidade  
**Modelo de Negócio:** SaaS com 3 planos de assinatura

---

## 💰 MODELO DE NEGÓCIO

### Planos de Assinatura

| Plano | Preço Mensal | Preço Semestral | Preço Anual | Comissão | Limite/mês | Saques/mês | Funcionalidades |
|-------|-------------|-----------------|------------|----------|-----------|-----------|-----------------|
| **Básico** | R$ 9,90 | R$ 49,50 | R$ 82,50 | 20% | R$ 5.000 | 2x | Email, Lista desejos |
| **Top** | R$ 19,90 | R$ 99,50 | R$ 165,90 | 25% | R$ 15.000 | 8x | IA, Analytics, Badges |
| **Premium** | R$ 29,90 | R$ 149,50 | R$ 248,90 | 30% | R$ 50.000 | ∞ | Tudo + Gerente dedicado |

### Descontos
- Semestral: 17% de desconto
- Anual: 33% de desconto

### Receita por Referência
- Comissão registrada **SOMENTE** após pagamento confirmado
- Validação rigorosa de fraude
- Transferências automáticas via Stripe Connect

---

## 🧠 MÓDULOS PRINCIPAIS

### MÓDULO 1: MONITOR DE JORNADA
**Objetivo:** Detectar atividade em apps de mobilidade em tempo real

**Status:**
- 🟢 ONLINE → App ativo
- 🟡 PAUSA → Inatividade
- 🔴 SUGERIR ENCERRAR → Inatividade prolongada

**Métricas Rastreadas:**
- Tempo online total
- Tempo em pausa
- Tempo trabalhado efetivo
- Tempo em corrida

**Entidade:** `WorkSession`
- userId
- startTime
- endTime
- status
- platformsActive[]
- metricsData

---

### MÓDULO 2: AUDITOR DE CORRIDAS
**Objetivo:** Comparar valor estimado vs realizado com detecção de anomalias

**Card Inteligente Exibe:**
- Valor ofertado pela plataforma
- Distância estimada vs real
- Tempo estimado vs real
- Ganho/km
- Ganho/hora

**Alertas Automáticos:**
- ⚠️ +15% tempo (possível trânsito/desvio)
- ⚠️ +10% distância (possível rota divergente)
- ⚠️ Rota divergente detectada

**Cálculo de Valor Justo:**
```
valorJusto = (kmReal × tarifaKm) + (tempoReal × tarifaMin)

Se valorJusto > valorPago:
  → Sugerir revisão com plataforma
```

**Entidade:** `RideAudit`
- rideId
- platformId
- estimatedValue
- realValue
- distance
- time
- earningsPerKm
- earningsPerHour
- alerts[]
- auditDate

---

### MÓDULO 3: EVIDÊNCIA VISUAL
**Objetivo:** Capturar automaticamente prints de corridas para auditoria

**Capturas Automáticas:**
1. 📸 Print inicial (com card da corrida)
2. 📸 Print final (com confirmação)

**Armazenamento Local:**
```
RotaDoLucro/Corridas/{YYYY-MM-DD}/
  ├── ride_{id}_initial.png
  ├── ride_{id}_final.png
  └── metadata.json
```

**Entidade:** `RideEvidence`
- rideId
- initialScreenshot
- finalScreenshot
- timestamp
- platform
- localPath

---

### MÓDULO 4: CENTRAL MULTI-PLATAFORMA
**Objetivo:** Consolidar dados de múltiplas plataformas (Uber, 99, Loggi, etc)

**Dashboard Consolidado Exibe:**
- 💰 Ganho total (todas as plataformas)
- 💰 Ganho por plataforma individual
- ⏱️ Ganho/hora (média)
- 🛣️ Km rodados totais
- 📊 Eficiência geral (ganho/km)

**Entidade:** `PlatformProfile`
- userId
- platformName
- platformId
- authToken
- isActive
- totalEarnings
- totalRides
- averageRating
- lastSync

---

### MÓDULO 5: PAINEL FINANCEIRO INTELIGENTE
**Objetivo:** Análise completa de lucro com recomendações de IA

**Indicadores Principais:**
- 📊 Lucro líquido (dia/mês/ano)
- 📈 Receita bruta
- 📉 Custos totais
- 🛣️ Custo/km
- ⚡ Eficiência (lucro/hora)
- 🎯 Meta mensal
- 📍 Progresso da meta

**Custos Rastreados:**
- ⛽ Combustível (consumo estimado)
- 🔧 Manutenção (preventiva + corretiva)
- 🚗 Desgaste do veículo (depreciação)
- 🛣️ Pedágios
- 💳 Financiamento/aluguel do veículo
- 💼 Despesas operacionais (seguro, IPVA, etc)

**Inteligência da IA:**
- 🤖 Explicar indicadores em linguagem natural
- 💡 Sugerir melhorias operacionais
- ⚠️ Alertar quando rentabilidade cai
- 📈 Projetar ganhos futuros
- 🎯 Recomendar ajustes de preço

**Entidade:** `FinancialPanel`
- userId
- date
- grossRevenue
- totalCosts
- netProfit
- costPerKm
- efficiency
- monthlyTarget
- progress
- aiInsights[]

---

### MÓDULO 6: MARKETPLACE E PARCERIAS
**Objetivo:** Hub de oportunidades com cupons automáticos e comissões

**Funcionalidades:**
- 🔍 Busca inteligente de produtos
- 🔗 Links afiliados automáticos
- 🎟️ Cupons automáticos (IA identifica e aplica)
- 📢 Alertas de preço
- ❤️ Lista de desejos
- ⭐ Avaliações de parceiros

**Inteligência da IA:**
- 🤖 Priorizar parceiros do programa
- 🤖 Filtrar ofertas confiáveis
- 🤖 Recomendar melhor custo-benefício
- 🤖 Buscar cupons em múltiplas plataformas
- 🤖 Aplicar automaticamente cupons

**Indicadores:**
- 💰 Receita comissionada
- 📊 Taxa de conversão
- 🏆 Top 10 produtos
- 📈 ROI por parceria

**Entidade:** `MarketplaceOffer`
- offerId
- title
- description
- price
- discount
- coupon
- affiliateLink
- partnerId
- category
- trustScore
- commissionRate
- isAffiliated

---

### MÓDULO 7: METAS FINANCEIRAS
**Objetivo:** Motorista define objetivo, sistema calcula meta diária

**Entrada do Motorista:**
- 💰 Lucro desejado (mensal)
- 💸 Gastos mensais
- 📅 Dias trabalhados (previsão)

**Cálculo do Sistema:**
```
metaDiaria = (lucroDesejado + gastosAjustados) / diasTrabalhados

Exemplo:
  Lucro desejado: R$ 3.000
  Gastos: R$ 1.000
  Dias: 20
  
  Meta diária = (3.000 + 1.000) / 20 = R$ 200/dia
```

**Visualização:**
- 📊 Barra de progresso visual
- 📈 Progresso do dia
- 📈 Progresso do mês
- 🎯 Dias restantes
- ⏰ Tempo restante (até 23:59)

**Entidade:** `FinancialGoal`
- userId
- desiredProfit
- monthlyExpenses
- workDaysPerMonth
- dailyTarget
- currentProgress
- daysRemaining
- createdAt
- updatedAt

---

### MÓDULO 8: CORRIDA PARTICULAR (COM PEDÁGIOS AUTOMÁTICOS)
**Objetivo:** Calcular valor ideal de corridas particulares com base em rota real

**Fluxo:**
1. Motorista seleciona "Corrida Particular"
2. Informa origem e destino
3. Sistema calcula rota (Google Maps API)
4. Detecta pedágios automaticamente
5. Motorista define parâmetros (km, minuto, multiplicador)
6. Sistema calcula valor final
7. Iniciar navegação

**Parâmetros do Motorista:**
- 💰 Valor por km (customizável)
- ⏱️ Valor por minuto (customizável)
- 📊 Multiplicador (1.0x a 2.0x)
- 💵 Margem mínima de lucro

**Detecção de Pedágios:**
- ✅ Identificar pedágios na rota
- ✅ Somar automaticamente ao valor
- ✅ Exibir lista detalhada
- ✅ Permitir ajuste manual

**Fórmula de Cálculo:**
```
valorBase = (distância × valorKm) + (tempo × valorMinuto)

valorComMultiplicador = valorBase × multiplicador

valorTotal = valorComMultiplicador + pedágios

valorFinal = valorTotal + margem (se existir)
```

**Resumo Exibido:**
- 🛣️ Distância (km)
- ⏱️ Tempo estimado (minutos)
- 🛣️ Pedágios (lista + total)
- 💸 Custos estimados (combustível, desgaste)
- 💰 Valor sugerido
- 📈 Lucro estimado

**Inteligência da IA:**
- 🤖 Sugerir preço ideal baseado em histórico
- ⚠️ Alertar se preço está abaixo do rentável
- 📚 Aprender com histórico de corridas
- 💡 Recomendar ajustes de parâmetros

**Entidade:** `PrivateRide`
- rideId
- origin
- destination
- distance
- estimatedTime
- tolls[]
- userParams (valorKm, valorMin, multiplicador, margem)
- baseValue
- finalValue
- estimatedProfit
- status
- createdAt

**Entidade:** `Toll`
- id
- name
- value
- highway
- location (lat, lng)
- updatedAt

---

### MÓDULO 9: PAINEL ADMINISTRATIVO
**Objetivo:** Gestão completa da plataforma e recomendações de IA

**Permissões:**
- 🔐 Login via Google OAuth
- 🔐 Roles: Super Admin, Admin, Moderador

**Funcionalidades:**

#### Gestão de Planos
- ✏️ Criar/editar planos
- 💰 Definir preços
- 📊 Visualizar conversões
- 📈 Acompanhar MRR (Monthly Recurring Revenue)

#### Gestão de Parceiros
- ➕ Adicionar parceiros
- ✏️ Editar ofertas
- 🎟️ Gerenciar cupons
- 📊 Acompanhar comissões
- ⭐ Avaliar confiabilidade

#### Analytics
- 📊 Usuários ativos
- 💰 Receita recorrente (MRR)
- 📉 Churn rate
- 📈 Taxa de conversão
- 💳 Adimplência
- 🎯 Lifetime Value (LTV)

#### Recomendações da IA
- 🤖 Ações de retenção
- 🤖 Alertas de fraude
- 🤖 Sugestões de parceiros
- 🤖 Otimizações de preço

#### Logs e Auditoria
- 📋 Histórico de ações
- 🔍 Rastreamento de transações
- ⚠️ Alertas de segurança

---

## 🔐 PERMISSÕES ANDROID/iOS

**Permissões Necessárias:**
- 📱 Uso de apps (DetectActivity)
- 📍 Localização em segundo plano
- 📸 Captura de tela
- 🔔 Notificações
- 💾 Armazenamento local
- 🔋 Serviço foreground

---

## 🎮 EXPERIÊNCIA DO USUÁRIO

### Fluxo Esperado (Dia Típico):

1. **Manhã:** Motorista abre app → Status ONLINE
2. **Ativação:** Apps de mobilidade detectados → Status ONLINE
3. **Corrida 1:** Corrida detectada → Card exibido
4. **Captura:** Print inicial automático
5. **Durante:** Monitoramento em tempo real
6. **Fim:** Print final automático
7. **Auditoria:** Sistema valida (estimado vs real)
8. **Dados:** Informações salvas no painel
9. **Insights:** IA fornece recomendações
10. **Noite:** Fechamento do dia com resumo

---

## 📊 ESTRUTURA DE DADOS

### Entidades Principais

```typescript
// WorkSession - Monitoramento de jornada
interface WorkSession {
  id: string;
  userId: number;
  startTime: Date;
  endTime?: Date;
  status: 'online' | 'paused' | 'offline';
  platformsActive: string[];
  totalTimeOnline: number;
  totalTimePaused: number;
  totalTimeWorking: number;
  totalTimeInRide: number;
  metricsData: object;
}

// RideAudit - Auditoria de corridas
interface RideAudit {
  id: string;
  rideId: string;
  userId: number;
  platformId: string;
  estimatedValue: number;
  realValue: number;
  distance: number;
  time: number;
  earningsPerKm: number;
  earningsPerHour: number;
  alerts: string[];
  auditDate: Date;
}

// RideEvidence - Evidências visuais
interface RideEvidence {
  id: string;
  rideId: string;
  userId: number;
  initialScreenshot: string;
  finalScreenshot: string;
  timestamp: Date;
  platform: string;
  localPath: string;
}

// FinancialPanel - Painel financeiro
interface FinancialPanel {
  id: string;
  userId: number;
  date: Date;
  grossRevenue: number;
  totalCosts: number;
  netProfit: number;
  costPerKm: number;
  efficiency: number;
  monthlyTarget: number;
  progress: number;
  aiInsights: string[];
}

// FinancialGoal - Metas financeiras
interface FinancialGoal {
  id: string;
  userId: number;
  desiredProfit: number;
  monthlyExpenses: number;
  workDaysPerMonth: number;
  dailyTarget: number;
  currentProgress: number;
  daysRemaining: number;
  createdAt: Date;
  updatedAt: Date;
}

// PrivateRide - Corrida particular
interface PrivateRide {
  id: string;
  userId: number;
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  distance: number;
  estimatedTime: number;
  tolls: Toll[];
  userParams: {
    valorKm: number;
    valorMin: number;
    multiplicador: number;
    margem: number;
  };
  baseValue: number;
  finalValue: number;
  estimatedProfit: number;
  status: 'draft' | 'active' | 'completed';
  createdAt: Date;
}

// Toll - Pedágios
interface Toll {
  id: string;
  name: string;
  value: number;
  highway: string;
  location: { lat: number; lng: number };
  updatedAt: Date;
}

// MarketplaceOffer - Ofertas do marketplace
interface MarketplaceOffer {
  id: string;
  title: string;
  description: string;
  price: number;
  discount?: number;
  coupon?: string;
  affiliateLink: string;
  partnerId: string;
  category: string;
  trustScore: number;
  commissionRate: number;
  isAffiliated: boolean;
}
```

---

## 🎯 PRIORIDADES DE IMPLEMENTAÇÃO

1. ✅ **Monitor de Jornada** (Detectar atividade)
2. ✅ **Auditor de Corridas** (Validar valores)
3. ✅ **Evidência Visual** (Capturar prints)
4. ✅ **Painel Financeiro** (Dashboard com IA)
5. ✅ **Corrida Particular** (Com pedágios)
6. ✅ **Marketplace** (Com cupons e IA)
7. ✅ **Planos e Adimplência** (SaaS)
8. ✅ **Painel Admin** (Gestão completa)
9. ⏳ **Integração com APIs** (Google Maps, Stripe, etc)

---

## 🚀 TECNOLOGIAS

### Frontend
- React Native 0.81
- Expo SDK 54
- TypeScript 5.9
- NativeWind (Tailwind CSS)
- Expo Router (Navegação)

### Backend
- Node.js + Express
- TypeScript
- Drizzle ORM
- PostgreSQL
- Stripe API
- Google Maps API

### Autenticação
- Google OAuth 2.0
- JWT (Sessions)
- Stripe Connect

### Inteligência Artificial
- LLM integrado (análise e recomendações)
- Detecção de padrões
- Recomendações personalizadas

### Infraestrutura
- Expo (Deploy mobile)
- Docker (Backend)
- S3 (Armazenamento de imagens)
- PostgreSQL (Banco de dados)

---

## ✅ STATUS ATUAL

### Implementado (✅)
- ✅ Estrutura base do app mobile
- ✅ Autenticação com Google OAuth
- ✅ Sistema de 3 planos (Básico, Top, Premium)
- ✅ Controle de acesso por plano
- ✅ Tela unificada de comissões
- ✅ Stripe Connect para transferências
- ✅ Gamificação com badges
- ✅ App desktop Electron para admins
- ✅ Sistema de validação de comissões (apenas com pagamento)
- ✅ Detecção de fraude
- ✅ Notificações push
- ✅ Painel administrativo web
- ✅ 80+ testes passando

### Em Progresso (⏳)
- ⏳ Sistema de cupons com IA
- ⏳ Webhooks de Stripe em produção
- ⏳ Dashboard de analytics

### Planejado (📋)
- 📋 Monitor de jornada (detecção de apps)
- 📋 Auditor de corridas
- 📋 Evidência visual (screenshots)
- 📋 Corrida particular com pedágios
- 📋 Integração com Google Maps
- 📋 Integração com múltiplas plataformas

---

## 📞 CONTATO E SUPORTE

**Desenvolvedor:** Manus AI  
**Status:** Em desenvolvimento ativo  
**Próxima revisão:** Após implementação de cupons com IA

---

**Última atualização:** 2026-02-16  
**Versão:** 1.0.0-beta
