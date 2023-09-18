import axios from 'axios';
import React, { useState } from 'react';


function OnlinePlayButton() {
  const [timeInput, setTimeInput] = useState('Bullet');

  async function createRoom() {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:8080/api/game/join/' + timeInput.charAt(0).toUpperCase() + timeInput.slice(1),
      headers: { 
        'Authorization': 'Bearer ' + localStorage.getItem("accessToken")
      }
    };
    
    axios.request(config)
    .then((response) => {
      window.location.href = "/online/" + response.data
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const handleInputChange = (event) => {
    setTimeInput(event.target.value)
  }

  return (
    <div className="flex items-end space-x-4 w-full">
      <div className="flex flex-col">
        <label
          htmlFor="game-time"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Game time
        </label>
        <select
          id="game-time"
          name="game-time"
          className="mt-1 w-full py-2 px-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={timeInput}
          onChange={handleInputChange}
        >
          <option>Bullet</option>
          <option>Blitz</option>
          <option>Rapid</option>
        </select>
      </div>
      <button onClick={createRoom} className="flex-grow py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:hover:bg-gray-600">
        Play
      </button>
    </div>
  );
}

export default OnlinePlayButton;
