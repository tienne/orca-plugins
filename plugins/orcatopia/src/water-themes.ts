import waterCatalog from './water-catalog.json';

export type WaterSurface = 'sea' | 'river';
export type WaterShape =
  'coral' | 'buoy' | 'sailboat' | 'lotus' | 'raft' | 'waterwheel';
export type WaterTheme = {
  id: string;
  placement: WaterSurface | 'coastal';
  gift: WaterShape;
  special: WaterShape;
};
export const waterThemes: WaterTheme[] = [
  { id: 'halong', placement: 'sea', gift: 'buoy', special: 'sailboat' },
  { id: 'papahanaumokuakea', placement: 'sea', gift: 'coral', special: 'buoy' },
  ...['montsaintmichel', 'venice', 'nanmadol', 'liberty', 'opera', 'belem'].map(
    (id): WaterTheme => ({
      id,
      placement: 'coastal',
      gift: 'buoy',
      special: 'sailboat',
    }),
  ),
  ...['mostar', 'pontdugard', 'kinderdijk', 'grandcanal', 'dujiangyan'].map(
    (id): WaterTheme => ({
      id,
      placement: 'river',
      gift: 'lotus',
      special: ['kinderdijk', 'dujiangyan'].includes(id)
        ? 'waterwheel'
        : 'raft',
    }),
  ),
  ...waterCatalog.map((entry): WaterTheme => ({
    id: entry.record.id,
    placement: entry.surface as WaterSurface,
    gift:
      entry.surface === 'river'
        ? 'lotus'
        : entry.record.id === 'bluehole' || entry.record.id === 'geirangerfjord'
          ? 'buoy'
          : 'coral',
    special:
      entry.surface === 'river'
        ? entry.record.id === 'middlerhine'
          ? 'waterwheel'
          : 'raft'
        : entry.record.id === 'greatbarrierreef'
          ? 'buoy'
          : 'sailboat',
  })),
];
const byId = new Map(waterThemes.map((t) => [t.id, t]));
/** 전용 장식과 랜드마크가 공유하는 물 영역 분류. */
export const waterTheme = (id: string) =>
  byId.get(id.endsWith('+') ? id.slice(0, -1) : id);
export const waterShapeNames: Record<WaterShape, [string, string]> = {
  coral: ['coral garden', '산호 정원'],
  buoy: ['navigation buoy', '항로 부표'],
  sailboat: ['sailboat', '범선'],
  lotus: ['floating lotus bed', '수상 연꽃밭'],
  raft: ['river raft', '강 뗏목'],
  waterwheel: ['waterwheel', '물레방아'],
};
