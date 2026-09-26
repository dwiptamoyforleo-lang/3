import React, { useState, useEffect, useRef } from 'react';
import { FocusSession } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Flame, 
  Sparkles,
  Award
} from 'lucide-react';

interface FocusTimerProps {
  onSessionComplete: (session: Omit<FocusSession, 'id'>) => void;
  sessions: FocusSession[];
}

export const FocusTimer: React.FC<FocusTimerProps> = ({
  onSessionComplete,
  sessions,
}) => {
  // Preset durations in minutes
  const presets = [
    { label: 'Pomodoro', minutes: 25, tag: 'Deep Work' },
    { label: 'Deep Flow', minutes: 50, tag: 'Architecture' },
    { label: 'Sprint', minutes: 15, tag: 'Quick Tasks' },
    { label: 'Short Break', minutes: 5, tag: 'Break' },
  ];

  const [selectedPreset, setSelectedPreset] = useState(presets[0]);
  const [timeLeft, setTimeLeft] = useState(presets[0].minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientSound, setAmbientSound] = useState<'off' | 'whitenoise' | 'rain'>('off');

  // Web Audio Context reference
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientNodeRef = useRef<{ stop: () => void } | null>(null);

  // Play audio completion tone
  const playAlarm = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
      osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.3); // D6

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // AudioContext may be restricted by browser gesture
    }
  };

  // Toggle ambient white noise / sound synthesizer
  const toggleAmbientSound = (soundType: 'off' | 'whitenoise' | 'rain') => {
    if (ambientNodeRef.current) {
      ambientNodeRef.current.stop();
      ambientNodeRef.current = null;
    }

    if (soundType === 'off') {
      setAmbientSound('off');
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Generate 2 seconds of noise buffer
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      if (soundType === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.value = 800;
      } else {
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
      }

      const gain = ctx.createGain();
      gain.gain.value = 0.05;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();

      ambientNodeRef.current = {
        stop: () => {
          try {
            noise.stop();
            noise.disconnect();
          } catch {}
        },
      };

      setAmbientSound(soundType);
    } catch {
      setAmbientSound('off');
    }
  };

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      playAlarm();
      onSessionComplete({
        durationMinutes: selectedPreset.minutes,
        completedAt: new Date().toISOString(),
        tag: selectedPreset.tag,
      });
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, selectedPreset, onSessionComplete]);

  // Clean up ambient sound on unmount
  useEffect(() => {
    return () => {
      if (ambientNodeRef.current) {
        ambientNodeRef.current.stop();
      }
    };
  }, []);

  const handlePresetSelect = (preset: typeof presets[0]) => {
    setIsRunning(false);
    setSelectedPreset(preset);
    setTimeLeft(preset.minutes * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedPreset.minutes * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalMinutes = sessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalSeconds = selectedPreset.minutes * 60;
  const progressPercent = Math.round(((totalSeconds - timeLeft) / totalSeconds) * 100);

  return (
    <div className="space-y-6 py-2">
      {/* Top Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Pillar 3: Focus & Flow Intervals
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Block out distractions and execute focused bursts with synchronized audio queues.
        </p>
      </div>

      {/* Main Timer Display Card */}
      <div className="relative overflow-hidden bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 flex flex-col items-center justify-center text-center shadow-2xl">
        {/* Preset Selector */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 mb-8 flex-wrap justify-center">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => handlePresetSelect(p)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                selectedPreset.label === p.label
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {p.label} ({p.minutes}m)
            </button>
          ))}
        </div>

        {/* Big Circular Progress & Timer */}
        <div className="relative flex items-center justify-center my-4">
          <svg className="w-64 h-64 sm:w-72 sm:h-72 transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="text-slate-800 stroke-current"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="text-pink-500 stroke-current transition-all duration-500"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={(2 * Math.PI * 120) * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className="text-5xl sm:text-6xl font-black text-white tracking-tight font-mono">
              {formatTime(timeLeft)}
            </span>
            <span className="mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
              {selectedPreset.tag}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-base transition shadow-xl cursor-pointer ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                : 'bg-pink-600 hover:bg-pink-500 text-white shadow-pink-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" /> Start Focus
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 cursor-pointer"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Ambient Sound Generators */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 w-full max-w-md flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            {ambientSound === 'off' ? (
              <VolumeX className="w-4 h-4 text-slate-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-pink-400 animate-pulse" />
            )}
            <span>Synthesized Ambient:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleAmbientSound('off')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                ambientSound === 'off'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Mute
            </button>
            <button
              onClick={() => toggleAmbientSound('whitenoise')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                ambientSound === 'whitenoise'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              White Noise
            </button>
            <button
              onClick={() => toggleAmbientSound('rain')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                ambientSound === 'rain'
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              Rain Sound
            </button>
          </div>
        </div>
      </div>

      {/* Focus Stats & Recent Logs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-pink-500/10 text-pink-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Time Focused</p>
            <p className="text-xl font-bold text-white mt-0.5">{totalMinutes} Minutes</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Completed Cycles</p>
            <p className="text-xl font-bold text-white mt-0.5">{sessions.length} Intervals</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Daily Streak Target</p>
            <p className="text-xl font-bold text-white mt-0.5">3 of 3 Met</p>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-pink-400" /> Recent Completed Sessions
        </h3>
        {sessions.length === 0 ? (
          <p className="text-sm text-slate-500 py-3">No focus intervals logged yet.</p>
        ) : (
          <div className="space-y-2">
            {sessions.slice(0, 5).map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/80"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-pink-500" />
                  <span className="text-sm font-medium text-slate-200">
                    {s.durationMinutes} Minutes Focus
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    {s.tag}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(s.completedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
