import { useState, useEffect } from "react";
import FriendCard from "./FriendCard";
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faBomb, faClock, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { playerUsername } from "../../services/auth";

const FriendPage = () => {
    const [friendName, setFriendName] = useState("");
    const [showRemove, setShowRemove] = useState(false);
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [addFriendName, setAddFriendName] = useState('');
    const [showChallenge, setShowChallenge] = useState(false)
    const [selectedMode, setSelectedMode] = useState(null)
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        getFriends();
      }, []);

      const getFriends = () => {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: process.env.REACT_APP_API + "/api/friends" + playerUsername,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        };
    
        axios
          .request(config)
          .then((response) => {
            setFriends(response.data);
          })
          .catch((error) => {
          });
      };

    const ChallengeFriend = () => {
        function challenge() {
            if(selectedMode !== null) {
                let config = {
                    method: "post",
                    maxBodyLength: Infinity,
                    url: process.env.REACT_APP_API + "/api/friends/challenge/" + friendName + "/" + selectedMode,
                    headers: {
                      "Content-Type": "application/json",
                    },
                  };
                  axios
                    .request(config)
                    .then(() => {
                        toast.success('Successfully challenged ' + friendName + ' to a ' + selectedMode + ' match')
            setTimeout(() => {
                setShowChallenge(false)
            }, 100)
            setSelectedMode(null)
                    })
                    .catch(function () {
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
                      })
                    });
        } else {
            toast.warn('Please select a game mode')
        }
        }

        const handleModeChange = (event) => {
            setSelectedMode(event.target.value);
          };

        return(
            <div id="select-modal" tabindex="-1" aria-hidden="true" class="bg-black flex bg-opacity-10 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center w-full md:inset-0 h-screen">
    <div class="relative p-4 w-full max-w-md max-h-full mt-24 xl:mt-44">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Challenge <span className="font-bold">{friendName}</span>
                </h3>
                <button onClick={() => {
                    setShowChallenge(false)
                    setSelectedMode(null)
                    }} 
                    class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="select-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                </button>
            </div>
            <div class="p-4 md:p-5">
                <p class="text-gray-500 dark:text-gray-400 mb-4">Select the game mode</p>
                <ul class="space-y-4 mb-4">
                    <li>
                        <input type="radio" id="job-1" name="job" value="Bullet" class="hidden peer" onChange={handleModeChange} required />
                        <label for="job-1" className={`
                        inline-flex 
                        items-center 
                        justify-between 
                        w-full 
                        p-5 
                        bg-white border 
                        border-gray-200 
                        rounded-lg 
                        cursor-pointer 
                        dark:hover:text-gray-300 
                        dark:border-gray-500 
                        ${selectedMode === 'Bullet' ? "border-blue-600 text-blue-600 dark:text-blue-500 " : "text-gray-900"}
                        hover:bg-gray-100 
                        dark:text-white 
                        dark:bg-gray-600 
                        dark:hover:bg-gray-500`}>                         
                            <div class="block">
                                <div class="w-full text-lg font-semibold"><FontAwesomeIcon icon={faBomb} /> Bullet</div>
                                <div class="w-full text-gray-500 dark:text-gray-400">1+0 min</div>
                            </div>
                            <svg class="w-4 h-4 ms-3 rtl:rotate-180 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/></svg>
                        </label>
                    </li>
                    <li>
                        <input type="radio" id="job-2" name="job" value="Blitz" class="hidden peer" onChange={handleModeChange} />
                        <label for="job-2" className={`
                        inline-flex 
                        items-center 
                        justify-between 
                        w-full 
                        p-5 
                        bg-white border 
                        border-gray-200 
                        rounded-lg 
                        cursor-pointer 
                        dark:hover:text-gray-300 
                        dark:border-gray-500 
                        ${selectedMode === 'Blitz' ? "border-blue-600 text-blue-600 dark:text-blue-500 " : "text-gray-900"}
                        hover:bg-gray-100 
                        dark:text-white 
                        dark:bg-gray-600 
                        dark:hover:bg-gray-500`}>

                            <div class="block">
                                <div class="w-full text-lg font-semibold"><FontAwesomeIcon icon={faBolt} /> Blitz</div>
                                <div class="w-full text-gray-500 dark:text-gray-400">5+0 min</div>
                            </div>
                            <svg class="w-4 h-4 ms-3 rtl:rotate-180 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/></svg>
                        </label>
                    </li>
                    <li>
                        <input type="radio" id="job-3" name="job" value="Rapid" onChange={handleModeChange} class="hidden peer" />
                        <label for="job-3" className={`
                        inline-flex 
                        items-center 
                        justify-between 
                        w-full 
                        p-5 
                        bg-white border 
                        border-gray-200 
                        rounded-lg 
                        cursor-pointer 
                        dark:hover:text-gray-300 
                        dark:border-gray-500 
                        ${selectedMode === 'Rapid' ? "border-blue-600 text-blue-600 dark:text-blue-500 " : "text-gray-900"}
                        hover:bg-gray-100 
                        dark:text-white 
                        dark:bg-gray-600 
                        dark:hover:bg-gray-500`}>
                            <div class="block">
                                <div class="w-full text-lg font-semibold"><FontAwesomeIcon icon={faClock} /> Rapid</div>
                                <div class="w-full text-gray-500 dark:text-gray-400">10+0 min</div>
                            </div>
                            <svg class="w-4 h-4 ms-3 rtl:rotate-180 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/></svg>
                        </label>
                    </li>
                </ul>
                <button onClick={() => challenge()} class="text-white inline-flex w-full justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Challenge
                </button>
            </div>
        </div>
    </div>
</div> 
        )
    };

    const handleChallenge = (username) => {
        setFriendName(username)
        setShowChallenge(true)
    }

    const handleRemove = (username) => {
        setFriendName(username)
        setShowRemove(true)
    };

    const confirmRemove = () => {
        setShowRemove(false)
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: process.env.REACT_APP_API + "/api/friends/remove/" + friendName,
            headers: {
              "Content-Type": "application/json",
            },
          };
          axios
            .request(config)
            .then(() => {
                toast.success('Successfully removed ' + friendName + ' from your friends.');
            })
            .catch(function () {
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
              })
            });
    }

    const RemoveDialog = () => {
        return (
            <div id="popup-modal" tabindex="-1" class="bg-opacity-10 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen bg-black max-h-full">
            <div class="p-4 w-full flex justify-center items-start lg:mt-52 mt-32">
                <div class="relative lg:w-1/3 w-1/2 bg-white rounded-lg shadow dark:bg-gray-700">
                    <button onClick={() => setShowRemove(false)} type="button" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                    <div class="p-4 md:p-5 text-center">
                        <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                        </svg>
                        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to remove <b>{friendName}</b> from your friends?</h3>
                        <button onClick={() => confirmRemove()} data-modal-hide="popup-modal" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                            Yes, I'm sure
                        </button>
                        <button onClick={() => setShowRemove(false)} data-modal-hide="popup-modal" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                    </div>
                </div>
            </div>
            </div>
        )
    }

    const AddFriendDialog = () => {
        function addFriend() {

            let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: process.env.REACT_APP_API + "/api/friends/add/" + addFriendName,
                headers: {
                  "Content-Type": "application/json",
                },
              };
              axios
                .request(config)
                .then(() => {
                    toast.success('Friend request sent successfully')
                })
                .catch(function () {
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
                  })
                });
                setAddFriendName("")
            setShowAddFriend(false)
        };

       return(
        <div id="crud-modal" tabindex="-1" aria-hidden="true" class="bg-black bg-opacity-10 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center flex w-full md:inset-0 h-screen">
    <div class="relative p-4 w-1/2 xl:w-1/4 max-h-full mt-40 xl:mt-60">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Send new friend request
                </h3>
            </div>
            <div className="p-4">
                        <div className="flex flex-col gap-4">
                        <input type="username" 
                        name="name" 
                        autoFocus="autoFocus"
                        id="name" 
                        value={addFriendName}
                        onChange={(e) => setAddFriendName(e.target.value)}
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Username..."
                        required />

                    <div className="w-full flex gap-16 justify-between">

                    <button onClick={() => addFriend()} className=" text-white w-full justify-center inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <FontAwesomeIcon icon={faUserPlus} className="mr-1" /> Add friend</button>
                <button onClick={() => {
                    setShowAddFriend(false)
                    setAddFriendName('')
                }} className="text-white justify-center w-full inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Cancel
                </button>

                    </div>

                    </div>

                </div>
        </div>
    </div>
</div> 
       ) 
    }

    return(
        <>
        {showRemove === true && <RemoveDialog />}
        {showAddFriend === true && <AddFriendDialog />}
        {showChallenge === true && <ChallengeFriend />}
        <div className="mt-20">
            <div className="flex justify-center">
                <div className="mb-8 w-2/3 items-center flex items font-semibold justify-between text-3xl">
                    <div>Your friends</div>
                    <button onClick={() => setShowAddFriend(true)} className="text-base text-white bg-blue-600 hover:bg-blue-700 p-2 rounded-md mr-1"><FontAwesomeIcon icon={faUserPlus} /> Add friend</button>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="w-2/3 flex gap-8 flex-wrap">
                {friends.map((friend) => (
                    <FriendCard onShowChallenge={handleChallenge} onRemove={handleRemove} username={friend.name} online={friend.online} />
                ))}
                </div>
            </div>
        </div>
        </>
    )
}

export default FriendPage;