import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const FilesInFolderPage = ({ folderName, onNavigate }) => {
  const [processedFiles, setProcessedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchProcessedFiles = useCallback(async () => {
    try {
      const response = await axios.get(`http://192.168.0.68:8000/get_processed_files?folder_name=${folderName}`);
      setProcessedFiles(response.data);
    } catch (error) {
      console.error('파일 목록을 가져오는 데 실패했습니다:', error);
    }
  }, [folderName]);

  useEffect(() => {
    fetchProcessedFiles();
  }, [fetchProcessedFiles]);

  const handleFileClick = (file) => {
    setSelectedFile(file);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedFile(null);
    setShowModal(false);
  };

  return (
    <div className="files-in-folder-page">
      <h2>{folderName} 폴더의 처리된 파일</h2>
      <button onClick={() => onNavigate('processedFiles')}>뒤로가기</button>
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
          </div>
        ))}
      </div>
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

export default FilesInFolderPage;
