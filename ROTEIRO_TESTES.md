# 🚗 Roteiro de Testes - Rota do Lucro Beta

**Objetivo:** Validar experiência real de uso do aplicativo  
**Duração:** 1-2 horas por motorista  
**Ambiente:** Android real (dispositivo pessoal)

---

## 📋 Pré-Requisitos

- [ ] Dispositivo Android 8.0+
- [ ] 150 MB de espaço livre
- [ ] Conexão WiFi ou dados móveis
- [ ] Apps de mobilidade instalados (Uber, 99, Loggi)
- [ ] Conta Google ativa
- [ ] Bateria acima de 50%

---

## 🎯 Fluxo Principal de Teste

### Fase 1: Instalação e Setup (10 minutos)

**Objetivo:** Verificar se instalação é simples e intuitiva

1. **Baixar APK**
   - [ ] Clique no link de download
   - [ ] Confirme instalação
   - [ ] Aguarde conclusão
   - [ ] Abra o app

2. **Criar Conta**
   - [ ] Toque em "Criar Conta"
   - [ ] Escolha "Login com Google"
   - [ ] Selecione sua conta Google
   - [ ] Preencha informações:
     - [ ] Nome completo
     - [ ] CPF
     - [ ] Telefone
     - [ ] Placa do veículo
     - [ ] Modelo do veículo
   - [ ] Toque em "Continuar"

3. **Ativar Permissões**
   - [ ] Leia a tela de permissões
   - [ ] Toque em "Permitir" para cada:
     - [ ] Acesso de Uso de Apps
     - [ ] Localização
     - [ ] Localização em Background
     - [ ] Serviço Foreground
     - [ ] Captura de Tela
     - [ ] Ignorar Otimização de Bateria

**Questões para Feedback:**
- A instalação foi fácil? (1-5)
- As instruções foram claras? (Sim/Não)
- Alguma permissão causou confusão? (Qual?)

---

### Fase 2: Validação do App (5 minutos)

**Objetivo:** Verificar se todas as funcionalidades estão ativas

1. **Executar Checklist Automático**
   - [ ] App mostra tela de validação
   - [ ] Aguarde conclusão (2-3 minutos)
   - [ ] Verifique se todos os itens passaram:
     - [ ] ✅ Detecção de app de mobilidade
     - [ ] ✅ Mudança de status ONLINE/PAUSA
     - [ ] ✅ Registro de sessão
     - [ ] ✅ Auditoria de corrida
     - [ ] ✅ Captura de evidência
     - [ ] ✅ Sincronização com backend

2. **Se Algum Item Falhar**
   - [ ] Toque em "Tentar Novamente"
   - [ ] Se falhar novamente, anote o erro
   - [ ] Envie relatório de erro

**Questões para Feedback:**
- Todos os itens passaram? (Sim/Não)
- Qual falhou? (Se aplicável)
- Tempo esperado: 2-3 min. Tempo real: ___ min

---

### Fase 3: Primeira Corrida (20 minutos)

**Objetivo:** Validar fluxo completo de uma corrida

1. **Iniciar Jornada**
   - [ ] Vá para aba "Mapa"
   - [ ] Toque em "Iniciar Jornada"
   - [ ] Confirme permissões se solicitado
   - [ ] Veja status mudar para "🟢 ONLINE"

2. **Realizar Corrida**
   - [ ] Abra seu app de mobilidade (Uber, 99, Loggi)
   - [ ] Realize uma corrida normal
   - [ ] Tente diferentes tipos:
     - [ ] Corrida curta (5-10 min)
     - [ ] Corrida média (10-20 min)
     - [ ] Corrida longa (20+ min)

3. **Verificar Registro**
   - [ ] Volte para Rota do Lucro
   - [ ] Vá para aba "Corridas"
   - [ ] Verifique se corrida aparece:
     - [ ] Plataforma correta (Uber/99/Loggi)
     - [ ] Valor recebido
     - [ ] Distância
     - [ ] Tempo
     - [ ] Lucro calculado

4. **Revisar Resumo**
   - [ ] Toque na corrida
   - [ ] Verifique detalhes:
     - [ ] Valor estimado vs realizado
     - [ ] Cálculo de lucro
     - [ ] Alertas (se houver)
     - [ ] Evidências (screenshots)

**Questões para Feedback:**
- Corrida foi detectada? (Sim/Não)
- Valores estão corretos? (Sim/Não)
- Houve alertas? (Quais?)
- Screenshots foram capturadas? (Sim/Não)
- Tempo para sincronizar: ___ segundos

