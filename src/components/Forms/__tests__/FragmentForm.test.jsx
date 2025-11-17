import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FragmentForm from '../FragmentForm'

describe('FragmentForm', () => {
  const mockOnSave = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty form', () => {
    render(<FragmentForm onSave={mockOnSave} onCancel={mockOnCancel} />)

    expect(screen.getByPlaceholderText(/initial concept/i)).toHaveValue('')
    expect(screen.getByPlaceholderText(/paste conversation/i)).toHaveValue('')
    expect(screen.getByPlaceholderText(/chatgpt thread/i)).toHaveValue('')
  })

  it('allows user to input title and content', async () => {
    const user = userEvent.setup()
    render(<FragmentForm onSave={mockOnSave} onCancel={mockOnCancel} />)

    const titleInput = screen.getByPlaceholderText(/initial concept/i)
    const contentInput = screen.getByPlaceholderText(/paste conversation/i)

    await user.type(titleInput, 'Test Fragment')
    await user.type(contentInput, 'Fragment content here')

    expect(titleInput).toHaveValue('Test Fragment')
    expect(contentInput).toHaveValue('Fragment content here')
  })

  it('allows user to input source', async () => {
    const user = userEvent.setup()
    render(<FragmentForm onSave={mockOnSave} onCancel={mockOnCancel} />)

    const sourceInput = screen.getByPlaceholderText(/chatgpt thread/i)
    await user.type(sourceInput, 'ChatGPT conversation')

    expect(sourceInput).toHaveValue('ChatGPT conversation')
  })

  it('allows user to add features', async () => {
    const user = userEvent.setup()
    render(<FragmentForm onSave={mockOnSave} onCancel={mockOnCancel} />)

    const featureInput = screen.getByPlaceholderText(/add a feature/i)
    const addButton = screen.getByRole('button', { name: /add/i })

    await user.type(featureInput, 'authentication')
    await user.click(addButton)

    expect(screen.getByText('authentication')).toBeInTheDocument()
    expect(featureInput).toHaveValue('')
  })

  it('allows user to add features by pressing Enter', async () => {
    const user = userEvent.setup()
    render(<FragmentForm onSave={mockOnSave} onCancel={mockOnCancel} />)

    const featureInput = screen.getByPlaceholderText(/add a feature/i)
    await user.type(featureInput, 'dashboard{Enter}')

    expect(screen.getByText('dashboard')).toBeInTheDocument()
  })

  it('prevents duplicate features', async () => {
    const user = userEvent.setup()
    render(<FragmentForm onSave={mockOnSave} onCancel={mockOnCancel} />)

    const featureInput = screen.getByPlaceholderText(/add a feature/i)
    const addButton = screen.getByRole('button', { name: /add/i })

    await user.type(featureInput, 'feature1')
    await user.click(addButton)

    await user.type(featureInput, 'feature1')
    await user.click(addButton)

    const features = screen.getAllByText('feature1')
    expect(features).toHaveLength(1)
  })

  it('allows user to remove features', async () => {
    const user = userEvent.setup()
    render(<FragmentForm onSave={mockOnSave} onCancel={mockOnCancel} />)

    const featureInput = screen.getByPlaceholderText(/add a feature/i)
    const addButton = screen.getByRole('button', { name: /add/i })

    await user.type(featureInput, 'test-feature')
    await user.click(addButton)

    const feature = screen.getByText('test-feature')
    expect(feature).toBeInTheDocument()

    const removeButton = feature.parentElement.querySelector('svg')
    await user.click(removeButton)

    await waitFor(() => {
      expect(screen.queryByText('test-feature')).not.toBeInTheDocument()
    })
  })

  it('calls onSave when form is submitted with valid data', async () => {
    const user = userEvent.setup()
    render(<FragmentForm onSave={mockOnSave} onCancel={mockOnCancel} />)

    await user.type(screen.getByPlaceholderText(/initial concept/i), 'Fragment Title')
    await user.type(screen.getByPlaceholderText(/paste conversation/i), 'Fragment content')

    const saveButton = screen.getByRole('button', { name: /save fragment/i })
    await user.click(saveButton)

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Fragment Title',
        content: 'Fragment content'
      })
    )
  })

  it('does not call onSave when title is empty', async () => {
    const user = userEvent.setup()
    render(<FragmentForm onSave={mockOnSave} onCancel={mockOnCancel} />)

    await user.type(screen.getByPlaceholderText(/paste conversation/i), 'Content only')

    const saveButton = screen.getByRole('button', { name: /save fragment/i })
    await user.click(saveButton)

    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('does not call onSave when content is empty', async () => {
    const user = userEvent.setup()
    render(<FragmentForm onSave={mockOnSave} onCancel={mockOnCancel} />)

    await user.type(screen.getByPlaceholderText(/initial concept/i), 'Title only')

    const saveButton = screen.getByRole('button', { name: /save fragment/i })
    await user.click(saveButton)

    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<FragmentForm onSave={mockOnSave} onCancel={mockOnCancel} />)

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })
})
