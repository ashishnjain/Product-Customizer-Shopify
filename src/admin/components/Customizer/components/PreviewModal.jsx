import React from 'react';
import styled from 'styled-components';
import ElementPreview from './ElementPreview';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #333;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: ${props => props.primary ? '#0066ff' : 'white'};
  color: ${props => props.primary ? 'white' : '#666'};
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

const PreviewModal = ({ isOpen, onClose, elements }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <Title>Frontend Preview</Title>
          <ButtonGroup>
            <Button onClick={onClose}>×</Button>
          </ButtonGroup>
        </ModalHeader>
        <ElementPreview elements={elements} />
      </ModalContent>
    </ModalOverlay>
  );
};

export default PreviewModal; 