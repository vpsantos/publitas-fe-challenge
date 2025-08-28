import './App.css'
import Header from './components/Header'
import ImageSlider from './components/ImageSlider'
import slide1 from '/slides/0.jpg'
import slide2 from '/slides/1.jpg'
import slide3 from '/slides/2.jpg'
import slide4 from '/slides/3.jpg'

const images = [slide1, slide2, slide3, slide4]

function App() {
  return (
    <>
      <Header />
      <section>
        <ImageSlider imageSources={images} />
      </section>
    </>
  )
}

export default App
