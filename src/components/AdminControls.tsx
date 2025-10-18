import React from 'react';
import { Layout, LayoutGrid } from 'lucide-react';

interface AdminControlsProps {
  isCompactView: boolean;
  onToggleView: () => void;
}

const AdminControls: React.FC<AdminControlsProps> = ({ isCompactView, onToggleView }) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onToggleView}
        className={`p-2 rounded-lg transition-colors duration-200 ${
          isCompactView
            ? 'bg-teal-100 text-teal-600'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        aria-label="Toggle compact view"
        title="Toggle compact view"
      >
        <Layout className="w-5 h-5" />
      </button>
      
      <button
        onClick={onToggleView}
        className={`p-2 rounded-lg transition-colors duration-200 ${
          !isCompactView
            ? 'bg-teal-100 text-teal-600'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        aria-label="Toggle table view"
        title="Toggle table view"
      >
        <LayoutGrid className="w-5 h-5" />
      </button>
    </div>
  );
};

export default AdminControls;