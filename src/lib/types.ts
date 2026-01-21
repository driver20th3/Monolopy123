export type Tier = "low" | "mid" | "high";

export type PlayerId = "HUMAN" | "BOT_1" | "BOT_2" | "BOT_3";

export type PropertyGroup = {
  id: number;
  name: string;
  colorClass: string; // Tailwind class name (e.g. "bg-amber-700")
  tier: Tier;
};

export type TileType =
  | "GO"
  | "PROPERTY"
  | "INFRASTRUCTURE_CARD"
  | "SUPERSTRUCTURE_CARD"
  | "ECONOMIC_CRISIS"
  | "SOCIAL_WELFARE"
  | "GO_TO_CRISIS";

export type TileBase = {
  index: number;
  type: TileType;
  name: string;
  description?: string;
};

export type PropertyTile = TileBase & {
  type: "PROPERTY";
  groupId: number;
  price: number;
  buildCost: number;
  baseRent: number;
  rentPerUpgrade: number;
  maxUpgrades: number;
};

export type SpecialTile = TileBase & {
  type: Exclude<TileType, "PROPERTY">;
};

export type Tile = PropertyTile | SpecialTile;

export type OwnedProperty = {
  tileIndex: number;
  ownerId: PlayerId;
  upgrades: number; // 0..maxUpgrades
};

export type PlayerToken = {
  name: string;
  icon: "Hammer" | "Crown" | "Book" | "Key";
  colorClass: string; // Tailwind text class
};

export type Player = {
  id: PlayerId;
  name: string;
  isHuman: boolean;
  token: PlayerToken;
  position: number;
  cash: number;
  skipTurns: number; // for crisis / bureaucracy etc.
};

export type DeckType = "infrastructure" | "superstructure";

export type CardEffect =
  | { kind: "cash"; amount: number }
  | { kind: "rentMultiplier"; multiplier: number; turns: number }
  | { kind: "skipTurns"; turns: number };

export type Card = {
  id: string;
  deck: DeckType;
  title: string;
  body: string;
  effect: CardEffect;
};

export type LogEntry = {
  id: string;
  turn: number;
  text: string;
};

