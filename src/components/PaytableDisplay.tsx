import React from 'react';
import { PAYTABLE_CONFIG } from '../utils/pokerLogic';
import { HandRank } from '../types/poker';

interface PaytableDisplayProps {
  currentBet: number;
  winningHandRank: HandRank | null;
}

export const PaytableDisplay: React.FC<PaytableDisplayProps> = ({
  currentBet,
  winningHandRank,
}) => {
  return (
    <div
      className="relative rounded-lg p-2.5 sm:p-3 overflow-hidden select-none border border-pink-500/40"
      style={{
        background: 'linear-gradient(180deg, rgba(20, 2, 28, 0.95) 0%, rgba(10, 0, 16, 0.98) 100%)',
        boxShadow: 'inset 0 0 16px rgba(255, 42, 109, 0.35), 0 0 12px rgba(255, 42, 109, 0.25)',
      }}
    >
      {/* CRT Scanline Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 42, 109, 0.15) 2px, rgba(255, 42, 109, 0.15) 4px)',
        }}
      />

      {/* Screen Glare reflection */}
      <div className="absolute -top-10 -left-10 w-48 h-32 bg-white/5 rounded-full blur-xl pointer-events-none transform -rotate-12" />

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-pink-500/30 pb-1 mb-1.5 font-mono text-[10px] sm:text-xs text-pink-400 font-bold uppercase tracking-wider">
        <span>PAYTABLE</span>
        <span className="text-pink-300">BET x{currentBet}</span>
      </div>

      {/* Paytable Rows */}
      <div className="space-y-0.5 sm:space-y-1 font-mono text-[9px] sm:text-[11px] leading-tight">
        {PAYTABLE_CONFIG.map((row) => {
          const isWinner = winningHandRank === row.handRank;
          // Calculate payout: royal flush at bet 5 pays 4000 (800x), else 250x
          const multiplier = row.handRank === 'ROYAL_FLUSH' && currentBet === 5 ? 800 : row.multiplier;
          const payoutCredits = multiplier * currentBet;

          return (
            <div
              key={row.handRank}
              className={`flex items-center justify-between px-1.5 py-0.5 rounded transition-all duration-300 ${
                isWinner
                  ? 'bg-pink-500/30 text-white font-black animate-pulse'
                  : 'text-pink-300/80 hover:text-pink-200'
              }`}
              style={{
                textShadow: isWinner
                  ? '0 0 8px #ff2a6d, 0 0 16px #ff2a6d, 0 0 24px #fff'
                  : '0 0 5px rgba(255, 42, 109, 0.6)',
              }}
            >
              <span className="tracking-tight">{row.displayName}</span>
              <span className="font-bold tabular-nums ml-2 text-right">
                {payoutCredits.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
