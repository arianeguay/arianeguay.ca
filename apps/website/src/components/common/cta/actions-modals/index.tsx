"use client";
import { Form } from "apps/website/src/types/shared";
import { useState } from "react";
import FormViewer from "../../form/viewer";
import Modal from "../../modal";

interface ActionModalWrapperProps {
  children: React.ReactNode;
  actionForm: Form;
  style?: React.CSSProperties;
}

const ActionModalWrapper: React.FC<ActionModalWrapperProps> = ({
  children,
  actionForm,
  style,
}) => {
  const [open, setOpen] = useState(false);

  const handleModal = () => setOpen(!open);

  return (
    <div
      onClick={handleModal}
      style={{ cursor: "pointer", width: "fit-content", ...style }}
    >
      {children}
      <Modal open={open} onClose={handleModal}>
        <FormViewer {...actionForm} />
      </Modal>
    </div>
  );
};

export default ActionModalWrapper;
