import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FolderImagesPage = ({ match }) => {
  const folderName = match.params.folderName;
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/get_processed_files/${folderName}`);
      setImages(response.data);
    } catch (error) {
      console.error(`Error fetching images for folder '${folderName}':`, error);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await axios.post(`http://localhost:8000/download_file`, { filename }, {
        responseType: 'blob', // Specify the response type as blob
      });

      // Create a temporary anchor element to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

    } catch (error) {
      console.error(`Error downloading file '${filename}':`, error);
    }
  };

  return (
    <div className="folder-images-page">
      <h2>Images in Folder: {folderName}</h2>
      <div className="image-grid">
        {images.map((image, index) => (
          <div key={index} className="image-item">
            <img src={`data:image/jpeg;base64,${image.image_base64}`} alt={image.filename} />
            <button onClick={() => handleDownload(image.filename)}>Download</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderImagesPage;
