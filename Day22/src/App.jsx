import Header from './components/Header'
import Cards from './components/Cards'
import './App.css'
function App() {
  return (
    <>
      <Header />
      <div className="AllCards">
        <Cards title="Card 1" description="This is the description for Card 1." image="src\assets\image1.jpg" />
        <Cards title="Card 2" description="This is the description for Card 2." image="src\assets\image2.jpg" />
        <Cards title="Card 3" description="This is the description for Card 3." image="src\assets\image3.jpg" />
        <Cards title="Card 4" description="This is the description for Card 4." image="src\assets\image4.jpg" />
        <Cards title="Card 5" description="This is the description for Card 5." image="src\assets\image5.jpg" />
        <Cards title="Card 6" description="This is the description for Card 6." image="src\assets\image6.jpg" />
      </div>
    </>
  )
}

export default App
