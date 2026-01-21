"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import {
  CRISIS_BAIL,
  GO_SALARY,
  MAX_TURNS,
  STARTING_CASH,
  infrastructureDeck,
  superstructureDeck,
  tiles,
} from "@/lib/gameData";
import type {
  Card,
  CardEffect,
  DeckType,
  LogEntry,
  OwnedProperty,
  Player,
  PlayerId,
  Tile,
} from "@/lib/types";
import { chooseBotDecision } from "@/lib/botLogic";
import { canBuildUpgrade, computeRent, isProperty } from "@/lib/rules";

type ActiveModal =
  | { kind: "tileFlashcard"; tileIndex: number }
  | { kind: "none" };

type GameState = {
  turn: number; // 1..MAX_TURNS for the human cycle
  currentPlayerIndex: number; // 0..3
  players: Player[];
  owned: OwnedProperty[];
  logs: LogEntry[];
  dice: { a: number; b: number; total: number } | null;
  rentMultiplier: { value: number; remainingTurns: number };
  activeModal: ActiveModal;
  message: string | null; // transient error/info (e.g. Marx rule)
  deckPointers: { infrastructure: number; superstructure: number };
  awaitingDecision: null | { kind: "buyProperty"; tileIndex: number };
  hasActedThisTurn: boolean; // for human: once Buy/Build => cannot roll again; must end turn
};

const TURN_ORDER: PlayerId[] = ["HUMAN", "BOT_1", "BOT_2", "BOT_3"];

function makePlayers(): Player[] {
  return [
    {
      id: "HUMAN",
      name: "Công nhân (Bạn)",
      isHuman: true,
      token: { name: "CN", icon: "Hammer", colorClass: "text-red-600" },
      position: 0,
      cash: STARTING_CASH,
      skipTurns: 0,
    },
    {
      id: "BOT_1",
      name: "Bot Tư bản",
      isHuman: false,
      token: { name: "TB", icon: "Crown", colorClass: "text-gray-800" },
      position: 0,
      cash: STARTING_CASH,
      skipTurns: 0,
    },
    {
      id: "BOT_2",
      name: "Bot Triết gia",
      isHuman: false,
      token: { name: "TG", icon: "Book", colorClass: "text-blue-800" },
      position: 0,
      cash: STARTING_CASH,
      skipTurns: 0,
    },
    {
      id: "BOT_3",
      name: "Bot Địa chủ",
      isHuman: false,
      token: { name: "ĐC", icon: "Key", colorClass: "text-green-800" },
      position: 0,
      cash: STARTING_CASH,
      skipTurns: 0,
    },
  ];
}

const initialState: GameState = {
  turn: 1,
  currentPlayerIndex: 0,
  players: makePlayers(),
  owned: [],
  logs: [],
  dice: null,
  rentMultiplier: { value: 1, remainingTurns: 0 },
  activeModal: { kind: "none" },
  message: null,
  deckPointers: { infrastructure: 0, superstructure: 0 },
  awaitingDecision: null,
  hasActedThisTurn: false,
};

type Action =
  | { type: "ROLL_DICE" }
  | { type: "CLOSE_MODAL" }
  | { type: "CLEAR_MESSAGE" }
  | { type: "BUY_CONFIRMED" }
  | { type: "BUILD_UPGRADE"; tileIndex: number }
  | { type: "END_TURN" }
  | { type: "PAY_BAIL" }
  | { type: "BOT_TAKE_TURN" }
  | { type: "RESET" };

function rollDie() {
  return 1 + Math.floor(Math.random() * 6);
}

function nextIndex(pos: number, steps: number) {
  const n = tiles.length;
  const next = (pos + steps) % n;
  const passedGo = pos + steps >= n;
  return { next, passedGo };
}

function findOwned(state: GameState, tileIndex: number) {
  return state.owned.find((o) => o.tileIndex === tileIndex) ?? null;
}

function ownedBy(state: GameState, playerId: PlayerId) {
  return state.owned.filter((o) => o.ownerId === playerId).map((o) => o.tileIndex);
}

