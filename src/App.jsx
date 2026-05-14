import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Trophy, Volume2 } from 'lucide-react';

const TIMER_DURATION = 120; // 2 minuti in secondi

const WorkoutTimer = () => {
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [rounds, setRounds] = useState(0);
  const [wakeLock, setWakeLock] = useState(null);

  const audioRef = useRef(null);
  const timerRef = useRef(null);

  // Formatta il tempo in MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcola la circonferenza per il progresso SVG
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / TIMER_DURATION) * circumference;

  // Gestione Screen Wake Lock
  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock(lock);
        console.log('Wake Lock attivo');
      } catch (err) {
        console.error(`${err.name}, ${err.message}`);
      }
    }
  };

  const releaseWakeLock = () => {
    if (wakeLock) {
      wakeLock.release();
      setWakeLock(null);
    }
  };

  // Funzione per suonare il "Ding"
  const playSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio play blocked by browser"));
    }
  }, []);

  // Logica del Timer
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playSound();
      setRounds((prev) => prev + 1);
      setTimeLeft(TIMER_DURATION);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft, playSound]);

  // Gestione pulsanti
  const toggleTimer = () => {
    if (!isActive) {
      requestWakeLock();
      // "Sblocca" l'audio sui browser mobile al primo click
      if (audioRef.current) audioRef.current.load();
    } else {
      releaseWakeLock();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setTimeLeft(TIMER_DURATION);
    setRounds(0);
    releaseWakeLock();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center p-6">
      {/* Audio Element - Bell Sound */}
      <audio ref={audioRef} preload="auto">
        <source src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" type="audio/mpeg" />
      </audio>

      <div className="w-full max-w-md flex flex-col items-center space-y-12">
        {/* Header e Rounds */}
        <div className="text-center space-y-2">
          <h1 className="text-sm font-bold tracking-[0.2em] text-blue-500 uppercase">Workout Timer</h1>
          <div className="flex items-center justify-center gap-2 text-3xl font-medium">
            <Trophy className="text-yellow-500 w-6 h-6" />
            <span>Round {rounds}</span>
          </div>
        </div>

        {/* Circular Countdown Container */}
        <div className="relative flex items-center justify-center">
          <svg className="w-72 h-72 transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="144"
              cy="144"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-800"
            />
            {/* Progress Circle */}
            <circle
              cx="144"
              cy="144"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              style={{
                strokeDashoffset,
                transition: 'stroke-dashoffset 1s linear',
              }}
              strokeLinecap="round"
              className="text-blue-500"
            />
          </svg>
          
          {/* Time Display */}
          <div className="absolute flex flex-col items-center">
            <span className="text-7xl font-mono font-bold tracking-tighter">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8">
          <button
            onClick={resetTimer}
            className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors text-slate-300"
            aria-label="Reset"
          >
            <RotateCcw size={28} />
          </button>

          <button
            onClick={toggleTimer}
            className={`p-8 rounded-full transition-all transform active:scale-95 ${
              isActive 
                ? 'bg-red-500/10 text-red-500 border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                : 'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)]'
            }`}
          >
            {isActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
          </button>

          <div className="p-4 text-slate-500">
            <Volume2 size={28} />
          </div>
        </div>

        {/* Status Indicator */}
        <div className="text-xs text-slate-500 font-medium">
          {wakeLock ? (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Screen Always On
            </span>
          ) : (
            <span className="opacity-50">Standby</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutTimer;