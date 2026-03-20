import type { ContentNode, ContentTree, ContentMetadata, WriteResult } from '../types/dita';

export interface CMSClient {
  listChildren(parentUuid: string): Promise<ContentNode[]>;
  getHierarchy(rootUuid: string): Promise<ContentTree>;
  readContent(uuid: string): Promise<string>;
  writeContent(uuid: string, xml: string): Promise<WriteResult>;
  getMetadata(uuid: string): Promise<ContentMetadata>;
}
