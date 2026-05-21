import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import StarRating from './StarRating';



function Test(){
  const [movieRating, setMovieRating] = useState(0);
  return <div>
  <StarRating color='blue' maxRating={10} onSetRating={setMovieRating} />
  <p>This movie is rated {movieRating}</p>
  </div>

}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={5} message={['Terrible',"Bad","Okay","Good","Best"]}/>
    <StarRating maxRating={5} defaultRating={2}/>

    <Test /> */}
  </React.StrictMode>
);


