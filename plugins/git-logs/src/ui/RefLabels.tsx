import { useLayoutEffect, useRef, useState } from 'react';

const TAG_PREFIX = 'tag: ';
const REF_GAP = 4;

export function RefLabels({ refs }: { refs: string[] }) {
  const branches = refs.filter((ref) => !ref.startsWith(TAG_PREFIX));
  const tags = refs
    .filter((ref) => ref.startsWith(TAG_PREFIX))
    .map((ref) => ref.slice(TAG_PREFIX.length));
  return (
    <span className="refs">
      {branches.map((ref) => (
        <em key={ref} title={ref}>
          {ref}
        </em>
      ))}
      {tags.length > 0 && <TagBadges tags={tags} />}
    </span>
  );
}

// 넘치는 뱃지는 숨기되 레이아웃에는 남겨 둔다. display:none으로 빼면 폭 측정이
// 다음 계산에서 0이 되어 접힘 개수가 흔들린다.
function TagBadges({ tags }: { tags: string[] }) {
  const box = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(tags.length);
  const tagKey = tags.join('\n');
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const widths = Array.from(
        el.querySelectorAll<HTMLElement>('.tag-badge'),
        (badge) => badge.offsetWidth,
      );
      const total =
        widths.reduce((sum, w) => sum + w, 0) +
        REF_GAP * Math.max(0, widths.length - 1);
      if (total <= el.clientWidth) return setVisible(widths.length);
      const moreWidth =
        el.querySelector<HTMLElement>('.tag-more')!.offsetWidth + REF_GAP;
      let count = 0;
      let used = 0;
      while (count < widths.length) {
        const next = used + (count > 0 ? REF_GAP : 0) + widths[count];
        if (next + moreWidth > el.clientWidth) break;
        used = next;
        count++;
      }
      setVisible(count);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
  }, [tagKey]);
  return (
    <span className="tag-badges" ref={box}>
      {tags.map((tag, index) => (
        <span
          key={tag}
          className="tag-badge"
          title={`${TAG_PREFIX}${tag}`}
          data-folded={index >= visible ? '' : undefined}
        >
          {tag}
        </span>
      ))}
      <span
        className="tag-more"
        data-idle={visible >= tags.length ? '' : undefined}
        title={tags.slice(visible).join(', ')}
      >
        +{tags.length - visible}
      </span>
    </span>
  );
}
