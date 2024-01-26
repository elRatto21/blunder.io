import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import axios from "axios";
import socket from "../../../services/socket";

function TacticsGamePage() {
  const [fen, setFen] = useState(null);
  const [moves, setMoves] = useState(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [game, setGame] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [solved, setSolved] = useState(false);
  const [moveFrom, setMoveFrom] = useState("");
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [successMessage, setSuccessMessage] = useState("Your turn");
  const [puzzleData, setPuzzleData] = useState({});
  const [playerSide, setPlayerSide] = useState("white");
  const [tries, setTries] = useState();
  const [showReset, setShowReset] = useState(false);

  const fetchPuzzle = async () => {
    const url = process.env.REACT_APP_API + "/api/puzzle";

    let accessToken = "Bearer " + localStorage.getItem("accessToken");
    let config = {
      method: "get",
      url: url,
      headers: {
        Authorization: accessToken,
      },
    };

    await axios.request(config).then((response) => {
      const puzzle = response.data;
      setFen(puzzle.fen);
      setMoves(puzzle.moves);
      setMoveIndex(0);
      setGame(new Chess(puzzle.fen));
      setCompleted(false);
      setPuzzleData(puzzle);
      setSuccessMessage("Your turn");
      setRightClickedSquares({});
      setTries(0);
      setSolved(false);

      if (puzzle.fen.split(" ")[1] === "w") {
        setPlayerSide("black");
      } else {
        setPlayerSide("white");
      }
    });
  };

  function resetPuzzle() {
    setShowReset(false);
    setFen(puzzleData.fen);
    setMoves(puzzleData.moves);
    setMoveIndex(0);
    setGame(new Chess(puzzleData.fen));
    setCompleted(false);
    setRightClickedSquares({});
    setTimeout(() => {
      setSuccessMessage("Your turn");
    }, 700);
  }

  useEffect(() => {
    fetchPuzzle();
  }, []);

  useEffect(() => {
    if (game && moves && playerSide && !completed && !showReset) {
      const opponentSide = playerSide === "white" ? "b" : "w";
      if (moveIndex < moves.length && game.turn() === opponentSide) {
        const move = moves[moveIndex];
        setFen(game.fen());
        setTimeout(() => {
          try {
            game.move({
              from: move.charAt(0) + move.charAt(1),
              to: move.charAt(2) + move.charAt(3),
              promotion: "q",
            });
          } catch (error) {}
          setFen(game.fen());
          setMoveIndex((prevMoveIndex) => prevMoveIndex + 1);
        }, 750);
      }
    }
    if (completed || showReset) {
      setFen(game.fen());
      try {
        game.move({
          from: "a2",
          to: "g5",
          promotion: "q",
        });
      } catch (error) {}
      setFen(game.fen());
    }
  }, [game, moveIndex, moves, playerSide, completed, showReset]);

  function getMoveOptions(square) {
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

  function newPuzzle() {
    setTries(0);
    setShowReset(false);
    fetchPuzzle();
  }

  function onSquareClick(square) {
    if (game.turn() === playerSide.charAt(0)) {
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
      } catch (error) {}

      if (move === null) {
        resetFirstMove(square);
        return;
      }

      setGame(tempGame);
      setMoveFrom("");
      setOptionSquares({});

      if (move) {
        const correctMove = moves[moveIndex];
        if (
          correctMove &&
          move.from === correctMove.charAt(0) + correctMove.charAt(1) &&
          move.to === correctMove.charAt(2) + correctMove.charAt(3)
        ) {
          setSuccessMessage("Best Move!");
          setMoveIndex((prevMoveIndex) => prevMoveIndex + 1);
          setFen(game.fen());
          if (moveIndex === moves.length - 1) {
            setFen(game.fen());
            setCompleted(true);
            setSolved(true);
            setSuccessMessage("Puzzle solved!");
            let elo = Math.floor(puzzleData.rating / 200);
            if(tries === 0) {
              socket.emit("puzzle-finish", elo);
            }
          }
        } else {
          setRightClickedSquares({
            ...rightClickedSquares,
            [square]: { backgroundColor: "rgba(255, 0, 0, 0.75)" },
          });
          setSuccessMessage("Wrong move");
          setTries((prevTries) => prevTries + 1);
          if (tries === 0 && !solved) {
            let elo = Math.floor((-20) + puzzleData.rating / 150);
            socket.emit("puzzle-finish", elo);
          }
          setShowReset(true);
        }
        setFen(game.fen());
      }
    }
  }

  function onSquareRightClick(square) {
    const color = "rgba(255, 0, 0, 0.5)";
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]:
        rightClickedSquares[square] &&
        rightClickedSquares[square].backgroundColor === color
          ? undefined
          : { backgroundColor: color },
    });
  }

  return (
    <div className="flex flex-col gap-8 pt-32 md:pt-0 md:gap-0 md:grid min-h-screen grid-cols-1 md:grid-cols-4 grid-rows-3 md:grid-rows-1 w-full md:justify-center items-center dark:bg-gray-800">
      <div className="w-full col-span-1 flex flex-col justify-center items-end"></div>
      <div className="w-full col-span-1 md:col-span-2 flex justify-center items-center">
        {fen && (
          <div className="md:w-2/3 w-5/6">
            <Chessboard
              id="ClickToMove"
              animationDuration={200}
              arePiecesDraggable={false}
              position={fen}
              boardOrientation={playerSide}
              onSquareClick={onSquareClick}
              onSquareRightClick={onSquareRightClick}
              customBoardStyle={{
                borderRadius: "4px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
              }}
              customSquareStyles={{
                ...optionSquares,
                ...rightClickedSquares,
              }}
            />
          </div>
        )}
      </div>

      <div className="md:col-start-4 col-span-1 w-full h-full flex flex-col justify-center items-center md:items-start">
        <div className="w-2/3 h-fit p-5 shadow-[0_1px_5px_rgb(0,0,0,0.15)] dark:shadow-[0_1px_5px_rgb(0,0,0,0.4)] gap-6 flex dark:bg-gray-700 dark:text-white justify-center items-center flex-col rounded-lg">
          <div className="text-2xl font-bold">{successMessage}</div>
          {completed || showReset ? (
            <div className="flex justify-center flex-col w-full items-center gap-4">
              {tries === 1 ? (
                <div>
                  {completed ? (
                  <span className="text-green-700 font-semibold">
                    +{Math.floor(puzzleData.rating / 200)} ELO
                  </span>
                ) : (
                  <span className="text-red-700 font-semibold">
                    {Math.floor((-20 + puzzleData.rating / 150)).toString()} Elo
                  </span>
                )}
                </div>
              ) : null}
              <button
                onClick={resetPuzzle}
                className="w-3/4 py-2 px-4 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-70 active:bg-blue-800"
              >
                Restart
              </button>
              <button
                onClick={newPuzzle}
                className="w-3/4 py-2 px-4 text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 active:bg-green-700"
              >
                Next
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default TacticsGamePage;
