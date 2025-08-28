import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Header from './index'

describe('Header', () => {
  it('renders the logo and the text', () => {
    render(<Header />)
    
    const logo = screen.getByAltText('Publitas')
    const text = screen.getByText('Frontend Challenge')
    
    expect(logo).not.toBeNull()
    expect(text).not.toBeNull()
  })
})
