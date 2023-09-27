import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { playerUsername } from "../../services/auth";
import axios from "axios";

const RecentMatches = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    getMatches();
  }, []);

  const getMatches = () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:8080/api/game/matches/" + playerUsername,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        setMatches(response.data);
      })
      .catch((error) => {
      });
  };

  const getElo = (match) => {
    if (match.winner === playerUsername) {
      if (playerUsername === match.white) {
        return "+" + match.whiteElo;
      } else {
        return "+" + match.blackElo;
      }
    } else {
      if (playerUsername === match.white) {
        return "-" + match.whiteElo;
      } else {
        return "-" + match.blackElo;
      }
    }
  };

  const parseDate = (match) => {
    let date = match.date;
    return (
      date.charAt(8) +
      date.charAt(9) +
      "/" +
      date.charAt(5) +
      date.charAt(6) +
      "/" +
      date.charAt(0) +
      date.charAt(1) +
      date.charAt(2) +
      date.charAt(3) +
      " " +
      date.charAt(11) +
      date.charAt(12) +
      date.charAt(13) +
      date.charAt(14) +
      date.charAt(15)
    );
  };

  return (
    <div className="bg-white dark:bg-gray-700 shadow-[0_1px_5px_rgb(0,0,0,0.15)] dark:shadow-[0_1px_5px_rgb(0,0,0,0.4)] rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-blue-600 dark:text-white">
          Recent Matches
        </h2>
        <button
          onClick={getMatches}
          className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-gray-200 active:text-blue-900"
        >
          <FontAwesomeIcon icon={faSyncAlt} className="h-5 w-5" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-3/4">
          <thead className="text-left font-bold text-gray-500 dark:text-gray-300">
            <tr>
              <th className="pb-2">Date</th>
              <th className="pb-2">Time</th>
              <th className="pb-2">Result</th>
              <th className="pb-2">Elo</th>
              <th className="pb-2">White</th>
              <th className="pb-2">Black</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.matchId} className="text-gray-700 dark:text-gray-300">
                <td className="py-2">{parseDate(match)}</td>
                <td className="py-2">{match.time}</td>
                <td className="py-2">
                  {match.winner === playerUsername ? (
                    <span className="text-green-600 font-semibold">Win</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Loss</span>
                  )}
                </td>
                <td>{getElo(match)}</td>
                <td className="py-2">{match.white}</td>
                <td className="py-2">{match.black}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentMatches;
