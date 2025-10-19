"use client";
import { Form } from "apps/website/src/types/shared";
import { useState } from "react";
import FormViewer from "../../form/viewer";
import Modal from "../../modal";

interface ActionModalWrapperProps {
  children: React.ReactNode;
  actionForm: Form;
}

const ActionModalWrapper: React.FC<ActionModalWrapperProps> = ({
  children,
  actionForm,
}) => {
  const [open, setOpen] = useState(false);

  const handleModal = () => setOpen(!open);

  return (
    <div onClick={handleModal}>
      {children}
      <Modal open={open} onClose={handleModal}>
        <FormViewer {...actionForm} />
      </Modal>
    </div>
  );
};

export default ActionModalWrapper;
