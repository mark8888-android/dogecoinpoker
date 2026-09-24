import React, { useState } from 'react';
import { DogeCoreStatus, DogeWallets, LedgerItem } from '../types/poker';
import { soundFx } from '../utils/audio';

interface DogeConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallets: DogeWallets;
  coreStatus: DogeCoreStatus;
  ledger: LedgerItem[];
  onDeposit: (amountDoge: number) => Promise<void>;
  onEndOfDayTransfer: () => Promise<void>;
  onDownloadZip: () => void;
  isProcessing: boolean;
}

export const DogeConsoleModal: React.FC<DogeConsoleModalProps> = ({
  isOpen,
  onClose,
  wallets,
  coreStatus,
  ledger,
  onDeposit,
  onEndOfDayTransfer,
  onDownloadZip,
  isProcessing,
}) => {
  const [depositAmount, setDepositAmount] = useState<number>(50);
  const [activeTab, setActiveTab] = useState<'WALLETS' | 'LEDGER' | 'SETUP_GUIDE'>('WALLETS');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(`Copied ${label}!`);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0) return;
    soundFx.playButtonClick();
    await onDeposit(depositAmount);
  };

  const handleSweepClick = async () => {
    soundFx.playSettlementSwoosh();
    await onEndOfDayTransfer();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      {/* Outer Cyberpunk Panel */}
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-xl overflow-hidden border border-cyan-500/50"
        style={{
          background: 'linear-gradient(180deg, #0b1329 0%, #060a17 100%)',
          boxShadow: '0 0 35px rgba(0, 240, 255, 0.25), inset 0 0 20px rgba(0, 240, 255, 0.1)',
        }}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-cyan-500/30 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
            <div>
              <h2 className="font-mono font-bold text-sm sm:text-base text-cyan-300 tracking-wider flex items-center gap-2">
                DOGECOIN CORE v1.14.9 GATEWAY
              </h2>
              <p className="text-[11px] font-mono text-slate-400">
                RPC: 127.0.0.1:22555 · User: elshaddai · Single-Player Protocol
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDownloadZip}
              className="px-3 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 font-mono text-xs font-bold transition-colors flex items-center gap-1.5"
              title="Download standalone files and instructions"
            >
              <span>DOWNLOAD .ZIP</span>
            </button>
            <button
              onClick={onClose}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition-colors"
            >
              ESC ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('WALLETS')}
            className={`py-2.5 px-4 font-mono text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'WALLETS'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            WALLETS &amp; BALANCES
          </button>
          <button
            onClick={() => setActiveTab('LEDGER')}
            className={`py-2.5 px-4 font-mono text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'LEDGER'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            TRANSACTION LEDGER ({ledger.length})
          </button>
          <button
            onClick={() => setActiveTab('SETUP_GUIDE')}
            className={`py-2.5 px-4 font-mono text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'SETUP_GUIDE'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            CORE 1.14.9 SETUP GUIDE
          </button>
        </div>

        {/* Copy toast */}
        {copyFeedback && (
          <div className="bg-cyan-500/20 border-b border-cyan-500/40 text-cyan-200 text-xs font-mono text-center py-1">
            {copyFeedback}
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-xs sm:text-sm">
          {activeTab === 'WALLETS' && (
            <div className="space-y-6">
              {/* Core Status Banner */}
              <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-700 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Daemon Status:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      coreStatus.connected
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {coreStatus.connected
                      ? 'CONNECTED (LIVE 1.14.9 DAEMON)'
                      : 'STANDALONE BRIDGE (Ready for LAN Node)'}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Blocks: <span className="text-cyan-300 font-bold tabular-nums">{coreStatus.blocks.toLocaleString()}</span> · Peers: <span className="text-cyan-300 font-bold">{coreStatus.connections}</span> · Protocol: {coreStatus.protocolVersion}
                </div>
              </div>

              {/* 3 Wallets Display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Player Wallet */}
                <div className="p-3.5 rounded-lg bg-slate-900/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-bold">1. PLAYER WALLET</span>
                    <span className="text-slate-400 text-[10px]">Active Session</span>
                  </div>
                  <div className="font-mono text-[11px] bg-slate-950 p-2 rounded break-all border border-slate-800/80 text-cyan-200 flex justify-between items-center group">
                    <span className="truncate mr-1">{wallets.player.address}</span>
                    <button
                      onClick={() => handleCopy(wallets.player.address, 'Player Address')}
                      className="text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 text-[10px] shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-slate-400 text-xs">Player Balance:</span>
                    <span className="font-mono text-base font-bold text-amber-300 tabular-nums">
                      {wallets.player.balanceDoge.toLocaleString(undefined, { minimumFractionDigits: 1 })} DOGE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Funds player credits and receives direct Dogecoin payouts on winning hands.
                  </p>
                </div>

                {/* 2. Game Operating Wallet */}
                <div className="p-3.5 rounded-lg bg-slate-900/70 border border-cyan-500/40 space-y-2 relative">
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                    OPERATIONAL
                  </div>
                  <div className="text-xs font-mono text-cyan-400 font-bold">
                    2. GAME OPERATING WALLET
                  </div>
                  <div className="font-mono text-[11px] bg-slate-950 p-2 rounded break-all border border-slate-800/80 text-cyan-200 flex justify-between items-center">
                    <span className="truncate mr-1">{wallets.gameOperating.address}</span>
                    <button
                      onClick={() => handleCopy(wallets.gameOperating.address, 'Game Wallet')}
                      className="text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 text-[10px] shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-slate-400 text-xs">Operating DOGE:</span>
                    <span className="font-mono text-base font-bold text-cyan-300 tabular-nums">
                      {wallets.gameOperating.balanceDoge.toLocaleString(undefined, { minimumFractionDigits: 1 })} DOGE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Holds game deposits. Retains player losses during the day until End of Business Day sweep.
                  </p>
                </div>

                {/* 3. House Wallet */}
                <div className="p-3.5 rounded-lg bg-slate-900/70 border border-purple-500/40 space-y-2">
                  <div className="text-xs font-mono text-purple-400 font-bold">
                    3. HOUSE TREASURY WALLET
                  </div>
                  <div className="font-mono text-[11px] bg-slate-950 p-2 rounded break-all border border-slate-800/80 text-cyan-200 flex justify-between items-center">
                    <span className="truncate mr-1">{wallets.house.address}</span>
                    <button
                      onClick={() => handleCopy(wallets.house.address, 'House Wallet')}
                      className="text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 text-[10px] shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-slate-400 text-xs">House Vault:</span>
                    <span className="font-mono text-base font-bold text-purple-300 tabular-nums">
                      {wallets.house.balanceDoge.toLocaleString(undefined, { minimumFractionDigits: 1 })} DOGE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Core 1.14.9 primary house vault. Receives all daily swept earnings.
                  </p>
                </div>
              </div>

              {/* Action Controls: Deposit & End of Day Sweep */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Deposit form */}
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                  <div className="font-mono text-xs font-bold text-amber-300">
                    PLAYER DEPOSIT (PAY THE HOUSE TO PLAY)
                  </div>
                  <p className="text-xs text-slate-400">
                    Transfers Dogecoin from Player Address into Game Operating Wallet. Credits are converted at 1 DOGE = 10 Credits.
                  </p>
                  <form onSubmit={handleDepositSubmit} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded font-mono text-sm text-white focus:outline-none focus:border-amber-400"
                        placeholder="Amount DOGE"
                      />
                      <span className="absolute right-3 top-2 font-mono text-xs text-slate-400">
                        DOGE
                      </span>
                    </div>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? 'CONFIRMING...' : `PAY ${depositAmount * 10} CREDITS`}
                    </button>
                  </form>
                </div>

                {/* End of Business Day Sweep */}
                <div className="p-4 rounded-lg bg-slate-950 border border-purple-500/40 space-y-3">
                  <div className="font-mono text-xs font-bold text-purple-300 flex items-center justify-between">
                    <span>END OF BUSINESS DAY SETTLEMENT</span>
                    <span className="text-[10px] text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                      CORE 1.14.9 SWEEP
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Transfers all accumulated lost Dogecoin from Game Operating Wallet ({wallets.gameOperating.balanceDoge.toFixed(1)} DOGE) directly into the Dogecoin Core House Wallet.
                  </p>
                  <button
                    onClick={handleSweepClick}
                    disabled={isProcessing || wallets.gameOperating.balanceDoge <= 0}
                    className="w-full py-2.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-40"
                  >
                    {isProcessing
                      ? 'SWEEPING VIA RPC...'
                      : `SWEEP ${wallets.gameOperating.balanceDoge.toFixed(1)} DOGE TO HOUSE CORE`}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'LEDGER' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                <span>Dogecoin Core 1.14.9 On-Chain / Session Audit Log</span>
                <span>{ledger.length} Recorded Events</span>
              </div>
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {ledger.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-bold text-[11px] px-1.5 py-0.5 rounded ${
                          item.type === 'WIN_PAYOUT'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : item.type === 'EOD_SWEEP'
                            ? 'bg-purple-500/20 text-purple-400'
                            : item.type === 'DEPOSIT'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {item.type}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-slate-300">{item.note}</div>
                    <div className="text-[10px] text-slate-500 truncate flex items-center justify-between">
                      <span className="truncate">TXID: {item.txid}</span>
                      <span className="text-cyan-400 ml-2 shrink-0">
                        {item.confirmations} conf
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'SETUP_GUIDE' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
                <h3 className="font-bold text-cyan-300 text-sm">
                  1. Dogecoin Core v1.14.9 Configuration File
                </h3>
                <p className="text-slate-400">
                  Save this in your Dogecoin data directory as <code className="text-amber-300">dogecoin.conf</code>:
                </p>
                <pre className="p-2.5 bg-black/60 rounded text-cyan-200 text-[11px] overflow-x-auto border border-slate-800">
{`server=1
rpcallowip=127.0.0.1
rpcallowip=192.168.*.*
mainnet=1
rpcuser=elshaddai
rpcpassword=DAaB6QuYcEmuGmYENZRD4vdM9BFKt1zz8x
port=22556
rpcport=22555
listen=1
txindex=1
gen=1
genproclimit=6
4way=1`}
                </pre>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
                <h3 className="font-bold text-cyan-300 text-sm">
                  2. Network Testing with Dogecoin-CLI
                </h3>
                <p className="text-slate-400">
                  Verify your daemon responds to RPC queries:
                </p>
                <pre className="p-2.5 bg-black/60 rounded text-emerald-300 text-[11px] overflow-x-auto border border-slate-800">
dogecoin-cli -rpcuser=elshaddai -rpcpassword=DAaB6QuYcEmuGmYENZRD4vdM9BFKt1zz8x -rpcport=22555 getinfo
                </pre>
              </div>

              <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-2">
                <h3 className="font-bold text-cyan-300 text-sm">
                  3. Download Complete LAN Package (.ZIP)
                </h3>
                <p className="text-slate-400">
                  Click the button below to download the entire tested game bundle containing <code className="text-amber-300">standalone.html</code>, Node server, <code className="text-amber-300">dogecoin.conf</code>, and <code className="text-amber-300">run.sh</code> / <code className="text-amber-300">run.bat</code>:
                </p>
                <button
                  onClick={onDownloadZip}
                  className="px-4 py-2.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors inline-flex items-center gap-2"
                >
                  <span>DOWNLOAD DOGECOIN POKER .ZIP (Full Network Package)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-2.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Active Dogecoin Core: v1.14.9 · RPC Port 22555</span>
          <button
            onClick={onClose}
            className="text-cyan-400 hover:text-cyan-300 underline"
          >
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
};
