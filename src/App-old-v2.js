import { useEffect, useState } from "react";
import StarRating from './StarRating'

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);



function Main({children}){
   return <main className="main">
          {children}
      </main>
}

function Box({children}){
   const [isOpen, setIsOpen] = useState(true);


   return <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? "–" : "+"}
          </button>
          {isOpen && 
           children
          }
        </div>
}

// function WatchedBox({children}){
//   const [isOpen2, setIsOpen2] = useState(true);


//    return <div className="box">
//           <button
//             className="btn-toggle"
//             onClick={() => setIsOpen2((open) => !open)}
//           >
//             {isOpen2 ? "–" : "+"}
//           </button>
//           {isOpen2 && (
//             children
//           )}
//       </div>
// }

function MoviesList({movies,selectMovie}){
  return  <ul className="list list-movies">
              {movies?.map((movie) => (
                <Movie movie={movie} selectMovie={selectMovie} key={movie.imdbID}/>
              ))}
            </ul>
}


function Movie({movie,selectMovie}){
  return <li style={{cursor:'pointer'}} onClick={()=>selectMovie(movie.imdbID)}>
                  <img src={movie.Poster} alt={`${movie.Title} poster`} />
                  <h3>{movie.Title}</h3>
                  <div>
                    <p>
                      <span>🗓</span>
                      <span>{movie.Year}</span>
                    </p>
                  </div>
                </li>
}


function MovieDetails({selectedId,onCloseMovie,onAddWatched, watched}){

  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  // derived state
  const currentWatchedMovie = watched?.filter(movie=> movie.imdbID === selectedId);
  const isWatched = currentWatchedMovie?.length > 0;
  const watchedMovieRating = currentWatchedMovie?.at(0)?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre
  } = movie


   useEffect(function (){
    function callback(e){
      if(e.code === 'Escape')onCloseMovie();
    }
    document.addEventListener('keydown',callback)


    return function(){
      document.removeEventListener('keydown',callback)
    }
   },[onCloseMovie])

  useEffect(()=>{
    async function fetchMovieDetails(){
       try{
        setIsLoading(true);
        const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);

        if(!res.ok) throw new Error('Unable to fetch movie details');

        const data = await res.json();
        setMovie(data);
        // document.title = `Movie | ${title}`
        setIsLoading(false);

      } catch(err){
        console.log(err);
      }
    }
    fetchMovieDetails()
  },[selectedId])

  useEffect(()=>{
    if(!title) return;
    document.title = `Movie | ${title}`
  },[title])


  function handleAdd(){
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating: userRating
    }
    onAddWatched(newWatchedMovie)
    onCloseMovie()
  }

  return <div className="details">
    {isLoading ? <Loader /> : <>
    <header>
    <button className="btn-back" onClick={onCloseMovie}>&larr;</button>
     <img src={poster} alt={`poster of the ${movie}`} />
     <div className="details-overview">
        <h2>{title}</h2>
        <p>{released} &bull; {runtime}</p>
        <p>{genre}</p>
        <p>
          <span> ⭐️ </span>
          {imdbRating} IMDb rating
          </p>
     </div>
     </header>

     <section>
      <div className="rating">
        {!isWatched ? 
        <>
        <StarRating maxRating={10} onSetRating={setUserRating} />

        {userRating > 0 && <button className="btn-add" onClick={handleAdd}>+ Add to list</button>} 
        
        </> : <p>You have already rated this movie {watchedMovieRating} <span>⭐️</span></p>}
      </div>
      <p>
        <em>{plot}</em>
      </p>
      <p>Starring {actors}</p>
      <p>Directed by {director}</p>
     </section>
     </>}
  </div>

}

function WatchedMoviesList({watched, onRemoveFromWatched}){
   return <ul className="list">
                {watched.map((movie) => (
                 <WatchedMovie movie={movie}
                  key={movie.imdbID}
                  onRemoveFromWatched = {onRemoveFromWatched}
                  />
                ))}
              </ul>
}

