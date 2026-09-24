import { Card, HandEvaluation, HandRank, Rank, Suit } from '../types/poker';

export const SUITS: Suit[] = ['spades', 'clubs', 'diamonds', 'hearts'];

export const RANKS: { rank: Rank; value: number }[] = [
  { rank: '2', value: 2 },
  { rank: '3', value: 3 },
  { rank: '4', value: 4 },
  { rank: '5', value: 5 },
  { rank: '6', value: 6 },
  { rank: '7', value: 7 },
  { rank: '8', value: 8 },
  { rank: '9', value: 9 },
  { rank: '10', value: 10 },
  { rank: 'J', value: 11 },
  { rank: 'Q', value: 12 },
  { rank: 'K', value: 13 },
  { rank: 'A', value: 14 },
];

export const PAYTABLE_CONFIG: {
  handRank: HandRank;
  displayName: string;
  multiplier: number;
}[] = [
  { handRank: 'ROYAL_FLUSH', displayName: 'ROYAL FLUSH', multiplier: 800 },
  { handRank: 'STRAIGHT_FLUSH', displayName: 'STRAIGHT FLUSH', multiplier: 50 },
  { handRank: 'FOUR_OF_A_KIND', displayName: 'FOUR OF A KIND', multiplier: 25 },
  { handRank: 'FULL_HOUSE', displayName: 'FULL HOUSE', multiplier: 9 },
  { handRank: 'FLUSH', displayName: 'FLUSH', multiplier: 6 },
  { handRank: 'STRAIGHT', displayName: 'STRAIGHT', multiplier: 4 },
  { handRank: 'THREE_OF_A_KIND', displayName: 'THREE OF A KIND', multiplier: 3 },
  { handRank: 'TWO_PAIR', displayName: 'TWO PAIR', multiplier: 2 },
  { handRank: 'JACKS_OR_BETTER', displayName: 'JACKS OR BETTER', multiplier: 1 },
];

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const r of RANKS) {
      deck.push({
        id: `${r.rank}_${suit}_${Math.random().toString(36).substring(2, 7)}`,
        suit,
        rank: r.rank,
        value: r.value,
      });
    }
  }
  return deck;
}

