import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorState } from '../components/common/ErrorState'

describe('ErrorState', () => {
  it('shows retry button and calls handler', () => {
    const handler = vi.fn()
    render(<ErrorState message="Failed to load data." onRetry={handler} />)
    fireEvent.click(screen.getByText('Try again'))
    expect(handler).toHaveBeenCalledTimes(1)
  })
})

