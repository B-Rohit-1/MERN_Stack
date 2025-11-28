import { useState } from "react";
import { createPortal } from "react-dom";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "8px",
        minWidth: "250px"
      }}>
        {children}
        <button onClick={onClose} style={{ marginTop: "10px" }}>
          Close
        </button>
      </div>
    </div>,
    document.body
  );
}

function MyApp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <h1>My App</h1>

      <button onClick={() => setIsOpen(true)}>
        Open Modal
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Modal Content</h2>
        <p>This content is rendered using a React Portal!</p>
      </Modal>
    </div>
  );
}

export default MyApp;
