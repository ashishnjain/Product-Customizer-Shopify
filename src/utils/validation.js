export const validateElement = (element) => {
  switch (element.type) {
    case elementTypes.TEXT:
      if (element.config.validation.required && !element.config.basic.label) {
        return 'Label is required';
      }
      // Add more validation rules...
      break;
    // Add cases for other element types...
    default:
      return null; // No errors
  }
};
