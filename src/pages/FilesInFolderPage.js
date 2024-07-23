import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const FilesInFolderPage = ({ folderName, onNavigate }) => {
  const [processedFiles, setProcessedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchProcessedFiles = useCallback(async () => {
    try {
      const server_ip = process.env.REACT_APP_API_HOST;

      const response = await axios.get(`${server_ip}/get_processed_files?folder_name=${folderName}`);
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

  const handleDownload = (file) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${file.image_base64}`;
    link.download = file.filename;
    link.click();
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
            <button onClick={() => handleDownload(file)}>다운로드</button>
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
            <button onClick={() => handleDownload(selectedFile)}>다운로드</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilesInFolderPage;
