export const elementTypes = {
  TEXT: 'text',
  IMAGE: 'image',
  CHECKBOX: 'checkbox',
  // Add more types as needed
};

// src/constants/defaultConfigs.js
export const defaultConfigs = {
  [elementTypes.TEXT]: {
    basic: {
      label: 'New Text Field',
      placeholder: '',
    },
    validation: {
      required: false,
      minLength: 0,
      maxLength: 100,
    },
    advanced: {
      columnWidth: '100',
      htmlClass: '',
    },
  },
  // Define other element types similarly
};
