# DOGECOIN CYBER VIDEO POKER
### Video Poker (Jacks or Better 5-Card Draw) with Dogecoin Core v1.14.9 Integration

---

## 1. OVERVIEW & NETWORK WALLETS

This application is built for single-player operation with direct Dogecoin Core v1.14.9 JSON-RPC integration and three dedicated wallets:

1. **Player Address:** `DTkzjqfsz5c5svKr3pD8FuTd2VfmedXeJw`
   - Source of player deposits to fund credits (1 DOGE = 10 Credits).
   - Direct destination of all winning payouts from the house.
2. **House Dogecoin Wallet:** `DFtZcDHNZPytu56nK7qffYVJssvCNLiq9P`
   - Main node/treasury vault. Receives all daily swept earnings from the game wallet at the end of the business day.
3. **Game Operating Wallet:** `DByArToqzT2MH8eZDRFSKmshNLzUucFwpr`
   - Holds active gaming credits. Retains player losses during the operating day.

---

## 2. DOGECOIN CORE v1.14.9 CONFIGURATION

Save this configuration into your Dogecoin data directory:
- **Windows:** `%APPDATA%\Dogecoin\dogecoin.conf` (e.g. `C:\Users\<User>\AppData\Roaming\Dogecoin\dogecoin.conf`)
- **Linux:** `~/.dogecoin/dogecoin.conf`
- **macOS:** `~/Library/Application Support/Dogecoin/dogecoin.conf`

```ini
server=1
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
4way=1
```

### Starting the Daemon:
```bash
# Linux / macOS:
dogecoind -daemon

# Windows:
dogecoind.exe
```

### Verify RPC Connection:
```bash
dogecoin-cli -rpcuser=elshaddai -rpcpassword=DAaB6QuYcEmuGmYENZRD4vdM9BFKt1zz8x -rpcport=22555 getinfo
```

---

## 3. RUNNING THE GAME SERVER ON YOUR LOCAL NETWORK

### Requirements:
- Node.js (version 18 or newer)
- npm

### Installation & Launch:
```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

The game server will launch and bind to `http://0.0.0.0:3000`. You can now connect from any computer, tablet, or terminal on your local area network (LAN) by opening:
`http://<YOUR_LAN_IP>:3000`

---

## 4. STANDALONE SINGLE-FILE OPTION (`standalone.html`)
The `.zip` download package also includes `standalone.html`. You can open this file directly in any web browser without running a server. It contains the complete neon cyberpunk console, audio effects, and card engine.

---

## 5. GAME RULES & FLOW

1. **Credits & Bet:** Default 1,450 starting credits. Bet 1 to 5 credits using `[BET ONE]` or `[BET MAX]`.
2. **Deal Hand:** Press `[DRAW]`. 5 holographic neon cards are dealt.
3. **Select Holds:** Click cards to toggle `[ HELD ]` indicator above and below each card.
4. **Draw Replacement Cards:** Press `[DRAW]` to replace unheld cards and evaluate the hand.
5. **Jacks or Better Paytable Multipliers:**
   - **Royal Flush:** 800x (4,000 credits on Bet 5)
   - **Straight Flush:** 50x
   - **Four of a Kind:** 25x
   - **Full House:** 9x
   - **Flush:** 6x
   - **Straight:** 4x
   - **Three of a Kind:** 3x
   - **Two Pair:** 2x
   - **Jacks or Better:** 1x (Pair of Jacks, Queens, Kings, or Aces)
6. **Winning Payout:** The house pays Dogecoin to the player address (`DTkzjqfsz5c5svKr3pD8FuTd2VfmedXeJw`).
7. **Losses:** If the player loses, the Dogecoin remains retained in the Game Operating Wallet (`DByArToqzT2MH8eZDRFSKmshNLzUucFwpr`).
8. **End of Business Day Settlement:** Click the **END BUSINESS DAY** button in the Dogecoin Console modal to sweep all accumulated Game Wallet Dogecoin directly into the Dogecoin Core House Wallet (`DFtZcDHNZPytu56nK7qffYVJssvCNLiq9P`).
