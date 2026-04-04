# TODO - Driver Finance App

## Backend e Banco de Dados
- [ ] Criar schema do banco de dados (usuários, veículos, corridas, despesas, ofertas, assinaturas)
- [ ] Implementar modelos com Drizzle ORM
- [ ] Criar migrations do banco de dados
- [ ] Implementar API endpoints para corridas
- [ ] Implementar API endpoints para veículos
- [ ] Implementar API endpoints para planejamento financeiro
- [ ] Implementar API endpoints para marketplace
- [ ] Implementar API endpoints para administração

## Autenticação e Usuários
- [x] Implementar autenticação com Google OAuth
- [x] Criar sistema de gerenciamento de sessão
- [x] Implementar perfil de usuário
- [x] Criar sistema de permissões (motorista vs admin)

## Telas do Aplicativo Mobile
- [x] Tela Dashboard (Home) com resumo do dia
- [x] Tela Mapa e Demanda com visualização de áreas
- [x] Tela Corrida Particular com formulário
- [x] Tela Resumo da Corrida com detalhamento
- [x] Tela Fechamento do Dia
- [x] Tela Planejamento Mensal
- [x] Tela Meu Veículo
- [x] Tela Marketplace (Parcerias e Benefícios)
- [x] Tela Perfil com menu de configurações

## Funcionalidades de Cálculo
- [x] Implementar cálculo de lucro real por corrida
- [x] Implementar cálculo de consumo de combustível
- [x] Implementar cálculo de desgaste do veículo
- [x] Implementar cálculo de custos de manutenção
- [x] Implementar cálculo de meta diária baseada em meta mensal

## Marketplace e IA
- [x] Implementar busca inteligente de produtos
- [x] Integrar IA para curadoria de ofertas
- [x] Implementar sistema de score de confiabilidade
- [x] Criar lista de desejos
- [ ] Implementar alertas de preço
- [ ] Implementar alertas de cupõns
- [ ] Implementar histórico de preços
- [ ] Criar sistema de links afiliados

## Integração com Mapas
- [x] Integrar Expo Maps para visualização
- [x] Implementar marcadores de áreas de demanda
- [x] Implementar marcadores de eventos
- [x] Implementar marcadores de postos de combustível
- [x] Implementar marcadores de pontos de recarga
- [x] Implementar cálculo de rotas e distâncias

## Painel Administrativo Web
- [x] Criar dashboard administrativo
- [ ] Implementar gestão de usuários
- [ ] Implementar gestão de parcerias
- [ ] Implementar relatórios de receita
- [ ] Implementar relatórios de conversões
- [ ] Implementar sistema de aprovação de ofertas da IA

## Sistema de Assinaturas
- [x] Implementar planos de assinatura (mensal, semestral, anual)
- [x] Integrar gateway de pagamento
- [x] Implementar controle de acesso por assinatura
- [x] Criar tela de gerenciamento de assinatura

## Segurança
- [ ] Implementar proteção antifraude
- [ ] Criar logs administrativos
- [ ] Implementar controle de permissões
- [ ] Adicionar validação de dados sensíveis

## Branding e Assets
- [x] Gerar logo personalizado do aplicativo
- [x] Atualizar app.config.ts com nome e branding
- [x] Configurar splash screen
- [x] Configurar ícones para Android e iOS

## Testes e Documentação
- [x] Criar testes unitários para cálculos financeiros
- [ ] Criar testes de integração para APIs
- [ ] Documentar APIs do backend
- [ ] Criar guia de uso do aplicativo

## Integração com Stripe
- [x] Implementar serviço de pagamento com Stripe
- [x] Criar webhook para confirmação de pagamento
- [x] Implementar reembolsos
- [x] Criar relatórios de transações

## Notificações Push
- [x] Implementar serviço de notificações
- [x] Criar alertas de demanda alta
- [x] Criar alertas de ofertas do marketplace
- [x] Criar lembretes de manutenção
- [x] Criar configurações de notificações

## Sistema de Referência
- [x] Implementar geração de códigos de referência
- [x] Implementar rastreamento de conversões
- [x] Implementar cálculo de comissões
- [x] Criar tela de programa de afiliação
- [x] Implementar pagamento de comissões

## Validação de Comissões (Regra Crítica)
- [x] Implementar validação de pagamento para comissões
- [x] Criar regra: Comissões SOMENTE para assinaturas PAGAS
- [x] Implementar webhook handler para Stripe
- [x] Criar testes de validação de comissões (22 testes)
- [x] Rejeitar comissões para pagamentos pendentes/falhados
- [x] Calcular comissões corretas por plano (20-30%)


## Dashboard de Comissões
- [x] Criar tela de dashboard com resumo de comissões
- [x] Implementar abas de filtro (pendentes, aprovadas, pagas)
- [x] Exibir histórico de comissões com status
- [x] Mostrar estatísticas de ganhos

## Sistema de Saque de Comissões
- [x] Criar tela de saque com fluxo em etapas
- [x] Implementar validação de valor mínimo/máximo
- [x] Criar formulário de dados bancários
- [x] Implementar revisão de dados antes de confirmar
- [x] Criar serviço de saque com Stripe Connect
- [x] Implementar webhook para confirmação de transferência

## Detecção de Fraude e Monitoramento
- [x] Implementar cálculo de score de fraude
- [x] Detectar múltiplas contas (mesmo IP, email, dispositivo)
- [x] Detectar velocidade anormal de referências
- [x] Detectar padrão de churn de referências
- [x] Criar sistema de alertas de fraude
- [x] Implementar bloqueio de usuários suspeitos
- [x] Criar painel administrativo de fraude
- [x] Implementar webhook para ações de fraude

## Testes
- [x] 33 testes de fraude e saque
- [x] 22 testes de validação de comissões
- [x] 15 testes de banco de dados
- [x] Total: 80 testes passando


## Piloto Financeiro - Módulos Novos
- [ ] Fase 1: Expandir schema PostgreSQL (15+ tabelas)
- [ ] Fase 2: Onboarding com 5 passos + LGPD
- [ ] Fase 3: Dashboard com métricas e gráficos
- [ ] Fase 4: Analisador de Corrida + overlay Android
- [ ] Fase 5: Padrões de Demanda + IA
- [ ] Fase 6: Métricas Mensais com Gemini IA
- [ ] Fase 7: Ranking + Marketplace + Comissões
- [ ] Fase 8: Asaas API (planos, pagamentos, PIX)
- [ ] Fase 9: Feature flags por camada
- [ ] Fase 10: Build final e checkpoint
