import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "./Header";
import axios from "axios";
import ReactStars from "react-rating-stars-component";
import { RiDraftFill } from "react-icons/ri";

export default function MovieDetail() {
  const { id } = useParams(); // Get the movie ID from the URL
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [savedReviews, setSavedReviews] = useState([]);
  const [editingReviewIndex, setEditingReviewIndex] = useState(-1);

  useEffect(() => {
    axios.get(`http://localhost:1234/fetchMovieData/${id}`)
      .then(res => {
        console.log(res.data);
        setMovie(res.data);
        const savedRating = localStorage.getItem(`rating-${res.data._id}`);
        if (savedRating) {
          setRating(parseFloat(savedRating));
        }
      }).catch(err => {
        console.log(err);
      });

    // Load reviews from localStorage on component mount
    const savedReviews = JSON.parse(localStorage.getItem(`reviews-${id}`)) || [];
    setSavedReviews(savedReviews);
  }, [id]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleReviewChange = (event) => {
    setReview(event.target.value);
  };

  const saveRating = () => {
    localStorage.setItem(`rating-${movie._id}`, rating.toString());
    alert('Rating updated');
  };

  const saveReview = () => {
    if (editingReviewIndex !== -1) {
      // Update existing review
      const updatedReviews = [...savedReviews];
      updatedReviews[editingReviewIndex] = { text: review, date: new Date().toLocaleDateString() };
      localStorage.setItem(`reviews-${id}`, JSON.stringify(updatedReviews));
      setSavedReviews(updatedReviews);
      setEditingReviewIndex(-1); // Reset editing state
      setReview('');
      alert('Review updated');
    } else {
      // Add new review
      const newReview = { text: review, date: new Date().toLocaleDateString() };
      const updatedReviews = [...savedReviews, newReview];
      localStorage.setItem(`reviews-${id}`, JSON.stringify(updatedReviews));
      setSavedReviews(updatedReviews);
      setReview('');
      alert('Review saved');
    }
  };

  const editReview = (index) => {
    setEditingReviewIndex(index);
    setReview(savedReviews[index].text);
  };

  const cancelEdit = () => {
    setEditingReviewIndex(-1);
    setReview('');
  };

  const deleteReview = (index) => {
    const updatedReviews = savedReviews.filter((_, i) => i !== index);
    localStorage.setItem(`reviews-${id}`, JSON.stringify(updatedReviews));
    setSavedReviews(updatedReviews);
    alert('Review deleted');
  };

  if (!movie) {
    return <div className="min-h-screen bg-black text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="container mx-auto p-4">
        <div className="flex flex-wrap pt-4">
          <div className="w-full md:w-1/3 pt-4 p-3">
            <img
              className="w-full"
              src={`http://localhost:1234/attach/${movie.movImg}`}
              alt="Movie"
            />
          </div>
          <div className="w-full md:w-2/3 text-white">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-center underline font-bold text-3xl flex-grow">{movie.title}</h2>
              <Link to={`/updateMovieDetail/${id}`} >
                <RiDraftFill className="text-white text-2xl" />
              </Link>
            </div>
            <p className="mt-7">{movie.description}</p>
            
            {/* Reviews */}
            <h3 className="text-2xl font-bold my-5 underline">Reviews:-</h3>
            {savedReviews.length > 0 ? (
              <ul className="list-disc pl-8">
                {savedReviews.map((review, index) => (
                  <li key={index} className="mt-2">
                    <p>{review.text}</p>
                    <p className="text-sm text-gray-500">Reviewed on {review.date}</p>
                    <div className="flex mt-1">
                      <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => editReview(index)}>Edit</button>
                      <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => deleteReview(index)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reviews yet.</p>
            )}

            <hr className="my-4 mt-7" />
            <div className="flex justify-between mt-7">
              <div>Release: {movie.reYear}</div>
              <div className="text-right pr-3 mr-6">
                <p>Genre: {movie.gnre}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex mb-20">
                <ReactStars
                  count={5}
                  size={30}
                  isHalf={true}
                  value={rating}
                  onChange={handleRatingChange}
                  emptyIcon={<i className="far fa-star"></i>}
                  halfIcon={<i className="fa fa-star-half-alt"></i>}
                  fullIcon={<i className="fa fa-star"></i>}
                  activeColor="#ffd700"
                />
                <button
                  className="rounded bg-green-500 text-white px-4 py-2 ml-3"
                  onClick={saveRating}
                >
                  Save Rating
                </button>
              </div>
              {/* Review area */}
              <div className="text-right mr-7">
                <textarea
                  className="w-full h-20 p-2 border border-gray-300 rounded text-black"
                  placeholder="Write your review here..."
                  value={review}
                  onChange={handleReviewChange}
                />
                {editingReviewIndex !== -1 ? (
                  <div>
                    <button
                      className="rounded bg-blue-500 text-white px-4 py-2 mt-3 mr-2"
                      onClick={saveReview}
                    >
                      Update Review
                    </button>
                    <button
                      className="rounded bg-gray-500 text-white px-4 py-2 mt-3"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="rounded bg-blue-500 text-white px-4 py-2 mt-3"
                    onClick={saveReview}
                  >
                    Save Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
