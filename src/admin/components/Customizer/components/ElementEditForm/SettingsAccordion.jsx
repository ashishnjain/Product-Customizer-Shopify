import React from 'react';
import { Accordion } from 'react-bootstrap';

const SettingsAccordion = ({ children, title, icon, eventKey }) => {
  return (
    <Accordion.Item eventKey={eventKey}>
      <Accordion.Header>
        <i className={`fa ${icon} fs-4 me-2`} aria-hidden="true"></i>
        {title}
      </Accordion.Header>
      <Accordion.Body>
        {children}
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default SettingsAccordion; 