import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { WorkspaceContext } from '../protocol';
import './styles.css';
function App() {
  const [workspace, setWorkspace] = useState<WorkspaceContext | null>(null);
  const [status, setStatus] = useState('브라우저 미리보기');
  useEffect(() => {
    let active = true;
    const orca = window.orca;
    if (!orca) return;
    Promise.all([orca.host.call('workspace.readContext', {}), orca.plugin.request('plugin.info', {})])
      .then(([context, info]) => { if (active) { setWorkspace(context); setStatus(`${info.name} worker 연결됨`); } })
      .catch((error: unknown) => { if (active) setStatus(error instanceof Error ? error.message : '연결 실패'); });
    return () => { active = false; };
  }, []);
  return <main>
    <p className="eyebrow">TIENNE / ORCA PLUGINS</p><h1>Git Tools</h1>
    <p className="intro">커밋의 흐름을 살펴보고, 코드의 변화를 읽는 공간.</p>
    <div className="context"><span>{workspace?.displayName ?? '워크스페이스'}</span><code>{workspace?.branch ?? 'Orca에서 연결'}</code></div>
    <section><h2>Git Graph</h2><p>브랜치와 커밋 이력을 탐색하는 화면을 추가할 예정입니다.</p></section>
    <section><h2>Diff Viewer</h2><p>변경 파일 목록과 좌우 코드 비교 화면을 추가할 예정입니다.</p></section>
    <footer>{status}</footer>
  </main>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
