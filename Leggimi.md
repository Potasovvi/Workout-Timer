# Workout Timer

Applicazione web minimal e reattiva per gestire i tempi di recupero tra le serie di allenamento — pensata per chi fa esercizi a intervalli regolari o per chi gioca a calcetto con gli amici e ogni tot minuti deve cambiare portiere. Progettata per essere rapida, precisa e priva di distrazioni.

## Caratteristiche

- **Intervalli timer selezionabili** — 2, 5, 10 minuti, o un valore personalizzato inserito manualmente, con conteggio automatico dei round
- **Indicatore circolare SVG** con animazione fluida (transizione di 1 secondo)
- **Avviso sonoro** al termine di ogni round (suono Mixkit via elemento `<audio>`)
- **Screen Wake Lock API** — impedisce allo schermo del dispositivo di spegnersi durante l'allenamento, con indicatore di stato in tempo reale
- **Contatore round** — si incrementa automaticamente a ogni scadenza del timer
- **Tema scuro** — interfaccia ad alto contrasto ottimizzata per la leggibilità in ambienti con poca luce
- **Completamente responsive** — funziona su smartphone, tablet e desktop

## Stack Tecnologico

| Tecnologia | Ruolo |
|---|---|
| [React 19](https://react.dev/) | Framework UI |
| [Vite 8](https://vite.dev/) | Build tool e server di sviluppo |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling utility-first |
| [lucide-react](https://lucide.dev/) | Libreria di icone |

## Funzionamento

L'utente seleziona una durata tra quattro opzioni: 2, 5, 10 minuti, oppure un valore personalizzato inserito in minuti. Il timer esegue il conto alla rovescia della durata selezionata utilizzando `useEffect` e `setInterval` di React. Il progresso circolare è renderizzato tramite un elemento SVG `<circle>` il cui `stroke-dashoffset` viene interpolato linearmente in base al rapporto `timeLeft / duration`. Quando il contatore raggiunge lo zero:

1. Viene riprodotto un suono campanella da un elemento `<audio>` precaricato.
2. Il contatore dei round viene incrementato.
3. Il timer si azzera automaticamente alla durata selezionata.

Se il browser supporta l'API Screen Wake Lock, lo schermo rimane acceso finché il timer è attivo e viene rilasciato in pausa o al reset.

## Per Iniziare

### Prerequisiti

- Node.js >= 18

### Installazione

```bash
git clone <url-della-repository>
cd workout-timer
npm install
```

### Sviluppo

```bash
npm run dev
```

Apri l'URL mostrato nel terminale (default `http://localhost:5173`).

### Build per la Produzione

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Supporto Browser

L'applicazione funziona su tutti i browser moderni. L'API Screen Wake Lock richiede un contesto sicuro (HTTPS o `localhost`) ed è supportata nelle versioni recenti di Chrome, Edge e Samsung Internet.

## Licenza

MIT
