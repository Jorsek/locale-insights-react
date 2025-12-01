import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ColumnHeader } from './ColumnHeader';

describe('ColumnHeader', () => {
  const mockOnSort = vi.fn();
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    mockOnSort.mockClear();
    mockOnRemove.mockClear();
  });

  it('renders the label text', () => {
    render(
      <table>
        <thead>
          <tr>
            <ColumnHeader
              label="Name"
              column="name"
              sortDirection="asc"
              loading={false}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('applies the correct className when sorting ascending', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <ColumnHeader
              label="Status"
              column="status"
              sortedBy="status"
              sortDirection="asc"
              loading={false}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    const th = container.querySelector('th');
    expect(th).toHaveClass('sortable-header');
    expect(th).toHaveClass('asc');
  });

  it('applies the correct className when sorting descending', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <ColumnHeader
              label="Date"
              column="date"
              sortedBy="date"
              sortDirection="desc"
              loading={false}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    const th = container.querySelector('th');
    expect(th).toHaveClass('desc');
  });

  it('applies loading class when loading is true', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <ColumnHeader
              label="Processing"
              column="processing"
              sortDirection="asc"
              loading={true}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    const th = container.querySelector('th');
    expect(th).toHaveClass('loading');
  });

  it('calls onSort with asc when clicking on a non-active column', async () => {
    const user = userEvent.setup();
    render(
      <table>
        <thead>
          <tr>
            <ColumnHeader
              label="Name"
              column="name"
              sortDirection="asc"
              loading={false}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    const th = screen.getByText('Name').closest('th');
    await user.click(th!);

    expect(mockOnSort).toHaveBeenCalledWith('name', 'asc');
  });

  it('toggles sort direction when clicking on active column', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <table>
        <thead>
          <tr>
            <ColumnHeader
              label="Name"
              column="name"
              sortedBy="name"
              sortDirection="asc"
              loading={false}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    const th = screen.getByText('Name').closest('th');
    await user.click(th!);

    expect(mockOnSort).toHaveBeenCalledWith('name', 'desc');

    // Simulate changing to desc
    mockOnSort.mockClear();
    rerender(
      <table>
        <thead>
          <tr>
            <ColumnHeader
              label="Name"
              column="name"
              sortedBy="name"
              sortDirection="desc"
              loading={false}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    await user.click(th!);
    expect(mockOnSort).toHaveBeenCalledWith('name', 'asc');
  });

  it('does not call onSort if column is not provided (unsortable)', async () => {
    const user = userEvent.setup();
    render(
      <table>
        <thead>
          <tr>
            <ColumnHeader
              label="Static"
              loading={false}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    const th = screen.getByText('Static').closest('th');
    await user.click(th!);

    expect(mockOnSort).not.toHaveBeenCalled();
  });

  it('shows remove button when onRemove is provided', () => {
    render(
      <table>
        <thead>
          <tr>
            <ColumnHeader
              label="Removable"
              column="removable"
              sortDirection="asc"
              loading={false}
              onSort={mockOnSort}
              onRemove={mockOnRemove}
            />
          </tr>
        </thead>
      </table>
    );

    const removeButton = screen.getByRole('button');
    expect(removeButton).toBeInTheDocument();
    expect(removeButton).toHaveTextContent('✕');
  });

  it('does not show remove button when onRemove is not provided', () => {
    render(
      <table>
        <thead>
          <tr>
            <ColumnHeader
              label="Not Removable"
              column="notRemovable"
              sortDirection="asc"
              loading={false}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    const removeButtons = screen.queryAllByRole('button');
    expect(removeButtons).toHaveLength(0);
  });

  it('calls onRemove when remove button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <table>
        <thead>
          <tr>
            <ColumnHeader
              label="Removable"
              column="removable"
              sortDirection="asc"
              loading={false}
              onSort={mockOnSort}
              onRemove={mockOnRemove}
            />
          </tr>
        </thead>
      </table>
    );

    const removeButton = screen.getByRole('button');
    await user.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <ColumnHeader
              label="Custom"
              column="custom"
              sortDirection="asc"
              loading={false}
              className="custom-class"
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    const th = container.querySelector('th');
    expect(th).toHaveClass('custom-class');
  });

  it('applies unsortable class when column is not provided', () => {
    const { container } = render(
      <table>
        <thead>
          <tr>
            <ColumnHeader
              label="Static"
              loading={false}
              onSort={mockOnSort}
            />
          </tr>
        </thead>
      </table>
    );

    const th = container.querySelector('th');
    expect(th).toHaveClass('unsortable');
  });
});
