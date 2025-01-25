import React from "react";
import TextSettings from "./TextSettings";
import TextAreaSettings from "./TextAreaSettings";
import SelectSettings from "./SelectSettings";
import DropdownSettings from "./DropdownSettings";
import ImageDropdownSettings from "./ImageDropdownSettings";
import RadioButtonSettings from "./RadioButtonSettings";
import CheckboxSettings from "./CheckboxSettings";
import ButtonSettings from "./ButtonSettings";
import DateTimeSettings from "./DateTimeSettings";
import FileUploadSettings from "./FileUploadSettings";
import HeadingSettings from "./HeadingSettings";
import DividerSettings from "./DividerSettings";
import SpacingSettings from "./SpacingSettings";
import RedirectLinkSettings from "./RedirectLinkSettings";
import PhoneSettings from "./PhoneSettings";
import EmailSettings from "./EmailSettings";
import NumberSettings from "./NumberSettings";

const ElementEditForm = ({ element, onUpdate, onClose }) => {
  const renderSettings = () => {
    switch (element.type) {
      case "text":
        return <TextSettings element={element} onUpdate={onUpdate} />;
      case "textarea":
        return <TextAreaSettings element={element} onUpdate={onUpdate} />;
      case "select":
        return <SelectSettings element={element} onUpdate={onUpdate} />;
      case "dropdown":
        return <DropdownSettings element={element} onUpdate={onUpdate} />;
      case "image-dropdown":
        
        return <ImageDropdownSettings element={element} onUpdate={onUpdate} />;
      case "radio":
        return <RadioButtonSettings element={element} onUpdate={onUpdate} />;
      case "checkbox":
        return <CheckboxSettings element={element} onUpdate={onUpdate} />;
      case "button":
        return <ButtonSettings element={element} onUpdate={onUpdate} />;
      case "datetime":
        return <DateTimeSettings element={element} onUpdate={onUpdate} />;
      case "file":
        return <FileUploadSettings element={element} onUpdate={onUpdate} />;
      case "heading":
        return <HeadingSettings element={element} onUpdate={onUpdate} />;
      case "divider":
        return <DividerSettings element={element} onUpdate={onUpdate} />;
      case "spacing":
        return <SpacingSettings element={element} onUpdate={onUpdate} />;
      case "redirect":
        return <RedirectLinkSettings element={element} onUpdate={onUpdate} />;
      case "phone":
        return <PhoneSettings element={element} onUpdate={onUpdate} />;
      case "email":
        return <EmailSettings element={element} onUpdate={onUpdate} />;
      case "number":
        return <NumberSettings element={element} onUpdate={onUpdate} />;
      default:
        return <div>No settings available for this element type</div>;
    }
  };

  return (
    <div className="element-edit-form">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Edit {element.type}</h5>
        <button
          type="button"
          className="btn btn-outline-primary px-2 py-1"
          aria-label="Close"
          onClick={onClose}
        >Save</button>
      </div>
      {renderSettings()}
    </div>
  );
};

export default ElementEditForm;
