import React, { useEffect } from 'react';

export const Devtool = () => {
  useEffect(() => {
    const disableRightClick = (e) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', disableRightClick);

    const disableShortcuts = (e) => {
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 'i' || e.key === 'I')) {
        e.preventDefault();
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
      }
      if (e.key === 'F12') {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', disableShortcuts);

    const detectDevTools = () => {
      const initialWidth = window.innerWidth;
      const initialHeight = window.innerHeight;

      const intervalId = setInterval(() => {
        if (window.innerWidth !== initialWidth || window.innerHeight !== initialHeight) {
          window.location.replace('about:blank');
        }
      }, 1000);

      return () => clearInterval(intervalId);
    };

    const cleanupDetectDevTools = detectDevTools();

    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableShortcuts);
      cleanupDetectDevTools();
    };
  }, []);

  return;
};

export default Devtool;