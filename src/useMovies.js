
import { useState,useEffect } from "react";


const KEY = '872c45a8'
export function useMovies(query){

const [movies, setMovies] = useState([]);
   const [isMoviesLoading, setIsMoviesLoading] = useState(false);
   const [error,setError] = useState('');

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
        if(err.name === 'AbortError') return
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
    // handleCloseMovie()
    fetchMovies();

    // commenting as it is not working
    // return function (){
    //   controller.abort();
    // }

  },[query])

  return {movies,isMoviesLoading, error}
}