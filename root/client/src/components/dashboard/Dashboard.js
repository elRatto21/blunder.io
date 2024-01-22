import RecentMatches from "../common/RecentMatches";
import GlobalChat from "./GlobalChat";
import PlayPreview from "./PlayPreview";

function Dashboard() {
  return (
    <div className="bg-white dark:bg-gray-800 md:min-h-screen pt-24 flex justify-center pb-6">
      <main className="w-full hidden md:w-5/6 md:grid grid-cols-5 gap-8">

          <div className="w-4/5 row-start-1 place-self-center"><PlayPreview title="Puzzles" url="/tactics" fen="r4rk1/1q3ppp/p2R4/1p2B3/4b3/7P/PP2QPP1/2R3K1 b - - 0 20" /></div>

          <div className="w-4/5 row-start-1 place-self-center"><PlayPreview title="Play online" url="/online" fen="r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3"/></div>

          <div className="w-4/5 row-start-1 place-self-center"><PlayPreview title="Play offline" url="/offline" /></div>

          <div className="w-full col-span-3 row-span-2 col-start-1 row-start-2 self-start">
            <RecentMatches />
          </div>

          <div className="w-full col-span-2 row-span-4 col-start-4 row-start-1">
            <GlobalChat />
          </div>
      </main>

      <main className="w-11/12 md:hidden grid grid-cols-3 gap-4">

          <div className="w-4/5 row-start-1 place-self-center"><PlayPreview title="Puzzles" url="/tactics" fen="r4rk1/1q3ppp/p2R4/1p2B3/4b3/7P/PP2QPP1/2R3K1 b - - 0 20" /></div>

          <div className="w-4/5 row-start-1 place-self-center"><PlayPreview title="Online" url="/online" fen="r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3"/></div>

          <div className="w-4/5 row-start-1 place-self-center"><PlayPreview title="Offline" url="/offline" /></div>

          <div className="w-full col-span-3 row-span-1 col-start-1 row-start-3 self-start">
            <RecentMatches />
          </div>

          <div className="w-full col-span-3 row-span-1 col-start-1 row-start-2">
            <GlobalChat />
          </div>
      </main>
    </div>
  );
}

export default Dashboard;
