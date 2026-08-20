"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, ShieldCheck, Lock } from "lucide-react";

type PreviewPlayerProps = {
  src: string;
  poster?: string;
  limitSeconds?: number;
  expiresAt?: string;
  isUnlocked?: boolean;
  onLimitReached?: () => void;
};

export function PreviewPlayer({
  src,
  poster,
  limitSeconds = 10,
  expiresAt,
  isUnlocked = false,
  onLimitReached,
}: PreviewPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovering, setIsHovering] = useState(true);
  const [limitReached, setLimitReached] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (expiresAt) {
      if (new Date(expiresAt).getTime() < Date.now()) {
        setIsExpired(true);
        setLimitReached(true);
      }
    }
  }, [expiresAt]);

  useEffect(() => {
    if (videoRef.current && src) {
      videoRef.current.load();
      // Tentativa de auto-play na montagem/mudança de source
      videoRef.current.play().catch(() => {
        // Ignora erro se o navegador bloquear autoplay
      });
    }
  }, [src]);

  // Format time (e.g., 01:23)
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (limitReached) {
      if (onLimitReached) onLimitReached();
      return;
    }

    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      if (newMutedState) {
        setVolume(0);
      } else {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(err => {
          console.error(`Erro ao entrar em tela cheia: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      setProgress((current / total) * 100);

      // Check limit (only if not unlocked and not explicitly rented/active)
      const hasAccess = isUnlocked || (expiresAt && !isExpired);
      if (!hasAccess && current >= limitSeconds && !limitReached) {
        videoRef.current.pause();
        setIsPlaying(false);
        setLimitReached(true);
        if (onLimitReached) onLimitReached();
        // Sair da tela cheia se estiver em tela cheia
        if (document.fullscreenElement) {
           document.exitFullscreen().catch(() => {});
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (limitReached) return;
    const seekValue = parseFloat(e.target.value);
    const seekTime = (seekValue / 100) * duration;
    
    if (seekTime > limitSeconds && !isUnlocked && !(expiresAt && !isExpired)) {
       return; // Prevent seeking beyond limit if no access
    }
    
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setProgress(seekValue);
    }
  };

  // Auto-hide controls when not hovering
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying) {
      timeout = setTimeout(() => setIsHovering(false), 3000);
    } else {
      setIsHovering(true);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, isHovering]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-none md:rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5 group"
      onMouseMove={() => setIsHovering(true)}
      onMouseLeave={() => { if (isPlaying) setIsHovering(false); }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        controlsList="nodownload"
        playsInline
        autoPlay
        muted
        preload="auto"
      />



      {/* Botão de Play Gigante no Centro */}
      {!isPlaying && !limitReached && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-10 bg-black/20 cursor-pointer transition-colors"
          onClick={togglePlay}
        >
          <div className="p-5 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Play className="w-16 h-16 text-white/80 fill-white/80 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] ml-1" />
          </div>
        </div>
      )}



      {/* Tela de Limite Atingido / Expirado */}
      {limitReached && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-500">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-2xl">
            <Lock className="w-7 h-7 text-zinc-300" />
          </div>
          {isExpired && (
            <>
              <h2 className="text-2xl font-black text-white tracking-tight mb-2">
                Aluguel Expirado
              </h2>
              <p className="text-zinc-400 text-sm font-medium mb-6">
                Seu período de 24 horas terminou.
              </p>
            </>
          )}
          <button 
            onClick={() => { if (onLimitReached) onLimitReached(); }}
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg hover:shadow-red-600/20 active:scale-95"
          >
            {isExpired ? "Renovar Aluguel" : "Desbloquear Vídeo Completo"}
          </button>
        </div>
      )}

      {/* Custom Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12 pb-4 px-4 md:px-6 transition-opacity duration-300 z-10 ${
          isHovering || !isPlaying || limitReached ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-2 w-full group/progress">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            disabled={limitReached}
            className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer outline-none transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:w-4 hover:[&::-webkit-slider-thumb]:h-4 [&::-moz-range-progress]:bg-red-500 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, #ef4444 ${progress}%, #27272a ${progress}%)`
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            
            {/* Play/Pause Button na barra */}
            <button 
              onClick={togglePlay} 
              className="text-white hover:text-red-500 transition-colors focus:outline-none"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <div className="flex items-center gap-2 group/volume">
              <button onClick={toggleMute} className="text-white hover:text-red-500 transition-colors focus:outline-none">
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-0 opacity-0 group-hover/volume:w-20 group-hover/volume:opacity-100 h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer outline-none transition-all duration-300 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                style={{
                  background: `linear-gradient(to right, white ${volume * 100}%, #27272a ${volume * 100}%)`
                }}
              />
            </div>

            <div className="text-xs font-semibold text-zinc-300 tabular-nums">
              {formatTime(currentTime)} <span className="text-zinc-600">/</span> {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleFullscreen}
              className="text-white hover:text-red-500 transition-colors focus:outline-none"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