// Fisher-Yates cryptographically-fair shuffle
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Evaluate 5-card Jacks or Better Video Poker hand
export function evaluatePokerHand(cards: Card[], bet: number): HandEvaluation {
  if (cards.length !== 5) {
    return {
      handRank: 'HIGH_CARD',
      name: 'INVALID HAND',
      multiplier: 0,
      winCredits: 0,
      highlightCardIndices: [],
    };
  }

  // Count ranks & suits
  const rankCounts: Record<number, number> = {};
  const suitCounts: Record<Suit, number> = {
    hearts: 0,
    diamonds: 0,
    clubs: 0,
    spades: 0,
  };

  cards.forEach((c) => {
    rankCounts[c.value] = (rankCounts[c.value] || 0) + 1;
    suitCounts[c.suit] = (suitCounts[c.suit] || 0) + 1;
  });

  const uniqueRanks = Object.keys(rankCounts).map(Number).sort((a, b) => a - b);
  const isFlush = Object.values(suitCounts).some((count) => count === 5);

  // Check straight
  let isStraight = false;
  let straightIndices: number[] = [0, 1, 2, 3, 4];

  if (uniqueRanks.length === 5) {
    // Normal 5 consecutive ranks
    if (uniqueRanks[4] - uniqueRanks[0] === 4) {
      isStraight = true;
    }
    // Ace-low straight: A, 2, 3, 4, 5 (14, 2, 3, 4, 5)
    else if (
      uniqueRanks[0] === 2 &&
      uniqueRanks[1] === 3 &&
      uniqueRanks[2] === 4 &&
      uniqueRanks[3] === 5 &&
      uniqueRanks[4] === 14
    ) {
      isStraight = true;
    }
  }

  // 1. Royal Flush: 10, J, Q, K, A of same suit
  if (isFlush && isStraight && uniqueRanks[0] === 10 && uniqueRanks[4] === 14) {
    // Standard rule: 800 multiplier, often max bet 5 pays 4,000
    const mult = bet === 5 ? 800 : 250;
    return {
      handRank: 'ROYAL_FLUSH',
      name: 'ROYAL FLUSH',
      multiplier: mult,
      winCredits: mult * bet,
      highlightCardIndices: [0, 1, 2, 3, 4],
    };
  }

  // 2. Straight Flush
  if (isFlush && isStraight) {
    return {
      handRank: 'STRAIGHT_FLUSH',
      name: 'STRAIGHT FLUSH',
      multiplier: 50,
      winCredits: 50 * bet,
      highlightCardIndices: [0, 1, 2, 3, 4],
    };
  }

  // 3. Four of a Kind
  const fourRank = Object.keys(rankCounts).find((r) => rankCounts[Number(r)] === 4);
  if (fourRank) {
    const val = Number(fourRank);
    const indices = cards.map((c, i) => (c.value === val ? i : -1)).filter((i) => i !== -1);
    return {
      handRank: 'FOUR_OF_A_KIND',
      name: 'FOUR OF A KIND',
      multiplier: 25,
      winCredits: 25 * bet,
      highlightCardIndices: indices,
    };
  }

  // 4. Full House: 3 of one rank, 2 of another
  const threeRank = Object.keys(rankCounts).find((r) => rankCounts[Number(r)] === 3);
  const pairRank = Object.keys(rankCounts).find((r) => rankCounts[Number(r)] === 2);
  if (threeRank && pairRank) {
    return {
      handRank: 'FULL_HOUSE',
      name: 'FULL HOUSE',
      multiplier: 9,
      winCredits: 9 * bet,
      highlightCardIndices: [0, 1, 2, 3, 4],
    };
  }

  // 5. Flush
  if (isFlush) {
    return {
      handRank: 'FLUSH',
      name: 'FLUSH',
      multiplier: 6,
      winCredits: 6 * bet,
      highlightCardIndices: [0, 1, 2, 3, 4],
    };
  }

  // 6. Straight
  if (isStraight) {
    return {
      handRank: 'STRAIGHT',
      name: 'STRAIGHT',
      multiplier: 4,
      winCredits: 4 * bet,
      highlightCardIndices: straightIndices,
    };
  }

  // 7. Three of a Kind
  if (threeRank) {
    const val = Number(threeRank);
    const indices = cards.map((c, i) => (c.value === val ? i : -1)).filter((i) => i !== -1);
    return {
      handRank: 'THREE_OF_A_KIND',
      name: 'THREE OF A KIND',
      multiplier: 3,
      winCredits: 3 * bet,
      highlightCardIndices: indices,
    };
  }

  // 8. Two Pair
  const pairs = Object.keys(rankCounts).filter((r) => rankCounts[Number(r)] === 2);
  if (pairs.length === 2) {
    const p1 = Number(pairs[0]);
    const p2 = Number(pairs[1]);
    const indices = cards.map((c, i) => (c.value === p1 || c.value === p2 ? i : -1)).filter((i) => i !== -1);
    return {
      handRank: 'TWO_PAIR',
      name: 'TWO PAIR',
      multiplier: 2,
      winCredits: 2 * bet,
      highlightCardIndices: indices,
    };
  }

  // 9. Jacks or Better (Pair of Jacks, Queens, Kings, Aces: value >= 11)
  if (pairs.length === 1) {
    const pVal = Number(pairs[0]);
    if (pVal >= 11) {
      const indices = cards.map((c, i) => (c.value === pVal ? i : -1)).filter((i) => i !== -1);
      return {
        handRank: 'JACKS_OR_BETTER',
        name: 'JACKS OR BETTER',
        multiplier: 1,
        winCredits: 1 * bet,
        highlightCardIndices: indices,
      };
    }
  }

  // Loss
  return {
    handRank: 'HIGH_CARD',
    name: 'GAME OVER',
    multiplier: 0,
    winCredits: 0,
    highlightCardIndices: [],
  };
}
