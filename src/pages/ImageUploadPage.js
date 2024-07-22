import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../App.css';
import FileList from '../components/FileList';
import FileInput from '../components/FileInput';
import ImagePreview from '../components/ImagePreview';
import useImageSelection from '../hooks/useImageSelection';

const ImageUploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const fileListRef = useRef(null);
  const {
    imageRef,
    selectedArea,
    selectedAreaCoords,
    handleImageMouseDown,
  } = useImageSelection(imageDimensions.width, imageDimensions.height);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedAreaCoords) {
      alert('Please select a file and an area to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('files', selectedFile);
    formData.append('coordinates', JSON.stringify(selectedAreaCoords));

    try {
      const response = await axios.post('http://192.168.0.68:8000/upload_file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('File uploaded successfully:', response.data);
      setSelectedFile(null);
      if (fileListRef.current) {
        fileListRef.current.refresh();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="image-upload-page">
      <h2>Image Upload and Selection</h2>
      <FileInput onFileChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Image</button>
      <ImagePreview
        selectedFile={selectedFile}
        imageRef={imageRef}
        selectedArea={selectedArea}
        handleImageMouseDown={handleImageMouseDown}
        selectedAreaCoords={selectedAreaCoords}
      />
      <FileList ref={fileListRef} />
    </div>
  );
};

export default ImageUploadPage;
