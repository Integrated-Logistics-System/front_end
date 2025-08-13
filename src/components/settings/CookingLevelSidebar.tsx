// Stub CookingLevelSidebar to make Header.tsx work
interface CookingLevelSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CookingLevelSidebar = ({ isOpen, onClose }: CookingLevelSidebarProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={onClose}>
      <div className="fixed right-0 top-0 h-full w-80 bg-white p-4">
        <h2>Cooking Level Settings</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};