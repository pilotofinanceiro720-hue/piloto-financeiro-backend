# Design do Aplicativo - Driver Finance

## Orientação e Contexto de Uso

Este aplicativo foi projetado para **orientação portrait (9:16)** e **uso com uma mão**, seguindo as diretrizes da **Apple Human Interface Guidelines (HIG)** para proporcionar uma experiência nativa e familiar aos usuários de iOS e Android.

## Paleta de Cores

**Cores Principais:**
- **Primary (Azul):** `#0a7ea4` - Usado para botões principais, destaques e elementos interativos
- **Success (Verde):** `#22C55E` (light) / `#4ADE80` (dark) - Indicadores de lucro positivo
- **Warning (Amarelo):** `#F59E0B` (light) / `#FBBF24` (dark) - Alertas e avisos
- **Error (Vermelho):** `#EF4444` (light) / `#F87171` (dark) - Despesas e indicadores negativos

**Cores de Interface:**
- **Background:** `#ffffff` (light) / `#151718` (dark)
- **Surface:** `#f5f5f5` (light) / `#1e2022` (dark) - Cards e superfícies elevadas
- **Foreground:** `#11181C` (light) / `#ECEDEE` (dark) - Texto principal
- **Muted:** `#687076` (light) / `#9BA1A6` (dark) - Texto secundário

## Lista de Telas

### 1. **Home (Dashboard)**
**Conteúdo Principal:**
- Card de resumo do dia com lucro líquido em destaque (grande, centralizado)
- Métricas rápidas: receita bruta, despesas, gorjetas
- Status online/offline (toggle switch)
- Botão principal "Iniciar Corrida" (destaque visual)
- "Radar de Oportunidades" (seção com dicas de áreas de demanda)

**Funcionalidade:**
- Visualização rápida do desempenho financeiro do dia
- Acesso rápido para iniciar corrida
- Navegação para outras seções via tab bar

**Layout:**
- Header com saudação e avatar do usuário
- Cards empilhados verticalmente com espaçamento generoso
- Botão flutuante ou fixo no rodapé para "Iniciar Corrida"

---

### 2. **Mapa e Demanda**
**Conteúdo Principal:**
- Mapa interativo mostrando localização atual
- Marcadores de áreas de alta demanda (heatmap)
- Pins de eventos e shows próximos
- Pins de postos de combustível e pontos de recarga
- Previsão de pico (banner ou card sobreposto)

**Funcionalidade:**
- Visualização geográfica de oportunidades
- Navegação para locais de interesse
- Atualização em tempo real de demanda

**Layout:**
- Mapa ocupando maior parte da tela
- Controles de zoom e localização
- Filtros deslizantes na parte inferior (combustível, eventos, demanda)

---

### 3. **Corrida Particular**
**Conteúdo Principal:**
- Campos de entrada: Origem, Destino
- Configurações de tarifa: valor por km, valor por minuto, multiplicador
- Toggle para incluir pedágios
- Resumo estimado (distância, tempo, custo)
- Botão "Iniciar Corrida"

**Funcionalidade:**
- Cálculo automático de custos do trajeto
- Registro de corrida particular (fora de apps como Uber)
- Estimativa de lucro antes de aceitar corrida

**Layout:**
- Formulário vertical com campos agrupados
- Seção de resumo destacada
- Botão de ação no rodapé

---

### 4. **Resumo da Corrida**
**Conteúdo Principal:**
- Informações da corrida: distância, tempo, origem, destino
- Breakdown de custos: combustível, pedágios, manutenção
- Receita bruta
- Lucro líquido (destaque visual)
- Botão "Finalizar Corrida"

**Funcionalidade:**
- Visualização detalhada dos custos e ganhos
- Confirmação de finalização da corrida
- Armazenamento no histórico

**Layout:**
- Card principal com métricas grandes
- Lista de itens de custo
- Botão de ação no rodapé

---

### 5. **Fechamento do Dia**
**Conteúdo Principal:**
- Resumo diário: receita total, despesas, gorjetas, lucro líquido
- Lista de corridas realizadas
- Gráfico de desempenho (opcional)
- Botão "Encerrar Dia"

**Funcionalidade:**
- Consolidação de todas as corridas do dia
- Visualização de performance
- Registro de fechamento diário

**Layout:**
- Header com resumo financeiro
- Lista scrollável de corridas
- Botão de ação no rodapé

---

### 6. **Planejamento Mensal**
**Conteúdo Principal:**
- Meta líquida mensal (input editável)
- Gastos mensais fixos (input editável)
- Dias trabalhados no mês
- Cálculo: "Valor necessário por dia"
- Progresso visual (barra de progresso)

**Funcionalidade:**
- Definição de metas financeiras
- Cálculo automático de necessidade diária
- Acompanhamento de progresso

**Layout:**
- Formulário com inputs grandes
- Card de resultado destacado
- Gráfico de progresso mensal

---

### 7. **Meu Veículo**
**Conteúdo Principal:**
- Informações do veículo: marca, modelo, ano
- Quilometragem atual
- Consumo médio (km/l ou kWh)
- Coeficiente de desgaste
- Custos médios de manutenção

