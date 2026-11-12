import { expandedScenes } from '../expanded-scenes';
import { classicScenes } from './classic';
import { journeyScenes } from './journeys';
import { frontierScenes } from './frontiers';

export const additionalScenes = [
  ...classicScenes,
  ...journeyScenes,
  ...frontierScenes,
  ...expandedScenes,
];
const byId = new Map(additionalScenes.map((scene) => [scene.id, scene]));
export const additionalSceneArt = (id: string) => byId.get(id)?.markup ?? '';
