import React, { Fragment } from 'https://esm.sh/react@18?bundle';

import { CONFIG_SCHEMAS } from './library.js';

const BlockConfigPanel = ({ node, library, onUpdateConfig }) => {
  if (!node) {
    return React.createElement(
      'aside',
      { className: 'config-panel config-panel--empty' },
      React.createElement(
        'div',
        null,
        React.createElement('p', { className: 'config-panel__empty-title' }, 'Select a block to configure it'),
        React.createElement(
          'p',
          { className: 'config-panel__empty-body' },
          'Click a card on the canvas to update its content and see the changes reflected instantly.',
        ),
      ),
    );
  }

  const block = library[node.data.blockType];
  const fields = CONFIG_SCHEMAS[node.data.blockType];

  const handleChange = (event) => {
    const { name, value } = event.target;
    onUpdateConfig(node.id, {
      ...node.data.config,
      [name]: value,
    });
  };

  return React.createElement(
    'aside',
    { className: 'config-panel' },
    React.createElement(
      'header',
      { className: 'config-panel__header' },
      React.createElement(
        'span',
        { className: 'config-panel__icon', style: { backgroundColor: `${block.accent}1a` } },
        React.createElement('img', { src: block.icon, alt: '' }),
      ),
      React.createElement(
        'div',
        null,
        React.createElement('p', { className: 'config-panel__eyebrow' }, 'Block configuration'),
        React.createElement('h2', { className: 'config-panel__title' }, block.title),
        React.createElement('p', { className: 'config-panel__description' }, block.description),
      ),
    ),
    React.createElement(
      'form',
      { className: 'config-panel__form' },
      fields.map((field) =>
        React.createElement(
          Fragment,
          { key: field.name },
          React.createElement(
            'label',
            { htmlFor: `${node.id}-${field.name}`, className: 'config-panel__label' },
            field.label,
          ),
          field.type === 'select'
            ? React.createElement(
                'select',
                {
                  id: `${node.id}-${field.name}`,
                  name: field.name,
                  value: node.data.config[field.name] ?? '',
                  onChange: handleChange,
                  className: 'config-panel__input',
                },
                field.options?.map((option) =>
                  React.createElement('option', { key: option, value: option }, option),
                ),
              )
            : field.type === 'textarea'
              ? React.createElement('textarea', {
                  id: `${node.id}-${field.name}`,
                  name: field.name,
                  value: node.data.config[field.name] ?? '',
                  placeholder: field.placeholder,
                  onChange: handleChange,
                  className: 'config-panel__textarea',
                  rows: field.name === 'notes' ? 4 : 5,
                })
              : React.createElement('input', {
                  id: `${node.id}-${field.name}`,
                  type: 'text',
                  name: field.name,
                  value: node.data.config[field.name] ?? '',
                  placeholder: field.placeholder,
                  onChange: handleChange,
                  className: 'config-panel__input',
                }),
          field.helperText
            ? React.createElement('p', { className: 'config-panel__helper' }, field.helperText)
            : null,
        ),
      ),
    ),
  );
};

export default BlockConfigPanel;
