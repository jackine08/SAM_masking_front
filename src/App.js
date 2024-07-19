import React, { useState } from 'react';
import './App.css';
import ImageUploadPage from './pages/ImageUploadPage';
import ProcessedFilesPage from './pages/ProcessedFilesPage';
import FilesInFolderPage from './pages/FilesInFolderPage'; // 새로운 페이지 컴포넌트 추가

const App = () => {
  const [currentPage, setCurrentPage] = useState('upload'); // 초기 페이지 설정
  const [selectedFolder, setSelectedFolder] = useState(null); // 선택된 폴더 상태

  const handleNavigate = (page, folderName = null) => {
    setCurrentPage(page);
    if (folderName) {
      setSelectedFolder(folderName);
    }
  };

  return (
    <div className="App">
      <h1>Main Application</h1>
      <button onClick={() => handleNavigate('upload')}>Upload Image</button>
      <button onClick={() => handleNavigate('processedFiles')}>Processed Files</button>

      {currentPage === 'upload' && <ImageUploadPage onNavigate={handleNavigate} />}
      {currentPage === 'processedFiles' && (
        <ProcessedFilesPage onNavigate={handleNavigate} handleFolderSelect={handleNavigate} />
      )}
      {currentPage === 'filesInFolder' && selectedFolder && (
        <FilesInFolderPage folderName={selectedFolder} onNavigate={handleNavigate} />
      )}
    </div>
  );
};

export default App;
