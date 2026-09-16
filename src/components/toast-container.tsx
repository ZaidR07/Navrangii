"use client";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css';

export const ToastProvider = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default ToastProvider;
