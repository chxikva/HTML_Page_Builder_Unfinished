/**********************************************
 * C:\Users\Admin\Desktop\Page Builder\frontend\src\components\Workspace.js
 **********************************************/
import React, { useState } from 'react';
import '../styles/Workspace.css';

const nestingRules = {
  '<form>': [
    '<input>', '<button>', '<label>', '<fieldset>', '<legend>',
    '<select>', '<textarea>', '<output>', '<progress>', '<meter>',
    '<datalist>', '<div>'
  ],
  '<table>': ['<caption>', '<thead>', '<tbody>', '<tfoot>', '<tr>', '<colgroup>'],
  '<tr>': ['<th>', '<td>'],
  '<select>': ['<option>', '<optgroup>'],
  '<optgroup>': ['<option>'],
  '<details>': ['<summary>']
};

const defaultTextMap = {
  '<p>': 'Paragraph text...',
  '<h1>': 'Heading 1 Title',
  '<h2>': 'Heading 2 Title',
  '<h3>': 'Heading 3 Title',
  '<h4>': 'Heading 4 Title',
  '<h5>': 'Heading 5 Title',
  '<h6>': 'Heading 6 Title',
  '<header>': 'Header area...',
  '<footer>': 'Footer area...',
  '<main>': 'Main content area...',
  '<section>': 'Section content...',
  '<article>': 'Article content...',
  '<nav>': 'Navigation area...',
  '<aside>': 'Aside content...',
  '<address>': 'Address content...'
};

