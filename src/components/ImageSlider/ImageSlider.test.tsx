import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeAll, vi } from 'vitest'
import ImageSlider from './index'

describe('ImageSlider', () => {
  const imageSources = ['/slides/0.jpg', '/slides/1.jpg', '/slides/2.jpg', '/slides/3.jpg']

  beforeAll(() => {
    // Mock the Image constructor
    vi.spyOn(window, 'Image').mockImplementation(() => {
      const img = {
        src: '',
        onload: null,
        onerror: null,
        width: 0,
        height: 0,
        // Mock EventTarget methods
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      } as unknown as HTMLImageElement

      setTimeout(() => {
        if (img.onload) {
          img.onload(new Event('load'))
        }
      }, 100)
      return img
    })
  })

  it('should render the loading message initially', () => {
    render(<ImageSlider imageSources={imageSources} />)
    expect(screen.getByText('Loading images, please wait...')).not.toBeNull()
  })

  it('should render the drag message after images are loaded', async () => {
    render(<ImageSlider imageSources={imageSources} />)
    expect(await screen.findByText('Drag to change image')).not.toBeNull()
  })

  it('should render the canvas', () => {
    const { container } = render(<ImageSlider imageSources={imageSources} />)
    const canvas = container.querySelector('canvas') as HTMLCanvasElement
    expect(canvas).not.toBeNull()
  })

  it('should have the correct width and height', () => {
    const { container } = render(<ImageSlider imageSources={imageSources} />)
    const canvas = container.querySelector('canvas') as HTMLCanvasElement
    expect(canvas.width).toBe(640)
    expect(canvas.height).toBe(400)
  })

  it('should add the dragging class when dragging', () => {
    const { container } = render(<ImageSlider imageSources={imageSources} />)
    const canvas = container.querySelector('canvas') as HTMLCanvasElement

    if (canvas) {
      fireEvent.mouseDown(canvas)
      expect(canvas.classList.contains('dragging')).toBe(true)
    }
  })
})
