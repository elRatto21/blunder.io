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

const GamePage = () => {
  const { roomId } = useParams();
  const [roomFull, setRoomFull] = useState(false);
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState("");
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [playerSide, setPlayerSide] = useState("white");
  const [mateSquare, setMateSquare] = useState({});
  const [gameOverMessage, setGameOverMessage] = useState();

  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);
  const timer = useRef(null);
  const [turnColor, setTurnColor] = useState("");

  useEffect(() => {
    socket.emit("join-room", roomId);

    socket.on("room-stats", (full) => {
      setRoomFull(full);
    });

    socket.on("side", (side) => {
      setPlayerSide(side);
    });

    socket.on("match-move", (fen) => {
      setGame(new Chess(fen));
      setMoveFrom("");
      setOptionSquares({});
    });

    socket.on("match-end", (fen) => {
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
    });

    socket.on("match-abort", () => {
      alert("Player disconnected. Aborting match");
      setTimeout(() => {
        window.location.href = "/online";
      }, 2000);
    });
  }, [roomId]);

  useEffect(() => {
    if (
      game.fen() !== "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    ) {
      if (game.turn() === "w") {
        timer.current = setInterval(() => {
          setWhiteTime((time) => time - 1);
        }, 1000);
      } else {
        timer.current = setInterval(() => {
          setBlackTime((time) => time - 1);
        }, 1000);
      }
    }
    return () => clearInterval(timer.current);
  }, [game]);

  useEffect(() => {
    if (whiteTime === 0 && playerSide === "black") {
      clearInterval(timer.current);
      socket.emit("match-end", roomId + ";" + game.fen());
    } else if (blackTime === 0 && playerSide === "white") {
      socket.emit("match-end", roomId + ";" + game.fen());
      clearInterval(timer.current);
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
        setGameOverMessage("You won by checkmate!");
        socket.emit("match-end", roomId + ";" + tempGame.fen());
        let side = "w";
        if (game.turn() === "w") {
          side = "b";
        }
        const kingPos = findKing(game, side);
        const color = "rgba(255, 0, 0, 0.6)";
        setMateSquare({
          ...mateSquare,
          [kingPos]:
            mateSquare[kingPos] && mateSquare[kingPos].backgroundColor === color
              ? undefined
              : { backgroundColor: color, borderRadius: "50%" },
        });
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

  return (
    <>
      {roomFull === false ? (
        <OnlineSearching />
      ) : (
        <div className="bg-white dark:bg-gray-800 flex flex-col md:flex-row min-h-screen pt-16 justify-between px-16">
          <div className="col-start-4 pb-20 flex flex-col justify-center items-start gap-64 text-3xl font-semibold">
            <div
              className="shadow-[0_1px_5px_rgb(0,0,0,0.15)] w-2/5 p-6 rounded-lg flex flex-row justify-center items-center"
              style={{ color: game.turn() === "b" ? "red" : "black" }}
            >
              <FontAwesomeIcon icon={faClock} />
              {playerSide === 'black' ? (
                <span className="ml-3">
                {Math.floor(whiteTime / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(whiteTime % 60).toString().padStart(2, "0")}
              </span>
              ) : (
                <span className="ml-3">
                {Math.floor(blackTime / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(blackTime % 60).toString().padStart(2, "0")}
              </span>
              )}
            </div>
            <div
              className="shadow-[0_1px_5px_rgb(0,0,0,0.15)] w-2/5 p-6 rounded-lg flex flex-row justify-center items-center"
              style={{ color: game.turn() === "w" ? "red" : "black" }}
            >
              <FontAwesomeIcon icon={faClock} />
              {playerSide === 'white' ? (
                <span className="ml-3">
                {Math.floor(whiteTime / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(whiteTime % 60).toString().padStart(2, "0")}
              </span>
              ) : (
                <span className="ml-3">
                {Math.floor(blackTime / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(blackTime % 60).toString().padStart(2, "0")}
              </span>
              )} 
            </div>
          </div>
          {gameOverMessage && (
            <div className="flex flex-col justify-center">
              <div>{gameOverMessage}</div>
              <button
                onClick={backHome}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                Return to home
              </button>
            </div>
          )}
          <div id="board" className="w-1/2 p-8 xl:w-2/5">
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
          <div className="h-96 w-1/3">
            <OnlineGameChat />
          </div>
        </div>
      )}
    </>
  );
};

export default GamePage;
