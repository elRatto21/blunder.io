import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    if (username === "" || password === "") {
      toast.error("Inputs can't be empty", {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
      });
    } else {
      let data = JSON.stringify({
        username: username,
        password: password,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: process.env.REACT_APP_API + "/api/auth/signin",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      axios
        .request(config)
        .then((response) => {
          localStorage.setItem("accessToken", response.data.accessToken);
          window.location.href = "/"
        })
        .catch(function (error) {
          try {
            if (error.response.status === 404) {
              toast.error("Wrong username or password", {
                position: "top-center",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: "colored",
              });
              setUsername("");
              setPassword("");
            }
          } catch (error) {
            toast.error(
              "Server not reachable. Please contact us at info@blunderio.xyz",
              {
                position: "top-center",
                autoClose: 15000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                theme: localStorage.getItem("theme"),
              }
            );
          }
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center mt-6">
          <h1 className="text-3xl font-extrabold text-blue-600 dark:text-white bg-blue-100 dark:bg-gray-700 py-2 px-3 rounded">
            blunder.io
          </h1>
        </div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-600 dark:text-white">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6">
          <div className="rounded-md space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <div className="relative mt-1 rounded-md shadow-[0px_0px_5px_1px_#00000024]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="h-5 w-5 text-gray-400"
                  />
                </div>
                <input
                  id="username"
                  name="username"
                  type="username"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-slate-700 rounded-md py-2"
                  placeholder="Username"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="relative mt-1 rounded-md shadow-[0px_0px_5px_1px_#00000024]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="h-5 w-5 text-gray-400"
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-400 dark:border-slate-700 rounded-md py-2"
                  placeholder="********"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a
                href="forgot"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-gray-100"
              >
                Forgot your password?
              </a>
            </div>
            <div className="text-sm">
              <a
                href="register"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-gray-100"
              >
                Register an account
              </a>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
