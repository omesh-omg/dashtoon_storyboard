import React from 'react';

const Storyboard = ({ savedImages, onSelectImage }) => {
  return (
    <div className="storyboard">
      <h2>Storyboard</h2>
      <ul className="listOfImages">
        {savedImages.map((savedImage, index) => (
          <li key={index} onClick={() => onSelectImage(index)}>
            <img src={savedImage} alt={`Saved Image ${index + 1}`} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Storyboard;