import type { FC } from 'react';
import styles from './Example.module.css';

interface ExampleProps {
    title?: string;
    content?: string;
}

export const Example: FC<ExampleProps> = ({
    title = 'CSS Modules Example',
    content = 'This component uses CSS modules for styling!'
}) => {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.content}>
                {content} <span className={styles.highlight}>Highlighted text</span>
            </p>
        </div>
    );
};
