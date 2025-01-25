export const settingsConfig = {
  text: {
    basic: {
      fields: [
        {
          type: "text",
          name: "label",
          label: "Field Label",
          placeholder: "Enter field label",
        },
        {
          type: "text",
          name: "placeholder",
          label: "Placeholder Text",
          placeholder: "Enter placeholder text",
        },
        {
          type: "text",
          name: "helpText",
          label: "Help Text",
          placeholder: "Enter help text",
        },
        {
          type: "select",
          name: "size",
          label: "Field Size",
          options: [
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" },
          ],
        },
      ],
    },
    validation: {
      fields: [
        {
          type: "checkbox",
          name: "required",
          label: "Required Field",
        },
        {
          type: "number",
          name: "minLength",
          label: "Minimum Length",
          min: 0,
        },
        {
          type: "number",
          name: "maxLength",
          label: "Maximum Length",
          min: 0,
        },
        {
          type: "text",
          name: "pattern",
          label: "Validation Pattern (Regex)",
          placeholder: "Enter regex pattern",
        },
        {
          type: "text",
          name: "errorMessage",
          label: "Error Message",
          placeholder: "Enter custom error message",
        },
      ],
    },
    advanced: {
      fields: [
        {
          type: "select",
          name: "columnWidth",
          label: "Column Width",
          options: [
            { value: "25", label: "25%" },
            { value: "50", label: "50%" },
            { value: "75", label: "75%" },
            { value: "100", label: "100%" },
          ],
        },
        {
          type: "text",
          name: "cssClass",
          label: "Custom CSS Class",
        },
        {
          type: "checkbox",
          name: "hiddenLabel",
          label: "Hide Field Label",
        },
        {
          type: "select",
          name: "visibility",
          label: "Field Visibility",
          options: [
            { value: "visible", label: "Always Visible" },
            { value: "hidden", label: "Hidden" },
            { value: "conditional", label: "Conditional" },
          ],
        },
      ],
    },
  },
  textarea: {
    basic: {
      fields: [
        {
          type: "text",
          name: "label",
          label: "Field Label",
          placeholder: "Enter field label",
        },
        {
          type: "text",
          name: "placeholder",
          label: "Placeholder Text",
          placeholder: "Enter placeholder text",
        },
        {
          type: "text",
          name: "helpText",
          label: "Help Text",
          placeholder: "Enter help text",
        },
        {
          type: "number",
          name: "rows",
          label: "Rows",
          placeholder: "Enter number of rows",
        },
      ],
    },
  },
  number: {
    basic: {
      fields: [
        {
          type: "text",
          name: "label",
          label: "Field Label",
          placeholder: "Enter field label",
        },
        {
          type: "number",
          name: "min",
          label: "Minimum Value",
          placeholder: "Enter minimum value",
        },
        {
          type: "number",
          name: "max",
          label: "Maximum Value",
          placeholder: "Enter maximum value",
        },
      ],
    },
  },
  phone: {
    basic: {
      fields: [
        {
          type: "text",
          name: "label",
          label: "Field Label",
          placeholder: "Enter field label",
        },
        {
          type: "text",
          name: "placeholder",
          label: "Placeholder Text",
          placeholder: "Enter placeholder text",
        },
      ],
    },
  },
  email: {
    basic: {
      fields: [
        {
          type: "text",
          name: "label",
          label: "Field Label",
          placeholder: "Enter field label",
        },
        {
          type: "text",
          name: "placeholder",
          label: "Placeholder Text",
          placeholder: "Enter placeholder text",
        },
      ],
    },
  },
  hiddenField: {
    basic: {
      fields: [
        {
          type: "text",
          name: "value",
          label: "Default Value",
          placeholder: "Enter default value",
        },
      ],
    },
  },
  datetime: {
    basic: {
      fields: [
        {
          type: "text",
          name: "label",
          label: "Field Label",
          placeholder: "Enter field label",
        },
        {
          type: "text",
          name: "placeholder",
          label: "Placeholder Text",
          placeholder: "Enter placeholder text",
        },
      ],
    },
  },
  fileUpload: {
    basic: {
      fields: [
        {
          type: "text",
          name: "label",
          label: "Field Label",
          placeholder: "Enter field label",
        },
        {
          type: "number",
          name: "maxSize",
          label: "Max File Size (MB)",
          placeholder: "Enter max file size",
        },
      ],
    },
  },
  select: {
    basic: {
      fields: [
        {
          type: "text",
          name: "label",
          label: "Field Label",
          placeholder: "Enter field label",
        },
        {
          type: "textarea",
          name: "options",
          label: "Options",
          placeholder: "Enter options separated by commas",
        },
        {
          type: "text",
          name: "defaultValue",
          label: "Default Value",
          placeholder: "Enter default value",
        },
      ],
    },
    advanced: {
      fields: [
        {
          type: "checkbox",
          name: "searchable",
          label: "Enable Search",
        },
        {
          type: "checkbox",
          name: "multiple",
          label: "Allow Multiple Selections",
        },
      ],
    },
  },
  dropdown: {
    basic: {
      fields: [
        {
          type: "text",
          name: "label",
          label: "Field Label",
          placeholder: "Enter field label",
        },
        {
          type: "textarea",
          name: "options",
          label: "Options",
          placeholder: "Enter options separated by commas",
        },
        {
          type: "text",
          name: "defaultValue",
          label: "Default Value",
          placeholder: "Enter default value",
        },
      ],
    },
    advanced: {
      fields: [
        {
          type: "checkbox",
          name: "searchable",
          label: "Enable Search",
        },
        {
          type: "checkbox",
          name: "multiple",
          label: "Allow Multiple Selections",
        },
      ],
    },
  },
  imageDropdown: {
    basic: {
      fields: [
        {
          type: "text",
          name: "label",
          label: "Field Label",
          placeholder: "Enter field label",
        },
        {
          type: "textarea",
          name: "options",
          label: "Options",
          placeholder: "Enter options separated by commas",
        },
        {
          type: "text",
          name: "defaultValue",
          label: "Default Value",
          placeholder: "Enter default value",
        },
      ],
    },
    advanced: {
      fields: [
        {
          type: "checkbox",
          name: "searchable",
          label: "Enable Search",
        },
        {
          type: "checkbox",
          name: "multiple",
          label: "Allow Multiple Selections",
        },
      ],
    },
  },
  radio: {
    basic: {
      fields: [
        {
          type: "text",
          name: "label",
          label: "Label",
          placeholder: "Enter label",
        },
        {
          type: "text",
          name: "name",
          label: "Name",
          placeholder: "Enter name",
        },
        { type: "custom", name: "options", label: "Option Values" },
        { type: "checkbox", name: "required", label: "Required Field" },
      ],
    },
    advanced: {
      fields: [
        { type: "checkbox", name: "hiddenLabel", label: "Hidden Label" },
        {
          type: "select",
          name: "defaultValue",
          label: "Default Value",
          options: [{ value: "", label: "-- Please select --" }],
        },
      ],
    },
  },
  checkbox: {
    basic: {
      fields: [
        {
          type: "text",
          name: "label",
          label: "Label",
          placeholder: "Enter label",
        },
        { type: "custom", name: "options", label: "Options" },
      ],
    },
    advanced: {
      fields: [
        { type: "checkbox", name: "hiddenLabel", label: "Hidden Label" },
        {
          type: "number",
          name: "minSelections",
          label: "Min Selections",
          placeholder: "Enter min selections",
        },
        {
          type: "number",
          name: "maxSelections",
          label: "Max Selections",
          placeholder: "Enter max selections",
        },
        {
          type: "select",
          name: "defaultValue",
          label: "Default Value",
          options: [{ value: "", label: "-- Please select --" }],
        },
        {
          type: "text",
          name: "helpText",
          label: "Help Text",
          placeholder: "Enter help text",
        },
        {
          type: "select",
          name: "helpTextPosition",
          label: "Help Text Position",
          options: [
            { value: "below", label: "Below option element" },
            { value: "above", label: "Above option element" },
          ],
        },
        {
          type: "radio",
          name: "style",
          label: "Style",
          options: [
            { value: "vertical", label: "Vertical" },
            { value: "horizontal", label: "Horizontal" },
          ],
        },
      ],
    },
  },
  button: {
    basic: {
      fields: [
        {
          type: "text",
          name: "label",
          label: "Button Text",
          placeholder: "Enter button text",
        },
      ],
    },
  },
  heading: {
    basic: {
      fields: [
        {
          type: "text",
          name: "text",
          label: "Heading Text",
          placeholder: "Enter heading text",
        },
      ],
    },
  },
  divider: {
    basic: {
      fields: [],
    },
  },
  spacing: {
    basic: {
      fields: [
        {
          type: "number",
          name: "height",
          label: "Height (px)",
          placeholder: "Enter height in pixels",
        },
      ],
    },
  },
  redirectProductLinks: {
    basic: {
      fields: [
        { type: "text", name: "url", label: "URL", placeholder: "Enter URL" },
      ],
    },
  },
};
