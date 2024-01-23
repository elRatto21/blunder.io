import React, { useState, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import OnlineSearching from "./OnlineSearching";
import { useEffect } from "react";
import socket from "../../../services/socket";
import { useParams } from "react-router-dom";
import OnlineGameChat from "../online/OnlineGameChat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const GamePage = () => {
  const { roomId } = useParams();
  const [roomFull, setRoomFull] = useState(false);
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState("");
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [playerSide, setPlayerSide] = useState("white");
  const [mateSquare, setMateSquare] = useState({});
  const [gameOverMessage, setGameOverMessage] = useState("");

  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);
  const timer = useRef(null);
  const timer2 = useRef(null);
  const [timerInterval, setTimerInterval] = useState(1000);
  const [turnColor, setTurnColor] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: process.env.REACT_APP_API + "/api/game/" + roomId + "/stats",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("accessToken"),
      },
    };

    axios
      .request(config)
      .then(() => {
        socket.emit("join-room", roomId);
      })
      .catch(function (error) {
        switch (error.response.status) {
          case 403:
            toast.warn("Not allowed to join an ongoing match.", {
              position: "top-center",
              autoClose: 2500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              theme: "colored"
            });
            setTimeout(() => {
              navigate("/online")
            }, 2000);
            break;
          case 401:
            toast.warn("There is no match with this id.", {
              position: "top-center",
              autoClose: 2500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
              theme: "colored",
            })
            setTimeout(() => {
              navigate("/online")
            }, 2000);
            break;
          default:
            break;
        }
      });

    socket.on("room-stats", (full) => {
      setRoomFull(full);
    });

    socket.on("side", (side) => {
      let timeId = roomId.charAt(0) + roomId.charAt(1);
      let time;
      switch (timeId) {
        case "1B":
          time = 60;
          break;
        case "3B":
          time = 360;
          break;
        default:
          time = 600;
          break;
      }
      setWhiteTime(time);
      setBlackTime(time);
      setPlayerSide(side);
    });

    socket.on("match-move", (fen) => {
      setGame(new Chess(fen));
      setMoveFrom("");
      setOptionSquares({});
    });

    socket.on("match-mate", (fen) => {
      clearInterval(timer.current);
      clearInterval(timer2.current);
      setGame(new Chess(fen));
      setMoveFrom("");
      setOptionSquares({});
      setGameOverMessage("You lost by checkmate!");
      let side;
      if (game.turn() === "w") {
        side = "b";
      } else {
        side = "w";
      }
      const kingPos = findKing(game, side);
      const color = "rgba(255, 0, 0, 0.5)";
      setMateSquare({
        ...mateSquare,
        [kingPos]:
          mateSquare[kingPos] && mateSquare[kingPos].backgroundColor === color
            ? undefined
            : { backgroundColor: color, borderRadius: "50%" },
      });
      setTimerInterval(999999999999999);
    });

    socket.on("match-draw", (fen) => {
      clearInterval(timer.current);
      clearInterval(timer2.current);
      setGame(new Chess(fen));
      setMoveFrom("");
      setOptionSquares({});
      setGameOverMessage("Draw by stalemate");
      setTimerInterval(999999999999999);
    });

    socket.on("match-time", (fen) => {
      setOptionSquares({});
      setGameOverMessage("You lost by time!");
    });

    socket.on("match-abort", () => {
      toast.warn("Player disconnected, aborting match", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
      });
      setTimeout(() => {
        navigate("/online")
      }, 3000);
    });
  }, [roomId]);

  useEffect(() => {
    if (
      game.fen() !== "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    ) {
      if (game.turn() === "w") {
        timer.current = setInterval(() => {
          setWhiteTime((time) => time - 1);
        }, timerInterval);
      } else {
        timer2.current = setInterval(() => {
          setBlackTime((time) => time - 1);
        }, timerInterval);
      }
    }
    return () => {
      clearInterval(timer.current);
      clearInterval(timer2.current);
    };
  }, [game]);

  useEffect(() => {
    if (whiteTime === 0 || blackTime === 0) {
      clearInterval(timer.current);
      clearInterval(timer2.current);
    }
    if (whiteTime === 0 && playerSide === "black") {
      socket.emit("match-time", roomId + ";" + game.fen());
      setGameOverMessage("You won by time!");
    } else if (blackTime === 0 && playerSide === "white") {
      socket.emit("match-time", roomId + ";" + game.fen());
      setGameOverMessage("You won by time!");
    }
  }, [whiteTime, blackTime]);

  useEffect(() => {
    if (game.turn() === "w") {
      setTurnColor("White");
    } else {
      setTurnColor("Black");
    }
  }, [turnColor, game]);

  function getMoveOptions(square) {
    if (game.turn() !== playerSide[0]) {
      return false;
    }
    const moves = game.moves({
      square,
      verbose: true,
    });
    if (moves.length === 0) {
      return false;
    }

    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) &&
          game.get(move.to).color !== game.get(square).color
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
        borderRadius: "50%",
      };
      return move;
    });
    newSquares[square] = {
      background: "rgba(255, 255, 0, 0.4)",
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick(square) {
    if (game.turn() !== playerSide[0]) {
      return;
    } else if (gameOverMessage !== "") {
      return;
    }
    setRightClickedSquares({});

    function resetFirstMove(square) {
      const hasOptions = getMoveOptions(square);
      if (hasOptions) setMoveFrom(square);
    }

    if (!moveFrom) {
      resetFirstMove(square);
      return;
    }

    let move = null;
    let tempGame = null;
    try {
      tempGame = new Chess(game.fen());
      move = tempGame.move({
        from: moveFrom,
        to: square,
        promotion: "q",
      });
      if (tempGame.isGameOver()) {
        setTimerInterval(999999999999999);
        if (tempGame.isCheckmate) {
          setGameOverMessage("You won by checkmate!");
          socket.emit("match-mate", roomId + ";" + tempGame.fen());
          let side = "w";
          if (game.turn() === "w") {
            side = "b";
          }
          const kingPos = findKing(game, side);
          const color = "rgba(255, 0, 0, 0.6)";
          setMateSquare({
            ...mateSquare,
            [kingPos]:
              mateSquare[kingPos] &&
              mateSquare[kingPos].backgroundColor === color
                ? undefined
                : { backgroundColor: color, borderRadius: "50%" },
          });
        } else if (tempGame.isDraw()) {
          setGameOverMessage("Draw by stalemate");
          socket.emit("match-draw", roomId + ";" + tempGame.fen());
        }
      } else {
        socket.emit(
          "match-move",
          roomId + ";" + tempGame.fen() + ";" + move.lan
        );
      }
    } catch (error) {}

    if (move === null) {
      resetFirstMove(square);
      return;
    }

    setGame(tempGame);
    setMoveFrom("");
    setOptionSquares({});
  }

  function onSquareRightClick(square) {
    const color = "rgba(255, 0, 0, 0.3)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square].backgroundColor === color
          ? undefined
          : { backgroundColor: color },
    });
  }

  function findKing(gameInstance, color) {
    const squares = ["a", "b", "c", "d", "e", "f", "g", "h"];
    for (let i = 1; i <= 8; i++) {
      for (let square of squares) {
        let position = square + i;
        let piece = gameInstance.get(position);
        if (piece && piece.type === "k" && piece.color === color) {
          return position;
        }
      }
    }
    return null;
  }

  function backHome() {
    window.location.href = "../../";
  }

  function getColor() {
    if (localStorage.getItem("theme") === "dark") {
      return "white";
    }
    return "black";
  }

  return (
    <>
      {roomFull === false ? (
        <OnlineSearching />
      ) : (
        <div className="dark:bg-gray-800 flex justify-center">
          <div className="bg-white dark:bg-gray-800 w-full items-start xl:w-4/5 flex flex-col md:flex-row min-h-screen md:pt-16 pt-12 md:justify-between md:px-16 px-4">
            <div className="w-full md:w-fit md:col-start-4 pt-8 flex md:flex-col justify-between md:justify-center items-center md:gap-32 xl:gap-56 text-xl md:text-2xl xl:text-3xl font-semibold">
              {playerSide === "black" ? (
                <div
                  className="shadow-[0_1px_5px_rgb(0,0,0,0.15)] dark:shadow-[0_1px_5px_rgb(0,0,0,0.4)] dark:bg-gray-700 p-4 md:p-6 rounded-lg flex flex-row justify-center items-center"
                  style={{ color: game.turn() === "w" ? "red" : getColor() }}
                >
                  <FontAwesomeIcon icon={faClock} />
                  <span className="ml-3">
                    {Math.floor(whiteTime / 60)
                      .toString()
                      .padStart(2, "0")}
                    :{(whiteTime % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              ) : (
                <div
                  className="shadow-[0_1px_5px_rgb(0,0,0,0.15)] dark:shadow-[0_1px_5px_rgb(0,0,0,0.4)] dark:bg-gray-700 p-4 md:p-6 rounded-lg flex flex-row justify-center items-center"
                  style={{ color: game.turn() === "b" ? "red" : getColor() }}
                >
                  <FontAwesomeIcon icon={faClock} />
                  <span className="ml-3">
                    {Math.floor(blackTime / 60)
                      .toString()
                      .padStart(2, "0")}
                    :{(blackTime % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              )}

              {gameOverMessage && (
                <div className="flex flex-col justify-center text-xl xl:text-2xl dark:text-white text-center">
                  <div className="mb-2">{gameOverMessage}</div>
                  <button
                    onClick={backHome}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm xl:text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Return to home
                  </button>
                </div>
              )}

              {playerSide === "white" ? (
                <div
                  className="shadow-[0_1px_5px_rgb(0,0,0,0.15)] dark:shadow-[0_1px_5px_rgb(0,0,0,0.4)] dark:bg-gray-700 p-4 md:p-6 rounded-lg flex flex-row justify-center items-center"
                  style={{ color: game.turn() === "w" ? "red" : getColor() }}
                >
                  <FontAwesomeIcon icon={faClock} />
                  <span className="ml-3">
                    {Math.floor(whiteTime / 60)
                      .toString()
                      .padStart(2, "0")}
                    :{(whiteTime % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              ) : (
                <div
                  className="shadow-[0_1px_5px_rgb(0,0,0,0.15)] dark:bg-gray-700 dark:shadow-[0_1px_5px_rgb(0,0,0,0.4)] p-4 md:p-6 rounded-lg flex flex-row justify-center items-center"
                  style={{ color: game.turn() === "b" ? "red" : getColor() }}
                >
                  <FontAwesomeIcon icon={faClock} />
                  <span className="ml-3">
                    {Math.floor(blackTime / 60)
                      .toString()
                      .padStart(2, "0")}
                    :{(blackTime % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              )}
            </div>

            <div id="board" className="mt-8 md:mt-16 w-full md:w-1/2 md:first-letter:p-8">
              <Chessboard
                id="ClickToMove"
                boardOrientation={playerSide}
                animationDuration={200}
                arePiecesDraggable={false}
                position={game.fen()}
                onSquareClick={onSquareClick}
                onSquareRightClick={onSquareRightClick}
                customBoardStyle={{
                  borderRadius: "4px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                }}
                customSquareStyles={{
                  ...optionSquares,
                  ...rightClickedSquares,
                  ...mateSquare,
                }}
              />
            </div>
            <div className="mt-8 md:mt-0 md:h-96 md:w-1/3 w-full">
              <OnlineGameChat />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GamePage;
