import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import FileList from '../pages/FileList';

const ImageUploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [selectionActive, setSelectionActive] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedAreaCoords, setSelectedAreaCoords] = useState(null);
  const imageRef = useRef(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (dragging && selectionActive) {
        const rect = imageRef.current.getBoundingClientRect();
        setEndCoords({
          x: Math.max(0, Math.min(rect.width, event.clientX - rect.left)),
          y: Math.max(0, Math.min(rect.height, event.clientY - rect.top))
        });
      }
    };

    const handleMouseUp = () => {
      if (dragging && selectionActive) {
        setDragging(false);
        setSelectionActive(false);

        const x = Math.min(startCoords.x, endCoords.x);
        const y = Math.min(startCoords.y, endCoords.y);
        const width = Math.abs(endCoords.x - startCoords.x);
        const height = Math.abs(endCoords.y - startCoords.y);

        const actualX = (x / imageRef.current.width) * imageWidth;
        const actualY = (y / imageRef.current.height) * imageHeight;
        const actualWidth = (width / imageRef.current.width) * imageWidth;
        const actualHeight = (height / imageRef.current.height) * imageHeight;

        setSelectedArea({ x, y, width, height });
        setSelectedAreaCoords({ x1: actualX, y1: actualY, x2: actualX + actualWidth, y2: actualY + actualHeight });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, selectionActive, startCoords, endCoords, imageWidth, imageHeight]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // 이미지 크기 가져오기
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setImageWidth(img.width);
      setImageHeight(img.height);
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
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('File uploaded successfully:', response.data);
      setSelectedFile(null);
      setSelectedAreaCoords(null);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleImageMouseDown = (event) => {
    event.preventDefault();
    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      setStartCoords({ x, y });
      setEndCoords({ x, y });
      setDragging(true);
      setSelectionActive(true);
      setSelectedArea(null);
      setSelectedAreaCoords(null);
    }
  };

  return (
    <div className="image-upload-page">
      <h2>Image Upload and Selection</h2>
      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload Image</button>
      </div>
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
      <FileList /> {/* 파일 목록 컴포넌트 */}
    </div>
  );
};

export default ImageUploadPage;
