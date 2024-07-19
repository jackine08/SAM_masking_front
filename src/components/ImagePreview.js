import React from 'react';

const ImagePreview = ({ selectedFile, imageRef, selectedArea, handleImageMouseDown, selectedAreaCoords }) => {
  return (
    <div className="image-preview">
      {selectedFile && (
        <div className="image-container" style={{ position: 'relative' }}>
          <img
            ref={imageRef}
            src={URL.createObjectURL(selectedFile)}
            alt="Selected"
            className="preview-image"
            onMouseDown={handleImageMouseDown}
          />
          {selectedArea && (
            <div
              className="selection-box"
              style={{
                position: 'absolute',
                border: '2px solid red',
                left: `${selectedArea.x}px`,
                top: `${selectedArea.y}px`,
                width: `${selectedArea.width}px`,
                height: `${selectedArea.height}px`,
              }}
            ></div>
          )}
          {selectedAreaCoords && (
            <div className="coordinates-info">
              <p>Selected Area Coords:</p>
              <p>X1: {selectedAreaCoords.x1}</p>
              <p>Y1: {selectedAreaCoords.y1}</p>
              <p>X2: {selectedAreaCoords.x2}</p>
              <p>Y2: {selectedAreaCoords.y2}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
