import './ImageSlider.css'
import { useCallback, useEffect, useRef, useState } from 'react'

type ImageSliderProps = {
    imageSources: string[]
}

const ImageSlider = ({ imageSources }: ImageSliderProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
	const animationFrameRef = useRef<number>(null)
    const [loading, setLoading] = useState(true)
    const [images, setImages] = useState<HTMLImageElement[]>([])
    const [dragging, setDragging] = useState(false)
    const [initialX, setInitialX] = useState(0)
    const [deltaX, setDeltaX] = useState(0)

    const handleMouseDown = useCallback((event: React.MouseEvent | React.TouchEvent) => {
        event.preventDefault()
        const offsetX = 'clientX' in event ? event.clientX : event.touches[0].clientX

        setInitialX(offsetX - deltaX)
        setDragging(true)
    }, [deltaX])

    const handleMouseMove = useCallback((event: MouseEvent | TouchEvent) => {
        if (!dragging || !canvasRef.current) {
            return
        }

        event.preventDefault()
        const offsetX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX
        const minX = canvasRef.current.width * (imageSources.length - 1) * -1
        const newDeltaX = Math.max(minX, Math.min(0, offsetX - initialX))
        
        setDeltaX(newDeltaX)
    }, [dragging, initialX, imageSources.length])

    const handleMouseUp = useCallback((event: MouseEvent | TouchEvent) => {
        event.preventDefault()
        setDragging(false)
    }, [])

    const drawImages = useCallback(() => {
		const canvas = canvasRef.current
		const context = canvas?.getContext('2d')

		if (!context || !canvas) {
			return
		}

        context.clearRect(0, 0, canvas.width, canvas.height)

        images.forEach((image, index) => {
			const centerX = (canvas.width - image.width) / 2
            const x = centerX + canvas.width * index + deltaX
            const isVisible = x > image.width * -1 && x < canvas.width

            if (isVisible) {
				const centerY = (canvas.height - image.height) / 2
                context.drawImage(image, x, centerY, image.width, image.height)
            }
        })
    }, [images, deltaX])

    const loadImages = useCallback(() => {
		const canvas = canvasRef.current

		if (!canvas) {
			return
		}

        let imagesLoaded = 0
        const newImages: HTMLImageElement[] = []

        imageSources.forEach(source => {
            const image = new Image()
			image.onload = () => {
                const scaleX = canvas.width / image.width
                const scaleY = canvas.height / image.height
                const scale = Math.min(scaleX, scaleY)
                image.width = image.width * scale
                image.height = image.height * scale
                imagesLoaded++
                
                if (imagesLoaded === imageSources.length) {
                    setLoading(false)
                    setImages(newImages)
                }
            }
            image.src = source
            newImages.push(image)
        })
    }, [imageSources])

    useEffect(() => {
		loadImages()
    }, [loadImages])

    useEffect(() => {
        if (images.length === 0) {
            return
        }

        animationFrameRef.current = requestAnimationFrame(drawImages)

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current)
			}
		}
    }, [images, drawImages])

    useEffect(() => {
        if (!dragging) {
            return
        }

		document.body.addEventListener('mousemove', handleMouseMove)
		document.body.addEventListener('mouseup', handleMouseUp)
		document.body.addEventListener('touchmove', handleMouseMove)
		document.body.addEventListener('touchend', handleMouseUp)
        
        return () => {
            document.body.removeEventListener('mousemove', handleMouseMove)
            document.body.removeEventListener('mouseup', handleMouseUp)
            document.body.removeEventListener('touchmove', handleMouseMove)
            document.body.removeEventListener('touchend', handleMouseUp)
        }
    }, [dragging, handleMouseMove, handleMouseUp])

    return (
        <>
            <canvas
                ref={canvasRef}
                className={dragging ? 'dragging' : undefined}
                width="640"
                height="400"
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            />
            {loading && <aside>Loading images, please wait...</aside>}
            {!loading && <aside>Drag to change image</aside>}
        </>
    )
}

export default ImageSlider
