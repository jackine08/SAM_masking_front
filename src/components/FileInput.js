import React, { useState } from 'react';

const FileInput = ({ onFileChange }) => {
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      onFileChange({ target: { files: [file] } });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileChange(event);
    }
  };

  return (
    <div
      className={`upload-section ${dragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input type="file" onChange={handleFileChange} />
      <p>Drag & Drop your image here or click to select</p>
    </div>
  );
};

export default FileInput;
