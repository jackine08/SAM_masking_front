import React, { useState } from 'react';
import './App.css';
import ImageUploadPage from './pages/ImageUploadPage';
import ProcessedFilesPage from './pages/ProcessedFilesPage';
import FolderImagesPage from './pages/FolderImagesPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('upload'); // 초기 페이지 설정

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      <h1>Main Application</h1>
      <button onClick={()=> {handleNavigate("upload")}}>Upload Image</button>
      <button onClick={()=> {handleNavigate("processedFiles")}}>processedFiles</button>

      {currentPage === 'upload' && <ImageUploadPage onNavigate={handleNavigate} />}
      {currentPage === 'processedFiles' && <ProcessedFilesPage onNavigate={handleNavigate} />}
    </div>
  );
};

export default App;
