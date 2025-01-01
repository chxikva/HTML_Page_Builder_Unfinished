import React, { useEffect, useState } from 'react';
import '../styles/PropertiesPanel.css';

const TEXT_TAGS = [
  '<p>', '<span>', '<div>', '<section>', '<article>', '<aside>', '<header>', 
  '<footer>', '<h1>', '<h2>', '<h3>', '<h4>', '<h5>', '<h6>'
];

const CSS_CATEGORIES = {
  Layout: [
    { label: 'Display', name: 'display', type: 'select', options: ['', 'block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'none'] },
    { label: 'Position', name: 'position', type: 'select', options: ['', 'static', 'relative', 'absolute', 'fixed', 'sticky'] },
    { label: 'Top', name: 'top', placeholder: 'e.g. 10px' },
    { label: 'Right', name: 'right', placeholder: 'e.g. 10px' },
    { label: 'Bottom', name: 'bottom', placeholder: 'e.g. 10px' },
    { label: 'Left', name: 'left', placeholder: 'e.g. 10px' },
    { label: 'Z-Index', name: 'zIndex', placeholder: 'e.g. 999' },
    { label: 'Float', name: 'float', type: 'select', options: ['', 'left', 'right', 'none'] },
    { label: 'Clear', name: 'clear', type: 'select', options: ['', 'left', 'right', 'both', 'none'] }
  ],
  Flexbox: [
    { label: 'Flex Direction', name: 'flexDirection', type: 'select', options: ['', 'row', 'row-reverse', 'column', 'column-reverse'] },
    { label: 'Flex Wrap', name: 'flexWrap', type: 'select', options: ['', 'nowrap', 'wrap', 'wrap-reverse'] },
    { label: 'Justify Content', name: 'justifyContent', type: 'select', options: ['', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'] },
    { label: 'Align Items', name: 'alignItems', type: 'select', options: ['', 'stretch', 'flex-start', 'flex-end', 'center', 'baseline'] },
    { label: 'Align Content', name: 'alignContent', type: 'select', options: ['', 'stretch', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around'] },
    { label: 'Order', name: 'order', placeholder: 'e.g. 1' },
    { label: 'Flex Grow', name: 'flexGrow', placeholder: 'e.g. 1' },
    { label: 'Flex Shrink', name: 'flexShrink', placeholder: 'e.g. 0' },
    { label: 'Flex Basis', name: 'flexBasis', placeholder: 'e.g. 100px' }
  ],
  Grid: [
    { label: 'Grid Template Columns', name: 'gridTemplateColumns', placeholder: 'e.g. 1fr 1fr' },
    { label: 'Grid Template Rows', name: 'gridTemplateRows', placeholder: 'e.g. auto 50px' },
    { label: 'Grid Gap', name: 'gridGap', placeholder: 'e.g. 10px' },
    { label: 'Justify Items', name: 'justifyItems', type: 'select', options: ['', 'start', 'end', 'center', 'stretch'] },
    { label: 'Align Items (Grid)', name: 'alignItemsGrid', type: 'select', options: ['', 'start', 'end', 'center', 'stretch'] }
  ],
  Sizing: [
    { label: 'Width', name: 'width', placeholder: 'e.g. 100px' },
    { label: 'Height', name: 'height', placeholder: 'e.g. 100px' },
    { label: 'Min-Width', name: 'minWidth', placeholder: 'e.g. 50px' },
    { label: 'Max-Width', name: 'maxWidth', placeholder: 'e.g. 600px' },
    { label: 'Min-Height', name: 'minHeight', placeholder: 'e.g. 50px' },
    { label: 'Max-Height', name: 'maxHeight', placeholder: 'e.g. 400px' }
  ],
  MarginPadding: [
    { label: 'Margin Top', name: 'marginTop', placeholder: 'e.g. 10px' },
    { label: 'Margin Right', name: 'marginRight', placeholder: 'e.g. 10px' },
    { label: 'Margin Bottom', name: 'marginBottom', placeholder: 'e.g. 10px' },
    { label: 'Margin Left', name: 'marginLeft', placeholder: 'e.g. 10px' },
    { label: 'Padding Top', name: 'paddingTop', placeholder: 'e.g. 5px' },
    { label: 'Padding Right', name: 'paddingRight', placeholder: 'e.g. 5px' },
    { label: 'Padding Bottom', name: 'paddingBottom', placeholder: 'e.g. 5px' },
    { label: 'Padding Left', name: 'paddingLeft', placeholder: 'e.g. 5px' }
  ],
  Border: [
    { label: 'Border Width', name: 'borderWidth', placeholder: 'e.g. 1px' },
    { label: 'Border Style', name: 'borderStyle', type: 'select', options: ['', 'none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'] },
    { label: 'Border Color', name: 'borderColor', placeholder: 'e.g. #ccc' },
    { label: 'Border Radius', name: 'borderRadius', placeholder: 'e.g. 5px' }
  ],
  Background: [
    { label: 'Background Color', name: 'backgroundColor', placeholder: 'e.g. #fff or red' },
    { label: 'Background Image', name: 'backgroundImage', placeholder: 'e.g. url("...")' },
    { label: 'Background Repeat', name: 'backgroundRepeat', type: 'select', options: ['', 'repeat', 'repeat-x', 'repeat-y', 'no-repeat'] },
    { label: 'Background Size', name: 'backgroundSize', type: 'select', options: ['', 'auto', 'cover', 'contain'] },
    { label: 'Background Position', name: 'backgroundPosition', placeholder: 'e.g. center or 10px 20px' },
    { label: 'Background Attachment', name: 'backgroundAttachment', type: 'select', options: ['', 'scroll', 'fixed', 'local'] }
  ],
  Typography: [
    { label: 'Color', name: 'color', placeholder: 'e.g. #000 or blue' },
    { label: 'Font Family', name: 'fontFamily', placeholder: 'e.g. Arial, sans-serif' },
    { label: 'Font Size', name: 'fontSize', placeholder: 'e.g. 16px' },
    { label: 'Font Style', name: 'fontStyle', type: 'select', options: ['', 'normal', 'italic', 'oblique'] },
    { label: 'Font Weight', name: 'fontWeight', placeholder: 'e.g. normal, bold, 400' },
    { label: 'Line Height', name: 'lineHeight', placeholder: 'e.g. 1.5 or 20px' },
    { label: 'Letter Spacing', name: 'letterSpacing', placeholder: 'e.g. 1px' },
    { label: 'Text Align', name: 'textAlign', type: 'select', options: ['', 'left', 'right', 'center', 'justify', 'start', 'end'] },
    { label: 'Text Transform', name: 'textTransform', type: 'select', options: ['', 'none', 'uppercase', 'lowercase', 'capitalize'] },
    { label: 'Text Decoration', name: 'textDecoration', placeholder: 'e.g. none, underline' },
    { label: 'White Space', name: 'whiteSpace', type: 'select', options: ['', 'normal', 'nowrap', 'pre', 'pre-wrap', 'pre-line'] }
  ],
  Effects: [
    { label: 'Box Shadow', name: 'boxShadow', placeholder: 'e.g. 0 2px 5px rgba(0,0,0,.3)' },
    { label: 'Opacity', name: 'opacity', placeholder: 'e.g. 1 or 0.5' },
    { label: 'Filter', name: 'filter', placeholder: 'e.g. blur(5px)' },
    { label: 'Mix Blend Mode', name: 'mixBlendMode', type: 'select', options: ['', 'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'] }
  ],
};

function composeStyleAttr(attrs) {
  let styleStr = '';
  Object.values(CSS_CATEGORIES).forEach((category) => {
    category.forEach((propDef) => {
      const val = attrs[propDef.name];
      if (val && val !== '') {
        let kebab = propDef.name
          .replace(/([A-Z])/g, (m) => `-${m.toLowerCase()}`)
          .replace('alignItemsGrid', 'align-items')
          .replace('zIndex', 'z-index');
        styleStr += `${kebab}: ${val}; `;
      }
    });
  });
  return styleStr.trim();
}

export default function PropertiesPanel({
  selectedElement,
  updateElementAttributes,
  onDeleteElement
}) {
  const [localAttrs, setLocalAttrs] = useState({});

  useEffect(() => {
    if (selectedElement) {
      setLocalAttrs(selectedElement.attributes || {});
    }
  }, [selectedElement]);

  if (!selectedElement) {
    return (
      <div className="properties-panel">
        <h2>Properties</h2>
        <p>No element selected.</p>
      </div>
    );
  }

  const { id, tag, name } = selectedElement;

  const handleChange = (e) => {
    const { name: fieldName, type, value, checked } = e.target;
    let newVal = value;
    if (type === 'checkbox') {
      newVal = checked;
    }
    setLocalAttrs((prev) => {
      const updated = { ...prev, [fieldName]: newVal };
      updated.styleAttr = composeStyleAttr(updated);
      updateElementAttributes(id, updated);
      return updated;
    });
  };

  const handleDelete = () => onDeleteElement(id);

  return (
    <div className="properties-panel">
      <h2>Properties</h2>
      <p>
        Editing: <strong>{name}</strong> <em>({tag})</em>
      </p>

      <button
        style={{
          backgroundColor: '#ff4d4f',
          color: '#fff',
          marginBottom: '10px',
          border: 'none',
          borderRadius: '4px',
          padding: '6px 12px',
          cursor: 'pointer'
        }}
        onClick={handleDelete}
      >
        Delete this element
      </button>

      <label>ID:</label>
      <input
        name="idAttr"
        placeholder="Element ID"
        value={localAttrs.idAttr || ''}
        onChange={handleChange}
      />

      <label>Class:</label>
      <input
        name="classAttr"
        placeholder="Element class"
        value={localAttrs.classAttr || ''}
        onChange={handleChange}
      />

      {TEXT_TAGS.includes(tag) && (
        <>
          <label>Text Content:</label>
          <textarea
            name="textContent"
            placeholder="Element text"
            rows={2}
            value={localAttrs.textContent || ''}
            onChange={handleChange}
          />
        </>
      )}

      {tag === '<img>' && (
        <>
          <label>Image SRC:</label>
          <input
            name="srcAttr"
            placeholder="Image URL"
            value={localAttrs.srcAttr || ''}
            onChange={handleChange}
          />
          <label>Image ALT:</label>
          <input
            name="altAttr"
            placeholder="Alt text"
            value={localAttrs.altAttr || ''}
            onChange={handleChange}
          />
        </>
      )}

      {tag === '<a>' && (
        <>
          <label>Link HREF:</label>
          <input
            name="hrefAttr"
            placeholder="https://example.com"
            value={localAttrs.hrefAttr || ''}
            onChange={handleChange}
          />
          <label>Link Target:</label>
          <select
            name="targetAttr"
            value={localAttrs.targetAttr || ''}
            onChange={handleChange}
          >
            <option value="">(none)</option>
            <option value="_blank">_blank</option>
            <option value="_self">_self</option>
            <option value="_parent">_parent</option>
            <option value="_top">_top</option>
          </select>
        </>
      )}

      {tag === '<input>' && (
        <>
          <label>Input Type:</label>
          <select
            name="typeAttr"
            value={localAttrs.typeAttr || 'text'}
            onChange={handleChange}
          >
            <option value="text">text</option>
            <option value="password">password</option>
            <option value="email">email</option>
            <option value="url">url</option>
            <option value="tel">tel</option>
            <option value="number">number</option>
            <option value="range">range</option>
            <option value="date">date</option>
            <option value="month">month</option>
            <option value="week">week</option>
            <option value="time">time</option>
            <option value="datetime-local">datetime-local</option>
            <option value="color">color</option>
            <option value="checkbox">checkbox</option>
            <option value="radio">radio</option>
            <option value="file">file</option>
            <option value="submit">submit</option>
            <option value="reset">reset</option>
            <option value="button">button</option>
            <option value="search">search</option>
            <option value="hidden">hidden</option>
            <option value="image">image</option>
          </select>
        </>
      )}

      {tag === '<button>' && (
        <>
          <label>Button Type:</label>
          <select
            name="typeAttr"
            value={localAttrs.typeAttr || 'button'}
            onChange={handleChange}
          >
            <option value="button">button</option>
            <option value="submit">submit</option>
            <option value="reset">reset</option>
          </select>
        </>
      )}

      {tag === '<form>' && (
        <>
          <label>Method:</label>
          <select
            name="methodAttr"
            value={localAttrs.methodAttr || 'get'}
            onChange={handleChange}
          >
            <option value="get">GET</option>
            <option value="post">POST</option>
          </select>
          <label>Autocomplete:</label>
          <select
            name="autocompleteAttr"
            value={localAttrs.autocompleteAttr || ''}
            onChange={handleChange}
          >
            <option value="">(none)</option>
            <option value="on">on</option>
            <option value="off">off</option>
          </select>
        </>
      )}

      {tag === '<script>' && (
        <>
          <label>
            <input
              type="checkbox"
              name="asyncAttr"
              checked={!!localAttrs.asyncAttr}
              onChange={handleChange}
            />
            async
          </label>
          <label>
            <input
              type="checkbox"
              name="deferAttr"
              checked={!!localAttrs.deferAttr}
              onChange={handleChange}
            />
            defer
          </label>
          <label>type:</label>
          <select
            name="scriptTypeAttr"
            value={localAttrs.scriptTypeAttr || ''}
            onChange={handleChange}
          >
            <option value="">(none)</option>
            <option value="module">module</option>
          </select>
        </>
      )}

      {tag === '<iframe>' && (
        <>
          <label>Iframe SRC:</label>
          <input
            name="srcAttr"
            placeholder="https://example.com"
            value={localAttrs.srcAttr || ''}
            onChange={handleChange}
          />
          <p>Sandbox:</p>
          <label>
            <input
              type="checkbox"
              name="allowSameOrigin"
              checked={!!localAttrs.allowSameOrigin}
              onChange={handleChange}
            />
            allow-same-origin
          </label>
          <label>
            <input
              type="checkbox"
              name="allowScripts"
              checked={!!localAttrs.allowScripts}
              onChange={handleChange}
            />
            allow-scripts
          </label>
          <label>
            <input
              type="checkbox"
              name="allowPopups"
              checked={!!localAttrs.allowPopups}
              onChange={handleChange}
            />
            allow-popups
          </label>
          <label>
            <input
              type="checkbox"
              name="allowForms"
              checked={!!localAttrs.allowForms}
              onChange={handleChange}
            />
            allow-forms
          </label>
          <label>
            <input
              type="checkbox"
              name="allowDownloads"
              checked={!!localAttrs.allowDownloads}
              onChange={handleChange}
            />
            allow-downloads
          </label>
        </>
      )}

      {tag === '<video>' && (
        <>
          <label>Video SRC:</label>
          <input
            name="srcAttr"
            placeholder="Video URL"
            value={localAttrs.srcAttr || ''}
            onChange={handleChange}
          />
          <label>
            <input
              type="checkbox"
              name="autoplayAttr"
              checked={!!localAttrs.autoplayAttr}
              onChange={handleChange}
            />
            autoplay
          </label>
          <label>
            <input
              type="checkbox"
              name="controlsAttr"
              checked={!!localAttrs.controlsAttr}
              onChange={handleChange}
            />
            controls
          </label>
          <label>
            <input
              type="checkbox"
              name="loopAttr"
              checked={!!localAttrs.loopAttr}
              onChange={handleChange}
            />
            loop
          </label>
          <label>
            <input
              type="checkbox"
              name="mutedAttr"
              checked={!!localAttrs.mutedAttr}
              onChange={handleChange}
            />
            muted
          </label>
          <label>preload:</label>
          <select
            name="preloadAttr"
            value={localAttrs.preloadAttr || ''}
            onChange={handleChange}
          >
            <option value="">(none)</option>
            <option value="none">none</option>
            <option value="metadata">metadata</option>
            <option value="auto">auto</option>
          </select>
        </>
      )}

      {tag === '<audio>' && (
        <>
          <label>Audio SRC:</label>
          <input
            name="srcAttr"
            placeholder="Audio URL"
            value={localAttrs.srcAttr || ''}
            onChange={handleChange}
          />
          <label>
            <input
              type="checkbox"
              name="autoplayAttr"
              checked={!!localAttrs.autoplayAttr}
              onChange={handleChange}
            />
            autoplay
          </label>
          <label>
            <input
              type="checkbox"
              name="controlsAttr"
              checked={!!localAttrs.controlsAttr}
              onChange={handleChange}
            />
            controls
          </label>
          <label>
            <input
              type="checkbox"
              name="loopAttr"
              checked={!!localAttrs.loopAttr}
              onChange={handleChange}
            />
            loop
          </label>
          <label>
            <input
              type="checkbox"
              name="mutedAttr"
              checked={!!localAttrs.mutedAttr}
              onChange={handleChange}
            />
            muted
          </label>
          <label>preload:</label>
          <select
            name="preloadAttr"
            value={localAttrs.preloadAttr || ''}
            onChange={handleChange}
          >
            <option value="">(none)</option>
            <option value="none">none</option>
            <option value="metadata">metadata</option>
            <option value="auto">auto</option>
          </select>
        </>
      )}

      {tag === '<meta>' && (
        <>
          <label>charset:</label>
          <input
            name="charsetAttr"
            placeholder='e.g. "UTF-8"'
            value={localAttrs.charsetAttr || ''}
            onChange={handleChange}
          />
          <label>name:</label>
          <input
            name="nameAttr"
            placeholder='e.g. "viewport"'
            value={localAttrs.nameAttr || ''}
            onChange={handleChange}
          />
          <label>http-equiv:</label>
          <input
            name="httpEquivAttr"
            placeholder='e.g. "refresh"'
            value={localAttrs.httpEquivAttr || ''}
            onChange={handleChange}
          />
        </>
      )}

      {tag === '<link>' && (
        <>
          <label>rel:</label>
          <select
            name="relAttr"
            value={localAttrs.relAttr || ''}
            onChange={handleChange}
          >
            <option value="">(none)</option>
            <option value="stylesheet">stylesheet</option>
            <option value="icon">icon</option>
            <option value="preload">preload</option>
            <option value="alternate">alternate</option>
            <option value="canonical">canonical</option>
          </select>
          <label>href:</label>
          <input
            name="hrefAttr"
            placeholder='e.g. "/styles.css"'
            value={localAttrs.hrefAttr || ''}
            onChange={handleChange}
          />
        </>
      )}

      {tag === '<track>' && (
        <>
          <label>kind:</label>
          <select
            name="kindAttr"
            value={localAttrs.kindAttr || ''}
            onChange={handleChange}
          >
            <option value="">(none)</option>
            <option value="subtitles">subtitles</option>
            <option value="captions">captions</option>
            <option value="descriptions">descriptions</option>
            <option value="chapters">chapters</option>
            <option value="metadata">metadata</option>
          </select>
          <label>
            <input
              type="checkbox"
              name="defaultAttr"
              checked={!!localAttrs.defaultAttr}
              onChange={handleChange}
            />
            default
          </label>
        </>
      )}

      {tag === '<map>' && (
        <>
          <label>name:</label>
          <input
            name="mapNameAttr"
            placeholder="map-name"
            value={localAttrs.mapNameAttr || ''}
            onChange={handleChange}
          />
        </>
      )}

      {tag === '<details>' && (
        <>
          <label>
            <input
              type="checkbox"
              name="openAttr"
              checked={!!localAttrs.openAttr}
              onChange={handleChange}
            />
            open
          </label>
        </>
      )}

      {tag === '<textarea>' && (
        <>
          <label>wrap:</label>
          <select
            name="wrapAttr"
            value={localAttrs.wrapAttr || ''}
            onChange={handleChange}
          >
            <option value="">(none)</option>
            <option value="soft">soft</option>
            <option value="hard">hard</option>
          </select>
        </>
      )}

      {tag === '<dialog>' && (
        <>
          <label>
            <input
              type="checkbox"
              name="dialogOpenAttr"
              checked={!!localAttrs.dialogOpenAttr}
              onChange={handleChange}
            />
            open
          </label>
        </>
      )}

      <hr style={{ margin: '10px 0' }} />
      <h3>CSS Properties</h3>

      {Object.entries(CSS_CATEGORIES).map(([catName, fields]) => (
        <div key={catName} style={{ marginBottom: '12px' }}>
          <h4 style={{ margin: '6px 0' }}>{catName}</h4>
          {fields.map((field) => {
            const val = localAttrs[field.name] || '';
            if (field.type === 'select' && field.options) {
              return (
                <div key={field.name} style={{ marginBottom: '4px' }}>
                  <label style={{ display: 'block' }}>{field.label}:</label>
                  <select
                    name={field.name}
                    value={val}
                    onChange={handleChange}
                    style={{ width: '100%', marginBottom: '4px' }}
                  >
                    {field.options.map((opt) => (
                      <option value={opt} key={opt}>
                        {opt || '(none)'}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }
            return (
              <div key={field.name} style={{ marginBottom: '4px' }}>
                <label style={{ display: 'block' }}>{field.label}:</label>
                <input
                  name={field.name}
                  placeholder={field.placeholder || ''}
                  value={val}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
