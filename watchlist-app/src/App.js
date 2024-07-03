import './App.css';
import { IoIosAddCircle, IoMdStar } from "react-icons/io";
import { IoBookmark, IoCheckmarkCircleSharp } from "react-icons/io5";
import { FaTrashAlt } from "react-icons/fa";
import Header from './Header';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [product, setProduct] = useState([]);
  const [clicked, setClicked] = useState(() => {
    const savedClickedState = JSON.parse(localStorage.getItem('clickedState')) || {};
    return savedClickedState;
  });
  const [delClicked, setDelClicked] = useState({});

  useEffect(() => {
    axios.get("http://localhost:1234/fetchMovie")
      .then(res => {
        console.log(res.data);
        setProduct(res.data);
      }).catch(err => {
        console.log(err);
      });
  }, []);

  const deleteCard = async () => {
    try {
      const toDelete = Object.keys(delClicked).filter(index => delClicked[index]);
      if (toDelete.length === 0) {
        alert("No movies selected for deletion.");
        return;
      }

      const confirmed = window.confirm(`Are you sure you want to delete ${toDelete.length} selected movie(s)?`);
      if (!confirmed) {
        return;
      }

      const promises = toDelete.map(index => {
        return axios.delete(`http://localhost:1234/deleteMovie/${product[index]._id}`);
      });

      await Promise.all(promises);
      alert("Selected movies deleted successfully.");

      const updatedMovies = await axios.get("http://localhost:1234/fetchMovie");
      setProduct(updatedMovies.data);
      setDelClicked({});
    } catch (error) {
      console.error("Error deleting movies:", error);
      alert("Failed to delete selected movies.");
    }
  };

  useEffect(() => {
    localStorage.setItem('clickedState', JSON.stringify(clicked));
  }, [clicked]);

  const toggleBookmark = (index) => {
    setClicked(prevClicked => ({
      ...prevClicked,
      [index]: !prevClicked[index]
    }));
  };

  const toggleDelBtn = (index) => {
    setDelClicked(prevClicked => ({
      ...prevClicked,
      [index]: !prevClicked[index]
    }));
  };

  const getMovieRating = (movieId) => {
    const savedRating = localStorage.getItem(`rating-${movieId}`);
    return savedRating ? parseFloat(savedRating) : 0;
  };

  const truncateDescription = (description, wordLimit) => {
    const words = description.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="flex flex-col items-end pr-8 pt-4">
        <Link to="/addMovie">
          <IoIosAddCircle className="text-white text-3xl mb-5" />
        </Link>
        <FaTrashAlt className="text-white text-3xl cursor-pointer" onClick={deleteCard} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {product.map((movieList, index) => (
          <div className="bg-gray-800 text-white border border-red-500 rounded-lg shadow-lg flex flex-col" key={index}>
          <div className="flex justify-between p-2">
            <IoBookmark
              className={`text-2xl cursor-pointer ${clicked[index] ? 'text-black' : 'text-gray-200'}`}
              onClick={() => toggleBookmark(index)}
            />
            <IoCheckmarkCircleSharp
              className={`text-2xl cursor-pointer ${delClicked[index] ? 'text-red-500' : 'text-gray-200'}`}
              onClick={() => toggleDelBtn(index)}
            />
          </div>
          <Link to={`/movieDetail/${movieList._id}`} key={index}>
            <img
              className="w-full h-72 object-cover rounded-t-lg"
              src={`http://localhost:1234/attach/${movieList.movImg}`}
              alt="Movie"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h4 className="text-xl font-bold">
                {movieList.title}
              </h4>
              <p className="mt-2 flex-grow">
                {truncateDescription(movieList.description, 25)}
              </p>
              <div className="mt-auto">
                <hr className="my-4" />
                <div className="flex justify-between items-center">
                  <div>Release: {movieList.reYear}</div>
                  <div className="text-right text-red-500 flex items-center">
                    <IoMdStar className="text-yellow-500 m-1 text-xl" />
                    <p className="text-white">{getMovieRating(movieList._id)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
        
        ))}
      </div>
    </div>
  );
}

export default App;
