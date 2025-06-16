# 🌍✈️ TravelWise - Recomendador Inteligente de Viagens

**TravelWise** é um sistema inteligente que ajuda usuários a planejar viagens completas, oferecendo recomendações personalizadas de bagagem, pontos turísticos e estimativas financeiras com base no destino, época e duração da viagem.

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Usar](#-como-usar)
- [Componentes Principais](#componentes-principais)
- [API e Dados](#api-e-dados)
- [Estilização](#estilização)
- [Tratamento de Erros](#tratamento-de-erros)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## 🎯 Sobre o Projeto

O **TravelWise** é uma aplicação web desenvolvida em **React.js** que funciona como um assistente pessoal de viagens. Ao informar o destino, data e duração, o sistema gera um planejamento completo com:

- ✅ **Recomendações de Bagagem**
- ✅ **Roteiro Turístico Personalizado**
- ✅ **Estimativas Financeiras**
- ✅ **Dicas Úteis sobre o Destino**

---

## ✨ Funcionalidades

### 🎒 Planejamento de Bagagem
- Sugestões de roupas conforme o clima
- Lista de higiene e cuidados pessoais
- Recomendação de acessórios e eletrônicos
- Cálculo do tamanho ideal da mala

### 🗺️ Roteiro Turístico
- Pontos turísticos populares e hidden gems
- Sugestão de atividades por dia
- Dicas gastronômicas e culturais
- Opções de transporte local

### 💰 Estimativas Financeiras
- Custo médio por categoria: hospedagem, alimentação, transporte
- Orçamento total estimado
- Dicas de economia por estação
- Comparativo por períodos do ano

### 🌟 Funcionalidades Técnicas
- Interface SPA moderna e responsiva
- Navegação fluida com React Router
- Validação de formulários e tratamento de erros
- Persistência de dados com LocalStorage

---

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- React.js 18+
- React Router DOM
- React Hooks (useState, useEffect, useParams, useNavigate)
- JSX

### **Estilização**
- CSS3 + CSS Modules
- Flexbox & Grid Layout
- Media Queries para responsividade

### **Ferramentas de Desenvolvimento**
- Vite
- npm
- JSON / JSON Server
- ES6+

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (v16 ou superior)
- npm (v8 ou superior)
- Editor de código (VS Code recomendado)

---

## 🚀 Instalação

### 1. Criação do Projeto

```bash
npm create vite@latest travelwise -- --template react
cd travelwise
npm install
```

### 2. Instalação de Dependências

```bash
npm install react-router-dom
npm install json-server
```

### 3. Configuração do JSON Server

Edite o `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview",
  "server": "json-server --watch data/db.json --port 3001"
}
```

### 4. Execução do Projeto

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run server
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:3001`

---

## 📁 Estrutura do Projeto

```
travelwise/
├── public/
├── src/
│   ├── components/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── styles/
│   ├── App.jsx
│   ├── main.jsx
├── data/
│   └── db.json
├── package.json
└── README.md
```

---

## 🎮 Como Usar

### 1. Página Inicial
- Acesse a URL principal
- Navegue para o planejador de viagens

### 2. Planejamento
- Informe:
  - Destino
  - Data de início
  - Duração
  - Tipo de viagem

### 3. Resultados
- **Bagagem:** Itens recomendados
- **Turismo:** Pontos turísticos e atividades
- **Orçamento:** Estimativas de gastos
- **Resumo:** Planejamento completo

### 4. Extras
- Salve localmente
- Exportação para PDF *(em desenvolvimento)*
- Compartilhamento por link *(em desenvolvimento)*

---

## 🧩 Componentes Principais

- `TravelForm`: Formulário de entrada
- `BaggageRecommendations`: Recomendações de bagagem
- `TourismGuide`: Sugestões turísticas
- `BudgetEstimator`: Estimativas de orçamento
- `NavBar`, `Footer`, `LoadingSpinner`: Layout e UX

---

## 📡 API e Dados

- **JSON Server:** Simula backend em `/data/db.json`
- **Fetch API:** Comunicação assíncrona
- **Local Storage:** Armazena planejamentos localmente

---

## 🎨 Estilização

- `global.css`, `variables.css`, `responsive.css`
- CSS Modules com escopo local
- Layouts responsivos via Flexbox e Grid

---

## ❌ Tratamento de Erros

- Validação de formulários
- Mensagens de erro personalizadas
- Redirecionamento para página de erro

---

