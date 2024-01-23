import { Chessboard } from "react-chessboard";
import { ThreeDots } from "react-loader-spinner";

function OnlineSearching() {
  return (
    <div className="dark:bg-gray-800 flex flex-col md:flex-row pt-24 md:pt-16 items-center md:items-start gap-6 md:gap-0 md:min-h-screen dark:text-white">
      <div id="board" className="md:w-2/5 w-5/6 md:p-8 p-4">
        <Chessboard
          id="ClickToMove"
          boardOrientation="white"
          animationDuration={200}
          arePiecesDraggable={false}
          position="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          customBoardStyle={{
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
          }}
        />
      </div>
      <div className="col-start-3 flex dark:bg-gray-700 justify-center items-center m-auto flex-col rounded-lg shadow-[0_1px_5px_rgb(0,0,0,0.15)] dark:shadow-[0_1px_5px_rgb(0,0,0,0.4)] h-fit p-6">
        <div className="text-2xl font-semibold">Searching for an opponent</div>
        <ThreeDots
          height="50"
          width="50"
          radius="9"
          color="#2563eb"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
        />
      </div>
    </div>
  );
}

export default OnlineSearching;
