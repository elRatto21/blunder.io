import React from 'react';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-600 dark:text-white">
                        Oops
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                        The page you are looking for does not exist or has been moved.
                    </p>
                </div>
                <div className="mt-6">
                    <a
                        href="/"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:hover:bg-gray-600"
                    >
                        Go to home page
                    </a>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