function addLog(state: GameState, text: string): GameState {
  const entry: LogEntry = { id: crypto.randomUUID(), turn: state.turn, text };
  return { ...state, logs: [entry, ...state.logs].slice(0, 100) };
}

function drawCard(state: GameState, deck: DeckType): { nextState: GameState; card: Card } {
  const list = deck === "infrastructure" ? infrastructureDeck : superstructureDeck;
  const pointer = state.deckPointers[deck];
  const card = list[pointer % list.length];
  const nextPointers = { ...state.deckPointers, [deck]: (pointer + 1) % list.length };
  return { nextState: { ...state, deckPointers: nextPointers }, card };
}

function applyCardToCurrentPlayer(state: GameState, card: Card): GameState {
  const current = state.players[state.currentPlayerIndex];
  let next = addLog(state, `${current.name} rút: ${card.title} — ${card.body}`);

  // NOTE: Some TS configs fail to narrow discriminated unions from inferred data.
  // Using explicit Extract<> keeps this type-safe and build-friendly.
  const effect: CardEffect = card.effect;
  if (effect.kind === "cash") {
    const { amount } = effect;
    next = updatePlayer(next, current.id, (p) => ({ ...p, cash: p.cash + amount }));
    next = addLog(next, `${current.name} ${amount >= 0 ? "nhận" : "mất"} ${Math.abs(amount)} MV.`);
    return next;
  }

  if (effect.kind === "rentMultiplier") {
    const { multiplier, turns } = effect;
    next = { ...next, rentMultiplier: { value: multiplier, remainingTurns: turns } };
    next = addLog(next, `Tiền thuê đổi thành x${multiplier} trong ${turns} lượt.`);
    return next;
  }

  // skipTurns
  const skip = effect as Extract<CardEffect, { kind: "skipTurns" }>;
  next = updatePlayer(next, current.id, (p) => ({ ...p, skipTurns: p.skipTurns + skip.turns }));
  next = addLog(next, `${current.name} sẽ bỏ ${skip.turns} lượt.`);
  return next;
}

function updatePlayer(state: GameState, playerId: PlayerId, fn: (p: Player) => Player): GameState {
  return {
    ...state,
    players: state.players.map((p) => (p.id === playerId ? fn(p) : p)),
  };
}

function transferCash(state: GameState, from: PlayerId, to: PlayerId, amount: number): GameState {
  let next = updatePlayer(state, from, (p) => ({ ...p, cash: p.cash - amount }));
  next = updatePlayer(next, to, (p) => ({ ...p, cash: p.cash + amount }));
  return next;
}

