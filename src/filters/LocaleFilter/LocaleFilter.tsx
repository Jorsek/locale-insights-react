import { useState, type MouseEvent, type FC, useDeferredValue } from 'react';
import { useActiveLocalesQuery } from 'src/state/activeLocalesApi';
import { useFilter } from '../filterContext';
import { Popup, type PopupItem } from 'src/common/Popup';
import classNames from 'classnames';
import filterStyles from '../filters.module.css';
import styles from './LocaleFilter.module.css';
import 'src/skeleton.css';

interface LocaleFilterProps {
    className?: string;
}

export const LocaleFilter: FC<LocaleFilterProps> = ({
    className,
}) => {
    const [showPopup, setShowPopup] = useState(false);
    const { data: activeLocales, isLoading, isError } = useActiveLocalesQuery();
    const { currentFilters, updateFilter, clearFilter } = useFilter();

    // Get current selection from filters
    const currentLocales = currentFilters.locales;
    const selectedLocales = Array.isArray(currentLocales) ? currentLocales : [];
    const isAllSelected = selectedLocales.length === 0;

    const handleTogglePopup = (event: MouseEvent<any>) => {
        event.stopPropagation();
        event.preventDefault();
        setShowPopup(!showPopup);
    };

    const handleItemSelected = (id: string) => {
        if (id === '[ALL]') {
            clearFilter('locales', false);
        } else {
            // Toggle selection
            if (selectedLocales.includes(id)) {
                // Remove from selection
                const newSelection = selectedLocales.filter(locale => locale !== id);
                if (newSelection.length === 0) {
                    clearFilter('locales', false);
                } else {
                    updateFilter('locales', newSelection, false);
                }
            } else {
                // Add to selection
                updateFilter('locales', [...selectedLocales, id], false);
            }
        }
        setShowPopup(false);
    };

    // Generate display text
    const getDisplayText = () => {
        if (isAllSelected) {
            return 'All Locales';
        }
        if (selectedLocales.length === 1 && activeLocales) {
            const locale = activeLocales.find(l => l.code === selectedLocales[0]);
            return `${locale?.displayName} [${locale?.code}]`;
        }
        return `${selectedLocales.length} Locales`;
    };

    if (isLoading) {
        return (
            <span className={classNames(filterStyles.selectFilter, 'skeleton-container', className)}>
                <div className={classNames(filterStyles.labelSkeleton, 'skeleton')} />
                <div className={classNames(filterStyles.controlSkeleton, 'skeleton')} />
            </span>
        );
    }

    if (isError) {
        return (
            <span className={classNames(styles.localeFilter, styles.error, className)}>
                <div>
                    Unable to fetch locales
                </div>
            </span>
        );
    }

    // Create popup items
    const popupItems: PopupItem[] = [
        {
            id: '[ALL]',
            label: 'All Locales',
            selected: isAllSelected
        },
        ...(activeLocales?.map(locale => ({
            id: locale.code,
            label: `${locale.displayName} [${locale.code}]`,
            selected: selectedLocales.includes(locale.code)
        })) ?? [])
    ];

    return (
        <span className={classNames(styles.localeFilter, className)} onClick={handleTogglePopup}>
            <div className={styles.label}>
                Locale(s):
            </div>
            <div
                className={styles.trigger}>
                {getDisplayText()}
            </div>
            <span className={styles.dropdownIcon}>
                {showPopup ? 'arrow_drop_up' : 'arrow_drop_down'}
            </span>
            <Popup
                show={showPopup}
                onClose={() => setShowPopup(false)}
                className={styles.popup}
                items={popupItems}
                onItemSelected={handleItemSelected}
                itemClassName={styles.menuItem}
                selectedClassName={styles.menuItemSelected}
            />
        </span >
    );
};
