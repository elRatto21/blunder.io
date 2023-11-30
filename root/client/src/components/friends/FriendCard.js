import { faComments } from "@fortawesome/free-regular-svg-icons";
import { faChess, faUserMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const FriendCard = ({username, online, onShowChallenge, onRemove}) => {
    const navigate = useNavigate();

    function handleChat() {
        navigate("chat/" + username.toLowerCase())
    }

    return (
        <>
            <div className="p-3 shadow-[0_1px_5px_rgb(0,0,0,0.15)] w-44 rounded-lg flex flex-col items-center">
                <img
                className="w-20 h-20 rounded-full bg-gray-100"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfcl5PMtio9Xhr0shasWnqRldXzbx0duvbhaRemQ_45UOMvoOko8hMHfrvtuOfw0a9Baw&usqp=CAU"
                alt="Profile"
                />
                <div className="mt-2">{username}</div>
                {online === true ? (
                    <div className="text-green-500 mb-2">online</div>
                ) : (
                    <div className="text-red-500 mb-2">offline</div>
                )}
                <div className="flex flex-row items-center justify-center gap-2 w-3/4 rounded-md">
                    <button className="bg-blue-300 rounded-md p-0.5 pl-2 pr-2" onClick={() => handleChat}><FontAwesomeIcon icon={faComments} /></button>
                    <button className="bg-green-300 rounded-md p-0.5 pl-2 pr-2" onClick={() => onShowChallenge(username)}><FontAwesomeIcon icon={faChess} /></button>
                    <button className="bg-red-300 rounded-md p-0.5 pl-2 pr-2" onClick={() => onRemove(username)}><FontAwesomeIcon icon={faUserMinus} /></button>           
                </div>
            </div>
        </>
    );
}

export default FriendCard;