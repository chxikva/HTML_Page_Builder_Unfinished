/**********************************************
 * C:\Users\Admin\Desktop\Page Builder\frontend\src\components\Toolbar.js
 **********************************************/
import React from 'react';
import '../styles/Toolbar.css';

export default function Toolbar({
  onSave,
  onLoad,
  onUndo,
  onRedo,
  onPreview
}) {
  return (
    <div className="toolbar">
      <button onClick={onSave}>Save</button>
      <button onClick={onLoad}>Load</button>
      <button onClick={onUndo}>Undo</button>
      <button onClick={onRedo}>Redo</button>
      <button onClick={onPreview}>Preview</button>
    </div>
  );
}
