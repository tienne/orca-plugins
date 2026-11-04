import { t, useLocale, changesLabel, formatNumber } from './i18n';
import { useEffect, useRef, useState } from 'react';
import '@git-tools/codicons.css';
import * as monaco from 'monaco-editor/editor/editor.api.js';
import EditorWorker from 'monaco-editor/editor/editor.worker.js?worker';
import 'monaco-editor/languages/definitions/typescript/register.js';
import type { FileDiff } from '../protocol';
import { syncMonacoTheme } from './theme';
(
  globalThis as typeof globalThis & { MonacoEnvironment: unknown }
).MonacoEnvironment = { getWorker: () => new EditorWorker() };
const kindLabel = {
  text: '텍스트',
  binary: '바이너리 · UTF-8 아님',
  missing: '파일 없음',
  special: '심볼릭 링크 / 서브모듈 / 충돌 · 비교 지원 안 함',
  large: '큰 파일 · 768 KiB 초과',
};
export function DiffView({
  data,
  left,
  right,
}: {
  data: FileDiff;
  left: string;
  right: string;
}) {
  const locale = useLocale();
  const container = useRef<HTMLDivElement>(null);
  const editor = useRef<monaco.editor.IStandaloneDiffEditor | null>(null);
  const [ignore, setIgnore] = useState(false);
  const [fold, setFold] = useState(true);
  const [count, setCount] = useState(0);
  const [error, setError] = useState('');
  const supported = [data.original, data.modified].every(
    (s) => s.kind === 'text' || s.kind === 'missing',
  );
  useEffect(() => {
    setError('');
    setCount(0);
    if (!container.current || !supported) return;
    let instance: monaco.editor.IStandaloneDiffEditor | undefined;
    const models: monaco.editor.ITextModel[] = [];
    let stopTheme: (() => void) | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let layoutFrame = 0;
    try {
      stopTheme = syncMonacoTheme();
      instance = monaco.editor.createDiffEditor(container.current, {
        readOnly: true,
        originalEditable: false,
        domReadOnly: true,
        automaticLayout: false,
        renderSideBySide: true,
        useInlineViewWhenSpaceIsLimited: false,
        renderSideBySideInlineBreakpoint: 0,
        renderOverviewRuler: false,
        enableSplitViewResizing: true,
        renderMarginRevertIcon: false,
        renderGutterMenu: false,
        diffAlgorithm: 'advanced',
        ignoreTrimWhitespace: ignore,
        hideUnchangedRegions: {
          enabled: fold,
          contextLineCount: 3,
          minimumLineCount: 8,
          revealLineCount: 10,
        },
        theme: 'orca-git-tools',
        fontSize: 13,
        fontFamily: 'Menlo, Consolas, monospace',
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'off',
        padding: { top: 14 },
        accessibilityVerbose: false,
        originalAriaLabel: t('이전 버전 · 읽기 전용'),
        modifiedAriaLabel: t('이후 버전 · 읽기 전용'),
      });
      const element = container.current;
      let lastWidth = -1;
      let lastHeight = -1;
      const scheduleLayout = () => {
        cancelAnimationFrame(layoutFrame);
        layoutFrame = requestAnimationFrame(() => {
          const width = element.clientWidth;
          const height = element.clientHeight;
          if (width !== lastWidth || height !== lastHeight) {
            lastWidth = width;
            lastHeight = height;
            instance?.layout({ width, height });
          }
        });
      };
      resizeObserver = new ResizeObserver(scheduleLayout);
      resizeObserver.observe(element);
      scheduleLayout();
      editor.current = instance;
      instance
        .getOriginalEditor()
        .updateOptions({ ariaLabel: t('이전 버전 · 읽기 전용') });
      instance
        .getModifiedEditor()
        .updateOptions({ ariaLabel: t('이후 버전 · 읽기 전용') });
      const lang = /\.[cm]?[jt]sx?$/.test(data.file.path)
        ? 'typescript'
        : 'plaintext';
      models.push(
        monaco.editor.createModel(data.original.text, lang),
        monaco.editor.createModel(data.modified.text, lang),
      );
      instance.setModel({ original: models[0], modified: models[1] });
      instance.onDidUpdateDiff(() =>
        setCount(instance?.getLineChanges()?.length ?? 0),
      );
      return () => {
        stopTheme?.();
        resizeObserver?.disconnect();
        cancelAnimationFrame(layoutFrame);
        editor.current = null;
        instance?.dispose();
        models.forEach((m) => m.dispose());
      };
    } catch (e) {
      stopTheme?.();
      resizeObserver?.disconnect();
      cancelAnimationFrame(layoutFrame);
      instance?.dispose();
      models.forEach((m) => m.dispose());
      setError(e instanceof Error ? e.message : 'Diff 렌더 실패');
    }
    // Options update in place, preserving scroll and active change.
  }, [data, supported]);
  useEffect(() => {
    editor.current?.updateOptions({
      ignoreTrimWhitespace: ignore,
      hideUnchangedRegions: { enabled: fold },
    });
  }, [ignore, fold]);
  useEffect(() => {
    editor.current
      ?.getOriginalEditor()
      .updateOptions({ ariaLabel: t('이전 버전 · 읽기 전용') });
    editor.current
      ?.getModifiedEditor()
      .updateOptions({ ariaLabel: t('이후 버전 · 읽기 전용') });
  }, [locale]);
  return (
    <section className="diff-view" aria-label={t('좌우 코드 비교')}>
      <div className="diff-toolbar">
        <span className="readonly">{t('읽기 전용')}</span>
        <span>{changesLabel(count)}</span>
        <button
          onClick={() => editor.current?.goToDiff('previous')}
          disabled={!count}
          title={t('이전 변경')}
        >
          {t('↑ 이전')}{' '}
        </button>
        <button
          onClick={() => editor.current?.goToDiff('next')}
          disabled={!count}
          title={t('다음 변경')}
        >
          {t('↓ 다음')}{' '}
        </button>
        <label>
          <input
            type="checkbox"
            checked={fold}
            onChange={(e) => setFold(e.target.checked)}
          />
          {t('변경 없는 영역 접기')}{' '}
        </label>
        <label>
          <input
            type="checkbox"
            checked={ignore}
            onChange={(e) => setIgnore(e.target.checked)}
          />
          {t('줄 앞뒤 공백 무시')}{' '}
        </label>
      </div>
      <div className="side-labels">
        <div>
          <b>{t('이전')}</b>
          <span title={t(left)}>{t(left)}</span>
          <small>
            {data.original.kind === 'text' && !data.original.bytes
              ? t('빈 파일 · 0 B')
              : t(kindLabel[data.original.kind])}
          </small>
        </div>
        <div>
          <b>{t('이후')}</b>
          <span title={t(right)}>{t(right)}</span>
          <small>
            {data.modified.kind === 'text' && !data.modified.bytes
              ? t('빈 파일 · 0 B')
              : t(kindLabel[data.modified.kind])}
          </small>
        </div>
      </div>
      {!supported ? (
        <div className="state">
          <h3>
            {data.file.conflict
              ? t('해결되지 않은 충돌')
              : t('텍스트 비교를 표시할 수 없습니다')}
          </h3>
          <p>
            {t('좌:')} {t(kindLabel[data.original.kind])} (
            {formatNumber(data.original.bytes)} B)
          </p>
          <p>
            {t('우:')} {t(kindLabel[data.modified.kind])} (
            {formatNumber(data.modified.bytes)} B)
          </p>
          <p>
            {t(
              '이 파일의 내용을 텍스트로 추정하거나 병합 결과로 표시하지 않습니다.',
            )}{' '}
          </p>
        </div>
      ) : error ? (
        <div className="state error" role="alert">
          {t('Monaco 초기화 실패:')} {t(error)}
        </div>
      ) : (
        <div className="monaco-container" ref={container} />
      )}
    </section>
  );
}
