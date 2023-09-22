import React, { useEffect, useState } from "react";
import RecentMatches from "../common/RecentMatches";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faBomb,
  faBolt,
  faClock,
  faPuzzlePiece,
} from "@fortawesome/free-solid-svg-icons";
import { playerUsername } from "../../services/auth";

const ProfilePage = () => {
  const [infos, setInfos] = useState(null);

  const getInfos = async () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "http://localhost:8080/api/user/" + playerUsername,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        let userData = {
          username: response.data.username,
          bio: response.data.bio,
          matches: response.data.matches,
          wins: response.data.wins,
          losses: response.data.losses,
          draws: response.data.draws,
          category: {
            Bullet: {
              icon: faBomb,
              elo: response.data.bulletElo,
            },
            Blitz: {
              icon: faBolt,
              elo: response.data.blitzElo,
            },
            Rapid: {
              icon: faClock,
              elo: response.data.rapidElo,
            },
            Puzzle: {
              icon: faPuzzlePiece,
              elo: response.data.puzzleElo,
            },
          },
        };
        setInfos(userData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getInfos();
  }, []);

  return (
    <div className="h-3/4 bg-white dark:text-white dark:bg-gray-800 flex md:flex-row flex-col justify-center gap-6 p-8 pt-24">
      <div>
        {infos && (
          <div className="w-fit h-fit p-8 rounded-lg dark:bg-gray-700 shadow-[0_1px_5px_rgb(0,0,0,0.15)] flex flex-col items-center justify-start">
            <img
              className="w-32 h-32 rounded-full mb-4 bg-gray-100"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfcl5PMtio9Xhr0shasWnqRldXzbx0duvbhaRemQ_45UOMvoOko8hMHfrvtuOfw0a9Baw&usqp=CAU"
              alt="Profile"
              width="150px"
              height="150px"
            />
            <div className="font-medium text-3xl mb-1">{infos.username}</div>
            <div className="font-medium text-lg">{infos.bio}</div>
            <div className="flex flex-col justify-between dark:shadow-[0_1px_5px_rgb(0,0,0,0.3)] mb-8 mt-8 rounded-lg p-6 gap-4 text-xl text-center shadow-[0_1px_5px_rgb(0,0,0,0.15)]">
              <span className="font-semibold">{infos.matches} Matches</span>
              <span>{infos.wins} Wins</span>
              <span>{infos.draws} Draws</span>
              <span>{infos.losses} Losses</span>
            </div>
          </div>
        )}
      </div>
      <div className="h-full p-8 rounded-lg shadow-[0_1px_5px_rgb(0,0,0,0.15)] dark:bg-gray-700 flex-grow md:max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-7">Stats</h1>
        {infos && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            {Object.entries(infos.category).map(([key, category]) => (
              <div
                key={key}
                className="flex flex-col items-center dark:shadow-[0_1px_5px_rgb(0,0,0,0.3)] shadow-[0_1px_5px_rgb(0,0,0,0.15)] p-4 rounded-lg"
              >
                <FontAwesomeIcon
                  icon={category.icon}
                  className="w-8 h-8 text-blue-600"
                />
                <h2 className="text-xl font-bold my-4">{key}</h2>
                <div>{category.elo}</div>
              </div>
            ))}
          </div>
        )}
        <RecentMatches />
      </div>
    </div>
  );
};

export default ProfilePage;
