import React from 'react';
import { Outlet } from 'react-router-dom';
import { isAuthenticated } from '../../services/auth';
import Navbar from './Navbar';

const AuthWrapper = () => {
  if (!isAuthenticated()) {
    window.location.href = "/auth/login";
    return null;
  }

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default AuthWrapper;