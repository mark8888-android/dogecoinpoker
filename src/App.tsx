import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Card, GameStage, HandEvaluation, DogeWallets, DogeCoreStatus, LedgerItem } from './types/poker';
import { createDeck, shuffleDeck, evaluatePokerHand } from './utils/pokerLogic';
import { soundFx } from './utils/audio';
import { CardSvg } from './components/CardSvg';
import { PaytableDisplay } from './components/PaytableDisplay';
import { PhysicalControls } from './components/PhysicalControls';
import { DogeConsoleModal } from './components/DogeConsoleModal';
import { RainCanvas } from './components/RainCanvas';

export default function App() {
  // Game session states
  const [deck, setDeck] = useState<Card[]>([]);
  // Initialize with exact iconic hand from image: 10♥, J♣, J♠, J♦, A♠
  const [hand, setHand] = useState<Card[]>([
    { id: '10_hearts_init', suit: 'hearts', rank: '10', value: 10 },
    { id: 'j_clubs_init', suit: 'clubs', rank: 'J', value: 11 },
    { id: 'j_spades_init', suit: 'spades', rank: 'J', value: 11 },
    { id: 'j_diamonds_init', suit: 'diamonds', rank: 'J', value: 11 },
    { id: 'a_spades_init', suit: 'spades', rank: 'A', value: 14 },
  ]);
  // Initial held states matching the image ([HELD] on card 3, 4, 5)
  const [heldCards, setHeldCards] = useState<boolean[]>([false, false, true, true, true]);
  const [currentBet, setCurrentBet] = useState<number>(5);
  const [credits, setCredits] = useState<number>(1450);
  const [stage, setStage] = useState<GameStage>('DEAL');
  const [statusMessage, setStatusMessage] = useState<string>('SELECT CARDS TO HOLD');
  const [evaluation, setEvaluation] = useState<HandEvaluation | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // Dogecoin Core & Wallets state
  const [wallets, setWallets] = useState<DogeWallets>({
    player: {
      address: 'DTkzjqfsz5c5svKr3pD8FuTd2VfmedXeJw',
      balanceDoge: 5820.0,
    },
    house: {
      address: 'DFtZcDHNZPytu56nK7qffYVJssvCNLiq9P',
      balanceDoge: 250000.0,
    },
    gameOperating: {
      address: 'DByArToqzT2MH8eZDRFSKmshNLzUucFwpr',
      balanceDoge: 145.0,
      unsettledLossesDoge: 0.0,
    },
  });

  const [coreStatus, setCoreStatus] = useState<DogeCoreStatus>({
    connected: false,
    version: '1.14.9',
    protocolVersion: 70015,
    blocks: 5412980,
    connections: 16,
    difficulty: 14258902.15,
    relayFee: 0.01,
    lastRpcCheck: new Date().toISOString(),
    error: null,
    mode: 'ACTIVE_BRIDGE',
  });

  const [ledger, setLedger] = useState<LedgerItem[]>([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Fetch initial node and wallet status from backend
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/doge/status');
      if (res.ok) {
        const data = await res.json();
        setWallets(data.wallets);
        setCoreStatus(data.core);
        if (data.player && typeof data.player.credits === 'number') {
          setCredits(data.player.credits);
        }
        if (Array.isArray(data.ledger)) {
          setLedger(data.ledger);
        }
      }
    } catch (e) {
      // Backend status fallback handled gracefully
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 12000);
    return () => clearInterval(interval);
  }, []);

  // Card click handler for holding/unholding
  const toggleHold = (index: number) => {
    if (stage !== 'DEAL') return;
    const nextHeld = [...heldCards];
    nextHeld[index] = !nextHeld[index];
    setHeldCards(nextHeld);
    soundFx.playToggleHold(nextHeld[index]);
  };

  // Increment Bet
  const handleBetOne = () => {
    if (stage !== 'BETTING' && stage !== 'RESULT') return;
    const nextBet = currentBet >= 5 ? 1 : currentBet + 1;
    setCurrentBet(nextBet);
    soundFx.playBetTick();
  };

  // Bet Max (sets 5 and triggers deal)
  const handleBetMax = () => {
    if (stage !== 'BETTING' && stage !== 'RESULT') return;
    setCurrentBet(5);
    soundFx.playButtonClick();
    handleDeal(5);
  };

  // Primary Action: Deal / Draw
  const handleDrawOrDeal = () => {
    if (stage === 'BETTING' || stage === 'RESULT') {
      handleDeal(currentBet);
    } else if (stage === 'DEAL') {
      handleDraw();
    }
  };

  // Deal first 5 cards
  const handleDeal = async (betAmount = currentBet) => {
    if (credits < betAmount) {
      setStatusMessage('INSUFFICIENT CREDITS - DEPOSIT DOGE');
      setIsConsoleOpen(true);
      return;
    }

    // Deduct bet locally and on backend
    setCredits((prev) => prev - betAmount);
    setStage('DEAL');
    setHeldCards([false, false, false, false, false]);
    setEvaluation(null);
    setStatusMessage('SELECT CARDS TO HOLD');

    // Notify backend of bet deduction
    fetch('/api/doge/bet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ betAmount }),
    }).catch(() => {});

    // Create fresh deck, shuffle, and deal 5 cards
    const freshDeck = shuffleDeck(createDeck());
    const initialHand = freshDeck.slice(0, 5);
    const remainingDeck = freshDeck.slice(5);

    setDeck(remainingDeck);
    setHand(initialHand);

    // Play card deal sounds in sequence
    initialHand.forEach((_, i) => soundFx.playDealCard(i * 70));
  };

  // Draw replacement cards and evaluate
  const handleDraw = async () => {
    setStage('EVALUATING');
    setStatusMessage('DRAWING CARDS...');

    // Replace unheld cards
    let currentDeck = [...deck];
    if (currentDeck.length < 5) {
      currentDeck = shuffleDeck(createDeck());
    }

    const nextHand = hand.map((card, i) => {
      if (heldCards[i]) {
        return card;
      }
      const newCard = currentDeck.shift()!;
      soundFx.playDealCard(i * 90);
      return newCard;
    });

    setHand(nextHand);
    setDeck(currentDeck);

    // Evaluate Hand
    setTimeout(async () => {
      const result = evaluatePokerHand(nextHand, currentBet);
      setEvaluation(result);

      if (result.winCredits > 0) {
        soundFx.playWinFanfare(result.multiplier >= 9);
        soundFx.playCoinPayout();
        setStatusMessage(`YOU WON WITH ${result.name}! +${result.winCredits.toLocaleString()} CREDITS`);

        // Trigger celebratory confetti for significant wins
        if (result.multiplier >= 9) {
          confetti({
            particleCount: 65,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00f0ff', '#ff2a6d', '#ffe600', '#7000ff'],
          });
        }

        // Notify backend of winning payout to transfer DOGE to player wallet
        try {
          const res = await fetch('/api/doge/payout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              winCredits: result.winCredits,
              handName: result.name,
              bet: currentBet,
            }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.wallets) setWallets(data.wallets);
            if (data.credits) setCredits(data.credits);
            fetchStatus();
          }
        } catch (e) {
          setCredits((prev) => prev + result.winCredits);
        }
      } else {
        // Player loss: DOGE stays in Game Operating Wallet
        setStatusMessage('GAME OVER - PLACE YOUR BET');
        try {
          await fetch('/api/doge/loss', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bet: currentBet }),
          });
          fetchStatus();
        } catch (e) {}
      }

      setStage('RESULT');
    }, 450);
  };

  // Deposit player Dogecoin
  const handleDeposit = async (amountDoge: number) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/doge/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountDoge }),
      });
      if (res.ok) {
        const data = await res.json();
        setCredits(data.credits);
        setWallets(data.wallets);
        soundFx.playCoinPayout();
        await fetchStatus();
      }
    } catch (e) {
      // Local fallback
      setCredits((prev) => prev + amountDoge * 10);
      setWallets((prev) => ({
        ...prev,
        player: { ...prev.player, balanceDoge: Math.max(0, prev.player.balanceDoge - amountDoge) },
        gameOperating: { ...prev.gameOperating, balanceDoge: prev.gameOperating.balanceDoge + amountDoge },
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  // End of Business Day Sweep
  const handleEndOfDayTransfer = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/doge/end-of-day-transfer', {
        method: 'POST',
      });
      if (res.ok) {
        await fetchStatus();
      }
    } catch (e) {
      // Fallback
      setWallets((prev) => ({
        ...prev,
        house: { ...prev.house, balanceDoge: prev.house.balanceDoge + prev.gameOperating.balanceDoge },
        gameOperating: { ...prev.gameOperating, balanceDoge: 0, unsettledLossesDoge: 0 },
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  // One-click Download ZIP
  const handleDownloadZip = () => {
    window.location.href = '/api/download-zip';
  };

  const toggleAudio = () => {
    const next = soundFx.toggle();
    setAudioEnabled(next);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center bg-[#030712] text-white overflow-hidden select-none">
      {/* Rain and Bokeh canvas */}
      <RainCanvas />

      {/* Cyberpunk Arcade Street Contextual Backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Deep atmospheric gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060c18] via-[#040813] to-[#020308]" />

        {/* Street Lights & Neon Reflections on wet asphalt */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-cyan-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-pink-600/15 blur-[120px] rounded-full" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-500/15 blur-[120px] rounded-full" />

        {/* Left Arcade Cabinet: "NEO-RAMA" (as seen in image) */}
        <div className="hidden lg:block absolute left-3 top-20 w-60 h-[480px] rounded-xl border-2 border-pink-500/40 bg-slate-950/80 shadow-[0_0_35px_rgba(255,42,109,0.35)] opacity-40 blur-[2px]">
          <div className="p-3 text-center font-mono font-black text-pink-500 tracking-[0.25em] text-sm border-b border-pink-500/40 shadow-[0_0_12px_#ff2a6d]">
            NEO-RAMA
          </div>
          <div className="p-4 mt-8 flex flex-col items-center">
            <div className="w-40 h-28 border border-pink-400/30 rounded bg-pink-950/20" />
            <div className="w-44 h-8 bg-slate-800 rounded mt-6 border border-slate-700" />
          </div>
        </div>

        {/* Right Arcade Cabinet: "CYBER-SLOT" (as seen in image) */}
        <div className="hidden lg:block absolute right-3 top-20 w-60 h-[480px] rounded-xl border-2 border-cyan-500/40 bg-slate-950/80 shadow-[0_0_35px_rgba(0,240,255,0.35)] opacity-40 blur-[2px]">
          <div className="p-3 text-center font-mono font-black text-cyan-400 tracking-[0.25em] text-sm border-b border-cyan-500/40 shadow-[0_0_12px_#00f0ff]">
            CYBER-SLOT
          </div>
          <div className="p-4 mt-8 flex flex-col items-center">
            <div className="w-40 h-28 border border-cyan-400/30 rounded bg-cyan-950/20" />
            <div className="w-44 h-8 bg-slate-800 rounded mt-6 border border-slate-700" />
          </div>
        </div>
      </div>

      {/* Top Cyber Navigation Bar */}
      <header className="relative z-20 w-full max-w-6xl px-4 py-2.5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono font-extrabold text-xs sm:text-sm tracking-wider text-cyan-300">
            DOGE VIDEO POKER // CORE v1.14.9
          </span>
        </div>

        {/* Quick actions: Dogecoin Console, Sound, Download ZIP */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsConsoleOpen(true)}
            className="px-2.5 sm:px-3 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/50 text-cyan-300 font-mono text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5"
            title="Open Dogecoin Core 1.14.9 Console & Wallets"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>CORE WALLETS</span>
          </button>

          <button
            onClick={handleDownloadZip}
            className="px-2.5 sm:px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 font-mono text-[11px] sm:text-xs font-bold transition-all"
            title="Download ZIP for LAN Testing"
          >
            DOWNLOAD .ZIP
          </button>

          <button
            onClick={toggleAudio}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs transition-colors"
            title="Toggle Sound Effects"
          >
            {audioEnabled ? 'SFX ON' : 'MUTED'}
          </button>
        </div>
      </header>

      {/* Main Arcade Console Viewport */}
      <main className="relative z-10 w-full max-w-6xl flex-1 flex flex-col items-center justify-center px-2 sm:px-4 py-2 sm:py-4">
        {/* Holographic HUD Screen Glass Panel */}
        <div
          className="relative w-full max-w-5xl rounded-2xl p-4 sm:p-6 backdrop-blur-md border border-cyan-500/30"
          style={{
            background: 'linear-gradient(180deg, rgba(6, 12, 26, 0.75) 0%, rgba(2, 5, 14, 0.85) 100%)',
            boxShadow: '0 0 45px rgba(0, 240, 255, 0.2), inset 0 0 25px rgba(0, 240, 255, 0.1)',
          }}
        >
          {/* Subtle reflection glare on glass */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-2xl" />

          {/* 1. Upper Displays (Exact replication of image_1.png) */}
          <div className="relative z-10 flex items-center justify-between mb-2 sm:mb-4 px-2 sm:px-4 font-mono">
            {/* Bet Display (Magenta/Cyan) */}
            <div
              className="text-xs sm:text-base md:text-lg font-black tracking-wider"
              style={{
                color: '#00f0ff',
                textShadow: '0 0 10px #00f0ff, 0 0 20px #0099ff',
              }}
            >
              BET: {currentBet} {currentBet === 5 ? '[MAX]' : ''}
            </div>

            {/* Status / Prompt Display (Glowing Magenta / Pink) */}
            <div
              className="text-xs sm:text-base md:text-xl font-black tracking-widest uppercase text-center px-2"
              style={{
                color: '#ff2a6d',
                textShadow: '0 0 10px #ff2a6d, 0 0 20px #ff007f, 0 0 30px #ffffff',
              }}
            >
              {statusMessage}
            </div>

            {/* Credits Display (Blue / Cyan) */}
            <div
              className="text-xs sm:text-base md:text-lg font-black tracking-wider"
              style={{
                color: '#00f0ff',
                textShadow: '0 0 10px #00f0ff, 0 0 20px #0099ff',
              }}
            >
              CREDITS: {credits.toLocaleString()}
            </div>
          </div>

          {/* 2. Five Holographic Glowing Cards Row */}
          <div className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-3 md:gap-4 my-2 sm:my-4">
            {hand.map((card, idx) => (
              <CardSvg
                key={card.id}
                card={card}
                isHeld={heldCards[idx]}
                isWinning={evaluation?.highlightCardIndices.includes(idx) ?? false}
                canHold={stage === 'DEAL'}
                onClick={() => toggleHold(idx)}
              />
            ))}
          </div>
        </div>

        {/* 3. Main Console Surface (Wet Textured Metal with Controls & Paytable) */}
        <div
          className="relative w-full max-w-5xl mt-3 sm:mt-5 rounded-2xl p-4 sm:p-5 border-2 border-slate-700/80 overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #1f2736 0%, #101623 50%, #080c14 100%)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.9), inset 0 2px 4px rgba(255,255,255,0.15)',
          }}
        >
          {/* Water droplets and gloss texture on console metal surface */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 40%, rgba(255,255,255,0.2) 1px, transparent 2px), radial-gradient(circle at 75% 60%, rgba(255,255,255,0.2) 1px, transparent 2px)',
              backgroundSize: '40px 40px, 35px 35px',
            }}
          />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Left: Glowing Paytable Console Screen (Embedded in wet console) */}
            <div className="md:col-span-4">
              <PaytableDisplay
                currentBet={currentBet}
                winningHandRank={evaluation?.handRank ?? null}
              />
            </div>

            {/* Right: Tactile Pushbuttons & Quick Status */}
            <div className="md:col-span-8 flex flex-col items-center justify-center space-y-3">
              <PhysicalControls
                onDraw={handleDrawOrDeal}
                onBetOne={handleBetOne}
                onBetMax={handleBetMax}
                canDraw={stage === 'BETTING' || stage === 'DEAL' || stage === 'RESULT'}
                canBet={stage === 'BETTING' || stage === 'RESULT'}
                currentBet={currentBet}
                stage={stage}
              />

              {/* Console Status / Quick Links */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                  1 DOGE = 10 Credits
                </span>
                <span className="hidden sm:inline text-slate-600">|</span>
                <span className="truncate max-w-[200px] sm:max-w-none text-slate-400">
                  Player: <span className="text-amber-300 font-bold">{wallets.player.balanceDoge.toFixed(1)} DOGE</span>
                </span>
                <span className="hidden sm:inline text-slate-600">|</span>
                <span className="truncate max-w-[200px] sm:max-w-none text-slate-400">
                  Game Wallet: <span className="text-cyan-300 font-bold">{wallets.gameOperating.balanceDoge.toFixed(1)} DOGE</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer System Status Bar */}
      <footer className="relative z-20 w-full max-w-6xl px-4 py-2 flex flex-wrap items-center justify-between border-t border-slate-900 bg-black/60 text-[11px] font-mono text-slate-500">
        <div>
          DOGECOIN CORE 1.14.9 · NODE IP: 127.0.0.1:22555 · RPC USER: elshaddai
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsConsoleOpen(true)}
            className="text-cyan-400 hover:text-cyan-300 underline"
          >
            End of Day Settlement &amp; Wallets
          </button>
          <span>·</span>
          <button
            onClick={handleDownloadZip}
            className="text-amber-400 hover:text-amber-300 underline"
          >
            Download Game .ZIP
          </button>
        </div>
      </footer>

      {/* Dogecoin Core 1.14.9 Wallets & Setup Modal */}
      <DogeConsoleModal
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
        wallets={wallets}
        coreStatus={coreStatus}
        ledger={ledger}
        onDeposit={handleDeposit}
        onEndOfDayTransfer={handleEndOfDayTransfer}
        onDownloadZip={handleDownloadZip}
        isProcessing={isProcessing}
      />
    </div>
  );
}
