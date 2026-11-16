import catalog700 from './catalog-700.json';
import waterCatalog from './water-catalog.json';
import catalog600 from './catalog-600.json';

export type WaterSurface = 'sea' | 'river';
export type WaterShape =
  'coral' | 'buoy' | 'sailboat' | 'lotus' | 'raft' | 'waterwheel';
export type WaterTheme = {
  id: string;
  placement: WaterSurface | 'coastal';
  gift: WaterShape;
  special: WaterShape;
};
const marineMotifs = ['fish', 'turtle', 'whale', 'seagrass'];
const additionalWaterThemes: WaterTheme[] = [
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
  ...catalog600
    .filter((entry) => entry.placement !== 'land')
    .map((entry): WaterTheme => ({
      id: entry.id,
      placement: entry.placement as WaterSurface | 'coastal',
      gift: entry.placement === 'river' ? 'lotus' : 'buoy',
      special: entry.placement === 'river' ? 'raft' : 'sailboat',
    })),
  ...catalog700.map((entry): WaterTheme => ({
    id: entry.record.id,
    placement: entry.surface as WaterSurface,
    gift:
      entry.surface === 'river'
        ? 'lotus'
        : marineMotifs.includes(entry.visual.motif)
          ? 'coral'
          : 'buoy',
    special:
      entry.surface === 'river'
        ? ['lock', 'lift', 'wheel'].includes(entry.visual.motif)
          ? 'waterwheel'
          : 'raft'
        : marineMotifs.includes(entry.visual.motif)
          ? 'buoy'
          : 'sailboat',
  })),
];
/** 기존 정원 장식이 있는 최초 수상 테마는 제외해 water- 접두사를 유지한다. */
export const expandedWaterIds: ReadonlySet<string> = new Set(
  additionalWaterThemes.map((theme) => theme.id),
);
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
  ...additionalWaterThemes,
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
