import { useQuery } from '@tanstack/react-query';
import { useCMSClient } from '../api/cms-provider';
import { useUIStore } from '../state/ui-store';
import type { ContentNode } from '../types/dita';
import styles from './Sidebar.module.css';

function TreeNode({ node }: { node: ContentNode }) {
  const openTab = useUIStore((s) => s.openTab);

  return (
    <div className={styles.treeNode}>
      <button
        className={styles.nodeButton}
        onClick={() => openTab(node.uuid, node.title)}
      >
        <span className={styles.icon}>{node.type === 'map' ? '📁' : '📄'}</span>
        {node.title}
      </button>
      {node.children && node.children.length > 0 && (
        <div className={styles.children}>
          {node.children.map((child) => (
            <TreeNode key={child.uuid} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar() {
  const client = useCMSClient();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const { data, isLoading, error } = useQuery({
    queryKey: ['hierarchy', 'root-001'],
    queryFn: () => client.getHierarchy('root-001'),
  });

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>Content</h3>
        <button className={styles.collapseBtn} onClick={toggleSidebar}>
          ✕
        </button>
      </div>
      {isLoading && <p className={styles.status}>Loading...</p>}
      {error && <p className={styles.status}>Error loading content</p>}
      {data && <TreeNode node={data.root} />}
    </div>
  );
}
