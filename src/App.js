/**********************************************
 * C:\Users\Admin\Desktop\Page Builder\frontend\src\App.js
 **********************************************/
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Workspace from './components/Workspace';
import PropertiesPanel from './components/PropertiesPanel';
import Toolbar from './components/Toolbar';
import './styles/App.css';

/**
 * Convert "elements" tree into minimal HTML. 
 * Very simple example for the "Preview" feature.
 */
function buildHTML(elements) {
  const voidTags = [
    'area','base','br','col','embed','hr','img','input','link',
    'meta','param','source','track','wbr'
  ];

  function createElementString(el) {
    const tag = el.tag.replace('<', '').replace('>', '').trim();
    let attrs = '';

    // Basic attributes: ID, class, style
    if (el.attributes?.idAttr) {
      attrs += ` id="${el.attributes.idAttr}"`;
    }
    if (el.attributes?.classAttr) {
      attrs += ` class="${el.attributes.classAttr}"`;
    }
    if (el.attributes?.styleAttr) {
      attrs += ` style="${el.attributes.styleAttr}"`;
    }

    // Example: handle <img> src, alt
    if (tag === 'img') {
      if (el.attributes?.srcAttr) attrs += ` src="${el.attributes.srcAttr}"`;
      if (el.attributes?.altAttr) attrs += ` alt="${el.attributes.altAttr}"`;
    }
    // Add more if you want (like <a> href, <iframe> src, etc.)

    const isVoid = voidTags.includes(tag.toLowerCase());
    const childrenHTML = (el.children || []).map(createElementString).join('');

    const textContent = el.attributes?.textContent && !isVoid
      ? el.attributes.textContent
      : '';

    if (isVoid) {
      return `<${tag}${attrs} />`;
    } else {
      return `<${tag}${attrs}>${textContent}${childrenHTML}</${tag}>`;
    }
  }

  return elements.map(createElementString).join('\n');
}

export default function App() {
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);

  // Undo/Redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // 1) Single function to replace setElements:
  //    - merges new state
  //    - updates history
  function handleSetElements(newValueOrFn) {
    setElements((prev) => {
      const newElements = 
        typeof newValueOrFn === 'function'
          ? newValueOrFn(prev)
          : newValueOrFn;

      // push newElements to history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newElements);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      return newElements;
    });
  }

  // 2) Save/Load with localStorage
  const handleSave = () => {
    const dataStr = JSON.stringify(elements);
    localStorage.setItem('pageBuilderData', dataStr);
    alert('Saved to localStorage!');
  };

  const handleLoad = () => {
    const dataStr = localStorage.getItem('pageBuilderData');
    if (!dataStr) {
      alert('No saved data found!');
      return;
    }
    try {
      const parsed = JSON.parse(dataStr);
      // directly call handleSetElements
      handleSetElements(parsed);
      alert('Loaded from localStorage!');
    } catch (err) {
      alert('Failed to parse saved data!');
    }
  };

  // 3) Undo/Redo
  const handleUndo = () => {
    if (historyIndex <= 0) {
      alert('No more undo steps!');
      return;
    }
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setElements(history[newIndex]);
    setSelectedElement(null);
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) {
      alert('No more redo steps!');
      return;
    }
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setElements(history[newIndex]);
    setSelectedElement(null);
  };

  // 4) Preview in new tab
  const handlePreview = () => {
    const htmlStr = buildHTML(elements);
    const previewWin = window.open('', '_blank', 'width=1000,height=800');
    if (previewWin) {
      previewWin.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Preview</title>
            <meta charset="UTF-8"/>
          </head>
          <body>
            ${htmlStr}
          </body>
        </html>
      `);
      previewWin.document.close();
    }
  };

  // 5) Update attributes
  function updateElementAttributes(elementId, newAttrs) {
    handleSetElements((prev) => {
      const updateRec = (arr) =>
        arr.map((el) => {
          if (el.id === elementId) {
            return {
              ...el,
              attributes: {
                ...el.attributes,
                ...newAttrs
              }
            };
          }
          if (el.children) {
            return { ...el, children: updateRec(el.children) };
          }
          return el;
        });
      return updateRec(prev);
    });
  }

  // 6) Delete element
  function handleDeleteElement(elementId) {
    handleSetElements((prev) => {
      const removeRec = (arr) =>
        arr.filter((el) => {
          if (el.id === elementId) return false;
          if (el.children) el.children = removeRec(el.children);
          return true;
        });
      return removeRec(prev);
    });
    if (selectedElement && selectedElement.id === elementId) {
      setSelectedElement(null);
    }
  }

  return (
    <div className="app-container">
      <Toolbar
        onSave={handleSave}
        onLoad={handleLoad}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onPreview={handlePreview}
      />

      <div className="main-layout">
        <Sidebar />

        <Workspace
          elements={elements}
          setElements={handleSetElements}
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          onDeleteElement={handleDeleteElement}
        />

        <PropertiesPanel
          selectedElement={selectedElement}
          updateElementAttributes={updateElementAttributes}
          onDeleteElement={handleDeleteElement}
        />
      </div>
    </div>
  );
}
