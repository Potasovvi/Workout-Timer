# Workout Timer

A minimal, responsive web application for managing recovery intervals and workout sessions — designed for anyone doing regular interval exercises or playing five-a-side football with friends who needs to rotate goalkeepers every few minutes. Built for speed, precision, and distraction-free training.

## Features

- **Selectable timer intervals** — 2, 5, 10 minutes, or a custom value entered manually, with automatic round tracking
- **Circular SVG progress indicator** with smooth 1-second transition animation
- **Audio alert** on round completion via the Web Audio API (Mixkit sound)
- **Screen Wake Lock API** — prevents the device screen from dimming during a session, with a live status indicator
- **Round counter** — increments automatically at each timer expiration
- **Dark theme** — high-contrast UI optimized for readability in low-light gym environments
- **Fully responsive** — works seamlessly on smartphones, tablets, and desktops

## Tech Stack

| Technology | Role |
|---|---|
| [React 19](https://react.dev/) | UI framework |
| [Vite 8](https://vite.dev/) | Build tool and dev server |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [lucide-react](https://lucide.dev/) | Icon library |

## How It Works

The user selects a duration from four options: 2, 5, 10 minutes, or a custom value entered in minutes. The timer runs the selected countdown using React's `useEffect` and `setInterval`. The circular progress is rendered via an SVG `<circle>` element whose `stroke-dashoffset` is interpolated linearly based on `timeLeft / duration`. When the counter reaches zero:

1. A bell sound is played from a preloaded `<audio>` element.
2. The round counter increments.
3. The timer resets to the selected duration automatically.

If the browser supports the Screen Wake Lock API, the screen remains on while the timer is active and is released on pause or reset.

## Getting Started

### Prerequisites

- Node.js >= 18

### Installation

```bash
git clone <repository-url>
cd workout-timer
npm install
```

### Development

```bash
npm run dev
```

Open the URL shown in the terminal (default `http://localhost:5173`).

### Build for Production

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Browser Support

The application works in all modern browsers. The Screen Wake Lock API requires a secure context (HTTPS or `localhost`) and is supported in recent versions of Chrome, Edge, and Samsung Internet.

## License

MIT
