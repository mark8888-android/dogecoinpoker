import React from 'react';
import { soundFx } from '../utils/audio';

interface PhysicalControlsProps {
  onDraw: () => void;
  onBetOne: () => void;
  onBetMax: () => void;
  canDraw: boolean;
  canBet: boolean;
  currentBet: number;
  stage: 'BETTING' | 'DEAL' | 'EVALUATING' | 'RESULT';
}

export const PhysicalControls: React.FC<PhysicalControlsProps> = ({
  onDraw,
  onBetOne,
  onBetMax,
  canDraw,
  canBet,
  currentBet,
  stage,
}) => {
  const handleDrawClick = () => {
    if (!canDraw) return;
    soundFx.playButtonClick();
    onDraw();
  };

  const handleBetOneClick = () => {
    if (!canBet) return;
    soundFx.playBetTick();
    onBetOne();
  };

  const handleBetMaxClick = () => {
    if (!canBet) return;
    soundFx.playButtonClick();
    onBetMax();
  };

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6 py-2">
      {/* DRAW BUTTON (Large Center Glowing Arcade Pushbutton) */}
      <button
        onClick={handleDrawClick}
        disabled={!canDraw}
        className={`group relative outline-none select-none transition-all duration-100 ${
          canDraw
            ? 'active:scale-95 active:translate-y-1 cursor-pointer'
            : 'opacity-40 cursor-not-allowed filter grayscale-[40%]'
        }`}
        style={{
          perspective: '600px',
        }}
        aria-label="Draw Cards"
      >
        {/* Outer Heavy Beveled Black/Chrome Arcade Housing Frame */}
        <div
          className="p-1 sm:p-1.5 rounded-lg border-2 border-slate-700/80"
          style={{
            background: 'linear-gradient(180deg, #2b3342 0%, #111620 50%, #080c14 100%)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,255,255,0.2)',
          }}
        >
          {/* Inner Recessed Bezel */}
          <div
            className="px-6 sm:px-10 py-3 sm:py-4 rounded-md border border-cyan-400/50 relative overflow-hidden transition-all duration-150"
            style={{
              background: 'linear-gradient(180deg, #00d2ff 0%, #0077b6 60%, #004b77 100%)',
              boxShadow: canDraw
                ? '0 0 20px rgba(0, 210, 255, 0.7), inset 0 2px 4px rgba(255,255,255,0.7), inset 0 -3px 6px rgba(0,0,0,0.5)'
                : 'inset 0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {/* Top Gloss highlight */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />

            {/* Glowing Label */}
            <span
              className="relative z-10 font-mono font-black text-sm sm:text-lg text-white tracking-widest uppercase block"
              style={{
                textShadow: '0 0 10px #ffffff, 0 0 20px #00f0ff, 0 0 30px #00a8ff',
              }}
            >
              [ {stage === 'DEAL' ? 'DRAW' : 'DEAL'} ]
            </span>
          </div>
        </div>
      </button>

      {/* BET ONE BUTTON */}
      <button
        onClick={handleBetOneClick}
        disabled={!canBet}
        className={`group relative outline-none select-none transition-all duration-100 ${
          canBet
            ? 'active:scale-95 active:translate-y-1 cursor-pointer'
            : 'opacity-40 cursor-not-allowed filter grayscale-[40%]'
        }`}
        aria-label="Bet One Credit"
      >
        <div
          className="p-1 sm:p-1.5 rounded-lg border-2 border-slate-700/80"
          style={{
            background: 'linear-gradient(180deg, #2b3342 0%, #111620 50%, #080c14 100%)',
            boxShadow: '0 6px 14px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,255,255,0.2)',
          }}
        >
          <div
            className="px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-md border border-blue-400/40 relative overflow-hidden transition-all duration-150"
            style={{
              background: 'linear-gradient(180deg, #0284c7 0%, #0369a1 60%, #0c4a6e 100%)',
              boxShadow: canBet
                ? '0 0 14px rgba(2, 132, 199, 0.6), inset 0 2px 3px rgba(255,255,255,0.6)'
                : 'none',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
            <span
              className="relative z-10 font-mono font-bold text-xs sm:text-sm text-cyan-50 tracking-wider uppercase block"
              style={{
                textShadow: '0 0 8px #ffffff, 0 0 15px #38bdf8',
              }}
            >
              [ BET ONE ]
            </span>
          </div>
        </div>
      </button>

      {/* BET MAX BUTTON */}
      <button
        onClick={handleBetMaxClick}
        disabled={!canBet}
        className={`group relative outline-none select-none transition-all duration-100 ${
          canBet
            ? 'active:scale-95 active:translate-y-1 cursor-pointer'
            : 'opacity-40 cursor-not-allowed filter grayscale-[40%]'
        }`}
        aria-label="Bet Max Credits"
      >
        <div
          className="p-1 sm:p-1.5 rounded-lg border-2 border-slate-700/80"
          style={{
            background: 'linear-gradient(180deg, #2b3342 0%, #111620 50%, #080c14 100%)',
            boxShadow: '0 6px 14px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,255,255,0.2)',
          }}
        >
          <div
            className="px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-md border border-cyan-300/50 relative overflow-hidden transition-all duration-150"
            style={{
              background: 'linear-gradient(180deg, #06b6d4 0%, #0891b2 60%, #164e63 100%)',
              boxShadow: canBet
                ? '0 0 16px rgba(6, 182, 212, 0.65), inset 0 2px 3px rgba(255,255,255,0.6)'
                : 'none',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
            <span
              className="relative z-10 font-mono font-bold text-xs sm:text-sm text-cyan-50 tracking-wider uppercase block"
              style={{
                textShadow: '0 0 8px #ffffff, 0 0 15px #22d3ee',
              }}
            >
              [ BET MAX ]
            </span>
          </div>
        </div>
      </button>
    </div>
  );
};