function handleLanding(state: GameState, tile: Tile): GameState {
  const current = state.players[state.currentPlayerIndex];

  // Human flashcard after landing
  let next = state;
  if (current.isHuman) {
    next = { ...next, activeModal: { kind: "tileFlashcard", tileIndex: tile.index } };
  }

  if (tile.type === "GO") return addLog(next, `${current.name} dừng ở GO.`);

  if (tile.type === "GO_TO_CRISIS") {
    next = addLog(next, `${current.name} bị đưa tới ô Khủng hoảng kinh tế.`);
    next = updatePlayer(next, current.id, (p) => ({ ...p, position: 10, skipTurns: Math.max(p.skipTurns, 1) }));
    return next;
  }

  if (tile.type === "ECONOMIC_CRISIS") {
    next = addLog(next, `${current.name} đang ở ô Khủng hoảng kinh tế.`);
    // The skipping is enforced on turn start; landing here doesn't force it immediately.
    return next;
  }

  if (tile.type === "SOCIAL_WELFARE") {
    return addLog(next, `${current.name} nghỉ tại Phúc lợi xã hội.`);
  }

  if (tile.type === "INFRASTRUCTURE_CARD") {
    const drawn = drawCard(next, "infrastructure");
    return applyCardToCurrentPlayer(drawn.nextState, drawn.card);
  }

  if (tile.type === "SUPERSTRUCTURE_CARD") {
    const drawn = drawCard(next, "superstructure");
    return applyCardToCurrentPlayer(drawn.nextState, drawn.card);
  }

  // PROPERTY (or fallback)
  if (!isProperty(tile)) {
    return addLog(next, `${current.name} dừng tại ${tile.name}.`);
  }

  const owned = findOwned(next, tile.index);
  if (!owned) {
    // Only human gets explicit decision; bots will be handled by botLogic step later.
    if (current.isHuman) {
      next = addLog(next, `${current.name} dừng ở ô chưa sở hữu ${tile.name}.`);
      return { ...next, awaitingDecision: { kind: "buyProperty", tileIndex: tile.index } };
    }
    return addLog(next, `${current.name} dừng ở ô chưa sở hữu ${tile.name}.`);
  }

  if (owned.ownerId === current.id) {
    return addLog(next, `${current.name} dừng trên ô của chính mình: ${tile.name}.`);
  }

  const rent = computeRent({
    tile,
    upgrades: owned.upgrades,
    rentMultiplier: next.rentMultiplier.value,
  });
  next = addLog(next, `${current.name} trả ${rent} MV tiền thuê cho ${owned.ownerId} tại ${tile.name}.`);
  next = transferCash(next, current.id, owned.ownerId, rent);
  return next;
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "RESET":
      return initialState;
    case "CLOSE_MODAL":
      return { ...state, activeModal: { kind: "none" } };
    case "CLEAR_MESSAGE":
      return { ...state, message: null };
    case "ROLL_DICE": {
      const current = state.players[state.currentPlayerIndex];
      if (!current.isHuman) return state; // bots handled elsewhere
      if (state.awaitingDecision) return { ...state, message: "Hãy giải quyết lựa chọn hiện tại trước." };
      if (state.hasActedThisTurn) return { ...state, message: "Bạn đã hành động trong lượt này. Hãy kết thúc lượt." };

      // If skipping (crisis/bureaucracy), block roll.
      if (current.skipTurns > 0) {
        return { ...state, message: "Bạn phải trả bảo lãnh hoặc kết thúc lượt (bỏ lượt)." };
      }

      const a = rollDie();
      const b = rollDie();
      const total = a + b;
      const moved = nextIndex(current.position, total);
      let next = addLog(state, `${current.name} gieo được ${a} + ${b} = ${total}.`);

      next = updatePlayer(next, current.id, (p) => ({ ...p, position: moved.next }));
      if (moved.passedGo) {
        next = updatePlayer(next, current.id, (p) => ({ ...p, cash: p.cash + GO_SALARY }));
        next = addLog(next, `${current.name} qua GO và nhận ${GO_SALARY} MV.`);
      }

      next = { ...next, dice: { a, b, total } };
      const tile = tiles[moved.next];
      return handleLanding(next, tile);
    }
    case "BOT_TAKE_TURN": {
      const current = state.players[state.currentPlayerIndex];
      if (current.isHuman) return state;

      // If bot is skipping, just end turn (skip decrement handled in END_TURN).
      if (current.skipTurns > 0) return state;

      const a = rollDie();
      const b = rollDie();
      const total = a + b;
      const moved = nextIndex(current.position, total);
      let next = addLog(state, `${current.name} gieo được ${a} + ${b} = ${total}.`);

      next = updatePlayer(next, current.id, (p) => ({ ...p, position: moved.next }));
      if (moved.passedGo) {
        next = updatePlayer(next, current.id, (p) => ({ ...p, cash: p.cash + GO_SALARY }));
        next = addLog(next, `${current.name} qua GO và nhận ${GO_SALARY} MV.`);
      }

      next = { ...next, dice: { a, b, total } };
      const tile = tiles[moved.next];
      next = handleLanding(next, tile);

      // Decide immediate bot actions (buy/build/bail) after landing.
      const refreshedBot = next.players[next.currentPlayerIndex];
      const decision = chooseBotDecision({
        bot: refreshedBot,
        tile,
        owned: next.owned,
        tiles,
        buffer: 150,
      });

      if (decision.kind === "payBail") {
        if (refreshedBot.cash >= CRISIS_BAIL) {
          next = updatePlayer(next, refreshedBot.id, (p) => ({ ...p, cash: p.cash - CRISIS_BAIL, skipTurns: 0 }));
          next = addLog(next, `${refreshedBot.name} trả ${CRISIS_BAIL} MV bảo lãnh.`);
        }
      }

      if (decision.kind === "buy") {
        const t = tiles[decision.tileIndex];
        if (isProperty(t) && !findOwned(next, t.index) && refreshedBot.cash >= t.price) {
          next = updatePlayer(next, refreshedBot.id, (p) => ({ ...p, cash: p.cash - t.price }));
          next = { ...next, owned: [...next.owned, { tileIndex: t.index, ownerId: refreshedBot.id, upgrades: 0 }] };
          next = addLog(next, `${refreshedBot.name} mua ${t.name} giá ${t.price} MV.`);
        }
      }

      if (decision.kind === "build") {
        const t = tiles[decision.tileIndex];
        if (isProperty(t)) {
          const o = findOwned(next, t.index);
          const botNow = next.players[next.currentPlayerIndex];
          if (o && o.ownerId === botNow.id && o.upgrades < t.maxUpgrades && botNow.cash >= t.buildCost) {
            const ownedIndices = ownedBy(next, botNow.id);
            const allowed = canBuildUpgrade({ tile: t, ownerId: botNow.id, ownedTileIndices: ownedIndices, tiles });
            if (allowed.ok) {
              next = updatePlayer(next, botNow.id, (p) => ({ ...p, cash: p.cash - t.buildCost }));
              next = {
                ...next,
                owned: next.owned.map((op) =>
                  op.tileIndex === t.index ? { ...op, upgrades: op.upgrades + 1 } : op
                ),
              };
              next = addLog(next, `${botNow.name} xây Nâng cấp trên ${t.name}.`);
            }
          }
        }
      }

      return next;
    }
    case "BUY_CONFIRMED": {
      if (!state.awaitingDecision || state.awaitingDecision.kind !== "buyProperty") return state;
      const tile = tiles[state.awaitingDecision.tileIndex];
      const current = state.players[state.currentPlayerIndex];
      if (!current.isHuman) return state;
      if (!isProperty(tile)) return { ...state, awaitingDecision: null };
      if (findOwned(state, tile.index)) return { ...state, awaitingDecision: null };
      if (current.cash < tile.price) return { ...state, message: "Không đủ MV để mua ô này." };

      let next = updatePlayer(state, current.id, (p) => ({ ...p, cash: p.cash - tile.price }));
      next = {
        ...next,
        owned: [...next.owned, { tileIndex: tile.index, ownerId: current.id, upgrades: 0 }],
        awaitingDecision: null,
        hasActedThisTurn: true,
      };
      next = addLog(next, `${current.name} mua ${tile.name} với giá ${tile.price} MV.`);
      return next;
    }
    case "BUILD_UPGRADE": {
      const current = state.players[state.currentPlayerIndex];
      if (!current.isHuman) return state;
      const tile = tiles[action.tileIndex];
      if (!isProperty(tile)) return state;
      const owned = findOwned(state, tile.index);
      if (!owned || owned.ownerId !== current.id) return { ...state, message: "Bạn không sở hữu ô này." };
      if (owned.upgrades >= tile.maxUpgrades) return { ...state, message: "Đã đạt cấp nâng tối đa." };

      const ownedIndices = ownedBy(state, current.id);
      const allowed = canBuildUpgrade({ tile, ownerId: current.id, ownedTileIndices: ownedIndices, tiles });
      if (!allowed.ok) return { ...state, message: allowed.reason };
      if (current.cash < tile.buildCost) return { ...state, message: "Không đủ MV để xây dựng." };

      let next = updatePlayer(state, current.id, (p) => ({ ...p, cash: p.cash - tile.buildCost }));
      next = {
        ...next,
        owned: next.owned.map((o) =>
          o.tileIndex === tile.index ? { ...o, upgrades: o.upgrades + 1 } : o
        ),
        hasActedThisTurn: true,
      };
      next = addLog(next, `${current.name} xây Nâng cấp trên ${tile.name} với ${tile.buildCost} MV.`);
      return next;
    }
    case "PAY_BAIL": {
      const current = state.players[state.currentPlayerIndex];
      if (!current.isHuman) return state;
      if (current.cash < CRISIS_BAIL) return { ...state, message: "Không đủ MV để trả bảo lãnh." };
      let next = updatePlayer(state, current.id, (p) => ({ ...p, cash: p.cash - CRISIS_BAIL, skipTurns: 0 }));
      next = addLog(next, `${current.name} trả ${CRISIS_BAIL} MV bảo lãnh và được đi tiếp.`);
      return next;
    }
    case "END_TURN": {
      // Decrement global rent modifier (simple: per END_TURN call)
      let next = state;
      if (next.rentMultiplier.remainingTurns > 0) {
        const remaining = next.rentMultiplier.remainingTurns - 1;
        next = {
          ...next,
          rentMultiplier: { value: remaining > 0 ? next.rentMultiplier.value : 1, remainingTurns: remaining },
        };
      }

      // Handle skip-turn consumption for current player
      const current = next.players[next.currentPlayerIndex];
      if (current.skipTurns > 0) {
        next = updatePlayer(next, current.id, (p) => ({ ...p, skipTurns: Math.max(0, p.skipTurns - 1) }));
        next = addLog(next, `${current.name} bỏ 1 lượt.`);
      }

      const nextIndex = (next.currentPlayerIndex + 1) % TURN_ORDER.length;
      const wraps = nextIndex === 0;
      next = {
        ...next,
        currentPlayerIndex: nextIndex,
        dice: null,
        message: null,
        awaitingDecision: null,
        hasActedThisTurn: false,
      };
      if (wraps) next = { ...next, turn: Math.min(MAX_TURNS, next.turn + 1) };
      return next;
    }
    default:
      return state;
  }
}

