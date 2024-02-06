import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeContext } from "./components/common/ThemeProvider";
import Login from "./components/auth/Login";
import NotFound from "./components/common/NotFound";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import Dashboard from "./components/dashboard/Dashboard";
import OnlineGamePage from "./components/play/online/OnlineGamePage";
import OfflineGamePage from "./components/play/offline/OfflineGamePage";
import TacticsGamePage from "./components/play/tactics/TacticsGamePage";
import Settings from "./components/settings/Settings";
import ProfilePage from "./components/profile/ProfilePage";
import OnlineDashboard from "./components/play/online/OnlineDashboard";
import AuthWrapper from "./components/common/AuthWrapper";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { faPuzzlePiece } from "@fortawesome/free-solid-svg-icons";
import UnderConstruction from "./components/common/UnderConstruction";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FriendPage from "./components/friends/FriendPage";
import FriendChat from "./components/friends/FriendChat";

library.add(faUserGroup, faPuzzlePiece);

const App = () => {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Router>
        <div>
          <Routes>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot" element={<ForgotPassword />} />

            <Route path="/" element={<AuthWrapper />}>
              <Route index element={<Dashboard />} />
              <Route path="online" element={<OnlineDashboard />} />
              <Route path="online/:roomId" element={<OnlineGamePage />} />
              <Route path="offline" element={<OfflineGamePage />} />
              <Route path="tactics" element={<TacticsGamePage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<Settings />} />

              <Route path="friends" element={<FriendPage />} />
              <Route path="friends/chat/:friendId" element={<FriendChat />} />

              <Route path="shop" element={<UnderConstruction />} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </>
  );
};

export default App;
