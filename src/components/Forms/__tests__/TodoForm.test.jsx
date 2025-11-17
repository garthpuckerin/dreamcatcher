import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoForm from '../TodoForm'

describe('TodoForm', () => {
  const mockTaskCategories = [
    { value: 'coding', label: 'Coding', icon: '💻' },
    { value: 'design', label: 'Design', icon: '🎨' },
    { value: 'marketing', label: 'Marketing', icon: '📢' }
  ]

  const mockOnSave = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty form with default values', () => {
    render(<TodoForm onSave={mockOnSave} onCancel={mockOnCancel} taskCategories={mockTaskCategories} />)

    expect(screen.getByPlaceholderText(/what needs to be done/i)).toHaveValue('')
    expect(screen.getByRole('combobox')).toHaveValue('coding')

    // Should have a default deadline (7 days from now)
    const deadlineInput = screen.getByLabelText(/deadline/i)
    expect(deadlineInput.value).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('renders with existing todo data', () => {
    const existingTodo = {
      title: 'Test Todo',
      category: 'design',
      deadline: '2025-12-31',
      notes: 'Test notes'
    }

    render(<TodoForm todo={existingTodo} onSave={mockOnSave} onCancel={mockOnCancel} taskCategories={mockTaskCategories} />)

    expect(screen.getByPlaceholderText(/what needs to be done/i)).toHaveValue('Test Todo')
    expect(screen.getByRole('combobox')).toHaveValue('design')
    expect(screen.getByLabelText(/deadline/i)).toHaveValue('2025-12-31')
    expect(screen.getByPlaceholderText(/additional details/i)).toHaveValue('Test notes')
  })

  it('allows user to input title', async () => {
    const user = userEvent.setup()
    render(<TodoForm onSave={mockOnSave} onCancel={mockOnCancel} taskCategories={mockTaskCategories} />)

    const titleInput = screen.getByPlaceholderText(/what needs to be done/i)
    await user.type(titleInput, 'New task')

    expect(titleInput).toHaveValue('New task')
  })

  it('allows user to change category', async () => {
    const user = userEvent.setup()
    render(<TodoForm onSave={mockOnSave} onCancel={mockOnCancel} taskCategories={mockTaskCategories} />)

    const categorySelect = screen.getByRole('combobox')
    await user.selectOptions(categorySelect, 'marketing')

    expect(categorySelect).toHaveValue('marketing')
  })

  it('allows user to change deadline', async () => {
    const user = userEvent.setup()
    render(<TodoForm onSave={mockOnSave} onCancel={mockOnCancel} taskCategories={mockTaskCategories} />)

    const deadlineInput = screen.getByLabelText(/deadline/i)
    await user.clear(deadlineInput)
    await user.type(deadlineInput, '2025-12-25')

    expect(deadlineInput).toHaveValue('2025-12-25')
  })

  it('allows user to input notes', async () => {
    const user = userEvent.setup()
    render(<TodoForm onSave={mockOnSave} onCancel={mockOnCancel} taskCategories={mockTaskCategories} />)

    const notesInput = screen.getByPlaceholderText(/additional details/i)
    await user.type(notesInput, 'Important notes here')

    expect(notesInput).toHaveValue('Important notes here')
  })

  it('calls onSave when form is submitted with valid data', async () => {
    const user = userEvent.setup()
    render(<TodoForm onSave={mockOnSave} onCancel={mockOnCancel} taskCategories={mockTaskCategories} />)

    const titleInput = screen.getByPlaceholderText(/what needs to be done/i)
    await user.type(titleInput, 'Complete task')

    const saveButton = screen.getByRole('button', { name: /save todo/i })
    await user.click(saveButton)

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Complete task',
        category: 'coding'
      })
    )
  })

  it('does not call onSave when title is empty', async () => {
    const user = userEvent.setup()
    render(<TodoForm onSave={mockOnSave} onCancel={mockOnCancel} taskCategories={mockTaskCategories} />)

    const saveButton = screen.getByRole('button', { name: /save todo/i })
    await user.click(saveButton)

    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<TodoForm onSave={mockOnSave} onCancel={mockOnCancel} taskCategories={mockTaskCategories} />)

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })
})