export default function Workspace({
  elements,
  setElements,
  selectedElement,
  setSelectedElement,
  onDeleteElement
}) {
  const [draggedElement, setDraggedElement] = useState({ id: null });

  function mapTagToDOM(tagString) {
    return tagString.replace('<', '').replace('>', '').trim() || 'div';
  }

  function parseStyleString(styleAttr) {
    if (!styleAttr) return {};
    const styleObj = {};
    for (const part of styleAttr.split(';')) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const [prop, val] = trimmed.split(':');
      if (prop && val) styleObj[prop.trim()] = val.trim();
    }
    return styleObj;
  }

  // Renders a single element as real DOM node
  function renderActualElement(el) {
    const realTag = mapTagToDOM(el.tag);
    const { attributes } = el;
    const props = {};

    if (attributes?.idAttr) props.id = attributes.idAttr;
    if (attributes?.classAttr) props.className = attributes.classAttr;
    if (attributes?.styleAttr) props.style = parseStyleString(attributes.styleAttr);

    let content = null;
    const voidTags = [
      'img','input','br','hr','area','base','col','embed','link','meta','param','source','track','wbr'
    ];
    if (attributes?.textContent && !voidTags.includes(realTag)) {
      content = attributes.textContent;
    }

    // 1) Fix forms: prevent submit
    if (realTag === 'form') {
      props.onSubmit = (e) => e.preventDefault();
    }

    // 2) Button default type
    if (realTag === 'button') {
      if (attributes?.typeAttr) {
        props.type = attributes.typeAttr;
      } else {
        // If user didn’t set type, default to "button" so it won't submit form
        props.type = 'button';
      }
      if (attributes?.textContent) content = attributes.textContent;
    }

    // If <input> has a type
    if (realTag === 'input' && attributes?.typeAttr) {
      props.type = attributes.typeAttr;
    }

    // Example: <img> => src, alt
    if (realTag === 'img') {
      if (attributes?.srcAttr) props.src = attributes.srcAttr;
      if (attributes?.altAttr) props.alt = attributes.altAttr;
    }

    // Just an example for <a>
    if (realTag === 'a') {
      if (attributes?.hrefAttr) props.href = attributes.hrefAttr;
      if (attributes?.targetAttr) props.target = attributes.targetAttr;
      if (!content && attributes?.textContent) content = attributes.textContent;
    }

    // etc. for <iframe>, <video>, <audio>, etc.

    // Render children
    const childNodes = [];
    if (el.children?.length) {
      for (const childEl of el.children) {
        childNodes.push(renderActualElement(childEl));
      }
    }

    props.onClick = (evt) => {
      evt.stopPropagation();
      setSelectedElement(el);
    };

    if (content && childNodes.length) {
      childNodes.unshift(content);
      return React.createElement(realTag, props, ...childNodes);
    } else if (content) {
      return React.createElement(realTag, props, content);
    } else if (childNodes.length) {
      return React.createElement(realTag, props, childNodes);
    } else {
      return React.createElement(realTag, props);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDragStart(e, id) {
    setDraggedElement({ id });
    e.dataTransfer.setData('text/plain', 'reorder');
  }

  function handleDrop(e, targetId = null, position = 'inside') {
    e.preventDefault();
    e.stopPropagation();

    const fromSidebar = e.dataTransfer.getData('application/json');
    const isReorder = e.dataTransfer.getData('text/plain') === 'reorder';

    if (isReorder && draggedElement.id) {
      setElements((prev) => {
        let draggedItem = null;
        function remove(arr) {
          return arr.filter((x) => {
            if (x.id === draggedElement.id) {
              draggedItem = x;
              return false;
            }
            if (x.children) x.children = remove(x.children);
            return true;
          });
        }
        let updated = remove(prev);
        if (targetId && position === 'inside') {
          updated = addInside(updated, targetId, draggedItem);
        } else if (targetId && (position === 'above' || position === 'below')) {
          updated = insertAboveBelow(updated, targetId, draggedItem, position);
        } else {
          updated.push(draggedItem);
        }
        return updated;
      });
      setDraggedElement({ id: null });
      return;
    }

    if (fromSidebar) {
      let item;
      try {
        item = JSON.parse(fromSidebar);
      } catch (err) {
        console.error('JSON parse error', err);
        return;
      }
      const newEl = {
        id: Date.now(),
        tag: item.tag,
        name: item.name,
        description: item.description,
        attributes: {},
        children: []
      };
      // If there's a default text
      if (defaultTextMap[item.tag]) {
        newEl.attributes.textContent = defaultTextMap[item.tag];
      }
      setElements((prev) => {
        if (targetId && position === 'inside') {
          return addInside(prev, targetId, newEl);
        } else if (targetId && (position === 'above' || position === 'below')) {
          return insertAboveBelow(prev, targetId, newEl, position);
        } else {
          return [...prev, newEl];
        }
      });
    }
  }

  function addInside(list, parentId, childEl) {
    return list.map((node) => {
      if (node.id === parentId) {
        if (!nestingRules[node.tag] || nestingRules[node.tag].includes(childEl.tag)) {
          return {
            ...node,
            children: [...(node.children || []), childEl]
          };
        } else {
          alert(`Cannot drop ${childEl.tag} inside ${node.tag}`);
        }
      }
      if (node.children) {
        node.children = addInside(node.children, parentId, childEl);
      }
      return node;
    });
  }

  function insertAboveBelow(list, refId, newEl, position) {
    const newList = [];
    for (const item of list) {
      if (item.id === refId) {
        if (position === 'above') {
          newList.push(newEl);
          newList.push(item);
        } else {
          newList.push(item);
          newList.push(newEl);
        }
      } else {
        if (item.children) {
          item.children = insertAboveBelow(item.children, refId, newEl, position);
        }
        newList.push(item);
      }
    }
    return newList;
  }

  function renderElement(el) {
    const isSelected = selectedElement && selectedElement.id === el.id;
    const realNode = renderActualElement(el);

    return (
      <div key={el.id} className="workspace-element">
        <div
          className="drop-zone"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, el.id, 'above')}
        />
        <div
          className="element-box"
          draggable
          onDragStart={(e) => handleDragStart(e, el.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, el.id, 'inside')}
          style={{
            borderColor: isSelected ? '#faad14' : '#91d5ff'
          }}
        >
          <button
            className="delete-button"
            onClick={(evt) => {
              evt.stopPropagation();
              onDeleteElement(el.id);
            }}
          >
            X
          </button>
          {realNode}
        </div>
        <div
          className="drop-zone"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, el.id, 'below')}
        />
      </div>
    );
  }

  return (
    <div className="workspace" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e)}>
      <h2 className="workspace-title">Workspace</h2>
      <div className="workspace-canvas" onClick={() => setSelectedElement(null)}>
        {elements.map((el) => renderElement(el))}
      </div>
    </div>
  );
}
