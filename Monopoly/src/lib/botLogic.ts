import type { OwnedProperty, Player, PropertyTile, Tile } from "@/lib/types";
import { canBuildUpgrade, isProperty } from "@/lib/rules";

export type BotDecision =
  | { kind: "payBail" }
  | { kind: "buy"; tileIndex: number }
  | { kind: "build"; tileIndex: number }
  | { kind: "none" };

export function chooseBotDecision(params: {
  bot: Player;
  tile: Tile;
  owned: OwnedProperty[];
  tiles: Tile[];
  buffer: number;
}) : BotDecision {
  const { bot, tile, owned, tiles, buffer } = params;

  // IF in crisis THEN pay bail immediately if cash > 500.
  if (bot.skipTurns > 0 && bot.cash > 500) return { kind: "payBail" };

  // If landed on unowned property AND cash > price + buffer THEN buy.
  if (isProperty(tile)) {
    const already = owned.find((o) => o.tileIndex === tile.index);
    if (!already && bot.cash > tile.price + buffer) return { kind: "buy", tileIndex: tile.index };

    // IF landing on owned property AND can_build AND cash > build_cost THEN build.
    if (already && already.ownerId === bot.id) {
      if (already.upgrades < tile.maxUpgrades && bot.cash > tile.buildCost + buffer) {
        const ownedIndices = owned.filter((o) => o.ownerId === bot.id).map((o) => o.tileIndex);
        const allowed = canBuildUpgrade({
          tile: tile as PropertyTile,
          ownerId: bot.id,
          ownedTileIndices: ownedIndices,
          tiles,
        });
        if (allowed.ok) return { kind: "build", tileIndex: tile.index };
      }
    }
  }

  return { kind: "none" };
}

