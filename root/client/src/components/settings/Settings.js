import React, { useContext, useState } from 'react';
import { ThemeContext } from '../common/ThemeProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faUser } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { faInfo } from '@fortawesome/free-solid-svg-icons';

const SettingsPage = () => {
    const [showModal, setShowModal] = useState(false);
    const { theme, setTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }

    const logout = () => {
        localStorage.removeItem("accessToken")
        toast.info("Logged out successfully 😔", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            theme: localStorage.getItem("theme"),
          });
        navigate("/auth/login")
    }

    const toggleModal = () => {
        if(showModal === true) {
            setShowModal(false);
        } else {
            setShowModal(true);
        }
    }

    function About() {
        return(
            <>
            <div
            id="default-modal"
            tabindex="-1"
            aria-hidden="true"
            class="overflow-y-auto bg-black bg-opacity-10 dark:bg-opacity-50 overflow-x-hidden fixed z-50 flex justify-center items-center w-full md:inset-0 min-h-full"
            >
            <div class="p-4 max-w-2xl">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    About blunder.io
                </h3>
                <button
                    type="button"
                    class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="default-modal"
                    onClick={toggleModal}
                >
                    <svg
                    class="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                    >
                    <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
                </div>

                <div class="p-4 md:p-5 space-y-4">
                    <p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>
                        <span className='text-black font-semibold dark:text-white'>Contact</span><br />
                        If you have any questions or other requests you can contact us via
                        <a href='mailto:info@blunderio.xyz' target='_blank' className='text-blue-500 dark:text-blue-400' rel='noreferrer'> Email</a> or on our <a href='https://discord.gg/b6JSGwUwh2' target='_blank' className='text-blue-500 dark:text-blue-400' rel='noreferrer'>Discord server</a>.
                    </p>

                    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        <span className='text-black font-semibold dark:text-white'>Team</span><br />
                        <a href='https://github.com/elRatto21' target='_blank' className='text-blue-500 dark:text-blue-400' rel='noreferrer'>Niklas Trapp</a> - Fullstack
                    </p>

                    <p className='text-base leading-relaxed text-gray-500 dark:text-gray-400'>
                        <span className='text-black font-semibold dark:text-white'>History</span><br />
                        <ol class="mt-1 ml-1 relative border-s border-gray-200 dark:border-gray-700">                  
                            <li class="mb-5 ms-4">
                                <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                                <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-400">November 2023</time>
                                <h3 class="text-md font-semibold text-gray-700 dark:text-white">First Beta Release</h3>
                                <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">After a long break from development, Beta 1.0 is officially released and blunder.io is now publicly accessible.</p>
                            </li>
                            <li class="mb-5 ms-4">
                                <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                                <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-400">July 2023</time>
                                <h3 class="text-md font-semibold text-gray-700 dark:text-white">Start of development</h3>
                                <p class="text-base font-normal text-gray-500 dark:text-gray-400">The development of blunder.io has officially started. We have a lot of cool ideas and are excited for the future!</p>
                            </li>
                        </ol>
                    </p>   

                <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    <span className='text-black font-semibold dark:text-white'>Metadata</span><br />
                    Version 1.1 Beta (24.01.2024)<br />
                    <a href='https://github.com/elRatto21/blunder.io' target='_blank' className='text-blue-500 dark:text-blue-400' rel='noreferrer'>Sourcecode</a>
                </p>
                </div>
            </div>
            </div>
        </div>
        </>
        )
}

    return (
        <div className={`min-h-screen flex flex-col items-center pt-24 md:pt-0 md:justify-center py-5 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
           {showModal === true ? (About()) : null}
            <div className="rounded-md flex items-center flex-col shadow-[0_1px_5px_rgb(0,0,0,0.15)] w-full sm:max-w-md p-6 space-y-4 bg-white dark:bg-gray-700">
                <h1 className="text-2xl font-bold text-center dark:text-white">Settings</h1>
                <div className='w-5/6'>
                <div onClick={toggleTheme} className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-600 rounded-sm">
                    <p className="font-medium dark:text-white">Dark mode</p>
                    <div>
                            {theme === 'dark' ? (
                                <FontAwesomeIcon icon={faSun} className="h-5 w-5 text-yellow-500" />
                            ) : (
                                <FontAwesomeIcon icon={faMoon} className="h-5 w-5 text-gray-500" />
                            )}
                    </div>
                </div>
                <div onClick={logout} className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-600 rounded-sm">
                    <p className='font-medium dark:text-white'>Log out</p>
                        <div>
                                <FontAwesomeIcon icon={faUser} className='h-5 w-5 text-blue-500' />
                        </div>
                    </div>
                    <div onClick={toggleModal} className="flex justify-between p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-600 rounded-sm">
                    <p className='font-medium dark:text-white'>About blunder.io</p>
                        <div>
                                <FontAwesomeIcon icon={faInfo} className='h-5 w-5 text-blue-500' />
                        </div>
                    </div>
                    </div>
            </div>
        </div>
    )
}

export default SettingsPage;
