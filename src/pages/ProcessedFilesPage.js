import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProcessedFilesPage = ({ onNavigate, handleFolderSelect }) => {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    const server_ip = process.env.REACT_APP_API_HOST;

    try {
      const response = await axios.get(`${server_ip}/processed_files`);
      setFolders(response.data);
    } catch (error) {
      console.error('폴더 목록을 가져오는 데 실패했습니다:', error);
    }
  };

  const handleFolderClick = (folder) => {
    handleFolderSelect('filesInFolder', folder); // 폴더 클릭 시 파일 보기 페이지로 이동
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
    </div>
  );
};

export default ProcessedFilesPage;
