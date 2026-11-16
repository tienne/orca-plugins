import expansion from './landmark-expansion.json';
import { expandedWaterIds } from './water-themes';
import type { Decoration } from './decorations';

export const expandedDecorations: Decoration[] = expansion
  .filter((entry) => !expandedWaterIds.has(entry.id))
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
