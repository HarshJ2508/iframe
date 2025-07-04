import { useState, useRef, useCallback, useEffect } from 'react';
import "./App.css";

const App = () => {
  const [isIframeCollapsed, setIsIframeCollapsed] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<any>(null);

  const toggleIframe = () => {
    setIsIframeCollapsed(!isIframeCollapsed);
  };

  const handleMouseDown = useCallback((e: any) => {
    if (isIframeCollapsed) return;
    setIsDragging(true);
    e.preventDefault();
  }, [isIframeCollapsed]);

  const handleMouseMove = useCallback((e: any) => {
    if (!isDragging || !containerRef.current || isIframeCollapsed) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const containerWidth = containerRect.width;

    let newLeftPanelWidth = (mouseX / containerWidth) * 100;

    const minWidthPx = 200;
    const minWidthPercent = (minWidthPx / containerWidth) * 100;
    const maxWidthPercent = 100 - minWidthPercent;

    newLeftPanelWidth = Math.max(minWidthPercent, Math.min(maxWidthPercent, newLeftPanelWidth));

    setLeftPanelWidth(newLeftPanelWidth);
  }, [isDragging, isIframeCollapsed]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="app-container" ref={containerRef}>
      <button className="toggle-button" onClick={toggleIframe}>
        {isIframeCollapsed ? <p>Left</p> : <p>Right</p>}
        {isIframeCollapsed ? 'Expand Panel' : 'Collapse Panel'}
      </button>

      <style>{`
        .component-one {
          color: white;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: width 0.1s ease;
          width: ${isIframeCollapsed ? '100%' : `${leftPanelWidth}%`};
          min-width: ${isIframeCollapsed ? 'auto' : '200px'};
          flex-shrink: 0;
        }

        .resizer {
          width: 6px;
          background: #e0e0e0;
          cursor: col-resize;
          position: relative;
          transition: background-color 0.2s ease;
          display: ${isIframeCollapsed ? 'none' : 'block'};
          flex-shrink: 0;
        }

        .iframe-container {
          background: white;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: width 0.1s ease;
          overflow: hidden;
          width: ${isIframeCollapsed ? '0%' : `${100 - leftPanelWidth}%`};
          min-width: ${isIframeCollapsed ? '0' : '200px'};
          flex-shrink: 0;
        }
      `}</style>

      <div className={`component-one ${isIframeCollapsed ? 'expanded' : ''}`}>
        <h1 className="component-title">Component - 1</h1>
      </div>

      {!isIframeCollapsed && (
        <div className="resizer" onMouseDown={handleMouseDown}>
          <div className="resizer-handle">
            <div className="resizer-dots"></div>
          </div>
        </div>
      )}

      {!isIframeCollapsed && (
        <div className="iframe-container">
          <div className="iframe-header">
            <h2 className="iframe-title">Google Search</h2>
          </div>
          <div className="iframe-content">
            <iframe
              src="https://www.google.com/webhp?igu=1"
              title="Google Search"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
