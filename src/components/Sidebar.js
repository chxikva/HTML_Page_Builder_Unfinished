/***************************************
 * C:\Users\Admin\Desktop\Page Builder\frontend\src\components\Sidebar.js
 ***************************************/
import React, { useState } from 'react';
import '../styles/Sidebar.css';

/**
 * We add "Headings" category with <h1>...<h6>
 * We'll also keep existing categories.
 */
const elementsData = [
  {
    category: 'Headings',
    items: [
      { tag: '<h1>', name: 'Heading 1', description: 'Defines an H1 heading.' },
      { tag: '<h2>', name: 'Heading 2', description: 'Defines an H2 heading.' },
      { tag: '<h3>', name: 'Heading 3', description: 'Defines an H3 heading.' },
      { tag: '<h4>', name: 'Heading 4', description: 'Defines an H4 heading.' },
      { tag: '<h5>', name: 'Heading 5', description: 'Defines an H5 heading.' },
      { tag: '<h6>', name: 'Heading 6', description: 'Defines an H6 heading.' }
    ]
  },
  {
    category: 'Content Sectioning',
    items: [
      { tag: '<header>', name: 'Header', description: 'Defines a header section.' },
      { tag: '<footer>', name: 'Footer', description: 'Defines a footer section.' },
      { tag: '<main>', name: 'Main', description: 'Main content of the document.' },
      { tag: '<section>', name: 'Section', description: 'Defines a section.' },
      { tag: '<article>', name: 'Article', description: 'Defines independent content.' },
      { tag: '<nav>', name: 'Nav', description: 'Defines navigation links.' },
      { tag: '<aside>', name: 'Aside', description: 'Defines sidebar content.' },
      { tag: '<address>', name: 'Address', description: 'Defines contact information.' }
    ]
  },
  {
    category: 'Content Grouping',
    items: [
      { tag: '<div>', name: 'Div', description: 'Generic container.' },
      { tag: '<span>', name: 'Span', description: 'Inline container.' },
      { tag: '<p>', name: 'Paragraph', description: 'Defines a paragraph.' },
      { tag: '<hr>', name: 'Horizontal Rule', description: 'Creates a thematic break.' },
      { tag: '<blockquote>', name: 'Blockquote', description: 'Defines a block quote.' },
      { tag: '<pre>', name: 'Preformatted Text', description: 'Preformatted text block.' },
      { tag: '<figure>', name: 'Figure', description: 'Self-contained content.' },
      { tag: '<figcaption>', name: 'Figure Caption', description: 'Caption for a figure.' },
      { tag: '<ul>', name: 'UL', description: 'Unordered list.' },
      { tag: '<ol>', name: 'OL', description: 'Ordered list.' },
      { tag: '<li>', name: 'LI', description: 'List item.' },
      { tag: '<dl>', name: 'DL', description: 'Description list.' },
      { tag: '<dt>', name: 'DT', description: 'Term in a description list.' },
      { tag: '<dd>', name: 'DD', description: 'Definition in a description list.' }
    ]
  },
  {
    category: 'Text-Level Semantics',
    items: [
      { tag: '<a>', name: 'Anchor', description: 'Defines a hyperlink.' },
      { tag: '<abbr>', name: 'Abbreviation', description: 'Defines an abbreviation.' },
      { tag: '<b>', name: 'Bold', description: 'Defines bold text.' },
      { tag: '<bdi>', name: 'BDI', description: 'Bi-directional text isolation.' },
      { tag: '<bdo>', name: 'BDO', description: 'Overrides text direction.' },
      { tag: '<br>', name: 'Line Break', description: 'Creates a line break.' },
      { tag: '<cite>', name: 'Cite', description: 'Defines a citation.' },
      { tag: '<code>', name: 'Code', description: 'Defines code text.' },
      { tag: '<data>', name: 'Data', description: 'Machine-readable value.' },
      { tag: '<dfn>', name: 'Definition', description: 'Defines a term.' },
      { tag: '<em>', name: 'Emphasis', description: 'Defines emphasized text.' },
      { tag: '<i>', name: 'Italic', description: 'Defines italic text.' },
      { tag: '<kbd>', name: 'Keyboard Input', description: 'Defines keyboard input.' },
      { tag: '<mark>', name: 'Mark', description: 'Highlights text.' },
      { tag: '<q>', name: 'Quote', description: 'Short inline quote.' },
      { tag: '<s>', name: 'Strikethrough', description: 'Strikethrough text.' },
      { tag: '<small>', name: 'Small', description: 'Smaller text.' },
      { tag: '<strong>', name: 'Strong', description: 'Important text.' },
      { tag: '<sub>', name: 'Subscript', description: 'Subscript text.' },
      { tag: '<sup>', name: 'Superscript', description: 'Superscript text.' },
      { tag: '<time>', name: 'Time', description: 'Defines a time.' },
      { tag: '<u>', name: 'Underline', description: 'Underlined text.' },
      { tag: '<var>', name: 'Variable', description: 'Variable in math/programming.' },
      { tag: '<wbr>', name: 'Word Break', description: 'Opportunity for line-break.' }
    ]
  },
  {
    category: 'Forms',
    items: [
      { tag: '<form>', name: 'Form', description: 'HTML form container.' },
      { tag: '<input>', name: 'Input', description: 'Input field.' },
      { tag: '<button>', name: 'Button', description: 'Clickable button.' },
      { tag: '<select>', name: 'Select', description: 'Dropdown list.' },
      { tag: '<textarea>', name: 'Textarea', description: 'Multiline text input.' },
      { tag: '<label>', name: 'Label', description: 'Label for form control.' },
      { tag: '<fieldset>', name: 'Fieldset', description: 'Group related form data.' },
      { tag: '<legend>', name: 'Legend', description: 'Caption for fieldset.' },
      { tag: '<datalist>', name: 'Datalist', description: 'List of suggested input values.' },
      { tag: '<optgroup>', name: 'Optgroup', description: 'Group of options.' },
      { tag: '<option>', name: 'Option', description: 'Option in a dropdown.' },
      { tag: '<output>', name: 'Output', description: 'Result of a calculation.' },
      { tag: '<progress>', name: 'Progress', description: 'Progress bar.' },
      { tag: '<meter>', name: 'Meter', description: 'Scalar measurement.' }
    ]
  },
  {
    category: 'Embedded Content',
    items: [
      { tag: '<img>', name: 'Image', description: 'Embeds an image.' },
      { tag: '<iframe>', name: 'Iframe', description: 'Embeds another webpage.' },
      { tag: '<embed>', name: 'Embed', description: 'Embeds external content.' },
      { tag: '<object>', name: 'Object', description: 'Embeds external objects.' },
      { tag: '<param>', name: 'Param', description: 'Parameters for <object>.' },
      { tag: '<video>', name: 'Video', description: 'Embeds a video.' },
      { tag: '<audio>', name: 'Audio', description: 'Embeds audio.' },
      { tag: '<source>', name: 'Source', description: 'Media source for video/audio.' },
      { tag: '<track>', name: 'Track', description: 'Text tracks for media.' },
      { tag: '<canvas>', name: 'Canvas', description: 'Draw graphics via scripting.' },
      { tag: '<map>', name: 'Map', description: 'Image map container.' },
      { tag: '<area>', name: 'Area', description: 'Defines area in image map.' },
      { tag: '<picture>', name: 'Picture', description: 'Container for multiple images.' }
    ]
  },
  {
    category: 'Interactive',
    items: [
      { tag: '<details>', name: 'Details', description: 'Expandable details.' },
      { tag: '<summary>', name: 'Summary', description: 'Header for <details>.' },
      { tag: '<dialog>', name: 'Dialog', description: 'Represents a dialog box.' },
      { tag: '<menu>', name: 'Menu', description: 'List of commands/menus.' }
    ]
  },
  {
    category: 'Tables',
    items: [
      { tag: '<table>', name: 'Table', description: 'Defines a table.' },
      { tag: '<caption>', name: 'Caption', description: 'Table caption.' },
      { tag: '<thead>', name: 'THead', description: 'Group of header rows.' },
      { tag: '<tbody>', name: 'TBody', description: 'Group of body rows.' },
      { tag: '<tfoot>', name: 'TFoot', description: 'Group of footer rows.' },
      { tag: '<tr>', name: 'TR', description: 'Table row.' },
      { tag: '<th>', name: 'TH', description: 'Table header cell.' },
      { tag: '<td>', name: 'TD', description: 'Table data cell.' },
      { tag: '<col>', name: 'Col', description: 'Column definition.' },
      { tag: '<colgroup>', name: 'Colgroup', description: 'Group of columns.' }
    ]
  },
  {
    category: 'Scripting',
    items: [
      { tag: '<script>', name: 'Script', description: 'Embeds JavaScript.' },
      { tag: '<noscript>', name: 'No Script', description: 'Fallback for no JavaScript.' },
      { tag: '<template>', name: 'Template', description: 'Client-side template.' },
      { tag: '<slot>', name: 'Slot', description: 'Placeholder for shadow DOM.' }
    ]
  }
];

export default function Sidebar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState({});

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  };

  const toggleCategory = (category) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const filteredData = elementsData.map((group) => {
    const lowerSearch = searchTerm.toLowerCase();
    const filteredItems = group.items.filter((item) =>
      [item.name, item.tag, item.description]
        .some(str => str.toLowerCase().includes(lowerSearch))
    );
    return { ...group, items: filteredItems };
  });

  return (
    <div className="sidebar">
      <h2>HTML Elements</h2>
      <input
        type="text"
        placeholder="Search elements..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredData.map((group, idx) => {
        if (!group.items.length) return null; 
        const isCollapsed = collapsedCategories[group.category];
        return (
          <div key={idx} className="sidebar-category">
            <h3 onClick={() => toggleCategory(group.category)}>
              {group.category} {isCollapsed ? '▸' : '▾'}
            </h3>
            {!isCollapsed && (
              <ul>
                {group.items.map((item, i) => (
                  <li
                    key={i}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    className="draggable-item"
                  >
                    <div className="item-box">
                      <strong>{item.name}</strong>
                      <p>{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