function WatchedMovie({movie, onRemoveFromWatched}){
  return  <li>
                    <img src={movie.poster} alt={`${movie.title} poster`} />
                    <h3>{movie.title}</h3>
                    <p onClick={()=>onRemoveFromWatched(movie.imdbID)}>❌</p>
                    <div>
                      <p>
                        <span>⭐️</span>
                        <span>{movie.imdbRating}</span>
                      </p>
                      <p>
                        <span>🌟</span>
                        <span>{movie.userRating}</span>
                      </p>
                      <p>
                        <span>⏳</span>
                        <span>{movie.runtime} min</span>
                      </p>
                    </div>
                  </li>
}

function Summary({watched}){
   const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return <div className="summary">
                <h2>Movies you watched</h2>
                <div>
                  <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                  </p>
                  <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating}</span>
                  </p>
                  <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                  </p>
                  <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                  </p>
                </div>
              </div>
}


const KEY = '872c45a8'


function Loader(){
  return <p className="loader">Loading...</p>
}

function Error({message}){
  return <p className="error">{message}</p>
}

export default function App() {
   const [query, setQuery] = useState("");
   const [movies, setMovies] = useState([]);
   const [watched, setWatched] = useState([]);
   const [isMoviesLoading, setIsMoviesLoading] = useState(false);
   const [error,setError] = useState('');
   const [selectedId, setSelectedId] = useState(null);
   const tempQuery = 'interstellar';


   function handleSelectMovie(movieId){
    setSelectedId(selectedId=> movieId === selectedId ? null : movieId)
   }

   function handleCloseMovie(){
    setSelectedId(null);
   }

   function handleWatched(movie){
    setWatched(watched=>[...watched,movie])
   }

   function handleRemoveMovieFromWatchedList(id){
    setWatched(watched=> watched.filter(movie=> movie.imdbID !== id))
   }

  useEffect(()=>{
     const controller = new AbortController();
    async function fetchMovies(){
      try{
        setIsMoviesLoading(true);
        setError("")
        const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          {signal: controller.signal}
        );
        if(!res.ok)
           throw new Error('something went wrong while fetching movies')


        const data = await res.json();
        if(data.Response === 'False') {
          throw new Error('Movie not found')
        }

        setMovies(data.Search);
      }catch(err){
        if(err.name == 'AbortError') return
          console.log(err.message);
          setError(err.message); 
      }finally{
       if (!controller.signal.aborted) {
        setIsMoviesLoading(false);
      }
      }
     
    } 

    if(query.length < 3){
      setMovies([]);
      setError("");
      return;
    }
    handleCloseMovie()
    fetchMovies();

    // commenting as it is not working
    // return function (){
    //   controller.abort();
    // }

  },[query])

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery}/>
        <ResultsCount movies={movies}/>
      </Navbar>
      <Main > 

        {/* passing elements as props */}
        {/* <Box element={<MoviesList  movies={movies}/>}/>
        <Box element={
          <>
            <Summary watched={watched}/>
            <WatchedMoviesList watched={watched}/>
          </>
        }/> */}

        {/* children prop */}
        <Box>
          {/* {isMoviesLoading ? <Loader /> : <MoviesList  movies={movies}/>} */}

          {isMoviesLoading && <Loader />}
          {!isMoviesLoading && !error && <MoviesList
           selectMovie={handleSelectMovie} 
           movies={movies}/>}
          {error && <Error message={error} /> }
        </Box>
       <Box>

        {
          selectedId ? <MovieDetails 
          onCloseMovie={handleCloseMovie} 
          selectedId={selectedId}
          onAddWatched={handleWatched} 
          watched={watched}
          /> : <>
          <Summary watched={watched}/>
             <WatchedMoviesList watched={watched} 
             onRemoveFromWatched={handleRemoveMovieFromWatchedList} />
          </>
        }
        
       </Box>
       
        </Main>
    </>
  );
}


function Navbar({children}){
    return <nav className="nav-bar">
       <Logo />
       {children}
      </nav>
}

function Logo(){
    return <div className="logo">
          <span role="img">🍿</span>
          <h1>usePopcorn</h1>
        </div>
}


function ResultsCount ({movies}){
     return <p className="num-results">
          Found <strong>{movies?.length}</strong> results
        </p>
}


function Search({query,setQuery}) {
  
    return <input
          className="search"
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
    />
}
