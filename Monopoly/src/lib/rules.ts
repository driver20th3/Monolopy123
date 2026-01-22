import type { PlayerId, PropertyTile, Tile } from "@/lib/types";
import { propertyGroups } from "@/lib/gameData";

export const MARX_EAT_FIRST_ERROR =
  "Marx: Con người phải ăn trước khi làm khoa học! Hãy sở hữu ít nhất một ô Thực phẩm/Chỗ ở.";

export function isProperty(tile: Tile): tile is PropertyTile {
  return tile.type === "PROPERTY";
}

export function getGroupTier(groupId: number) {
  return propertyGroups.find((g) => g.id === groupId)?.tier;
}

/**
 * The 'Eat First' Rule:
 * Cannot build upgrades on high-tier properties unless owning at least one low-tier property.
 */
export function canBuildUpgrade(params: {
  tile: PropertyTile;
  ownerId: PlayerId;
  ownedTileIndices: number[];
  tiles: Tile[];
}): { ok: true } | { ok: false; reason: string } {
  const tier = getGroupTier(params.tile.groupId);
  if (tier !== "high") return { ok: true };

  const ownsLowTier = params.ownedTileIndices.some((idx) => {
    const t = params.tiles[idx];
    if (!t || t.type !== "PROPERTY") return false;
    const tt = getGroupTier(t.groupId);
    return tt === "low";
  });

  if (!ownsLowTier) return { ok: false, reason: MARX_EAT_FIRST_ERROR };
  return { ok: true };
}

export function computeRent(params: {
  tile: PropertyTile;
  upgrades: number;
  rentMultiplier: number;
}) {
  const base = params.tile.baseRent + params.tile.rentPerUpgrade * params.upgrades;
  return Math.max(0, Math.floor(base * params.rentMultiplier));
}

