export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  value: number; // 2 to 14
}

export type HandRank =
  | 'ROYAL_FLUSH'
  | 'STRAIGHT_FLUSH'
  | 'FOUR_OF_A_KIND'
  | 'FULL_HOUSE'
  | 'FLUSH'
  | 'STRAIGHT'
  | 'THREE_OF_A_KIND'
  | 'TWO_PAIR'
  | 'JACKS_OR_BETTER'
  | 'HIGH_CARD';

export interface HandEvaluation {
  handRank: HandRank;
  name: string;
  multiplier: number;
  winCredits: number;
  highlightCardIndices: number[];
}

export type GameStage = 'BETTING' | 'DEAL' | 'EVALUATING' | 'RESULT';

export interface DogeWallets {
  player: {
    address: string;
    balanceDoge: number;
  };
  house: {
    address: string;
    balanceDoge: number;
  };
  gameOperating: {
    address: string;
    balanceDoge: number;
    unsettledLossesDoge: number;
  };
}

export interface DogeCoreStatus {
  connected: boolean;
  version: string;
  protocolVersion: number;
  blocks: number;
  connections: number;
  difficulty: number;
  relayFee: number;
  lastRpcCheck: string;
  error: string | null;
  mode: 'CONNECTED_DAEMON' | 'ACTIVE_BRIDGE';
}

export interface LedgerItem {
  id: string;
  timestamp: string;
  type: 'DEPOSIT' | 'BET' | 'WIN_PAYOUT' | 'LOSS_RETAIN' | 'EOD_SWEEP';
  amountDoge: number;
  credits: number;
  fromAddress: string;
  toAddress: string;
  txid: string;
  confirmations: number;
  note: string;
}
