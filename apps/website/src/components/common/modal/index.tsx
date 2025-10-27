"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Body,
  CloseButton,
  Dialog,
  Footer,
  Header,
  ModalContainer,
  Overlay,
  Title,
} from "./styles";

type ModalSize = "sm" | "md" | "lg" | "xl";

function lockScroll() {
  const sbw = window.innerWidth - document.documentElement.clientWidth; // scrollbar width
  document.documentElement.style.setProperty("--sbw", `${sbw}px`);
  document.documentElement.classList.add("modal-open");
}

function unlockScroll() {
  document.documentElement.classList.remove("modal-open");
  document.documentElement.style.removeProperty("--sbw");
}

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  labelledBy?: string;
  describedBy?: string;
  hideCloseButton?: boolean;
};

const Modal = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEsc = true,
  labelledBy,
  describedBy,
  hideCloseButton,
}: ModalProps) => {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeOnEsc, onClose]);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open) {
      unlockScroll();
      return;
    }
    lockScroll();
    return () => {
      unlockScroll();
    };
  }, [open]);

  const ariaLabelledBy = useMemo(() => {
    if (labelledBy) return labelledBy;
    if (typeof title === "string") return "modal-title";
    return undefined;
  }, [labelledBy, title]);

  if (!mounted) return null;
  if (!open) return null;

  const content = (
    <>
      <Overlay onClick={closeOnOverlayClick ? onClose : undefined} />
      <ModalContainer $size={size} onClick={onClose}>
        <Dialog
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={ariaLabelledBy}
          aria-describedby={describedBy}
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <Header>
              {title ? (
                typeof title === "string" ? (
                  <Title
                    id={
                      ariaLabelledBy === "modal-title"
                        ? "modal-title"
                        : undefined
                    }
                  >
                    {title}
                  </Title>
                ) : (
                  title
                )
              ) : (
                <span />
              )}
            </Header>
          )}
          {!hideCloseButton && (
            <CloseButton aria-label="Close" onClick={onClose}>
              ×
            </CloseButton>
          )}
          <Body>{children}</Body>
          {footer && <Footer>{footer}</Footer>}
        </Dialog>
      </ModalContainer>
    </>
  );

  const portalTarget = typeof window !== "undefined" ? document.body : null;
  if (!portalTarget) return null;
  return createPortal(content, portalTarget);
};

export default Modal;
export type { ModalProps, ModalSize };
