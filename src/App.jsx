
import { useState } from 'react'
import './App.css'
import Search from './Components/Search'

const App = () => {

  const [searchTerm, setSearchTerm] = useState('')

  return (
    <main>
      <div className='pattern'>

      </div>
      <div className='wrapper'>
        <img src="./hero.png" alt="" />
        <h1>Find <span className='text-gradient'>Movies</span> You Will Enjoy Without Hassle.</h1>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <h1 className='text-white'>{searchTerm}</h1>
      </div>
    </main>
  )
}

export default App
