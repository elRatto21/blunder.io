import { Chessboard } from "react-chessboard";

function PlayPreview({ title, url, fen }) {
  function handleClick() {
    window.location.href = url;
  }

  return (
     <div onClick={handleClick} className="cursor-pointer shadow-[0_1px_5px_rgb(0,0,0,0.15)] dark:shadow-[0_1px_5px_rgb(0,0,0,0.4)] dark:text-white dark:bg-gray-700 relative rounded-md">
      <Chessboard arePiecesDraggable={false} position={fen} />
      <div className="text-center p-1 font-semibold text-lg">{title}</div>
    </div>
  );
}

export default PlayPreview;
