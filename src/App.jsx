import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Trophy, Volume2 } from 'lucide-react';

const PRESET_OPTIONS = [
  { label: '2 min', value: 120 },
  { label: '5 min', value: 300 },
  { label: '10 min', value: 600 },
];

const SOUND_OPTIONS = [
  { label: 'Bell (1s)', value: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' },
  { label: 'Chime (3s)', value: 'https://assets.mixkit.co/active_storage/sfx/933/933-preview.mp3' },
  { label: 'Alarm (5s)', value: 'https://assets.mixkit.co/active_storage/sfx/995/995-preview.mp3' },
];

const WorkoutTimer = () => {
  const [timeLeft, setTimeLeft] = useState(120);
  const [duration, setDuration] = useState(120);
  const [customMode, setCustomMode] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [rounds, setRounds] = useState(0);
  const [wakeLock, setWakeLock] = useState(null);
  const [selectedSound, setSelectedSound] = useState(SOUND_OPTIONS[0].value);

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
  const strokeDashoffset = circumference - (timeLeft / duration) * circumference;

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
      audioRef.current.play().catch(() => {});
    }
  }, []);

  // Logica del Timer
  const handleTick = useCallback(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        playSound();
        setRounds((r) => r + 1);
        return duration;
      }
      return prev - 1;
    });
  }, [duration, playSound]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(handleTick, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, handleTick]);

  // Aggiorna sorgente audio al cambio suoneria
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = selectedSound;
      audioRef.current.load();
    }
  }, [selectedSound]);

  // Anteprima suoneria
  const previewSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  // Gestione cambio intervallo
  const applyDuration = (secs) => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setTimeLeft(secs);
    setDuration(secs);
    releaseWakeLock();
  };

  const handleSelectChange = (e) => {
    const val = e.target.value;
    if (val === 'custom') {
      setCustomMode(true);
      setCustomMinutes('');
    } else {
      setCustomMode(false);
      setCustomMinutes('');
      applyDuration(parseInt(val, 10));
    }
  };

  const handleCustomMinutes = (e) => {
    const mins = parseInt(e.target.value, 10);
    setCustomMinutes(e.target.value);
    if (mins > 0 && mins <= 999) {
      applyDuration(mins * 60);
    }
  };

  // Gestione pulsanti
  const toggleTimer = () => {
    if (!isActive) {
      requestWakeLock();
      // Prima sblocca l'audio, poi riproduce
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play().catch(() => {});
      }
    } else {
      releaseWakeLock();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setTimeLeft(duration);
    setRounds(0);
    releaseWakeLock();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center p-6">
      {/* Audio Element */}
      <audio ref={audioRef} preload="auto" src={selectedSound}></audio>

      <div className="w-full max-w-md flex flex-col items-center space-y-12">
        {/* Header e Rounds */}
        <div className="text-center space-y-2">
          <h1 className="text-sm font-bold tracking-[0.2em] text-blue-500 uppercase">Workout Timer</h1>
          <div className="flex items-center justify-center gap-2 text-3xl font-medium">
            <Trophy className="text-yellow-500 w-6 h-6" />
            <span>Round {rounds}</span>
          </div>
        </div>

        {/* Settings */}
        <div className="flex flex-col items-center gap-4 w-full">
          {/* Duration Selector */}
          <div className="flex flex-col items-center gap-1.5 w-full">
            <label className="text-xs text-slate-400 font-medium tracking-wider uppercase">Interval</label>
            <select
              value={customMode ? 'custom' : duration}
              onChange={handleSelectChange}
              className="w-48 px-4 py-2.5 rounded-lg bg-slate-800 text-slate-100 text-sm font-semibold border border-slate-700 focus:border-blue-500 outline-none cursor-pointer"
            >
              {PRESET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
              <option value="custom">Custom...</option>
            </select>

            {customMode && (
              <input
                type="number"
                min="1"
                max="999"
                placeholder="Insert minutes"
                value={customMinutes}
                onChange={handleCustomMinutes}
                autoFocus
                className="w-48 px-4 py-2.5 rounded-lg bg-slate-800 text-slate-100 text-sm text-center border border-slate-700 focus:border-blue-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            )}
          </div>

          {/* Sound Selector */}
          <div className="flex flex-col items-center gap-1.5 w-full">
            <label className="text-xs text-slate-400 font-medium tracking-wider uppercase">Ringtone</label>
            <div className="flex items-center gap-2">
              <select
                value={selectedSound}
                onChange={(e) => setSelectedSound(e.target.value)}
                className="w-40 px-4 py-2.5 rounded-lg bg-slate-800 text-slate-100 text-sm font-semibold border border-slate-700 focus:border-blue-500 outline-none cursor-pointer"
              >
                {SOUND_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                onClick={previewSound}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-slate-300 border border-slate-700"
                aria-label="Preview sound"
                title="Preview"
              >
                <Volume2 size={18} />
              </button>
            </div>
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