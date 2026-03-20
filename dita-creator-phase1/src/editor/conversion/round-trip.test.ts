import { describe, it, expect } from 'vitest';
import { parseDitaXml } from './xml-parser';
import { xmlToTipTap } from './xml-to-tiptap';
import { tipTapToXml } from './tiptap-to-xml';

function normalizeXml(xml: string): string {
  return xml
    .replace(/\r\n/g, '\n')
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

function roundTrip(xml: string): string {
  const doc = parseDitaXml(xml);
  const tiptap = xmlToTipTap(doc);
  return tipTapToXml(tiptap);
}

describe('XML ↔ TipTap round-trip', () => {
  it('round-trips a minimal topic', () => {
    const input = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">
<topic id="minimal">
  <title>Minimal Topic</title>
  <body>
    <p>Hello world.</p>
  </body>
</topic>`;

    const output = roundTrip(input);
    expect(normalizeXml(output)).toBe(normalizeXml(input));
  });

  it('round-trips a topic with sections and lists', () => {
    const input = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">
<topic id="complex">
  <title>Complex Topic</title>
  <body>
    <p>Intro paragraph.</p>
    <section>
      <title>Section One</title>
      <p>Section content.</p>
      <ul>
        <li>Item A</li>
        <li>Item B</li>
      </ul>
    </section>
    <ol>
      <li>Step 1</li>
      <li>Step 2</li>
    </ol>
  </body>
</topic>`;

    const output = roundTrip(input);
    expect(normalizeXml(output)).toBe(normalizeXml(input));
  });

  it('round-trips inline formatting (bold, italic, underline)', () => {
    const input = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">
<topic id="inline">
  <title>Inline Formatting</title>
  <body>
    <p>This is <b>bold</b> and <i>italic</i> and <u>underlined</u> text.</p>
  </body>
</topic>`;

    const output = roundTrip(input);
    expect(normalizeXml(output)).toBe(normalizeXml(input));
  });

  it('round-trips a note element with type attribute', () => {
    const input = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">
<topic id="notes">
  <title>Notes</title>
  <body>
    <note type="tip">This is a tip.</note>
    <note type="warning">This is a warning.</note>
  </body>
</topic>`;

    const output = roundTrip(input);
    expect(normalizeXml(output)).toBe(normalizeXml(input));
  });

  it('round-trips an xref element', () => {
    const input = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">
<topic id="xrefs">
  <title>Cross References</title>
  <body>
    <p>See <xref href="other.dita" scope="local">the other topic</xref> for details.</p>
  </body>
</topic>`;

    const output = roundTrip(input);
    expect(normalizeXml(output)).toBe(normalizeXml(input));
  });

  it('preserves unknown attributes in the ditaAttrs bag', () => {
    const input = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">
<topic id="custom" outputclass="special">
  <title>Custom Attrs</title>
  <body>
    <p>Content here.</p>
  </body>
</topic>`;

    const output = roundTrip(input);
    expect(normalizeXml(output)).toBe(normalizeXml(input));
  });
});

describe('XML parsing', () => {
  it('throws DitaParseError on malformed XML', () => {
    expect(() => parseDitaXml('<topic><unclosed>')).toThrow();
  });

  it('parses well-formed XML without error', () => {
    const doc = parseDitaXml('<topic id="test"><title>Test</title><body><p>OK</p></body></topic>');
    expect(doc.documentElement.localName).toBe('topic');
  });
});

describe('xmlToTipTap', () => {
  it('converts a topic to TipTap doc format', () => {
    const doc = parseDitaXml('<topic id="t1"><title>Hello</title><body><p>World</p></body></topic>');
    const result = xmlToTipTap(doc);

    expect(result.type).toBe('doc');
    expect(result.content).toHaveLength(1);
    expect(result.content![0].type).toBe('ditaTopic');
    expect(result.content![0].attrs?.id).toBe('t1');
  });
});

describe('tipTapToXml', () => {
  it('produces valid XML with declaration and DOCTYPE', () => {
    const tiptap = {
      type: 'doc',
      content: [
        {
          type: 'ditaTopic',
          attrs: { id: 't1', ditaAttrs: {} },
          content: [
            { type: 'ditaTitle', attrs: { ditaAttrs: {} }, content: [{ type: 'text', text: 'Title' }] },
            {
              type: 'ditaBody',
              attrs: { ditaAttrs: {} },
              content: [
                { type: 'ditaP', attrs: { ditaAttrs: {} }, content: [{ type: 'text', text: 'Body' }] },
              ],
            },
          ],
        },
      ],
    };

    const xml = tipTapToXml(tiptap);
    expect(xml).toContain('<?xml version="1.0"');
    expect(xml).toContain('<!DOCTYPE topic');
    expect(xml).toContain('<topic id="t1">');
    expect(xml).toContain('<title>Title</title>');
    expect(xml).toContain('<p>Body</p>');
  });
});
