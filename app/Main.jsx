"use client";
import React, {useState, useEffect } from 'react';
import axios from "axios";

const Main = () => {
  const [story, setStory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [options, setOptions] = useState(["Start"]);


  const handleButtonClick = async (option) => {
    const response = await axios({
        method: "post",
        url: "http://localhost:3000/api/continue",
        data: {
            buttonName: option,
        },
        headers: { "Content-Type" :"application/json"},
    })

    setStory(response.data.story);
    setImageUrl(response.data.imageUrl);
    setOptions(response.data.options)
  };

  useEffect(() => {
    handleButtonClick("start");
  },[]);

  return (
    <div className="App max-w-7xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Interactive Story Game
      </h1>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Generated"
          className="mx-auto mb-4 rounded shadow-lg"
        />
      )}
      <p className="text-lg mb-4">{story}</p>
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleButtonClick(option)}
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
        >
          {option}
        </button>
      ))}
    </div>
  )
}

export default Main