import type { Editor } from '@tiptap/core';
import styles from './EditorToolbar.module.css';

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const insertParagraph = () => {
    editor.chain().focus().insertContent({ type: 'ditaP' }).run();
  };

  const insertSection = () => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'ditaSection',
        content: [
          { type: 'ditaTitle', content: [{ type: 'text', text: 'New Section' }] },
          { type: 'ditaP' },
        ],
      })
      .run();
  };

  const insertNote = (type: string) => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'ditaNote',
        attrs: { type },
        content: [{ type: 'text', text: 'Note text here.' }],
      })
      .run();
  };

  const insertList = (listType: 'ditaOl' | 'ditaUl') => {
    editor
      .chain()
      .focus()
      .insertContent({
        type: listType,
        content: [
          { type: 'ditaLi', content: [{ type: 'text', text: 'Item' }] },
        ],
      })
      .run();
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.group}>
        <button
          className={`${styles.btn} ${editor.isActive('bold') ? styles.active : ''}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          className={`${styles.btn} ${editor.isActive('italic') ? styles.active : ''}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          className={`${styles.btn} ${editor.isActive('underline') ? styles.active : ''}`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"
        >
          <u>U</u>
        </button>
      </div>

      <div className={styles.separator} />

      <div className={styles.group}>
        <button className={styles.btn} onClick={insertParagraph} title="Insert Paragraph">
          P
        </button>
        <button className={styles.btn} onClick={insertSection} title="Insert Section">
          Section
        </button>
        <button className={styles.btn} onClick={() => insertList('ditaUl')} title="Insert Unordered List">
          UL
        </button>
        <button className={styles.btn} onClick={() => insertList('ditaOl')} title="Insert Ordered List">
          OL
        </button>
      </div>

      <div className={styles.separator} />

      <div className={styles.group}>
        <button className={styles.btn} onClick={() => insertNote('note')} title="Insert Note">
          Note
        </button>
        <button className={styles.btn} onClick={() => insertNote('tip')} title="Insert Tip">
          Tip
        </button>
        <button className={styles.btn} onClick={() => insertNote('warning')} title="Insert Warning">
          Warn
        </button>
      </div>
    </div>
  );
}
