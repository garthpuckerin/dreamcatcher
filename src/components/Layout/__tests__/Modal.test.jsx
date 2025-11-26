import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '../Modal'

describe('Modal', () => {
  it('renders children content', () => {
    render(
      <Modal onClose={vi.fn()}>
        <div>Modal Content</div>
      </Modal>
    )

    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  it('calls onClose when clicking overlay', async () => {
    const user = userEvent.setup()
    const mockOnClose = vi.fn()

    const { container } = render(
      <Modal onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    )

    // Click the overlay (first div)
    const overlay = container.firstChild
    await user.click(overlay)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('does not call onClose when clicking modal content', async () => {
    const user = userEvent.setup()
    const mockOnClose = vi.fn()

    render(
      <Modal onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    )

    const content = screen.getByText('Modal Content')
    await user.click(content)

    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('applies correct styling for overlay', () => {
    const { container } = render(
      <Modal onClose={vi.fn()}>
        <div>Content</div>
      </Modal>
    )

    const overlay = container.firstChild
    expect(overlay).toHaveStyle({ position: 'fixed' })
    expect(overlay).toHaveStyle({ zIndex: '1000' })
  })

  it('renders with proper accessibility structure', () => {
    const { container } = render(
      <Modal onClose={vi.fn()}>
        <h2>Modal Title</h2>
        <p>Modal description</p>
      </Modal>
    )

    expect(screen.getByText('Modal Title')).toBeInTheDocument()
    expect(screen.getByText('Modal description')).toBeInTheDocument()
    expect(container.firstChild).toBeInTheDocument()
  })
})
