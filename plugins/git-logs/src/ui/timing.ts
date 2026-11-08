// 방향키로 커밋을 빠르게 넘길 때 중간 커밋마다 worker 요청이 나가지 않게 기다리는 시간.
// worker 요청은 취소할 수 없어서 요청을 보내기 전에 거른다.
export const COMMIT_SETTLE_MS = 80;
