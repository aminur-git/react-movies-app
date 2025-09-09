
import { useEffect, useState } from 'react'
import './App.css'
import Search from './Components/Search'
import Spinner from './Components/Spinner'
import MovieCard from './Components/MovieCard'
import { useDebounce } from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite'

const App = () => {

  const [errorMessage, setErrorMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounchedSearchTerm, setDebouncehedSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(() => setDebouncehedSearchTerm(searchTerm), 800, [searchTerm])


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
  const fetchMovies = async (query = '') => {
    try {
      setLoading(true)
      setErrorMessage('')


      const endPoint =
        query
          ?
          `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
          :
          `${API_BASE_URL}/discover/movie?short_by=popularity.desc`

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

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0])
      }

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
    fetchMovies(debounchedSearchTerm)
  }, [debounchedSearchTerm])

  // fetch trending movies
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies()
      setTrendingMovies(movies)
    }
    catch (error) {
      console.error('error fetching trending movies', error)

    }
  }

  useEffect(() => {
    loadTrendingMovies()
  }, [])




  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src="./hero.png" alt="" />
          <h1>Find <span className='text-gradient'>Movies</span> You Will Enjoy Without Hassle.</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          {/* <h1 className='text-white'>{searchTerm}</h1> */}
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, idx) => (
                <li key={movie.$id}>
                  <p>{idx + 1}</p>
                  <img src={movie.poster_url} alt="" />

                </li>
              ))}
            </ul>

          </section>
        )}

        <section className='all-movies'>
          <h2 className='mt-[40px]'>All Movies</h2>
          {loading ?
            (<Spinner />) : errorMessage ? (<p className='text-red-500'>{errorMessage}</p>)
              : (
                <ul className='text-white'>
                  {movieList.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </ul>
              )}
        </section>
      </div>
    </main>
  )
}

export default App
