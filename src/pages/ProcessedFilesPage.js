import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProcessedFilesPage = () => {
  const [folders, setFolders] = useState([]);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await axios.get('http://192.168.0.68:8000/processed_files');
      setFolders(response.data);
    } catch (error) {
      console.error('폴더 목록을 가져오는 데 실패했습니다:', error);
    }
  };

  const handleFolderClick = async (folder) => {
    try {
      const response = await axios.get(`http://192.168.0.68:8000/get_processed_files?folder_name=${folder}`);
      setProcessedFiles(response.data);
      setSelectedFolder(folder);
    } catch (error) {
      console.error('파일 목록을 가져오는 데 실패했습니다:', error);
    }
  };

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedFile(null);
    setShowModal(false);
  };

  const renderProcessedFiles = () => {
    return (
      <div className="processed-files-grid">
        {processedFiles.map((file, index) => (
          <div key={index} className="processed-file-item">
            <img
              src={`data:image/png;base64,${file.image_base64}`}
              alt={file.filename}
              className="processed-file-image"
              onClick={() => handleFileClick(file)}
            />
            <p className="processed-file-name">{file.filename}</p>
            <button onClick={() => downloadFile(file)}>다운로드</button>
          </div>
        ))}
      </div>
    );
  };

  const downloadFile = (file) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${file.image_base64}`;
    link.download = file.filename;
    link.click();
  };

  return (
    <div className="processed-files-page">
      <h2>처리된 폴더</h2>
      <div className="folders-container">
        {folders.map((folder, index) => (
          <div key={index} className="folder-item" onClick={() => handleFolderClick(folder)}>
            {folder}
          </div>
        ))}
      </div>
      {selectedFolder && (
        <div>
          <h2>{selectedFolder} 폴더의 처리된 파일</h2>
          {renderProcessedFiles()}
        </div>
      )}
      {showModal && selectedFile && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>&times;</span>
            <img
              src={`data:image/png;base64,${selectedFile.image_base64}`}
              alt={selectedFile.filename}
              className="modal-image"
            />
            <p className="modal-filename">{selectedFile.filename}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessedFilesPage;
