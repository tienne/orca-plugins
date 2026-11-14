import { waterTheme } from './water-themes';
import { baseId } from './landmark-variants';
import { tiles } from './world';

export type PlacementType = 'land' | 'sea' | 'river' | 'coastal';
/** 랜드마크의 권장 지형. 기존 육지 배치는 모든 타입에서 유지한다. */
export function placementType(id: string): PlacementType {
  return waterTheme(baseId(id))?.placement ?? 'land';
}
/** 보관함과 상세 화면에서 사용하는 배치 타입 이름. */
export const placementLabel = (id: string) =>
  ({
    land: 'Land',
    sea: 'Sea · Land compatible',
    coastal: 'Land & sea',
    river: 'River · Land compatible',
  })[placementType(id)];
/** 저장 가능한 세계 좌표인지 확인한다. */
export const isWorldCell = (cell: number) =>
  Number.isInteger(cell) && Boolean(tiles[cell]);
/** + 버전을 포함한 해상 배치 가능 여부. */
export const allowsSea = (id: string) =>
  ['sea', 'coastal'].includes(placementType(id));

/** 강 타일에 배치할 수 있는 랜드마크인지 확인한다. */
export const allowsRiver = (id: string) => placementType(id) === 'river';
