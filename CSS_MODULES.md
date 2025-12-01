# CSS Modules Guide

CSS Modules have been configured in this project to provide scoped styling for components.

## What are CSS Modules?

CSS Modules are CSS files where all class names are scoped locally by default. This prevents naming conflicts and makes styling more maintainable.

## How to Use CSS Modules

### 1. Create a CSS Module file

Name your CSS file with the `.module.css` extension:

```
Component.module.css
```

### 2. Write your styles

```css
/* Component.module.css */
.container {
    padding: 1rem;
    background-color: #f5f5f5;
}

.title {
    font-size: 1.5rem;
    font-weight: bold;
}
```

### 3. Import and use in your component

```tsx
import styles from './Component.module.css';

export const Component = () => {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Hello</h2>
        </div>
    );
};
```

## Configuration

The project is configured with the following CSS modules settings in `vite.config.ts`:

- **localsConvention**: `camelCaseOnly` - Allows you to use camelCase names in JS even if the CSS uses kebab-case
- **scopeBehaviour**: `local` - All classes are scoped locally by default
- **generateScopedName**: `[name]__[local]___[hash:base64:5]` - Generated class names format

### Example: Using kebab-case in CSS with camelCase in JS

CSS:
```css
.my-awesome-button {
    background: blue;
}
```

TypeScript:
```tsx
import styles from './Button.module.css';

// Access with camelCase
<button className={styles.myAwesomeButton}>Click me</button>
```

## Combining Multiple Classes

```tsx
// Option 1: Template strings
<div className={`${styles.container} ${styles.active}`}>

// Option 2: Array join
<div className={[styles.container, styles.active].join(' ')}>

// Option 3: Using a library like clsx
import clsx from 'clsx';
<div className={clsx(styles.container, { [styles.active]: isActive })}>
```

## Global Styles

If you need global styles, you can still use regular `.css` files (without `.module.css`):

```tsx
import './global.css';  // Global styles
import styles from './Component.module.css';  // Scoped styles
```

Or use `:global` in your CSS module:

```css
:global(.global-class) {
    /* This won't be scoped */
}

.local-class {
    /* This will be scoped */
}
```

## Example Component

See `src/components/common/Example/Example.tsx` for a working example of CSS modules in action.

## TypeScript Support

TypeScript definitions for CSS modules are configured in `src/vite-env.d.ts`, providing auto-completion and type safety for your imported styles.
