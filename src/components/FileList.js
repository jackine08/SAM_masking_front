import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';

const FileList = forwardRef((props, ref) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://192.168.0.68:8000/unprocessed_files');
      setFiles(response.data); // Assuming response.data is the array of files
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchFiles,
  }));

  const handlePerformInference = async () => {
    try {
      const response = await axios.post('http://192.168.0.68:8000/inference');
      console.log('Inference result:', response);
      // setInferenceResult(response.data); // Store inference result in state
    } catch (error) {
      console.error('Error performing inference:', error);
    }
  };

  return (
    <div className="file-list">
      <h3>Unprocessed Files</h3>
      <button onClick={handlePerformInference}>Perform Inference on All Files</button>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default FileList;
