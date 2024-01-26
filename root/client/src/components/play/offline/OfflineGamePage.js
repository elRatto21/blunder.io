import React, { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

function OfflineGamePage() {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState("");
  const [rightClickedSquares, setRightClickedSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [mateSquare, setMateSquare] = useState({});
  const [mate, setMate] = useState("");
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);
  const timer = useRef(null);
  const [turnColor, setTurnColor] = useState("");

  useEffect(() => {
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        const kingPos = findKing(game, game.turn());
        const color = "rgba(255, 0, 0, 0.5)";
        setMateSquare({
          ...mateSquare,
          [kingPos]:
            mateSquare[kingPos] && mateSquare[kingPos].backgroundColor === color
              ? undefined
              : { backgroundColor: color, borderRadius: "50%" },
        });
        const winner = game.turn() === "w" ? "Black" : "White";
        setMate(`${winner} won by checkmate`);
      } else if (game.isStalemate()) {
        setMate("Draw due to stalemate");
      } else if (game.isDraw()) {
        setMate("Draw");
      } else {
        setMate("Game over");
      }
    }
  }, [game]);

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
    if (whiteTime === 0) {
      setMate("Black wins on time");
      clearInterval(timer.current);
    } else if (blackTime === 0) {
      setMate("White wins on time");
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

  function onSquareClick(square) {
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

    console.log(move);

    if (move === null) {
      resetFirstMove(square);
      return;
    }

    setGame(tempGame);
    setMoveFrom("");
    setOptionSquares({});
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

  function resetGame() {
    setGame(new Chess());
    setMate("");
    setMoveFrom("");
    setRightClickedSquares({});
    setOptionSquares({});
    setMateSquare({});
    setWhiteTime("600");
    setBlackTime("600");
  }

  function getColor() {
    if(localStorage.getItem("theme") === 'dark') {
      return 'white'
    }
    return 'black'
  }

  return (
    <div className="bg-white dark:bg-gray-800 min-h-screen">
    <div className="min-h-screen pt-16 flex flex-col justify-center items-center md:grid grid-cols-4 grid-rows-1 gap-0 dark:text-white">
      <div className="col-span-1 flex flex-col items-end md:pt-72 gap-4 md:gap-8">
        <div className="h-1/6 w-full md:w-11/12 shadow-[0_1px_5px_rgb(0,0,0,0.15)] dark:shadow-[0_1px_5px_rgb(0,0,0,0.4)] rounded-lg p-6 dark:bg-gray-700 font-semibold text-3xl flex justify-center items-center">
          {mate ? <div>{mate}!</div> : <div>{turnColor}'s turn</div>}
        </div>
        <button
          onClick={resetGame}
          className="w-full md:w-11/12 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-600 active:bg-blue-800"
        >
          Reset Game
        </button>
      </div>
      <div className="pt-10 md:pt-0 w-full col-span-2 flex justify-center items-center md:pb-20 pb-10">
        <div className="w-11/12 md:w-2/3 m-auto">
          <Chessboard
            id="ClickToMove"
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
      </div>
      <div className="col-start-4 pb-20 flex md:flex-col justify-between md:justify-center items-start md:gap-64 text-3xl font-semibold">
        <div
          className="shadow-[0_1px_5px_rgb(0,0,0,0.15)] dark:shadow-[0_1px_5px_rgb(0,0,0,0.4)] dark:bg-gray-700 w-2/5 p-6 rounded-lg flex flex-row justify-center items-center"
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
        <div
          className="shadow-[0_1px_5px_rgb(0,0,0,0.15)] w-2/5 p-6 dark:shadow-[0_1px_5px_rgb(0,0,0,0.4)] dark:bg-gray-700 rounded-lg flex flex-row justify-center items-center"
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
      </div>
    </div>
    </div>
  );
}

export default OfflineGamePage;
