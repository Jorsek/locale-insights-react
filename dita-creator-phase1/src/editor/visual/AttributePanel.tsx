import { useState, useEffect, useCallback } from 'react';
import type { Editor } from '@tiptap/core';
import styles from './AttributePanel.module.css';

interface AttributePanelProps {
  editor: Editor;
}

interface NodeInfo {
  type: string;
  attrs: Record<string, unknown>;
}

export function AttributePanel({ editor }: AttributePanelProps) {
  const [selectedNode, setSelectedNode] = useState<NodeInfo | null>(null);

  const updateSelection = useCallback(() => {
    const { selection } = editor.state;
    const node = selection.$from.node(selection.$from.depth);
    if (node) {
      setSelectedNode({
        type: node.type.name,
        attrs: { ...node.attrs },
      });
    } else {
      setSelectedNode(null);
    }
  }, [editor]);

  useEffect(() => {
    editor.on('selectionUpdate', updateSelection);
    editor.on('transaction', updateSelection);
    return () => {
      editor.off('selectionUpdate', updateSelection);
      editor.off('transaction', updateSelection);
    };
  }, [editor, updateSelection]);

  if (!selectedNode) {
    return (
      <aside className={styles.panel}>
        <p className={styles.empty}>No element selected</p>
      </aside>
    );
  }

  const ditaAttrs = (selectedNode.attrs.ditaAttrs ?? {}) as Record<string, string>;
  const knownAttrs = Object.entries(selectedNode.attrs).filter(
    ([k]) => k !== 'ditaAttrs',
  );

  return (
    <aside className={styles.panel}>
      <h4 className={styles.heading}>
        {selectedNode.type.replace('dita', '')}
      </h4>

      {knownAttrs.length > 0 && (
        <div className={styles.section}>
          <h5 className={styles.subheading}>Attributes</h5>
          <table className={styles.attrTable}>
            <tbody>
              {knownAttrs.map(([key, value]) => (
                <tr key={key}>
                  <td className={styles.attrKey}>{key}</td>
                  <td className={styles.attrValue}>
                    {value == null ? '—' : String(value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {Object.keys(ditaAttrs).length > 0 && (
        <div className={styles.section}>
          <h5 className={styles.subheading}>Other Attributes</h5>
          <table className={styles.attrTable}>
            <tbody>
              {Object.entries(ditaAttrs).map(([key, value]) => (
                <tr key={key}>
                  <td className={styles.attrKey}>{key}</td>
                  <td className={styles.attrValue}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </aside>
  );
}
