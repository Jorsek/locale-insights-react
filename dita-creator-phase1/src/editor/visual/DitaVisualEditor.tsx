import { useEditor, EditorContent } from '@tiptap/react';
import { Document } from '@tiptap/extension-document';
import { Text } from '@tiptap/extension-text';
import { Bold } from '@tiptap/extension-bold';
import { Italic } from '@tiptap/extension-italic';
import { Underline } from '@tiptap/extension-underline';
import type { JSONContent, Editor } from '@tiptap/core';
import { topicSchemaExtensions } from '../schema/topic-schema';
import { EditorToolbar } from './EditorToolbar';
import { AttributePanel } from './AttributePanel';
import styles from './DitaVisualEditor.module.css';

/**
 * Custom document node that accepts our ditaTopic as top-level content.
 */
const DitaDocument = Document.extend({
  content: 'ditaTopic',
});

interface DitaVisualEditorProps {
  content: JSONContent;
  onUpdate?: (content: JSONContent) => void;
}

export function DitaVisualEditor({ content, onUpdate }: DitaVisualEditorProps) {
  const editor = useEditor({
    extensions: [
      DitaDocument,
      Text,
      Bold,
      Italic,
      Underline,
      ...topicSchemaExtensions,
    ],
    content,
    onUpdate: ({ editor: e }) => {
      onUpdate?.(e.getJSON());
    },
  });

  if (!editor) return null;

  return (
    <div className={styles.container}>
      <EditorToolbar editor={editor} />
      <div className={styles.editorArea}>
        <div className={styles.editorContent}>
          <EditorContent editor={editor} />
        </div>
        <AttributePanel editor={editor} />
      </div>
    </div>
  );
}

export function useVisualEditorRef() {
  return { editorRef: null as Editor | null };
}
