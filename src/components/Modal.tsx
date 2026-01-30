import React, { type ReactNode } from 'react';

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

const Modal = ({
  children,
  isOpen,
  onClose,
  title = '',
  description = '',
  ...props
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50 `}
      {...props}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden">
        <div className="bg-linear-to-r from-blue-500 to-blue-600 px-8 py-8 relative">
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          <p className="text-blue-100 text-sm">{description}</p>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};
export default Modal;