type GameApi = {
  state: GameState;
  tiles: Tile[];
  rollDice: () => void;
  endTurn: () => void;
  buy: () => void;
  build: (tileIndex: number) => void;
  payBail: () => void;
  closeModal: () => void;
  clearMessage: () => void;
  reset: () => void;
};

const Ctx = createContext<GameApi | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Auto-play bots once per turn/currentPlayerIndex.
  const botTurnKeyRef = React.useRef<string | null>(null);
  useEffect(() => {
    const current = state.players[state.currentPlayerIndex];
    if (current.isHuman) return;
    if (state.turn > MAX_TURNS) return;

    const key = `${state.turn}-${state.currentPlayerIndex}`;
    if (botTurnKeyRef.current === key) return;
    botTurnKeyRef.current = key;

    const t = window.setTimeout(() => {
      dispatch({ type: "BOT_TAKE_TURN" });
      dispatch({ type: "END_TURN" });
    }, 650);

    return () => window.clearTimeout(t);
  }, [state.currentPlayerIndex, state.turn, state.players]);

  const api = useMemo<GameApi>(
    () => ({
      state,
      tiles,
      rollDice: () => dispatch({ type: "ROLL_DICE" }),
      endTurn: () => dispatch({ type: "END_TURN" }),
      buy: () => dispatch({ type: "BUY_CONFIRMED" }),
      build: (tileIndex) => dispatch({ type: "BUILD_UPGRADE", tileIndex }),
      payBail: () => dispatch({ type: "PAY_BAIL" }),
      closeModal: () => dispatch({ type: "CLOSE_MODAL" }),
      clearMessage: () => dispatch({ type: "CLEAR_MESSAGE" }),
      reset: () => dispatch({ type: "RESET" }),
    }),
    [state]
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useGame() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}

