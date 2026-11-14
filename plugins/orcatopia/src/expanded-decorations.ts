import waterCatalog from './water-catalog.json';
import expansion from './landmark-expansion.json';
import type { Decoration } from './decorations';

/** 새 랜드마크마다 기존 제작 규칙을 따르는 두 가지 가상 정원 장식을 만든다. */
const waterIds = new Set(waterCatalog.map((entry) => entry.record.id));
export const expandedDecorations: Decoration[] = expansion
  .filter((entry) => !waterIds.has(entry.id))
  .flatMap((entry) => {
    const nature = [
      'peaks',
      'forest',
      'canyon',
      'savanna',
      'glacier',
      'redrocks',
      'badlands',
      'basalt',
      'cave',
      'volcano',
      'crater',
    ];
    const water = [
      'lakes',
      'wetland',
      'mangrove',
      'reef',
      'fjord',
      'coast',
      'waterfall',
      'geyser',
    ];
    const shape: Decoration['shape'] =
      entry.shape === 'forest'
        ? 'tree'
        : ['rocktemple', 'minaret', 'adobe'].includes(entry.shape)
          ? 'palm'
          : 'flowers';
    const special: Decoration['shape'] = nature.includes(entry.shape)
      ? 'bench'
      : water.includes(entry.shape)
        ? 'pond'
        : ['castle', 'fortress', 'gate', 'torii'].includes(entry.shape)
          ? 'gate'
          : 'fountain';
    return [
      {
        id: `${entry.id}-gift`,
        name: `${entry.name} garden planting`,
        landmark: entry.id,
        cost: 3,
        gift: true,
        shape,
        color: entry.color,
        walkable: shape === 'flowers',
      },
      {
        id: `${entry.id}-special`,
        name: `${entry.name} garden retreat`,
        landmark: entry.id,
        cost: 6,
        gift: false,
        shape: special,
        color: entry.color,
        walkable: false,
      },
    ];
  });
