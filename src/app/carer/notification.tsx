// components/Notification.tsx
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsBell } from 'react-icons/bs'; // Import the bell icon

export const showNotification = () => {
  const customMessage = 'Marie Claire is interested with your product.';
  toast.success(customMessage, {
    position: 'top-right',
    autoClose: false, // Set autoClose to false for no auto-close
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

const Notification: React.FC = () => {
  return (
    <div className="notification-icon">
      <BsBell size={20} onClick={showNotification} />
      <ToastContainer />
    </div>
  );
};

export default Notification;
