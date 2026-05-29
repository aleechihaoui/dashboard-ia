# Dashboard IA Financier

## Description
Dashboard interactif avec agent IA conversationnel pour analyser
des donnees financieres en langage naturel.

## Fonctionnalites
- KPIs financiers en temps reel (CA, benefice, marge, tresorerie)
- Graphiques interactifs (bar chart, line chart) avec Chart.js
- Agent IA conversationnel pour analyser les donnees
- Questions suggereees en un clic
- Interface dark mode professionnelle

## Stack technique
- **JavaScript** : logique metier et appels API
- **HTML/CSS** : interface dark mode responsive
- **Chart.js** : visualisation des donnees
- **OpenRouter API** : acces aux modeles LLM gratuits
- **LLM** : meta-llama/llama-3.2-3b-instruct

## Installation

1. Clone le repo
git clone https://github.com/aleechihaoui/dashboard-ia.git

2. Ouvre index.html dans ton navigateur

3. Configure ta cle API dans app.js
const OPENROUTER_API_KEY = "ta-cle-openrouter";

## Structure
dashboard-ia/
├── index.html      # Interface principale
├── app.js          # Logique IA et graphiques
├── style.css       # Dark theme
└── README.md

## Ce que ca demontre
- Integration d'un LLM dans une interface web
- Visualisation de donnees financieres
- Agent conversationnel sur donnees structurees
- Interface comprehensible par des equipes non techniques