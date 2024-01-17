import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AutoLogout = ({ onLogout,children }) => {
  const timeoutIdRef = useRef(null);
  const navigate = useNavigate();
  const resetTimer = () => {
    clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = setTimeout(() => {
      onLogout();
      navigate('/sign-in');
    }, 100000);
  };

  useEffect(() => {
    resetTimer();

    const eventListener = () => {
      resetTimer();
    };

    document.addEventListener('mousemove', eventListener);
    document.addEventListener('keydown', eventListener);

    return () => {
      document.removeEventListener('mousemove', eventListener);
      document.removeEventListener('keydown', eventListener);
      clearTimeout(timeoutIdRef.current); // Clear the timeout on component unmount
    };
  }, [onLogout]);

  return <>{children}</>;
};

export default AutoLogout;

