import { useUIStore } from '../state/ui-store';
import { Sidebar } from './Sidebar';
import styles from './AppShell.module.css';

export function AppShell() {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const activeTabUuid = useUIStore((s) => s.activeTabUuid);

  return (
    <div className={styles.shell}>
      {sidebarOpen && (
        <aside className={styles.sidebar}>
          <Sidebar />
        </aside>
      )}
      <main className={styles.main}>
        {activeTabUuid ? (
          <p>Editor for {activeTabUuid} — coming in Phase 2</p>
        ) : (
          <div className={styles.empty}>
            <p>Select a document from the sidebar to begin editing.</p>
          </div>
        )}
      </main>
    </div>
  );
}
