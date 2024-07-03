import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';

export default function UpdateMovieDetail() {
  const { id } = useParams(); 
  const [user, setUser] = useState({
    title: '',
    description: '',
    reYear: '',
  });
  const Navigate=useNavigate();


  useEffect(() => {
    axios.get(`http://localhost:1234/fetchMovieData/${id}`)
      .then(res => {
        console.log(res.data);
        const { title, description, reYear } = res.data;
        setUser({
          title,
          description,
          reYear,
        });
      }).catch(err => {
        console.log(err);
      });
  }, [id]);

  const inputHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

const dataSubmit = (e) => {
    e.preventDefault();
  axios.put(`http://localhost:1234/updateMovieDetail/${id}`, {
    title: user.title,
    description: user.description,
    reYear: user.reYear
  })
  .then(res => {
    alert(res.data.msg);
    setUser({ title: '', description: '', reYear: '' });
    Navigate(-1)
  })
  .catch(err => {
    alert(err.response.data.error);
  });
  };

  return (
    <div>
      <div
        className="flex justify-center items-center min-h-screen mt-[-10vh]"
      >
        <div className="border border-black p-4 rounded-md w-full max-w-md mx-2 bg-gray-200 rounded-md p-4">
          <h1>Update Movie Details</h1>
          <form className="flex flex-col items-center " onSubmit={dataSubmit}>
            <div className="mb-4 w-full">
              <input
                className="form-input w-full rounded-md border border-black px-3 py-1"
                type="text"
                placeholder="Enter Movie Title"
                name="title"
                value={user.title}
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
                value={user.description}
                onChange={inputHandler}
              />
            </div>
            
            <div className="mb-4 w-full">
              <input
                className="form-input w-full rounded-md border border-black px-3 py-1"
                type="number"
                placeholder="Release Year"
                name="reYear"
                value={user.reYear}
                onChange={inputHandler}
              />
            </div>

            <div className="flex justify-center items-center mb-4">
              <button className="bg-red-300 border border-black py-2 px-4 text-lg rounded-2xl">
                Update Movie
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
