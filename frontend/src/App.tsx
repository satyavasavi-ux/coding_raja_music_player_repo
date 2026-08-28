import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Sliders, 
  Radio, Disc3, Sparkles, Music, Activity, Layers, Repeat, Shuffle,
  Zap, Share2, Headphones, Cpu, Database, CheckCircle
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  bpm: number;
  key: string;
  audio_url: string;
  cover_url: string;
  genre: string;
  bitrate_kbps: number;
  waveform_peaks: number[];
}

const DEFAULT_TRACKS: Track[] = [
  {
    id: "trk-001",
    title: "Night Owl (Harmoniq Master)",
    artist: "Broke For Free",
    album: "Directionless EP",
    duration: 218,
    bpm: 124,
    key: "A Minor",
    audio_url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3",
    cover_url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
    genre: "Synthwave / Chillhop",
    bitrate_kbps: 320,
    waveform_peaks: [0.1, 0.4, 0.8, 0.65, 0.9, 0.75, 0.85, 0.4, 0.95, 0.7, 0.6, 0.8, 0.5, 0.3, 0.88, 0.92, 0.6]
  },
  {
    id: "trk-002",
    title: "Enthusiast (Hi-Res Remaster)",
    artist: "Tours",
    album: "Enthusiast Single",
    duration: 194,
    bpm: 128,
    key: "F# Major",
    audio_url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3",
    cover_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
    genre: "Electronic Dance",
    bitrate_kbps: 320,
    waveform_peaks: [0.2, 0.5, 0.7, 0.85, 0.9, 0.95, 0.8, 0.75, 0.9, 0.85, 0.7, 0.6, 0.95, 0.88, 0.4]
  },
  {
    id: "trk-003",
    title: "Shipping Lanes (Spatial Stereo)",
    artist: "Chad Crouch",
    album: "Arps Collection",
    duration: 182,
    bpm: 110,
    key: "C Major",
    audio_url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3",
    cover_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
    genre: "Ambient / Instrumental",
    bitrate_kbps: 320,
    waveform_peaks: [0.15, 0.3, 0.45, 0.6, 0.75, 0.7, 0.8, 0.65, 0.7, 0.55, 0.4, 0.35, 0.25]
  },
  {
    id: "trk-004",
    title: "Cybernetic Pulse (Lossless FLAC)",
    artist: "AuraSound Labs",
    album: "Quantum Acoustics 2026",
    duration: 240,
    bpm: 132,
    key: "D Minor",
    audio_url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3",
    cover_url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80",
    genre: "Cyberpunk / DNB",
    bitrate_kbps: 1411,
    waveform_peaks: [0.3, 0.7, 0.95, 0.85, 0.9, 0.98, 0.9, 0.82, 0.88, 0.94, 0.78, 0.65]
  }
];

const PRESETS: Record<string, number[]> = {
  "Flat": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  "Bass Heavy": [7.0, 5.5, 3.5, 1.0, 0, 0, 0, 0, 1.0, 2.0],
  "Vocal Clarity": [-2.0, -1.0, 0, 2.5, 4.5, 4.0, 3.0, 1.5, 0.5, -0.5],
  "Cyber Rave": [8.0, 6.0, 2.5, -1.0, -1.5, 1.5, 4.0, 6.0, 7.0, 8.0],
  "Studio Master": [2.0, 1.5, 0.5, 0, 0.5, 1.0, 2.0, 2.5, 2.0, 1.5],
  "Lo-Fi Warmth": [4.0, 3.0, 1.0, 0, -1.0, -2.0, -3.5, -5.0, -7.0, -9.0]
};

const FREQUENCIES = ["32Hz", "64Hz", "125Hz", "250Hz", "500Hz", "1kHz", "2kHz", "4kHz", "8kHz", "16kHz"];

