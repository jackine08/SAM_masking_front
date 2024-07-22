import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';

const FileList = forwardRef((props, ref) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inferenceMessage, setInferenceMessage] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get('http://localhost:8000/unprocessed_files');
      setFiles(response.data); // 파일 목록을 업데이트합니다.
    } catch (error) {
      console.error('파일 목록을 가져오는 중 오류 발생:', error);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchFiles,
  }));

  const handlePerformInference = async () => {
    setLoading(true); // 로딩 시작
    setInferenceMessage(''); // 이전 메시지 제거

    try {
      const response = await axios.post('http://localhost:8000/inference');
      console.log('Inference result:', response.data);
      setInferenceMessage('이미지 처리 완료'); // 처리 완료 메시지 설정
      fetchFiles(); // 파일 목록 갱신
    } catch (error) {
      console.error('Inference 수행 중 오류 발생:', error);
      setInferenceMessage('Inference 실패'); // 실패 메시지 설정
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <div className="file-list">
      <h3>Unprocessed Files</h3>
      <button onClick={handlePerformInference} disabled={loading}>
        {loading ? '처리 중...' : '모든 파일에 대해 추론 수행'}
      </button>
      {inferenceMessage && <p>{inferenceMessage}</p>}
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
