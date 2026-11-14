export interface JiraImage {
  alt: string;
  src: string;
}
export function extractDescription(value: unknown): {
  text: string;
  images: JiraImage[];
} {
  if (typeof value !== 'string') return { text: '', images: [] };
  const images: JiraImage[] = [];
  let bytes = 0;
  const text = value
    .replace(
      /!\[([^\]\r\n]*)\]\(([^)]*)\)/g,
      (_match, alt: string, src: string) => {
        // 패널 응답의 1 MiB 제한을 지키도록 이미지 전송량을 본문과 별도로 제한한다.
        if (
          /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(src) &&
          src.length <= 600000 &&
          bytes + src.length <= 720000 &&
          images.length < 8
        ) {
          const index = images.length;
          bytes += src.length;
          images.push({ alt: alt.slice(0, 200), src });
          return `\n\n[[image:${index}]]\n\n`;
        }
        return `\n\n> 🖼 ${alt.trim().slice(0, 200)}\n\n`;
      },
    )
    .replace(/\r\n?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return { text, images };
}
