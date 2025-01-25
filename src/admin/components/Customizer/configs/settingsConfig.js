export const settingsConfig = {
  checkbox: {
    basic: {
      fields: [
        {
          type: "text",
          name: "label",
          label: "Label",
          placeholder: "Enter label",
        },
        { type: "custom", name: "options", label: "Option Values" },
        { type: "checkbox", name: "required", label: "Required Field" },
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
  // ... other elements ...
};
