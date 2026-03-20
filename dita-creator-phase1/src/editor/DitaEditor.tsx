import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { JSONContent } from '@tiptap/core';
import { useCMSClient } from '../api/cms-provider';
import { useUIStore } from '../state/ui-store';
import { parseDitaXml } from './conversion/xml-parser';
import { xmlToTipTap } from './conversion/xml-to-tiptap';
import { tipTapToXml } from './conversion/tiptap-to-xml';
import { DitaVisualEditor } from './visual/DitaVisualEditor';
import { DitaSourceEditor } from './source/DitaSourceEditor';
import { ModeToggle } from '../shell/ModeToggle';
import styles from './DitaEditor.module.css';

interface DitaEditorProps {
  uuid: string;
}

export function DitaEditor({ uuid }: DitaEditorProps) {
  const client = useCMSClient();
  const queryClient = useQueryClient();
  const editorMode = useUIStore((s) => s.editorMode);
  const setTabDirty = useUIStore((s) => s.setTabDirty);

  // Fetch content from CMS
  const { data: originalXml, isLoading, error } = useQuery({
    queryKey: ['content', uuid],
    queryFn: () => client.readContent(uuid),
  });

  // TipTap JSON state (visual mode works with this)
  const [tipTapContent, setTipTapContent] = useState<JSONContent | null>(null);
  // XML string state (source mode works with this)
  const [xmlContent, setXmlContent] = useState<string>('');
  // Parse error when switching from source to visual
  const [parseError, setParseError] = useState<string | null>(null);

  // Initialize content from fetched XML
  useEffect(() => {
    if (!originalXml) return;
    setXmlContent(originalXml);
    try {
      const doc = parseDitaXml(originalXml);
      setTipTapContent(xmlToTipTap(doc));
      setParseError(null);
    } catch (e) {
      setParseError(e instanceof Error ? e.message : 'Parse error');
    }
  }, [originalXml]);

  // Handle visual editor updates
  const handleVisualUpdate = useCallback(
    (content: JSONContent) => {
      setTipTapContent(content);
      setXmlContent(tipTapToXml(content));
      setTabDirty(uuid, true);
    },
    [uuid, setTabDirty],
  );

  // Handle source editor updates
  const handleSourceUpdate = useCallback(
    (xml: string) => {
      setXmlContent(xml);
      setTabDirty(uuid, true);
    },
    [uuid, setTabDirty],
  );

  // Sync source → visual when switching to visual mode
  const handleModeSwitch = useCallback(
    (newMode: 'visual' | 'source') => {
      if (newMode === 'visual') {
        try {
          const doc = parseDitaXml(xmlContent);
          setTipTapContent(xmlToTipTap(doc));
          setParseError(null);
        } catch (e) {
          setParseError(e instanceof Error ? e.message : 'Invalid XML');
          return; // Don't switch if XML is invalid
        }
      } else {
        // Switching to source — serialize current TipTap content
        if (tipTapContent) {
          setXmlContent(tipTapToXml(tipTapContent));
        }
      }
      useUIStore.getState().setEditorMode(newMode);
    },
    [xmlContent, tipTapContent],
  );

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: (xml: string) => client.writeContent(uuid, xml),
    onSuccess: () => {
      setTabDirty(uuid, false);
      queryClient.invalidateQueries({ queryKey: ['content', uuid] });
    },
  });

  const handleSave = useCallback(() => {
    // Always save the XML version
    let xmlToSave = xmlContent;
    if (editorMode === 'visual' && tipTapContent) {
      xmlToSave = tipTapToXml(tipTapContent);
    }
    saveMutation.mutate(xmlToSave);
  }, [xmlContent, tipTapContent, editorMode, saveMutation]);

  // Keyboard shortcut: Ctrl+S to save
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSave]);

  if (isLoading) return <div className={styles.status}>Loading...</div>;
  if (error) return <div className={styles.status}>Error loading content</div>;

  return (
    <div className={styles.editor}>
      <div className={styles.header}>
        <ModeToggle mode={editorMode} onSwitch={handleModeSwitch} />
        <div className={styles.actions}>
          {parseError && <span className={styles.error}>{parseError}</span>}
          <button
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {editorMode === 'visual' && tipTapContent ? (
          <DitaVisualEditor content={tipTapContent} onUpdate={handleVisualUpdate} />
        ) : (
          <DitaSourceEditor xmlContent={xmlContent} onChange={handleSourceUpdate} />
        )}
      </div>
    </div>
  );
}
