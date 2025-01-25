export const elementConfigs = {
  text: {
    label: "Text Field",
    settings: {
      basic: {
        label: "",
        placeholder: "",
        defaultValue: "",
        helpText: "",
        tooltip: "",
      },
      validation: {
        required: false,
        minLength: 0,
        maxLength: 100,
        pattern: "",
        customValidation: "",
        errorMessage: "",
      },
      advanced: {
        width: "100",
        cssClass: "",
        visibility: "visible",
        conditional: false,
        conditionalRules: [],
      },
    },
  },
  textarea: {
    label: "Text Area",
    settings: {
      basic: {
        label: "",
        placeholder: "",
        defaultValue: "",
        rows: 3,
        helpText: "",
      },
      validation: {
        required: false,
        minLength: 0,
        maxLength: 500,
        errorMessage: "",
      },
      advanced: {
        width: "100",
        cssClass: "",
        resizable: true,
      },
    },
  },
  select: {
    label: "Dropdown",
    settings: {
      basic: {
        label: "",
        options: [],
        defaultValue: "",
        placeholder: "Select an option",
      },
      validation: {
        required: false,
        errorMessage: "",
      },
      advanced: {
        width: "100",
        multiple: false,
        searchable: true,
        allowCustom: false,
      },
    },
  },
  checkbox: {
    label: "Checkbox",
    settings: {
      basic: {
        label: "",
        options: [],
        defaultChecked: false,
      },
      validation: {
        required: false,
        minSelect: 0,
        maxSelect: null,
      },
      advanced: {
        layout: "vertical",
        width: "100",
        imageOptions: false,
      },
    },
  },
  "image-dropdown": {
    label: "Image Dropdown",
    settings: {
      basic: {
        label: "",
        options: [],
        defaultValue: "",
        placeholder: "Select an option",
      },
      validation: {
        required: false,
        errorMessage: "",
      },
      advanced: {
        width: "100",
        multiple: false,
        searchable: true,
        allowCustom: false,
      },
    },
  },
  radio: {
    label: "Radio Button",
    settings: {
      basic: {
        label: "",
        options: [],
        helpText: "",
        required: false,
        defaultValue: "",
        layout: "vertical",
        displayStyle: "standard",
        showPrice: false,
        optionSize: "medium",
      },
      validation: {
        required: false,
        minLength: 0,
        maxLength: 100,
        pattern: "",
        customValidation: "",
        errorMessage: "",
      },
      advanced: {
        width: "100",
        cssClass: "",
        visibility: "visible",
        conditional: false,
        conditionalRules: [],
      },
    },
  },
};
