
import { useEffect, useState } from 'react'
import './App.css'
import Search from './Components/Search'

const App = () => {

  const [errorMessage, setErrorMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(false);


  const API_BASE_URL = 'https://api.themoviedb.org/3/';
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY

  const API_OPTIONS = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  }

  // fetch movies
  const fetchMovies = async () => {
    try {
      setLoading(true)
      setErrorMessage('')


      const endPoint = `${API_BASE_URL}/discover/movie?short_by=popularity.desc`
      const response = await fetch(endPoint, API_OPTIONS)


      if (!response) {
        throw new Error('Failed to fetch movies')
      }

      const data = await response.json()
      // console.log(data)

      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies')
        setLoading(false)
        return
      }
      setMovieList(data.results || [])

    }
    catch (error) {
      console.error('error fetching movies', error)
      setErrorMessage('Error fetching movies, Please try again later!')
    }
    finally {
      setLoading(false)
    }

  }



  useEffect(() => {
    fetchMovies()
  }, [])


  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src="./hero.png" alt="" />
          <h1>Find <span className='text-gradient'>Movies</span> You Will Enjoy Without Hassle.</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <h1 className='text-white'>{searchTerm}</h1>
        </header>

        <section className='all-movies'>
          <h2>All Movies</h2>
          {loading ? (<p className='text-white'>Loading...</p>) : errorMessage ? (<p className='text-red-500'>{errorMessage}</p>) : (
            <ul className='text-white'>
              {movieList.map((movie) => (
                <li key={movie.id}>
                  <h3>{movie.title}</h3>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}

export default App