**Funcionalidade:**
- Cadastro e edição de dados do veículo
- Cálculo automático de custos baseado em consumo
- Histórico de manutenção (futuro)

**Layout:**
- Formulário vertical com seções agrupadas
- Botão "Salvar" no rodapé

---

### 8. **Marketplace (Parcerias e Benefícios)**
**Conteúdo Principal:**
- Campo de busca inteligente
- Grid ou lista de produtos/ofertas
- Card de produto: imagem, nome, preço, loja, cupom (se disponível)
- Botão "Comprar" (link afiliado)
- Seção "Lista de Desejos"
- Alertas ativos (badge de notificação)

**Funcionalidade:**
- Busca de produtos com IA
- Exibição de ofertas seguras e confiáveis
- Sistema de lista de desejos
- Alertas de preço e cupons

**Layout:**
- Search bar no topo
- Grid de produtos (2 colunas)
- Filtros e ordenação
- Tabs: "Ofertas", "Lista de Desejos", "Alertas"

---

### 9. **Configurações**
**Conteúdo Principal:**
- Perfil do usuário (nome, foto, email)
- Tarifas padrão (valores por km, minuto)
- Consumo do veículo
- Preferências (notificações, tema)
- Gerenciamento de assinatura
- Logout

**Funcionalidade:**
- Edição de perfil e preferências
- Configuração de tarifas padrão
- Gerenciamento de conta

**Layout:**
- Lista de seções com navegação
- Formulários em telas separadas

---

## Fluxos de Usuário Principais

### Fluxo 1: Registrar Corrida Particular
1. Usuário abre app → Dashboard
2. Toca em "Iniciar Corrida"
3. Preenche origem e destino
4. Ajusta tarifas (se necessário)
5. Visualiza estimativa
6. Toca "Iniciar Corrida"
7. Durante corrida, app rastreia tempo/distância
8. Ao finalizar, toca "Finalizar Corrida"
9. Visualiza resumo detalhado
10. Confirma e salva no histórico

### Fluxo 2: Consultar Áreas de Demanda
1. Usuário abre app → Dashboard
2. Navega para tab "Mapa"
3. Visualiza mapa com heatmap de demanda
4. Filtra por "Eventos" ou "Combustível"
5. Toca em marcador para ver detalhes
6. Opcionalmente, inicia navegação

### Fluxo 3: Buscar Ofertas no Marketplace
1. Usuário navega para tab "Marketplace"
2. Digita produto no campo de busca (ex: "pneu")
3. IA busca e exibe ofertas confiáveis
4. Usuário visualiza cards de produtos
5. Toca em produto para ver detalhes
6. Adiciona à lista de desejos OU
7. Toca "Comprar" (abre link afiliado)
8. Ativa alerta de preço (opcional)

### Fluxo 4: Definir Meta Mensal
1. Usuário navega para "Planejamento Mensal"
2. Insere meta líquida (ex: R$ 5.000)
3. Insere gastos mensais (ex: R$ 2.000)
4. App calcula valor necessário por dia
5. Usuário visualiza progresso atual
6. Salva meta

### Fluxo 5: Encerrar Dia de Trabalho
1. Usuário finaliza última corrida
2. Navega para "Fechamento do Dia"
3. Revisa resumo: receita, despesas, lucro
4. Toca "Encerrar Dia"
5. Dados são salvos no histórico mensal
6. Dashboard é resetado para novo dia

---

## Componentes de Interface Principais

### Cards Financeiros
- Fundo com `bg-surface`
- Bordas arredondadas (`rounded-2xl`)
- Sombra sutil
- Padding generoso
- Valores em destaque (fonte grande, bold)

### Botões Principais
- `bg-primary` com texto branco
- Bordas arredondadas (`rounded-full`)
- Feedback tátil (haptic) ao pressionar
- Estado de loading quando necessário

### Inputs de Formulário
- Bordas sutis (`border-border`)
- Fundo `bg-surface`
- Labels claros acima do campo
- Validação inline

### Status Indicators
- Lucro: verde (`text-success`)
- Despesa: vermelho (`text-error`)
- Neutro: cinza (`text-muted`)

---

## Considerações de Design

**Acessibilidade:**
- Contraste adequado entre texto e fundo
- Tamanhos de fonte legíveis (mínimo 14px para corpo)
- Áreas de toque mínimas de 44x44px
- Suporte a modo escuro

**Performance:**
- Carregamento rápido de telas
- Animações sutis (80-300ms)
- Feedback imediato em interações

**Usabilidade:**
- Navegação clara e intuitiva
- Minimizar número de toques para ações principais
- Confirmações para ações destrutivas
- Estados de loading e erro bem definidos

---

## Tecnologias de Interface

- **React Native** com Expo SDK 54
- **NativeWind** (Tailwind CSS) para estilização
- **Expo Router** para navegação
- **React Native Reanimated** para animações
- **Expo Haptics** para feedback tátil
- **Expo Maps** para visualização de mapas
