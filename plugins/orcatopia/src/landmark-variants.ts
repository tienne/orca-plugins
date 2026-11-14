import landmarks from './landmarks.json';

export const enhancedId = (id: string) => `${id}+`;
export const isEnhanced = (id: string) => id.endsWith('+');
export const baseId = (id: string) => (isEnhanced(id) ? id.slice(0, -1) : id);
export const collectibleLandmarks = landmarks.flatMap((landmark) => [
  landmark,
  { ...landmark, id: enhancedId(landmark.id), name: `${landmark.name} +` },
]);
const byId = new Map(
  collectibleLandmarks.map((landmark) => [landmark.id, landmark]),
);
export const landmarkById = (id: string) => byId.get(id);
