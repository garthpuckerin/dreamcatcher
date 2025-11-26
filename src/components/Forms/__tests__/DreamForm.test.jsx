import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DreamForm from '../DreamForm'

describe('DreamForm', () => {
  const mockStatuses = [
    { value: 'idea', label: 'Idea' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'launched', label: 'Launched' },
  ]

  const mockOnSave = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty form for new dream', () => {
    render(<DreamForm onSave={mockOnSave} onCancel={mockOnCancel} statuses={mockStatuses} />)

    expect(screen.getByPlaceholderText(/my amazing project/i)).toHaveValue('')
    expect(screen.getByPlaceholderText(/what's this dream about/i)).toHaveValue('')
  })

  it('renders with existing dream data', () => {
    const existingDream = {
      title: 'Test Dream',
      description: 'Test description',
      status: 'in-progress',
      tags: ['test', 'react'],
    }

    render(
      <DreamForm
        dream={existingDream}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        statuses={mockStatuses}
      />
    )

    expect(screen.getByPlaceholderText(/my amazing project/i)).toHaveValue('Test Dream')
    expect(screen.getByPlaceholderText(/what's this dream about/i)).toHaveValue('Test description')
    expect(screen.getByText('test')).toBeInTheDocument()
    expect(screen.getByText('react')).toBeInTheDocument()
  })

  it('allows user to input title and description', async () => {
    const user = userEvent.setup()
    render(<DreamForm onSave={mockOnSave} onCancel={mockOnCancel} statuses={mockStatuses} />)

    const titleInput = screen.getByPlaceholderText(/my amazing project/i)
    const descInput = screen.getByPlaceholderText(/what's this dream about/i)

    await user.type(titleInput, 'New Dream Title')
    await user.type(descInput, 'New dream description')

    expect(titleInput).toHaveValue('New Dream Title')
    expect(descInput).toHaveValue('New dream description')
  })

  it('allows user to change status', async () => {
    const user = userEvent.setup()
    render(<DreamForm onSave={mockOnSave} onCancel={mockOnCancel} statuses={mockStatuses} />)

    const statusSelect = screen.getByRole('combobox')
    await user.selectOptions(statusSelect, 'in-progress')

    expect(statusSelect).toHaveValue('in-progress')
  })

  it('allows user to add tags', async () => {
    const user = userEvent.setup()
    render(<DreamForm onSave={mockOnSave} onCancel={mockOnCancel} statuses={mockStatuses} />)

    const tagInput = screen.getByPlaceholderText(/add a tag/i)
    const addButton = screen.getByRole('button', { name: /add/i })

    await user.type(tagInput, 'test-tag')
    await user.click(addButton)

    expect(screen.getByText('test-tag')).toBeInTheDocument()
    expect(tagInput).toHaveValue('')
  })

  it('allows user to add tags by pressing Enter', async () => {
    const user = userEvent.setup()
    render(<DreamForm onSave={mockOnSave} onCancel={mockOnCancel} statuses={mockStatuses} />)

    const tagInput = screen.getByPlaceholderText(/add a tag/i)

    await user.type(tagInput, 'enter-tag{Enter}')

    expect(screen.getByText('enter-tag')).toBeInTheDocument()
  })

  it('prevents duplicate tags', async () => {
    const user = userEvent.setup()
    const dreamWithTag = {
      title: 'Test',
      description: '',
      status: 'idea',
      tags: ['existing'],
    }

    render(
      <DreamForm
        dream={dreamWithTag}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        statuses={mockStatuses}
      />
    )

    const tagInput = screen.getByPlaceholderText(/add a tag/i)
    const addButton = screen.getByRole('button', { name: /add/i })

    await user.type(tagInput, 'existing')
    await user.click(addButton)

    const tags = screen.getAllByText('existing')
    expect(tags).toHaveLength(1) // Should still only be one
  })

  it('allows user to remove tags', async () => {
    const user = userEvent.setup()
    const dreamWithTags = {
      title: 'Test',
      description: '',
      status: 'idea',
      tags: ['tag1', 'tag2'],
    }

    render(
      <DreamForm
        dream={dreamWithTags}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        statuses={mockStatuses}
      />
    )

    const tag1 = screen.getByText('tag1')
    expect(tag1).toBeInTheDocument()

    // Click the X icon to remove the tag
    const removeButtons = tag1.parentElement.querySelector('svg')
    await user.click(removeButtons)

    await waitFor(() => {
      expect(screen.queryByText('tag1')).not.toBeInTheDocument()
    })
    expect(screen.getByText('tag2')).toBeInTheDocument()
  })

  it('calls onSave when form is submitted with valid data', async () => {
    const user = userEvent.setup()
    render(<DreamForm onSave={mockOnSave} onCancel={mockOnCancel} statuses={mockStatuses} />)

    const titleInput = screen.getByPlaceholderText(/my amazing project/i)
    await user.type(titleInput, 'My Dream')

    const saveButton = screen.getByRole('button', { name: /save dream/i })
    await user.click(saveButton)

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'My Dream',
      })
    )
  })

  it('does not call onSave when title is empty', async () => {
    const user = userEvent.setup()
    render(<DreamForm onSave={mockOnSave} onCancel={mockOnCancel} statuses={mockStatuses} />)

    const saveButton = screen.getByRole('button', { name: /save dream/i })
    await user.click(saveButton)

    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<DreamForm onSave={mockOnSave} onCancel={mockOnCancel} statuses={mockStatuses} />)

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })
})
