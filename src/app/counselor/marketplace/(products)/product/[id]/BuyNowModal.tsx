// BuyNowModal.tsx
import React from 'react';

interface BuyNowModalProps {
  onClose: () => void;
}

const BuyNowModal: React.FC<BuyNowModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
      <div className="bg-white p-8 max-w-md w-full rounded-md">
        <h2 className="text-2xl font-bold mb-4">Buy Now</h2>
        {/* Add your form fields for name, contact, and email */}
        {/* Include form validation and submission logic */}
        <form>
          {/* Your form fields go here */}
          <button
            type="button"
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-md"
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default BuyNowModal;
