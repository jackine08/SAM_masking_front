import { useState, useRef, useEffect } from 'react';

const useImageSelection = (imageWidth, imageHeight) => {
  const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
  const [endCoords, setEndCoords] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [selectionActive, setSelectionActive] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedAreaCoords, setSelectedAreaCoords] = useState(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (dragging && selectionActive) {
        const rect = imageRef.current.getBoundingClientRect();
        setEndCoords({
          x: Math.max(0, Math.min(rect.width, event.clientX - rect.left)),
          y: Math.max(0, Math.min(rect.height, event.clientY - rect.top)),
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

  return {
    imageRef,
    startCoords,
    endCoords,
    selectedArea,
    selectedAreaCoords,
    handleImageMouseDown,
  };
};

export default useImageSelection;
