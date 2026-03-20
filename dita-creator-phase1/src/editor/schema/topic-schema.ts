import { Node, Mark } from '@tiptap/core';

/**
 * TipTap node extension for the DITA <topic> root element.
 */
export const DitaTopic = Node.create({
  name: 'ditaTopic',
  group: 'block',
  content: 'ditaTitle ditaBody',
  defining: true,

  addAttributes() {
    return {
      id: { default: null },
      ditaAttrs: { default: {} },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-dita-type="topic"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-dita-type': 'topic' }, 0];
  },
});

/**
 * TipTap node extension for the DITA <title> element.
 */
export const DitaTitle = Node.create({
  name: 'ditaTitle',
  group: 'block',
  content: 'inline*',
  defining: true,

  addAttributes() {
    return {
      ditaAttrs: { default: {} },
    };
  },

  parseHTML() {
    return [{ tag: 'h2[data-dita-type="title"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['h2', { ...HTMLAttributes, 'data-dita-type': 'title' }, 0];
  },
});

/**
 * TipTap node extension for the DITA <body> element.
 */
export const DitaBody = Node.create({
  name: 'ditaBody',
  group: 'block',
  content: '(ditaP | ditaSection | ditaOl | ditaUl | ditaNote)*',
  defining: true,

  addAttributes() {
    return {
      ditaAttrs: { default: {} },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-dita-type="body"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-dita-type': 'body' }, 0];
  },
});

/**
 * TipTap node extension for the DITA <p> element.
 */
export const DitaP = Node.create({
  name: 'ditaP',
  group: 'block',
  content: 'inline*',

  addAttributes() {
    return {
      ditaAttrs: { default: {} },
    };
  },

  parseHTML() {
    return [{ tag: 'p[data-dita-type="p"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['p', { ...HTMLAttributes, 'data-dita-type': 'p' }, 0];
  },
});

/**
 * TipTap node extension for the DITA <section> element.
 */
export const DitaSection = Node.create({
  name: 'ditaSection',
  group: 'block',
  content: 'ditaTitle? (ditaP | ditaOl | ditaUl | ditaNote)*',
  defining: true,

  addAttributes() {
    return {
      ditaAttrs: { default: {} },
    };
  },

  parseHTML() {
    return [{ tag: 'section[data-dita-type="section"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['section', { ...HTMLAttributes, 'data-dita-type': 'section' }, 0];
  },
});

/**
 * TipTap node extension for the DITA <ol> element.
 */
export const DitaOl = Node.create({
  name: 'ditaOl',
  group: 'block',
  content: 'ditaLi+',

  addAttributes() {
    return {
      ditaAttrs: { default: {} },
    };
  },

  parseHTML() {
    return [{ tag: 'ol[data-dita-type="ol"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['ol', { ...HTMLAttributes, 'data-dita-type': 'ol' }, 0];
  },
});

/**
 * TipTap node extension for the DITA <ul> element.
 */
export const DitaUl = Node.create({
  name: 'ditaUl',
  group: 'block',
  content: 'ditaLi+',

  addAttributes() {
    return {
      ditaAttrs: { default: {} },
    };
  },

  parseHTML() {
    return [{ tag: 'ul[data-dita-type="ul"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['ul', { ...HTMLAttributes, 'data-dita-type': 'ul' }, 0];
  },
});

/**
 * TipTap node extension for the DITA <li> element.
 */
export const DitaLi = Node.create({
  name: 'ditaLi',
  group: 'block',
  content: 'inline*',

  addAttributes() {
    return {
      ditaAttrs: { default: {} },
    };
  },

  parseHTML() {
    return [{ tag: 'li[data-dita-type="li"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['li', { ...HTMLAttributes, 'data-dita-type': 'li' }, 0];
  },
});

/**
 * TipTap node extension for the DITA <note> element.
 */
export const DitaNote = Node.create({
  name: 'ditaNote',
  group: 'block',
  content: 'inline*',

  addAttributes() {
    return {
      type: { default: 'note' },
      ditaAttrs: { default: {} },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-dita-type="note"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      {
        ...HTMLAttributes,
        'data-dita-type': 'note',
        'data-note-type': node.attrs.type,
        class: `dita-note dita-note--${node.attrs.type}`,
      },
      0,
    ];
  },
});

/**
 * TipTap node extension for the DITA <image> element (leaf node).
 */
export const DitaImage = Node.create({
  name: 'ditaImage',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      href: { default: null },
      alt: { default: null },
      ditaAttrs: { default: {} },
    };
  },

  parseHTML() {
    return [{ tag: 'img[data-dita-type="image"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', {
      ...HTMLAttributes,
      'data-dita-type': 'image',
      src: HTMLAttributes.href,
    }];
  },
});

/**
 * TipTap mark for DITA <xref> inline element.
 */
export const DitaXref = Mark.create({
  name: 'ditaXref',

  addAttributes() {
    return {
      href: { default: null },
      scope: { default: null },
      format: { default: null },
      ditaAttrs: { default: {} },
    };
  },

  parseHTML() {
    return [{ tag: 'a[data-dita-type="xref"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['a', { ...HTMLAttributes, 'data-dita-type': 'xref' }, 0];
  },
});

/**
 * TipTap node for unknown/opaque DITA elements (preserved for round-trip).
 */
export const DitaUnknown = Node.create({
  name: 'ditaUnknown',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      tagName: { default: 'unknown' },
      xmlContent: { default: '' },
      ditaAttrs: { default: {} },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-dita-type="unknown"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      {
        ...HTMLAttributes,
        'data-dita-type': 'unknown',
        class: 'dita-unknown',
        title: `Unknown DITA element: <${node.attrs.tagName}>`,
      },
      `<${node.attrs.tagName}>`,
    ];
  },
});

/** All topic schema extensions bundled together */
export const topicSchemaExtensions = [
  DitaTopic,
  DitaTitle,
  DitaBody,
  DitaP,
  DitaSection,
  DitaOl,
  DitaUl,
  DitaLi,
  DitaNote,
  DitaImage,
  DitaXref,
  DitaUnknown,
];
