import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChess } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
    return (
        <div className="dark:bg-gray-700 pb-4 dark:pb-0 fixed top-0 left-0 right-0 z-10">
            <nav className="bg-white dark:bg-gray-700 shadow-lg dark:shadow-[0_1px_5px_rgb(0,0,0,0)]">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <a href="/"><FontAwesomeIcon icon={faChess} className="h-6 w-6 text-blue-600 dark:text-white" /></a>
                            </div>
                            <div className="block">
                                <div className="md:ml-10 ml-5 flex items-baseline md:space-x-4">
                                    <div className="relative group">
                                        <a href="/" className="text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                            Play
                                        </a>
                                        <div className="absolute left-0 w-fit mt-2 origin-top rounded-md shadow-lg bg-white dark:bg-gray-800 z-10 hidden group-hover:block -translate-y-2">
                                            <div className="py-1">
                                                <a href="/online" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white">Online</a>
                                                <a href="/offline" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white">Offline</a>
                                                <a href="/tactics" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white">Tactics</a>
                                            </div>
                                        </div>
                                    </div>
                                    <a href="/friends" className="text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">Friends</a>
                                    <a href="/shop" className="text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">Shop</a>
                                    <a href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">Profile</a>
                                    <a href="/settings" className="text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">Settings</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
