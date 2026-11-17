import { catalog700Scenes } from '../catalog-700-scenes';
import { expandedScenes } from '../expanded-scenes';
import { classicScenes } from './classic';
import { journeyScenes } from './journeys';
import { frontierScenes } from './frontiers';
import { catalog600Scenes } from '../catalog-600-scenes';

export const additionalScenes = [
  ...classicScenes,
  ...journeyScenes,
  ...frontierScenes,
  ...expandedScenes,
  ...catalog600Scenes,
  ...catalog700Scenes,
];
const byId = new Map(additionalScenes.map((scene) => [scene.id, scene]));
export const additionalSceneArt = (id: string) => byId.get(id)?.markup ?? '';
