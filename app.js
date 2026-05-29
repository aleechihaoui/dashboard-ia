// ── Configuration ─────────────────────────────────────────────────────────────
const OPENROUTER_API_KEY = "YOUR_API_KEY_HERE";
const MODEL = "google/gemma-4-31b-it:freeze-2024-09-01";

// ── Données financières ────────────────────────────────────────────────────────
const data = {
  departements: {
    labels: ["Commercial", "Technique", "Support"],
    valeurs: [1500000, 800000, 200000]
  },
  mensuel: {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
             "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"],
    valeurs: [180000, 195000, 210000, 205000, 220000, 215000,
              230000, 225000, 240000, 235000, 250000, 295000]
  },
  contexte: `
    Rapport financier 2025 - Entreprise XYZ
    Chiffre d'affaires total : 2.5 millions euros
    Benefice net : 350 000 euros
    Marge brute : 42%
    Dette totale : 800 000 euros
    Tresorerie : 1.2 millions euros
    
    Departements :
    - Commercial : 1.5M euros, croissance 15%
    - Technique : 800K euros, croissance 8%
    - Support : 200K euros, croissance 3%
    
    Previsions 2026 :
    - Objectif CA : 3 millions euros
    - Investissements : 500 000 euros
    - Recrutements : 12 employes
    
    Risques :
    - Hausse couts matieres premieres
    - Concurrence accrue marche europeen
    - Dependance 3 clients majeurs = 60% du CA
  `
};

// ── Graphiques ─────────────────────────────────────────────────────────────────
function initCharts() {
  // Chart départements
  new Chart(document.getElementById("chart-ca"), {
    type: "bar",
    data: {
      labels: data.departements.labels,
      datasets: [{
        label: "CA (€)",
        data: data.departements.valeurs,
        backgroundColor: ["#7c83fd", "#2ecc71", "#e74c3c"],
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#888" }, grid: { color: "#2d2f45" } },
        y: { ticks: { color: "#888" }, grid: { color: "#2d2f45" } }
      }
    }
  });

  // Chart mensuel
  new Chart(document.getElementById("chart-mensuel"), {
    type: "line",
    data: {
      labels: data.mensuel.labels,
      datasets: [{
        label: "CA mensuel (€)",
        data: data.mensuel.valeurs,
        borderColor: "#7c83fd",
        backgroundColor: "rgba(124, 131, 253, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#7c83fd"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#888" }, grid: { color: "#2d2f45" } },
        y: { ticks: { color: "#888" }, grid: { color: "#2d2f45" } }
      }
    }
  });
}

// ── Chat IA ────────────────────────────────────────────────────────────────────
function ajouterMsg(texte, role) {
  const msgs = document.getElementById("messages");
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.id = role === "loading" ? "loading-msg" : "";
  div.textContent = texte;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

async function envoyer() {
  const input = document.getElementById("input");
  const btn = document.getElementById("btn");
  const question = input.value.trim();
  if (!question) return;

  ajouterMsg(question, "user");
  input.value = "";
  btn.disabled = true;
  ajouterMsg("Analyse en cours...", "loading");

  const prompt = `Tu es un agent IA expert en analyse financiere.
Voici les donnees du dashboard :
${data.contexte}

Question de l'utilisateur : ${question}

Reponds de facon claire et concise en francais, en te basant sur les donnees.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400
      })
    });

    const result = await response.json();
    document.getElementById("loading-msg")?.remove();

    if (result.choices) {
      ajouterMsg(result.choices[0].message.content, "ai");
    } else if (result.error?.code === 429) {
      setTimeout(() => envoyer(), 5000);
      return;
    } else {
      ajouterMsg("Erreur : " + JSON.stringify(result.error), "ai");
    }
  } catch (e) {
    document.getElementById("loading-msg")?.remove();
    ajouterMsg("Erreur de connexion.", "ai");
  }

  btn.disabled = false;
}

function poser(el) {
  document.getElementById("input").value = el.textContent;
  envoyer();
}

// ── Init ───────────────────────────────────────────────────────────────────────
initCharts();