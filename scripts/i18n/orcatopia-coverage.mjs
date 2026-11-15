import ts from 'typescript';

const attributes = new Set(['aria-label', 'title', 'placeholder', 'alt']);
const structuralCalls = new Set([
  'querySelector',
  'querySelectorAll',
  'closest',
  'matches',
  'getElementById',
  'getAttribute',
  'removeAttribute',
  'createElement',
  'createElementNS',
  'addEventListener',
  'removeEventListener',
  'setProperty',
  'removeProperty',
]);
const normalize = (text) => text.replace(/\s+/g, ' ').trim();
const decode = (text) =>
  text.replace(
    /&(amp|lt|gt|quot|apos|nbsp|#39|#\d+|#x[\da-f]+);/gi,
    (entity, key) => {
      const named = {
        amp: '&',
        lt: '<',
        gt: '>',
        quot: '"',
        apos: "'",
        nbsp: ' ',
        '#39': "'",
      };
      return (
        named[key] ??
        String.fromCodePoint(
          Number.parseInt(
            key.slice(key[1] === 'x' ? 2 : 1),
            key[1] === 'x' ? 16 : 10,
          ),
        )
      );
    },
  );

// 구조 속성까지 번역 대상으로 잡으면 저장 값과 SVG 경로가 오탐으로 섞인다.
export function markupMessages(markup) {
  const result = [],
    stack = [];
  const tag =
    /<!--[\s\S]*?-->|<![^>]*>|<\/?[a-z][\w:-]*(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi;
  let at = 0;
  for (const match of markup.matchAll(tag)) {
    if (!stack.at(-1)?.blocked)
      result.push({
        text: decode(markup.slice(at, match.index)),
        kind: 'text',
      });
    const name = /^<(\/?)([\w:-]+)/.exec(match[0]);
    if (name?.[1]) {
      const index = stack.findLastIndex(
        (entry) => entry.name === name[2].toLowerCase(),
      );
      if (index >= 0) stack.length = index;
    } else if (name) {
      const attrs = [
        ...match[0].matchAll(
          /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g,
        ),
      ].map((attr) => [attr[1].toLowerCase(), attr[2] ?? attr[3] ?? attr[4]]);
      const blocked =
        stack.at(-1)?.blocked ||
        /^(script|style|code|pre)$/.test(name[2]) ||
        attrs.some(([key, value]) => key === 'translate' && value === 'no');
      if (!blocked)
        for (const [key, value] of attrs) {
          if (attributes.has(key))
            result.push({ text: decode(value), kind: 'attribute' });
        }
      if (
        !/\/\s*>$/.test(match[0]) &&
        !/^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i.test(
          name[2],
        )
      )
        stack.push({ name: name[2].toLowerCase(), blocked });
    }
    at = match.index + match[0].length;
  }
  if (!stack.at(-1)?.blocked)
    result.push({ text: decode(markup.slice(at)), kind: 'text' });
  return result;
}

export function extractMessages(file, source) {
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const result = [];
  const add = (node, text, kind = 'literal') => {
    const { line, character } = tree.getLineAndCharacterOfPosition(
      node.getStart(tree),
    );
    const pieces = /<[a-z!/]/i.test(text)
      ? markupMessages(text)
      : [{ text, kind }];
    for (const piece of pieces) {
      const text = normalize(piece.text);
      if (/[a-z]/i.test(text))
        result.push({
          file,
          line: line + 1,
          column: character + 1,
          kind: piece.kind,
          text,
        });
    }
  };
  const structural = (node) => {
    const p = node.parent;
    if (
      ts.isImportDeclaration(p) ||
      ts.isExportDeclaration(p) ||
      ts.isLiteralTypeNode(p)
    )
      return true;
    if (
      (ts.isPropertyAssignment(p) ||
        ts.isPropertySignature(p) ||
        ts.isMethodDeclaration(p)) &&
      p.name === node
    )
      return true;
    if (ts.isElementAccessExpression(p) && p.argumentExpression === node)
      return true;
    if (ts.isCaseClause(p)) return true;
    if (
      ts.isBinaryExpression(p) &&
      [
        ts.SyntaxKind.EqualsEqualsEqualsToken,
        ts.SyntaxKind.ExclamationEqualsEqualsToken,
        ts.SyntaxKind.EqualsEqualsToken,
        ts.SyntaxKind.ExclamationEqualsToken,
      ].includes(p.operatorToken.kind)
    )
      return true;
    if (
      ts.isBinaryExpression(p) &&
      p.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      /\.(?:className|id|cssText|animation|transform|left|top|width|height|opacity|zIndex|display|visibility)$/.test(
        p.left.getText(tree),
      )
    )
      return true;
    if (
      ts.isPropertyAssignment(p) &&
      /^(?:id|code|shape|landmark|decoration|tier|surface|placement|status|kind|type|color|fill|stroke|fontFamily|fontSize|fontWeight|textAnchor|pointerEvents|cursor|overflow|position|background|border|boxShadow|transform|display|alignItems|justifyContent|behavior|block|inline)$/.test(
        p.name.getText(tree),
      )
    )
      return true;
    if (ts.isCallExpression(p)) {
      const name = ts.isPropertyAccessExpression(p.expression)
        ? p.expression.name.text
        : '';
      if (structuralCalls.has(name)) return true;
      if (name === 'setAttribute')
        return p.arguments[0] === node || !attributes.has(p.arguments[0]?.text);
      if (
        ts.isPropertyAccessExpression(p.expression) &&
        /\.classList$/.test(p.expression.expression.getText(tree))
      )
        return true;
    }
    return false;
  };
  const presentationKind = (node) => {
    let p = node.parent;
    while (
      p &&
      (ts.isConditionalExpression(p) ||
        ts.isBinaryExpression(p) ||
        ts.isParenthesizedExpression(p))
    ) {
      if (
        ts.isBinaryExpression(p) &&
        p.operatorToken.kind !== ts.SyntaxKind.PlusToken &&
        p.operatorToken.kind !== ts.SyntaxKind.EqualsToken
      )
        break;
      if (
        ts.isBinaryExpression(p) &&
        p.operatorToken.kind === ts.SyntaxKind.EqualsToken
      ) {
        if (/\.(textContent|innerText|innerHTML)$/.test(p.left.getText(tree)))
          return 'text';
        break;
      }
      p = p.parent;
    }
    if (p && (ts.isCallExpression(p) || ts.isNewExpression(p))) {
      if (/^(?:new )?Error$/.test(p.expression.getText(tree))) return 'error';
      if (
        /\.setAttribute$/.test(p.expression.getText(tree)) &&
        attributes.has(p.arguments[0]?.text)
      )
        return 'attribute';
    }
    return 'literal';
  };
  const visit = (node) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      if (!structural(node)) add(node, node.text, presentationKind(node));
    } else if (ts.isTemplateExpression(node)) {
      let text = node.head.text;
      node.templateSpans.forEach((span, i) => {
        text += `{${i}}${span.literal.text}`;
      });
      add(node, text, presentationKind(node));
    }
    ts.forEachChild(node, visit);
  };
  visit(tree);
  return result;
}

