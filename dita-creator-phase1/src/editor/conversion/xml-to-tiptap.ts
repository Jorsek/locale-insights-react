import type { JSONContent } from '@tiptap/core';
import { getElementAttributes } from './xml-parser';

/** Map from DITA element names to TipTap node/mark names */
const ELEMENT_TO_NODE: Record<string, string> = {
  topic: 'ditaTopic',
  title: 'ditaTitle',
  body: 'ditaBody',
  p: 'ditaP',
  section: 'ditaSection',
  ol: 'ditaOl',
  ul: 'ditaUl',
  li: 'ditaLi',
  note: 'ditaNote',
  image: 'ditaImage',
};

const INLINE_MARKS: Record<string, string> = {
  b: 'bold',
  i: 'italic',
  u: 'underline',
  xref: 'ditaXref',
};

/** Known attributes per element that get their own TipTap attr (not in ditaAttrs bag) */
const KNOWN_ATTRS: Record<string, string[]> = {
  topic: ['id'],
  note: ['type'],
  image: ['href', 'alt'],
  xref: ['href', 'scope', 'format'],
};

function splitAttrs(
  tagName: string,
  allAttrs: Record<string, string>,
): { known: Record<string, string>; extra: Record<string, string> } {
  const knownKeys = KNOWN_ATTRS[tagName] ?? [];
  const known: Record<string, string> = {};
  const extra: Record<string, string> = {};
  for (const [k, v] of Object.entries(allAttrs)) {
    if (knownKeys.includes(k)) {
      known[k] = v;
    } else {
      extra[k] = v;
    }
  }
  return { known, extra };
}

type MarkDef = { type: string; attrs?: Record<string, unknown> };

function convertInlineNode(
  el: Element,
  activeMarks: MarkDef[],
): JSONContent[] {
  const results: JSONContent[] = [];

  for (const child of el.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent ?? '';
      if (text) {
        const node: JSONContent = { type: 'text', text };
        if (activeMarks.length > 0) {
          node.marks = activeMarks.map((m) => ({ ...m }));
        }
        results.push(node);
      }
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const childEl = child as Element;
      const tagName = childEl.localName;

      if (tagName in INLINE_MARKS) {
        const markType = INLINE_MARKS[tagName];
        const allAttrs = getElementAttributes(childEl);
        const { known, extra } = splitAttrs(tagName, allAttrs);
        const mark: MarkDef = { type: markType };
        if (Object.keys(known).length > 0 || Object.keys(extra).length > 0) {
          mark.attrs = { ...known };
          if (Object.keys(extra).length > 0) {
            mark.attrs.ditaAttrs = extra;
          }
        }
        const newMarks = [...activeMarks, mark];
        results.push(...convertInlineNode(childEl, newMarks));
      } else if (tagName === 'ph') {
        // <ph> is a transparent inline container — just pass marks through
        results.push(...convertInlineNode(childEl, activeMarks));
      } else if (tagName === 'image') {
        const allAttrs = getElementAttributes(childEl);
        const { known, extra } = splitAttrs('image', allAttrs);
        results.push({
          type: 'ditaImage',
          attrs: { ...known, ditaAttrs: extra },
        });
      } else {
        // Unknown inline element — treat as text
        results.push(...convertInlineNode(childEl, activeMarks));
      }
    }
  }

  return results;
}

function convertElement(el: Element): JSONContent | null {
  const tagName = el.localName;
  const nodeType = ELEMENT_TO_NODE[tagName];

  if (!nodeType) {
    // Unknown block element — preserve as opaque
    const serializer = new XMLSerializer();
    return {
      type: 'ditaUnknown',
      attrs: {
        tagName,
        xmlContent: serializer.serializeToString(el),
        ditaAttrs: getElementAttributes(el),
      },
    };
  }

  const allAttrs = getElementAttributes(el);
  const { known, extra } = splitAttrs(tagName, allAttrs);
  const attrs: Record<string, unknown> = { ...known, ditaAttrs: extra };

  // Leaf node
  if (nodeType === 'ditaImage') {
    return { type: nodeType, attrs };
  }

  // Determine if this node contains inline or block content
  const isInlineContainer = ['ditaTitle', 'ditaP', 'ditaLi', 'ditaNote'].includes(nodeType);

  if (isInlineContainer) {
    const content = convertInlineNode(el, []);
    return {
      type: nodeType,
      attrs,
      content: content.length > 0 ? content : undefined,
    };
  }

  // Block container
  const content: JSONContent[] = [];
  for (const child of el.childNodes) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const converted = convertElement(child as Element);
      if (converted) content.push(converted);
    }
  }

  return {
    type: nodeType,
    attrs,
    content: content.length > 0 ? content : undefined,
  };
}

/**
 * Convert a parsed DITA XML Document to TipTap JSON content.
 * The document should have a <topic> or <map> root element.
 */
export function xmlToTipTap(xmlDoc: Document): JSONContent {
  const root = xmlDoc.documentElement;

  // Skip DOCTYPE/processing instructions — start from the root element
  const converted = convertElement(root);
  if (!converted) {
    throw new Error(`Could not convert root element: <${root.localName}>`);
  }

  return {
    type: 'doc',
    content: [converted],
  };
}
