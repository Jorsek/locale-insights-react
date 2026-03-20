import type { CMSClient } from './types';
import type { ContentNode, ContentTree, ContentMetadata, WriteResult } from '../types/dita';

const SAMPLE_TOPIC_XML = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">
<topic id="sample-topic">
  <title>Sample Topic</title>
  <body>
    <p>This is a sample paragraph.</p>
    <section>
      <title>Section Title</title>
      <p>Section content goes here.</p>
    </section>
    <ul>
      <li>First item</li>
      <li>Second item</li>
    </ul>
    <note type="tip">This is a helpful tip.</note>
  </body>
</topic>`;

const SAMPLE_MAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE map PUBLIC "-//OASIS//DTD DITA Map//EN" "map.dtd">
<map>
  <title>Sample Map</title>
  <topicref href="topic-1.dita" navtitle="Introduction">
    <topicref href="topic-1a.dita" navtitle="Getting Started" />
  </topicref>
  <topicref href="topic-2.dita" navtitle="Advanced Topics" />
</map>`;

const MOCK_HIERARCHY: ContentNode = {
  uuid: 'root-001',
  title: 'Sample Map',
  type: 'map',
  children: [
    {
      uuid: 'topic-001',
      title: 'Introduction',
      type: 'topic',
      children: [
        { uuid: 'topic-001a', title: 'Getting Started', type: 'topic' },
      ],
    },
    { uuid: 'topic-002', title: 'Advanced Topics', type: 'topic' },
  ],
};

const MOCK_CONTENT: Record<string, string> = {
  'root-001': SAMPLE_MAP_XML,
  'topic-001': SAMPLE_TOPIC_XML,
  'topic-001a': SAMPLE_TOPIC_XML,
  'topic-002': SAMPLE_TOPIC_XML,
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock CMS client for development. Replace with real API calls when backend is available.
 */
export class MockCMSClient implements CMSClient {
  private content: Record<string, string> = { ...MOCK_CONTENT };

  async listChildren(parentUuid: string): Promise<ContentNode[]> {
    await delay(100);
    const find = (node: ContentNode): ContentNode[] => {
      if (node.uuid === parentUuid) return node.children ?? [];
      for (const child of node.children ?? []) {
        const result = find(child);
        if (result.length) return result;
      }
      return [];
    };
    return find(MOCK_HIERARCHY);
  }

  async getHierarchy(rootUuid: string): Promise<ContentTree> {
    await delay(150);
    if (rootUuid === MOCK_HIERARCHY.uuid) {
      return { root: MOCK_HIERARCHY };
    }
    throw new Error(`Unknown root: ${rootUuid}`);
  }

  async readContent(uuid: string): Promise<string> {
    await delay(100);
    const xml = this.content[uuid];
    if (!xml) throw new Error(`Content not found: ${uuid}`);
    return xml;
  }

  async writeContent(uuid: string, xml: string): Promise<WriteResult> {
    await delay(200);
    this.content[uuid] = xml;
    return {
      success: true,
      uuid,
      timestamp: new Date().toISOString(),
    };
  }

  async getMetadata(uuid: string): Promise<ContentMetadata> {
    await delay(100);
    const find = (node: ContentNode): ContentNode | null => {
      if (node.uuid === uuid) return node;
      for (const child of node.children ?? []) {
        const result = find(child);
        if (result) return result;
      }
      return null;
    };
    const node = find(MOCK_HIERARCHY);
    if (!node) throw new Error(`Node not found: ${uuid}`);
    return {
      uuid: node.uuid,
      title: node.title,
      type: node.type,
      lastModified: new Date().toISOString(),
    };
  }
}
