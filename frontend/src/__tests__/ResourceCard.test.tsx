import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ResourceCard } from '../components/common/ResourceCard'

describe('ResourceCard', () => {
  it('renders title, description, and price label', () => {
    render(
      <MemoryRouter>
        <ResourceCard
          title="Serene Suite"
          description="Oceanfront view"
          priceLabel="From $420"
          href="/rooms/1"
          images={[{ id: 1, url: 'https://example.com/photo.jpg' }]}
        />
      </MemoryRouter>,
    )
    expect(screen.getByText('Serene Suite')).toBeInTheDocument()
    expect(screen.getByText('Oceanfront view')).toBeInTheDocument()
    expect(screen.getByText('From $420')).toBeInTheDocument()
  })
})

