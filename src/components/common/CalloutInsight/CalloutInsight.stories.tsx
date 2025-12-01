import type { Meta, StoryObj } from '@storybook/react';
import { CalloutInsight } from './CalloutInsight';

const meta = {
    title: 'Common/CalloutInsight',
    component: CalloutInsight,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof CalloutInsight>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
    args: {
        icon: 'language',
        label: 'Localized files',
        value: 1241,
        loading: false,
    },
};

export const LargeNumber: Story = {
    args: {
        label: 'Total translations',
        value: new Number(1142857).toLocaleString('en-us'),
        icon: 'article'
    },
};

export const Loading: Story = {
    args: {
        label: 'Localized files',
        value: 1241,
        icon: 'article',
        loading: true,
    },
};

export const WithoutIcon: Story = {
    args: {
        label: 'No icon variant',
        value: 456,
        loading: false,
    },
};

export const LoadingWithoutIcon: Story = {
    args: {
        label: 'Localized files',
        value: 1241,
        loading: true,
    },
};

export const InContaner: Story = {
    args: {
        label: 'In Container',
        value: 1241,
        icon: 'home'
    },
    parameters: {
        layout: 'fullscreen'
    },
    decorators: [
        story => (
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'stretch', minWidth: '90%',
                padding: '2rem', gap: '1rem'
            }}>
                {story()}
                {story()}
                {story()}
            </div>
        )
    ]
};

export const InContanerLoading: Story = {
    args: {
        label: 'In Container',
        value: 1241,
        icon: 'home',
        loading: true,
    },
    parameters: {
        layout: 'fullscreen'
    },
    decorators: [
        story => (
            <div style={{
                display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', minWidth: '90%',
                padding: '2rem', gap: '1rem'
            }}>
                {story()}
                {story()}
                {story()}
            </div>
        )
    ]
};

