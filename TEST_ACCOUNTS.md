# 👤 Contas de Teste - Rota do Lucro Beta

**Ambiente:** Staging  
**Data:** 17 de Fevereiro de 2026

---

## 🔐 Credenciais de Acesso

### 1️⃣ Conta Admin (Super Admin)

```
Email: admin@rotadolucro.com
Senha: Admin@123456
Plano: N/A (Admin)
Permissões: Completas
```

**Acesso:**
- Painel administrativo completo
- Gestão de usuários
- Relatórios financeiros
- Monitoramento técnico
- Aprovação de ofertas
- Gestão de parcerias

**URL:** https://admin-staging.rotadolucro.com

---

### 2️⃣ Conta Motorista - Plano Básico

```
Email: motorista.basico@teste.rotadolucro.com
Senha: Motorista@123456
Plano: Básico (R$ 9,90/mês)
Permissões: Funcionalidades Básicas
```

**Acesso:**
- Dashboard com resumo do dia
- Monitor de Jornada
- Auditor de Corridas
- Marketplace (limitado)
- Histórico de corridas
- Suporte por email

**Dados do Veículo:**
- Placa: ABC-1234
- Modelo: Fiat Uno 2020
- Ano: 2020
- Combustível: Gasolina
- Consumo: 12 km/l

---

### 3️⃣ Conta Motorista - Plano Premium

```
Email: motorista.premium@teste.rotadolucro.com
Senha: Motorista@123456
Plano: Premium (R$ 29,90/mês)
Permissões: Todas as funcionalidades
```

**Acesso:**
- Dashboard completo com analytics avançado
- Monitor de Jornada com IA
- Auditor de Corridas com alertas
- Marketplace completo com cupons automáticos
- Programa de referência
- Relatórios financeiros detalhados
- Suporte prioritário 24/7
- Integração com múltiplas plataformas

**Dados do Veículo:**
- Placa: XYZ-5678
- Modelo: Toyota Corolla 2022
- Ano: 2022
- Combustível: Gasolina
- Consumo: 14 km/l

---

## 🎯 Casos de Teste Recomendados

### Teste 1: Fluxo Básico de Corrida

**Conta:** Motorista Básico  
**Duração:** 10 minutos

1. Login com email e senha
2. Ativar permissões
3. Iniciar jornada
4. Abrir app de mobilidade (Uber/99)
5. Realizar corrida de teste
6. Verificar registro no dashboard
7. Enviar feedback

### Teste 2: Auditoria de Corrida

**Conta:** Motorista Premium  
**Duração:** 15 minutos

1. Realizar 3 corridas diferentes
2. Verificar cálculos de lucro
3. Validar alertas de anomalia
4. Comparar com valor justo
5. Conferir evidências capturadas
6. Revisar relatório de auditoria

### Teste 3: Programa de Referência

**Conta:** Motorista Premium  
**Duração:** 20 minutos

1. Acessar aba "Referência"
2. Copiar código de referência
3. Compartilhar com outro testador
4. Outro testador usa código no cadastro
5. Verificar comissão registrada
6. Validar que comissão aparece apenas após pagamento

### Teste 4: Marketplace com Cupons

**Conta:** Motorista Premium  
**Duração:** 15 minutos

1. Acessar Marketplace
2. Buscar produtos (ex: "pneu")
3. Verificar cupons automáticos aplicados
4. Clicar em oferta
5. Verificar link de afiliado
6. Conferir se comissão é rastreada

---

## 📱 Dados de Teste para Pagamento

### Cartão de Crédito (Stripe Test)

```
Número: 4242 4242 4242 4242
Validade: 12/25
CVV: 123
Nome: TESTE MOTORISTA
```

### Cartão com Falha

```
Número: 4000 0000 0000 0002
Validade: 12/25
CVV: 123
```

---

## 🔄 Resetar Conta de Teste

Para resetar uma conta de teste:

1. Acesse painel admin
2. Vá para Usuários
3. Procure pela conta
4. Clique em "Resetar Dados"
5. Confirme ação

**Dados que serão resetados:**
- Histórico de corridas
- Comissões
- Evidências
- Logs de atividade

**Dados que NÃO serão resetados:**
- Email
- Senha
- Plano
- Veículo

---

## 📊 Dados de Teste Pré-Carregados

Cada conta vem com dados simulados:

### Motorista Básico
- 5 corridas no histórico
- 2 comissões pendentes
- 1 feedback enviado
- 0 referências

### Motorista Premium
- 15 corridas no histórico
- 8 comissões aprovadas
- 5 feedbacks enviados
- 3 referências (2 pagas, 1 pendente)
- 12 cupons usados

---

## ⚠️ Limitações de Teste

- Dados são sincronizados a cada 5 minutos
- Pagamentos são processados em modo sandbox
- Notificações push podem ter delay
- Screenshots são simuladas (não reais)
- Localização é mockada (não real)

---

## 🆘 Suporte

**Problemas com login?**
- Verifique se email está correto
- Tente resetar senha
- Limpe cache do navegador

**Permissões não aparecem?**
- Reinstale o app
- Limpe dados do app
- Tente novamente

**Dados não sincronizam?**
- Verifique conexão WiFi
- Aguarde 5 minutos
- Reinicie o app

**Contato de Suporte:**
- Email: suporte-beta@rotadolucro.com
- WhatsApp: +55 (11) 98765-4321

---

**Versão:** 1.0.0-beta.1  
**Última atualização:** 17 de Fevereiro de 2026