const escapePattern = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const placeholders = (text) =>
  [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
export function catalogIssues(messages) {
  const errors = [];
  for (const [source, target] of Object.entries(messages)) {
    if (typeof target !== 'string' || !target.trim())
      errors.push(`Empty translation: ${source}`);
    else if (
      JSON.stringify(placeholders(source)) !==
      JSON.stringify(placeholders(target))
    )
      errors.push(`Placeholder mismatch: ${source} => ${target}`);
  }
  return errors;
}

export function coverageIssues(
  candidates,
  {
    messages,
    templates,
    translate,
    exclusions = [],
    identifiers = [],
    fragments = [],
  },
) {
  const errors = [...catalogIssues(messages)];
  const covered = (text, depth = 0) => {
    const sample = text
      .replace(/\{\d+\}/g, '7')
      .trim()
      .replace(/^·\s*/, '');
    if (!/[a-z]/i.test(sample) || /^https?:\/\/\S+$/.test(sample)) return true;
    if (
      exclusions.some(
        (e) =>
          !e.file &&
          e.category === 'brand' &&
          e.text === sample &&
          e.reason?.trim(),
      )
    )
      return true;
    if (
      /^(Exported|Weather updated) \d{4}-\d{2}-\d{2}T\S+$/.test(sample) &&
      translate(sample, 'ko-KR') !== sample
    )
      return true;
    if (Object.hasOwn(messages, sample)) return true;
    if (depth > 8) return false;
    const template = templates.find(
      (entry) =>
        Object.hasOwn(messages, entry.source) && entry.regex.test(sample),
    );
    if (template)
      return template.regex
        .exec(sample)
        .slice(1)
        .every((part) => covered(part, depth + 1));
    if (sample.includes(' · '))
      return sample.split(' · ').every((part) => covered(part, depth + 1));
    if (/^[☀☁☂❄] /.test(sample)) return covered(sample.slice(2), depth + 1);
    return false;
  };
  for (const candidate of candidates) {
    if (
      candidate.kind === 'literal' &&
      (identifiers.includes(candidate.text) ||
        /^(?:#[\da-f]{3,8}|https?:\/\/\S+|[Mm][\d\s.,+{}eEMmLlHhVvCcSsQqTtAaZz-]+)$/.test(
          candidate.text,
        ))
    )
      continue;
    if (
      exclusions.some(
        (e) =>
          (!e.file || e.file === candidate.file) &&
          (!e.kind || e.kind === candidate.kind) &&
          e.text === candidate.text &&
          e.reason?.trim() &&
          e.category,
      )
    )
      continue;
    if (
      fragments.some(
        (e) =>
          e.file === candidate.file &&
          e.text === candidate.text &&
          e.reason?.trim() &&
          e.samples.length > 0 &&
          e.samples.every(
            (sample) =>
              new RegExp(
                '^' +
                  escapePattern(e.prefix ?? '') +
                  e.text
                    .split(/(\{\d+\})/)
                    .map((part) =>
                      /^\{\d+\}$/.test(part) ? '.*?' : escapePattern(part),
                    )
                    .join('') +
                  '$',
                'u',
              ).test(sample) && covered(sample),
          ),
      )
    )
      continue;
    if (!covered(candidate.text))
      errors.push(
        `${candidate.file}:${candidate.line}:${candidate.column} [${candidate.kind}] Missing translation: ${candidate.text}`,
      );
  }
  return [...new Set(errors)];
}