---

### Fase 4: Teste de Funcionalidades (15 minutos)

**Objetivo:** Validar features principais

1. **Dashboard**
   - [ ] Vá para aba "Home"
   - [ ] Verifique dados do dia:
     - [ ] Lucro líquido
     - [ ] Número de corridas
     - [ ] Receita bruta
     - [ ] Despesas
   - [ ] Dados estão corretos? (Sim/Não)

2. **Marketplace**
   - [ ] Vá para aba "Marketplace"
   - [ ] Busque um produto (ex: "pneu")
   - [ ] Verifique cupons automáticos
   - [ ] Clique em uma oferta
   - [ ] Verifique se link abre corretamente

3. **Perfil**
   - [ ] Vá para aba "Perfil"
   - [ ] Verifique informações:
     - [ ] Nome
     - [ ] Plano
     - [ ] Veículo
     - [ ] Dados de pagamento
   - [ ] Tudo correto? (Sim/Não)

**Questões para Feedback:**
- Dashboard mostra dados corretos? (Sim/Não)
- Marketplace funciona bem? (Sim/Não)
- Perfil está completo? (Sim/Não)

---

### Fase 5: Teste de Estabilidade (10 minutos)

**Objetivo:** Verificar se app é estável

1. **Teste de Fechamento**
   - [ ] Feche o app completamente
   - [ ] Aguarde 30 segundos
   - [ ] Abra novamente
   - [ ] App abriu sem problemas? (Sim/Não)

2. **Teste de Mudança de Aba**
   - [ ] Alterne entre abas rapidamente
   - [ ] Vá para cada aba 5 vezes
   - [ ] App travou? (Sim/Não)

3. **Teste de Conexão**
   - [ ] Desative WiFi
   - [ ] Aguarde 10 segundos
   - [ ] Ative WiFi novamente
   - [ ] App se reconectou? (Sim/Não)

**Questões para Feedback:**
- App travou em algum momento? (Sim/Não)
- Qual aba causou problema? (Se aplicável)
- Consumo de bateria: ___ % em 30 min

---

### Fase 6: Enviar Feedback (5 minutos)

**Objetivo:** Coletar impressão do testador

1. **Abrir Feedback**
   - [ ] Vá para Perfil → Feedback
   - [ ] Ou toque no ícone de feedback (flutuante)

2. **Preencher Formulário**
   - [ ] Classificação geral (1-5 estrelas)
   - [ ] O que funcionou bem?
   - [ ] O que pode melhorar?
   - [ ] Algum bug encontrado?
   - [ ] Sugestões?

3. **Enviar**
   - [ ] Toque em "Enviar"
   - [ ] Confirme envio
   - [ ] Mensagem de sucesso apareceu? (Sim/Não)

---

## 📊 Checklist Final

Ao terminar os testes, confirme:

- [ ] Instalação completada com sucesso
- [ ] Todas as permissões ativadas
- [ ] Validação automática passou
- [ ] Pelo menos 3 corridas testadas
- [ ] Dashboard mostra dados corretos
- [ ] Marketplace funciona
- [ ] App não travou
- [ ] Feedback enviado

---

## 🐛 Relatório de Bugs

Se encontrar algum problema, anote:

**Bug #1**
- Descrição: _______________
- Como reproduzir: _______________
- Screenshot: [ ] Sim [ ] Não
- Severidade: [ ] Baixa [ ] Média [ ] Alta [ ] Crítica

**Bug #2**
- Descrição: _______________
- Como reproduzir: _______________
- Screenshot: [ ] Sim [ ] Não
- Severidade: [ ] Baixa [ ] Média [ ] Alta [ ] Crítica

---

## 💬 Feedback Geral

**O que você achou do Rota do Lucro?**

Pontos Positivos:
- _______________
- _______________
- _______________

Pontos a Melhorar:
- _______________
- _______________
- _______________

Sugestões:
- _______________
- _______________
- _______________

---

## 📧 Enviar Resultados

Após completar todos os testes, envie este documento para:

**Email:** suporte-beta@rotadolucro.com  
**Assunto:** Resultados Teste Beta - [Seu Nome]

---

**Obrigado por participar do teste piloto!** 🎉

Seu feedback é essencial para melhorar o Rota do Lucro.

---

**Versão:** 1.0.0-beta.1  
**Última atualização:** 17 de Fevereiro de 2026
