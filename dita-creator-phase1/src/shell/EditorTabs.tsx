import { useUIStore } from '../state/ui-store';
import styles from './EditorTabs.module.css';

export function EditorTabs() {
  const openTabs = useUIStore((s) => s.openTabs);
  const activeTabUuid = useUIStore((s) => s.activeTabUuid);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const closeTab = useUIStore((s) => s.closeTab);

  return (
    <div className={styles.tabs}>
      {openTabs.map((tab) => (
        <div
          key={tab.uuid}
          className={`${styles.tab} ${tab.uuid === activeTabUuid ? styles.active : ''}`}
          onClick={() => setActiveTab(tab.uuid)}
        >
          <span className={styles.title}>
            {tab.dirty && <span className={styles.dirty}>*</span>}
            {tab.title}
          </span>
          <button
            className={styles.closeBtn}
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.uuid);
            }}
            title="Close tab"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
