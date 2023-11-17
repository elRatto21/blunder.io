import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        toast.success("Follow the link in the email to reset your password!", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            theme: localStorage.getItem("theme"),
          });
          navigate("/auth/login")
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center mt-6">
                    <h1 className="text-3xl font-extrabold text-blue-600 dark:text-white bg-blue-100 dark:bg-gray-700 py-2 px-3 rounded">blunder.io</h1>
                </div>
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-600 dark:text-white">
                        Forgot your password?
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md space-y-4">
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                            <div className="relative mt-1 rounded-md shadow-[0px_0px_5px_1px_#00000024]">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-gray-400"/>
                                </div>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-slate-700 rounded-md py-2"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a href="login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-gray-100">
                                Back to Sign in
                            </a>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            Reset password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