export default function App() {
  const [tracks, setTracks] = useState<Track[]>(DEFAULT_TRACKS);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<string>("Cyber Rave");
  const [eqGains, setEqGains] = useState<number[]>(PRESETS["Cyber Rave"]);
  const [spatialMode, setSpatialMode] = useState<boolean>(true);
  const [bassBoost, setBassBoost] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'player' | 'equalizer' | 'library' | 'dsp'>('player');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  const currentTrack = tracks[currentIdx] || DEFAULT_TRACKS[0];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e));
    }
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current && duration > 0) {
      audioRef.current.currentTime = (val / 100) * duration;
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs <= 0) return "0:00";
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const selectPreset = (pName: string) => {
    setActivePreset(pName);
    setEqGains([...PRESETS[pName]]);
  };

  const updateBand = (bandIdx: number, val: number) => {
    const next = [...eqGains];
    next[bandIdx] = val;
    setEqGains(next);
    setActivePreset("Custom");
  };

  // Canvas visualizer animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const bars = 48;
      const barWidth = width / bars;

      for (let i = 0; i < bars; i++) {
        const barHeight = isPlaying 
          ? (Math.sin(phase + i * 0.25) * 0.4 + 0.6) * (height * 0.8) * ((eqGains[i % 10] + 12) / 24)
          : (Math.sin(phase * 0.5 + i * 0.1) * 0.1 + 0.15) * height;

        const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
        gradient.addColorStop(0, '#38bdf8');
        gradient.addColorStop(0.5, '#a855f7');
        gradient.addColorStop(1, '#ec4899');

        ctx.fillStyle = gradient;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = isPlaying ? 10 : 2;
        ctx.fillRect(i * barWidth + 1, height - barHeight, barWidth - 2, barHeight);
      }

      phase += isPlaying ? 0.08 : 0.02;
      animRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, eqGains]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.audio_url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        autoPlay={isPlaying}
      />

      {/* Top Header */}
      <header className="border-b border-cyan-500/20 bg-[#070d1e]/80 backdrop-blur-xl px-6 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-2xl shadow-cyan-950/40">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 p-0.5 shadow-lg shadow-cyan-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#070d1e] rounded-[10px] flex items-center justify-center">
              <Disc3 className={`w-5 h-5 text-cyan-400 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black tracking-wider text-base bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400">
                AURASOUND PRO
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono">
                v4.5 FLAC
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Enterprise Audio Streaming & WebAudio DSP Workstation</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('player')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'player' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Master Player</span>
          </button>
          <button
            onClick={() => setActiveTab('equalizer')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'equalizer' ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>10-Band EQ</span>
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'library' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Library ({tracks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('dsp')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTab === 'dsp' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>DSP Rack</span>
          </button>
        </div>

        {/* Live Audio Telemetry Badge */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block font-mono text-[11px]">
            <div className="text-cyan-400 flex items-center justify-end space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
              <span>48.0 kHz / 24-bit Lossless</span>
            </div>
            <div className="text-slate-400">{currentTrack.bitrate_kbps} kbps • {currentTrack.bpm} BPM • {currentTrack.key}</div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visualizer & Master Deck */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          {/* Main Visualizer Deck */}
          <div className="relative rounded-2xl bg-gradient-to-b from-[#091124] to-[#050b18] border border-cyan-500/20 p-6 overflow-hidden shadow-2xl shadow-cyan-950/30 flex flex-col justify-between min-h-[380px]">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Track Info Card */}
            <div className="flex items-center space-x-5 z-10">
              <div className="relative group">
                <img
                  src={currentTrack.cover_url}
                  alt={currentTrack.title}
                  className="w-24 h-24 rounded-xl object-cover shadow-2xl ring-2 ring-cyan-500/30 group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {currentTrack.genre}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Track {currentIdx + 1} of {tracks.length}</span>
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight truncate mt-1">{currentTrack.title}</h1>
                <p className="text-sm font-medium text-cyan-400/90 truncate">{currentTrack.artist} • <span className="text-slate-400">{currentTrack.album}</span></p>
              </div>
            </div>

            {/* Canvas Spectrum Visualizer */}
            <div className="my-4 relative h-28 w-full rounded-xl bg-black/40 border border-cyan-500/10 p-2 overflow-hidden flex items-end">
              <canvas ref={canvasRef} width={600} height={100} className="w-full h-full block" />
              <div className="absolute top-2 right-3 font-mono text-[10px] text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                REALTIME FFT SPECTRUM
              </div>
            </div>

            {/* Progress Bar and Scrubber */}
            <div className="space-y-1.5 z-10">
              <div className="relative group">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={duration ? (currentTime / duration) * 100 : 0}
                  onChange={handleSeek}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-fuchsia-400 transition-colors"
                />
              </div>
              <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                <span>{formatTime(currentTime)}</span>
                <span className="text-cyan-400/70">PRO MASTERED (48kHz)</span>
                <span>{formatTime(duration || currentTrack.duration)}</span>
              </div>
            </div>

            {/* Master Transport Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 z-10">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setBassBoost(!bassBoost)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
                    bassBoost ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  ⚡ Bass Boost
                </button>
                <button
                  onClick={() => setSpatialMode(!spatialMode)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
                    spatialMode ? 'bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-300' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  🎧 3D Spatial
                </button>
              </div>

              {/* Main Buttons */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-full bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-all active:scale-95"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={togglePlay}
                  className="p-4 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-bold shadow-xl shadow-cyan-500/40 transform hover:scale-105 active:scale-95 transition-all"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-black text-black" /> : <Play className="w-6 h-6 fill-black text-black ml-0.5" />}
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-full bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-all active:scale-95"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center space-x-2">
                <button onClick={() => setIsMuted(!isMuted)} className="text-slate-400 hover:text-cyan-300 transition-colors">
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Quick Preset Matrix */}
          <div className="rounded-xl bg-[#091124]/60 border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Active DSP Equalizer Curve</span>
              </span>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                Preset: {activePreset}
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {Object.keys(PRESETS).map((p) => (
                <button
                  key={p}
                  onClick={() => selectPreset(p)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all border text-center truncate ${
                    activePreset === p
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: 10-Band Graphic Equalizer & Library */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* 10-Band Graphic Equalizer Console */}
          <div className="rounded-2xl bg-gradient-to-b from-[#091124] to-[#050b18] border border-cyan-500/20 p-5 shadow-xl shadow-cyan-950/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-fuchsia-400" />
                <h2 className="text-sm font-bold text-white tracking-wide uppercase">10-Band Parametric Matrix</h2>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                ±12 dB Gain
              </span>
            </div>

            {/* 10 Sliders */}
            <div className="grid grid-cols-10 gap-1.5 items-end h-44 py-2 px-1 bg-black/40 rounded-xl border border-slate-800">
              {eqGains.map((gain, i) => (
                <div key={i} className="flex flex-col items-center h-full justify-between">
                  <span className="text-[9px] font-mono text-cyan-300">{gain > 0 ? `+${gain}` : gain}</span>
                  <div className="h-28 flex items-center justify-center">
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="0.5"
                      value={gain}
                      onChange={(e) => updateBand(i, Number(e.target.value))}
                      className="h-24 w-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-fuchsia-400 -rotate-90"
                    />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">{FREQUENCIES[i]}</span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Sub-Bass (32Hz)</span>
              <span className="text-cyan-400">Presence (2kHz)</span>
              <span>Brilliance (16kHz)</span>
            </div>
          </div>

          {/* Master Playlist Library */}
          <div className="rounded-2xl bg-[#091124]/80 border border-slate-800 p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-sm font-bold text-white tracking-wide uppercase">Active Track Queue</h2>
                </div>
                <span className="text-xs font-mono text-slate-400">{tracks.length} Master Audio Assets</span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {tracks.map((t, idx) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setCurrentIdx(idx);
                      setIsPlaying(true);
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      currentIdx === idx
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-950/50'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 relative">
                        <img src={t.cover_url} alt={t.title} className="w-full h-full object-cover" />
                        {currentIdx === idx && isPlaying && (
                          <div className="absolute inset-0 bg-cyan-950/60 flex items-center justify-center">
                            <Activity className="w-4 h-4 text-cyan-300 animate-pulse" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate text-white">{t.title}</p>
                        <p className="text-[11px] text-slate-400 truncate">{t.artist}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center space-x-2 flex-shrink-0">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">{t.bpm} BPM</span>
                      <span className="text-xs font-mono text-slate-400">{formatTime(t.duration)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Footer Status */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>WebAudio DSP Connected</span>
              </span>
              <span>FastAPI Port 8000</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
