import { useUIStore } from '../state/ui-store';
import { Sidebar } from './Sidebar';
import { EditorTabs } from './EditorTabs';
import { DitaEditor } from '../editor/DitaEditor';
import styles from './AppShell.module.css';

export function AppShell() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const activeTabUuid = useUIStore((s) => s.activeTabUuid);
  const openTabs = useUIStore((s) => s.openTabs);

  return (
    <div className={styles.shell}>
      {sidebarOpen && (
        <aside className={styles.sidebar}>
          <Sidebar />
        </aside>
      )}
      <div className={styles.mainArea}>
        {!sidebarOpen && (
          <button className={styles.openSidebar} onClick={toggleSidebar} title="Open sidebar">
            &#9776;
          </button>
        )}
        {openTabs.length > 0 && <EditorTabs />}
        <main className={styles.main}>
          {activeTabUuid ? (
            <DitaEditor uuid={activeTabUuid} />
          ) : (
            <div className={styles.empty}>
              <p>Select a document from the sidebar to begin editing.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
