import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";

const GameRooms = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setRooms([])
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:8080/api/game/stats",
      headers: {
        Authorization:
          "Bearer " + localStorage.getItem("accessToken"),
      },
    };
    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setRooms(response.data)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-[0_1px_5px_rgb(0,0,0,0.15)] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-blue-600 dark:text-white">
          Active Game Rooms
        </h2>
        <button
          onClick={getData}
          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-gray-200 active:text-blue-900"
        >
          <FontAwesomeIcon icon={faSyncAlt} className="h-5 w-5" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="text-left font-bold text-gray-500 dark:text-gray-300">
            <tr>
              <th className="pb-2">Name</th>
              <th className="pb-2">Players</th>
              <th className="pb-2">Game Mode</th>
              <th className="pb-2">Join</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="text-gray-700 dark:text-gray-300">
                <td className="py-2">{room.id}</td>
                <td className="py-2">{room.players}/2</td>
                <td className="py-2">{room.time.charAt(0).toUpperCase()}{room.time.slice(1)}</td>
                <td className="py-2">
                  {room.players < 2 ? (
                    <Link
                      to={`/online/${room.id}`}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded font-semibold"
                    >
                      Join
                    </Link>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GameRooms;
