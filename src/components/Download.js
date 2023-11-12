import React, { useRef } from 'react';

const DownloadButton = ({ targetId }) => {
  const canvasRef = useRef(null);

  const handleDownload = () => {
    const targetDiv = document.getElementById(targetId);

    if (targetDiv) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas dimensions to match the target div
      canvas.width = targetDiv.offsetWidth;
      canvas.height = targetDiv.offsetHeight;

      // Draw the content of the target div onto the canvas
      context.drawWindow(window, targetDiv.offsetLeft, targetDiv.offsetTop, canvas.width, canvas.height, 'white');

      // Convert the canvas content to a data URL
      const dataURL = canvas.toDataURL('image/png');

      // Create a download link
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = 'downloaded-image.png';

      // Trigger a click on the link to start the download
      a.click();
    }
  };

  return (
    <div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <button onClick={handleDownload}>Download</button>
    </div>
  );
};

export default DownloadButton;
