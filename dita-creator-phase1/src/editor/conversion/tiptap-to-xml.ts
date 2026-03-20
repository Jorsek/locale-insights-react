import type { JSONContent } from '@tiptap/core';

/** Map from TipTap node types back to DITA element names */
const NODE_TO_ELEMENT: Record<string, string> = {
  ditaTopic: 'topic',
  ditaTitle: 'title',
  ditaBody: 'body',
  ditaP: 'p',
  ditaSection: 'section',
  ditaOl: 'ol',
  ditaUl: 'ul',
  ditaLi: 'li',
  ditaNote: 'note',
  ditaImage: 'image',
};

/** Map from TipTap mark types back to DITA element names */
const MARK_TO_ELEMENT: Record<string, string> = {
  bold: 'b',
  italic: 'i',
  underline: 'u',
  ditaXref: 'xref',
};

/** Known attributes that are stored directly (not in ditaAttrs) */
const KNOWN_ATTRS: Record<string, string[]> = {
  topic: ['id'],
  note: ['type'],
  image: ['href', 'alt'],
  xref: ['href', 'scope', 'format'],
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildAttrString(
  ditaTag: string,
  attrs: Record<string, unknown> | undefined,
): string {
  if (!attrs) return '';

  const parts: string[] = [];
  const knownKeys = KNOWN_ATTRS[ditaTag] ?? [];

  // Add known attributes
  for (const key of knownKeys) {
    if (attrs[key] != null && attrs[key] !== '') {
      parts.push(`${key}="${escapeXml(String(attrs[key]))}"`);
    }
  }

  // Add extra attributes from ditaAttrs bag
  const extra = (attrs.ditaAttrs ?? {}) as Record<string, string>;
  for (const [k, v] of Object.entries(extra)) {
    parts.push(`${k}="${escapeXml(v)}"`);
  }

  return parts.length > 0 ? ' ' + parts.join(' ') : '';
}

function serializeMarks(
  text: string,
  marks: JSONContent['marks'],
): string {
  if (!marks || marks.length === 0) return escapeXml(text);

  let result = escapeXml(text);

  // Wrap in mark elements from innermost to outermost
  for (let i = marks.length - 1; i >= 0; i--) {
    const mark = marks[i];
    const ditaTag = MARK_TO_ELEMENT[mark.type];
    if (ditaTag) {
      const attrStr = buildAttrString(ditaTag, mark.attrs);
      result = `<${ditaTag}${attrStr}>${result}</${ditaTag}>`;
    }
  }

  return result;
}

function serializeNode(node: JSONContent, indent: number): string {
  const pad = '  '.repeat(indent);

  if (node.type === 'text') {
    return serializeMarks(node.text ?? '', node.marks);
  }

  if (node.type === 'ditaUnknown') {
    // Opaque unknown elements are stored as raw XML
    return pad + (node.attrs?.xmlContent ?? '');
  }

  const ditaTag = NODE_TO_ELEMENT[node.type ?? ''];
  if (!ditaTag) {
    // Unknown node type — skip
    return '';
  }

  const attrStr = buildAttrString(ditaTag, node.attrs);

  // Leaf node (e.g., image)
  if (node.type === 'ditaImage') {
    return `${pad}<${ditaTag}${attrStr} />`;
  }

  // Inline container (title, p, li, note) — no extra newlines
  const isInlineContainer = ['ditaTitle', 'ditaP', 'ditaLi', 'ditaNote'].includes(node.type ?? '');

  if (isInlineContainer) {
    const innerContent = (node.content ?? [])
      .map((child) => serializeNode(child, 0))
      .join('');
    return `${pad}<${ditaTag}${attrStr}>${innerContent}</${ditaTag}>`;
  }

  // Block container
  if (!node.content || node.content.length === 0) {
    return `${pad}<${ditaTag}${attrStr} />`;
  }

  const children = node.content
    .map((child) => serializeNode(child, indent + 1))
    .filter(Boolean)
    .join('\n');

  return `${pad}<${ditaTag}${attrStr}>\n${children}\n${pad}</${ditaTag}>`;
}

/**
 * Convert TipTap JSON content back to a DITA XML string.
 */
export function tipTapToXml(doc: JSONContent): string {
  if (doc.type !== 'doc' || !doc.content) {
    throw new Error('Expected a TipTap doc node with content');
  }

  const rootNode = doc.content[0];
  if (!rootNode) {
    throw new Error('Empty document');
  }

  const ditaTag = NODE_TO_ELEMENT[rootNode.type ?? ''];

  // Determine DOCTYPE
  let doctype = '';
  if (ditaTag === 'topic') {
    doctype = '<!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">';
  } else if (ditaTag === 'map') {
    doctype = '<!DOCTYPE map PUBLIC "-//OASIS//DTD DITA Map//EN" "map.dtd">';
  }

  const xmlBody = serializeNode(rootNode, 0);
  const parts = ['<?xml version="1.0" encoding="UTF-8"?>'];
  if (doctype) parts.push(doctype);
  parts.push(xmlBody);

  return parts.join('\n');
}
