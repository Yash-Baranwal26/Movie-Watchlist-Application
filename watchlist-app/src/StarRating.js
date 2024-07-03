import { useState, useEffect } from "react";
import { Rating } from "react-simple-star-rating";

export default function StarRating({ movieId }) {
  const [tempRating, setTempRating] = useState(0);

  useEffect(() => {
    // Load rating from local storage when the component mounts
    const savedRating = localStorage.getItem(`rating-${movieId}`);
    if (savedRating) {
      setTempRating(parseInt(savedRating));
    }
  }, [movieId]);

  const handleRating = (rate) => {
    setTempRating(rate);
  };

  const saveRating = () => {
    localStorage.setItem(`rating-${movieId}`, tempRating);
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <Rating
        onClick={handleRating}
        ratingValue={tempRating} // rating value between 0 and 100
        size={30}
        transition
        fillColor="gold"
        emptyColor="gray"
        className="foo" // Will remove the inline style if applied
      />
      <button
        className="rounded bg-green-500 text-white px-4 py-2 mt-3"
        onClick={saveRating}
      >
        Save Rating
      </button>
    </div>
  );
}
