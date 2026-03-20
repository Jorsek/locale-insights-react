import type { EditorMode } from '../state/ui-store';
import styles from './ModeToggle.module.css';

interface ModeToggleProps {
  mode: EditorMode;
  onSwitch: (mode: EditorMode) => void;
}

export function ModeToggle({ mode, onSwitch }: ModeToggleProps) {
  return (
    <div className={styles.toggle}>
      <button
        className={`${styles.btn} ${mode === 'visual' ? styles.active : ''}`}
        onClick={() => onSwitch('visual')}
      >
        Visual
      </button>
      <button
        className={`${styles.btn} ${mode === 'source' ? styles.active : ''}`}
        onClick={() => onSwitch('source')}
      >
        Source
      </button>
    </div>
  );
}
