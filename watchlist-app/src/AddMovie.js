import axios from "axios";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "./Header";

export default function AddMovie() {
  const [user, setUser] = useState({});
  const [attachment, setAttachment] = useState();
  const [gnre, setGnre] = useState([]);
  const [showGnre, setShowGnre] = useState(false);
  const Navigate=useNavigate();

  const allgnre = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Science Fiction ",
    "Romance",
    "Thriller",
    "Fantasy",
    "Documentary",
    "Animated",
  ];

  const inputHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleGnresChange = (e) => {
    const value = e.target.value;
    if (gnre.includes(value)) {
      setGnre(gnre.filter((gnres) => gnres !== value));
    } else {
      setGnre([...gnre, value]);
    }
  };

  const toggleGnre = () => {
    setShowGnre((prevShowGnre) => !prevShowGnre);
  };

  const uploadImage = (e) => {
    setAttachment(e.target.files[0]);
  };

  const dataSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", user.title);
    formData.append("description", user.description);
    formData.append("reYear", user.reYear);
    formData.append("gnre", gnre.join(', '));
    formData.append("movImg", attachment);

    axios.post('http://localhost:1234/addMovie', formData)
        .then(res => {
            alert(res.data.msg);
            setUser({});
        setAttachment(null);
        setGnre([]);
        Navigate('/')
        }).catch(err => {
            alert(err.response.data.error);
        });
};

  return (
    <div>
      <Header/>
      <div
        className="flex justify-center items-center min-h-screen mt-[-10vh]"
      >
        <div className="border border-black p-4 rounded-md w-full max-w-md mx-2 bg-gray-200 rounded-md p-4">
          <h4 className="mb-3 text-2xl md:text-3xl">Add Movie</h4>
          <form className="flex flex-col items-center " onSubmit={dataSubmit}>
            <div className="mb-4 w-full">
              <input
                className="form-input w-full rounded-md border border-black px-3 py-1"
                type="text"
                placeholder="Enter Movie Title"
                name="title"
                value={user.title || ""}
                onChange={inputHandler}
              />
            </div>
            <div className="mb-4 w-full">
              <textarea
                rows={5}
                cols={50}
                className="form-input w-full rounded-md border border-black px-3 py-1"
                placeholder="Description"
                name="description"
                value={user.description || ""}
                onChange={inputHandler}
              >
              </textarea>
            </div>
            <div className="mb-4 w-full">
              <input
                className="form-input w-full rounded-md border border-black px-3 py-1"
                type="number"
                placeholder="Release Year"
                name="reYear"
                value={user.reYear || ""}
                onChange={inputHandler}
              />
            </div>

            <div className="mb-4 w-full relative">
              <input
                className="form-input w-full rounded-md border border-black px-3 py-1"
                type="text"
                placeholder="Type of Movie"
                name="gnre"
                value={gnre.join(", ")}
                onClick={toggleGnre}
                readOnly
              />
              {showGnre && (
                <div className="absolute top-full left-0 w-full bg-white border border-black rounded-md mt-1 p-2 z-10">
                  {allgnre.map((gnres) => (
                    <div key={gnres} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        id={gnres}
                        value={gnres}
                        checked={gnre.includes(gnres)}
                        onChange={handleGnresChange}
                      />
                      <label htmlFor={gnres} className="ml-2">
                        {gnres}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mb-4 w-full">
              <label className="block mb-2">Movie Image</label>
              <input
                className="form-input w-full rounded-md border border-black px-3 py-1 bg-white"
                type="file"
                name="movImg"
                onChange={uploadImage}
              />
            </div>

            <div className="flex justify-center items-center mb-4">
              <button className="bg-red-300 border border-black py-2 px-4 text-lg rounded-2xl">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
