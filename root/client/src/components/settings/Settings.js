import React, { useContext } from 'react';
import { ThemeContext } from '../common/ThemeProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faUser } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const SettingsPage = () => {
    const { theme, setTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }

    const logout = () => {
        localStorage.removeItem("accessToken")

        toast.success("See you next time 🥺", {
            position: "top-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            theme: "light",
          });

        navigate("/auth/login")
    }

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center py-5 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="rounded-md shadow-[0_1px_5px_rgb(0,0,0,0.15)] w-full sm:max-w-md p-6 space-y-4 bg-white dark:bg-gray-700">
                <h1 className="text-2xl font-bold text-center dark:text-white">Settings</h1>
                <div className="flex items-center justify-between pt-6">
                    <p className="font-medium dark:text-white">Dark mode</p>
                    <div>
                        <button onClick={toggleTheme} className="focus:outline-none">
                            {theme === 'dark' ? (
                                <FontAwesomeIcon icon={faSun} className="h-5 w-5 text-yellow-500" />
                            ) : (
                                <FontAwesomeIcon icon={faMoon} className="h-5 w-5 text-gray-500" />
                            )}
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-between pt-6">
                    <p className='font-medium dark:text-white'>Log out</p>
                        <div>
                            <button onClick={logout} className="focus:outline-none">
                                <FontAwesomeIcon icon={faUser} className='h-5 w-5 text-blue-500' />
                            </button>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default SettingsPage;
