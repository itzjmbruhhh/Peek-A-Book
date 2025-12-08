/**
 * Component: Overlay
 * Purpose: A simple backdrop used for modals and mobile menus.
 * Accepts `isOpen` to toggle visibility and `onClose` to handle clicks.
 */
interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

function Overlay({ isOpen, onClose }: OverlayProps) {
  const base =
    "fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ease-out";

  return (
    <div
      className={`${base} ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
      aria-hidden
    />
  );
}

export default Overlay;
