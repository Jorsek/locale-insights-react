import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CalloutInsight } from './CalloutInsight';

describe('CalloutInsight', () => {
    describe('Basic Rendering', () => {
        it('renders without crashing', () => {
            const { container } = render(
                <CalloutInsight label="Test Label" value="123" />
            );
            expect(container.querySelector('section')).toBeInTheDocument();
        });

        it('renders with callout-insight class', () => {
            const { container } = render(
                <CalloutInsight label="Test Label" value="123" />
            );
            expect(container.querySelector('.callout-insight')).toBeInTheDocument();
        });

        it('renders label text', () => {
            render(<CalloutInsight label="Localized Files" value="123" />);
            expect(screen.getByText('Localized Files')).toBeInTheDocument();
        });

        it('renders value text', () => {
            render(<CalloutInsight label="Test Label" value="1,241" />);
            expect(screen.getByText('1,241')).toBeInTheDocument();
        });

        it('renders both label and value', () => {
            render(<CalloutInsight label="Total Resources" value="456" />);
            expect(screen.getByText('Total Resources')).toBeInTheDocument();
            expect(screen.getByText('456')).toBeInTheDocument();
        });
    });

    describe('Icon Rendering', () => {
        it('renders icon when provided', () => {
            const { container } = render(
                <CalloutInsight label="Test Label" value="123" icon="language" />
            );
            const icon = container.querySelector('.icon');
            expect(icon).toBeInTheDocument();
            expect(icon?.textContent).toBe('language');
        });

        it('does not render icon element when icon is not provided', () => {
            const { container } = render(
                <CalloutInsight label="Test Label" value="123" />
            );
            expect(container.querySelector('.icon')).not.toBeInTheDocument();
        });

        it('renders different icon values correctly', () => {
            const { container } = render(
                <CalloutInsight label="Test Label" value="123" icon="article" />
            );
            const icon = container.querySelector('.icon');
            expect(icon?.textContent).toBe('article');
        });

        it('renders icon with work_history value', () => {
            const { container } = render(
                <CalloutInsight label="Jobs" value="5" icon="work_history" />
            );
            const icon = container.querySelector('.icon');
            expect(icon?.textContent).toBe('work_history');
        });
    });

    describe('Value Types', () => {
        it('renders numeric value', () => {
            render(<CalloutInsight label="Count" value={42} />);
            expect(screen.getByText('42')).toBeInTheDocument();
        });

        it('renders string value', () => {
            render(<CalloutInsight label="Status" value="Active" />);
            expect(screen.getByText('Active')).toBeInTheDocument();
        });

        it('renders formatted number string', () => {
            render(<CalloutInsight label="Total" value="1,234,567" />);
            expect(screen.getByText('1,234,567')).toBeInTheDocument();
        });

        it('renders zero value', () => {
            render(<CalloutInsight label="Count" value={0} />);
            expect(screen.getByText('0')).toBeInTheDocument();
        });

        it('renders ReactNode as value', () => {
            render(
                <CalloutInsight
                    label="Custom"
                    value={<span data-testid="custom-value">Custom Content</span>}
                />
            );
            expect(screen.getByTestId('custom-value')).toBeInTheDocument();
            expect(screen.getByText('Custom Content')).toBeInTheDocument();
        });
    });

    describe('Loading State', () => {
        it('renders skeleton elements when loading is true', () => {
            const { container } = render(
                <CalloutInsight label="Test" value="123" loading={true} />
            );
            const skeletons = container.querySelectorAll('.skeleton');
            expect(skeletons.length).toBeGreaterThan(0);
        });

        it('does not render label text when loading', () => {
            render(
                <CalloutInsight label="Test Label" value="123" loading={true} />
            );
            expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
        });

        it('does not render value text when loading', () => {
            render(
                <CalloutInsight label="Test" value="123" loading={true} />
            );
            expect(screen.queryByText('123')).not.toBeInTheDocument();
        });

        it('applies skeleton-conainer class when loading', () => {
            const { container } = render(
                <CalloutInsight label="Test" value="123" loading={true} />
            );
            expect(container.querySelector('.skeleton-conainer')).toBeInTheDocument();
        });

        it('renders skeleton icon when loading and icon is provided', () => {
            const { container } = render(
                <CalloutInsight label="Test" value="123" icon="language" loading={true} />
            );
            const skeletonIcon = container.querySelector('.skeleton[style*="2.5em"]');
            expect(skeletonIcon).toBeInTheDocument();
        });

        it('does not render icon element when loading and icon provided', () => {
            const { container } = render(
                <CalloutInsight label="Test" value="123" icon="language" loading={true} />
            );
            expect(container.querySelector('.icon')).not.toBeInTheDocument();
        });

        it('renders two skeleton label elements when loading', () => {
            const { container } = render(
                <CalloutInsight label="Test" value="123" loading={true} />
            );
            const skeletonLabels = container.querySelectorAll('.label.skeleton');
            expect(skeletonLabels.length).toBe(2);
        });

        it('does not render skeleton icon when loading without icon', () => {
            const { container } = render(
                <CalloutInsight label="Test" value="123" loading={true} />
            );
            // Should have 2 skeleton labels but no skeleton icon
            const skeletons = container.querySelectorAll('.skeleton');
            expect(skeletons.length).toBe(2);
        });

        it('does not apply skeleton-conainer class when not loading', () => {
            const { container } = render(
                <CalloutInsight label="Test" value="123" loading={false} />
            );
            expect(container.querySelector('.skeleton-conainer')).not.toBeInTheDocument();
        });
    });

    describe('Custom ClassName', () => {
        it('applies custom className', () => {
            const { container } = render(
                <CalloutInsight label="Test" value="123" className="custom-class" />
            );
            expect(container.querySelector('.custom-class')).toBeInTheDocument();
        });

        it('applies both callout-insight and custom className', () => {
            const { container } = render(
                <CalloutInsight label="Test" value="123" className="error-callout" />
            );
            const section = container.querySelector('section');
            expect(section).toHaveClass('callout-insight');
            expect(section).toHaveClass('error-callout');
        });

        it('applies multiple custom classes', () => {
            const { container } = render(
                <CalloutInsight label="Test" value="123" className="class-one class-two" />
            );
            const section = container.querySelector('section');
            expect(section).toHaveClass('callout-insight');
            expect(section).toHaveClass('class-one');
            expect(section).toHaveClass('class-two');
        });

        it('combines custom className with skeleton-conainer when loading', () => {
            const { container } = render(
                <CalloutInsight
                    label="Test"
                    value="123"
                    className="custom-class"
                    loading={true}
                />
            );
            const section = container.querySelector('section');
            expect(section).toHaveClass('callout-insight');
            expect(section).toHaveClass('custom-class');
            expect(section).toHaveClass('skeleton-conainer');
        });
    });

    describe('Content Structure', () => {
        it('renders content in a div with content class', () => {
            const { container } = render(
                <CalloutInsight label="Test" value="123" />
            );
            const contentDiv = container.querySelector('.content');
            expect(contentDiv).toBeInTheDocument();
            expect(contentDiv?.tagName).toBe('DIV');
        });

        it('renders label in p tag with label class', () => {
            const { container } = render(
                <CalloutInsight label="Test Label" value="123" />
            );
            const labelP = container.querySelector('.label');
            expect(labelP).toBeInTheDocument();
            expect(labelP?.tagName).toBe('P');
            expect(labelP?.textContent).toBe('Test Label');
        });

        it('renders value in p tag with value class', () => {
            const { container } = render(
                <CalloutInsight label="Test" value="123" />
            );
            const valueP = container.querySelector('.value');
            expect(valueP).toBeInTheDocument();
            expect(valueP?.tagName).toBe('P');
            expect(valueP?.textContent).toBe('123');
        });

        it('wraps everything in a section element', () => {
            const { container } = render(
                <CalloutInsight label="Test" value="123" icon="language" />
            );
            const section = container.querySelector('section');
            expect(section).toBeInTheDocument();
            expect(section?.children.length).toBeGreaterThan(0);
        });
    });

    describe('Edge Cases', () => {
        it('handles empty string label', () => {
            render(<CalloutInsight label="" value="123" />);
            const { container } = render(<CalloutInsight label="" value="123" />);
            expect(container.querySelector('.label')).toBeInTheDocument();
        });

        it('handles empty string value', () => {
            render(<CalloutInsight label="Test" value="" />);
            const { container } = render(<CalloutInsight label="Test" value="" />);
            expect(container.querySelector('.value')).toBeInTheDocument();
        });

        it('handles long label text', () => {
            const longLabel = 'This is a very long label text that should still render correctly';
            render(<CalloutInsight label={longLabel} value="123" />);
            expect(screen.getByText(longLabel)).toBeInTheDocument();
        });

        it('handles long value text', () => {
            const longValue = '123,456,789,012,345,678,901,234,567,890';
            render(<CalloutInsight label="Test" value={longValue} />);
            expect(screen.getByText(longValue)).toBeInTheDocument();
        });

        it('handles special characters in label', () => {
            render(<CalloutInsight label="Test & Special <Characters>" value="123" />);
            expect(screen.getByText('Test & Special <Characters>')).toBeInTheDocument();
        });

        it('handles special characters in value', () => {
            render(<CalloutInsight label="Test" value="100% Complete!" />);
            expect(screen.getByText('100% Complete!')).toBeInTheDocument();
        });

        it('handles undefined icon gracefully', () => {
            const { container } = render(
                <CalloutInsight label="Test" value="123" icon={undefined} />
            );
            expect(container.querySelector('.icon')).not.toBeInTheDocument();
        });

        it('handles empty string icon', () => {
            const { container } = render(
                <CalloutInsight label="Test" value="123" icon="" />
            );
            // Empty string is still a string, so icon element should render but be empty
            const icon = container.querySelector('.icon');
            expect(icon).toBeInTheDocument();
            expect(icon?.textContent).toBe('');
        });
    });

    describe('Loading State with Different Props', () => {
        it('shows loading state with icon', () => {
            const { container } = render(
                <CalloutInsight
                    label="Localized Files"
                    value="1,241"
                    icon="article"
                    loading={true}
                />
            );
            expect(container.querySelector('.skeleton-conainer')).toBeInTheDocument();
            expect(screen.queryByText('Localized Files')).not.toBeInTheDocument();
            expect(screen.queryByText('1,241')).not.toBeInTheDocument();
        });

        it('shows loading state without icon', () => {
            const { container } = render(
                <CalloutInsight
                    label="No Icon"
                    value="456"
                    loading={true}
                />
            );
            expect(container.querySelector('.skeleton-conainer')).toBeInTheDocument();
            const skeletons = container.querySelectorAll('.skeleton');
            expect(skeletons.length).toBe(2); // Only 2 skeleton labels, no icon
        });

        it('toggles from loading to loaded state', () => {
            const { container, rerender } = render(
                <CalloutInsight label="Test" value="123" loading={true} />
            );
            expect(container.querySelector('.skeleton-conainer')).toBeInTheDocument();

            rerender(<CalloutInsight label="Test" value="123" loading={false} />);
            expect(container.querySelector('.skeleton-conainer')).not.toBeInTheDocument();
            expect(screen.getByText('Test')).toBeInTheDocument();
            expect(screen.getByText('123')).toBeInTheDocument();
        });
    });

    describe('Skeleton Styles', () => {
        it('applies correct inline styles to skeleton icon', () => {
            const { container } = render(
                <CalloutInsight label="Test" value="123" icon="language" loading={true} />
            );
            const skeletonIcon = container.querySelector('.skeleton[style*="2.5em"]');
            expect(skeletonIcon).toBeInTheDocument();
        });

        it('applies correct inline styles to first skeleton label', () => {
            const { container } = render(
                <CalloutInsight label="Test" value="123" loading={true} />
            );
            const skeletonLabels = container.querySelectorAll('.label.skeleton');
            expect(skeletonLabels[0]).toHaveStyle({ '--w': '15ch', '--h': '1.2em' });
        });

        it('applies correct inline styles to second skeleton label', () => {
            const { container } = render(
                <CalloutInsight label="Test" value="123" loading={true} />
            );
            const skeletonLabels = container.querySelectorAll('.label.skeleton');
            expect(skeletonLabels[1]).toHaveStyle({ '--w': '10ch', '--h': '1.875em' });
        });
    });

    describe('Integration Scenarios', () => {
        it('renders complete callout with all props', () => {
            const { container } = render(
                <CalloutInsight
                    label="Localized Files"
                    value="1,241"
                    icon="docs"
                    className="test-callout"
                    loading={false}
                />
            );
            expect(screen.getByText('Localized Files')).toBeInTheDocument();
            expect(screen.getByText('1,241')).toBeInTheDocument();
            expect(container.querySelector('.icon')).toHaveTextContent('docs');
            expect(container.querySelector('.test-callout')).toBeInTheDocument();
        });

        it('renders error callout variant', () => {
            const { container } = render(
                <CalloutInsight
                    label="Missing Resources"
                    value="150"
                    icon="error"
                    className="error-callout"
                />
            );
            expect(screen.getByText('Missing Resources')).toBeInTheDocument();
            expect(screen.getByText('150')).toBeInTheDocument();
            expect(container.querySelector('.error-callout')).toBeInTheDocument();
        });

        it('renders multiple callouts with different values', () => {
            const { container } = render(
                <div>
                    <CalloutInsight label="Files" value="100" icon="docs" />
                    <CalloutInsight label="Locales" value="5" icon="language" />
                    <CalloutInsight label="Jobs" value="3" icon="work_history" />
                </div>
            );
            expect(screen.getByText('Files')).toBeInTheDocument();
            expect(screen.getByText('100')).toBeInTheDocument();
            expect(screen.getByText('Locales')).toBeInTheDocument();
            expect(screen.getByText('5')).toBeInTheDocument();
            expect(screen.getByText('Jobs')).toBeInTheDocument();
            expect(screen.getByText('3')).toBeInTheDocument();
        });
    });
});
