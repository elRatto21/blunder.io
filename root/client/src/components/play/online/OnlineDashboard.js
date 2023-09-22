import React from 'react';
import GameRooms from './GameRooms';
import OnlinePlayButton from './OnlinePlayButton';

function OnlineDashboard() {
    return (
        <div className="bg-white dark:bg-gray-800 min-h-screen pt-16">
            <main className="flex flex-col md:flex-row justify-around items-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full md:w-1/2 space-y-8">
                    <OnlinePlayButton />
                    <GameRooms />
                </div>
            </main>
        </div>
    );
}

export default OnlineDashboard;
