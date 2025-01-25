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
  // Other element types...
}; 