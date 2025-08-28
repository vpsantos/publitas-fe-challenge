import './ImageSlider.css'
import { useCallback, useEffect, useRef, useState } from 'react'

type ImageSliderProps = {
    imageSources: string[]
}

const ImageSlider = ({ imageSources }: ImageSliderProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [loading, setLoading] = useState(true)
    const [images, setImages] = useState<HTMLImageElement[]>([])
    const [dragging, setDragging] = useState(false)
    const [initialX, setInitialX] = useState(0)
    const [deltaX, setDeltaX] = useState(0)

    const handleMouseDown = useCallback((event: MouseEvent | TouchEvent) => {
        if (event.target !== canvasRef.current) {
            return
        }

        event.preventDefault()
        const offsetX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX

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

    const drawImages = useCallback((images: HTMLImageElement[], deltaX: number) => {
        const canvas = canvasRef.current

        if (!canvas) {
            return
        }
        
        const context = canvas.getContext('2d')

        if (!context) {
            return
        }

        context.clearRect(0, 0, canvas.width, canvas.height)

        images.forEach((image, index) => {
            const widthRatio = canvas.width / image.width
            const heightRatio = canvas.height / image.height
            const ratio = Math.min(widthRatio, heightRatio)
            const centerX = (canvas.width - image.width * ratio) / 2
            const centerY = (canvas.height - image.height * ratio) / 2
            const x = centerX + canvas.width * index + deltaX

            context.drawImage(image, x, centerY, image.width * ratio, image.height * ratio)
        })
    }, [])

    const loadImages = useCallback(() => {
        let imagesLoaded = 0
        const newImages: HTMLImageElement[] = []

        imageSources.forEach((source) => {
            const image = new Image()
            image.src = source
			image.onload = () => {
                imagesLoaded++
                
                if (imagesLoaded === imageSources.length) {
                    setLoading(false)
                    setImages(newImages)
                }
            }

            newImages.push(image)
        })
    }, [imageSources])

    useEffect(() => {
		loadImages()

        document.body.addEventListener('mousedown', handleMouseDown)
		document.body.addEventListener('mousemove', handleMouseMove)
		document.body.addEventListener('mouseup', handleMouseUp)
        document.body.addEventListener('touchstart', handleMouseDown)
		document.body.addEventListener('touchmove', handleMouseMove)
		document.body.addEventListener('touchend', handleMouseUp)
        
        return () => {
            document.body.removeEventListener('mousedown', handleMouseDown)
            document.body.removeEventListener('mousemove', handleMouseMove)
            document.body.removeEventListener('mouseup', handleMouseUp)
            document.body.removeEventListener('touchstart', handleMouseDown)
            document.body.removeEventListener('touchmove', handleMouseMove)
            document.body.removeEventListener('touchend', handleMouseUp)
        }
    }, [handleMouseDown, handleMouseMove, handleMouseUp, loadImages])

    useEffect(() => {
        if (images.length === 0) {
            return
        }

        drawImages(images, deltaX)
    }, [images, drawImages, deltaX])

    return (
        <>
            <canvas
                ref={canvasRef}
                className={dragging ? 'dragging' : undefined}
                width="640"
                height="400"
            />
            {loading && <aside>Loading images, please wait...</aside>}
            {!loading && <aside>Drag to change image</aside>}
        </>
    )
}

export default ImageSlider
