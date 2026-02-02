import React, { type ReactNode } from 'react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-7xl',
  full: 'max-w-full m-4',
};

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: ModalSize;
}

const Modal = ({
  children,
  isOpen,
  onClose,
  title = '',
  description = '',
  size = 'md',
  className,
  ...props
}: ModalProps) => {
  if (!isOpen) return null;

  const widthClass = sizeClasses[size];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity"
      aria-modal="true"
      {...props}
    >
      <div
        className={`
          bg-white rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden max-h-[90vh]
          ${widthClass} 
          ${className ?? ''} 
        `}
      >
        {(title || description) && (
          <div className="bg-linear-to-r from-blue-500 to-blue-600 px-8 py-5 relative shrink-0">
            <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
            {description && <p className="text-blue-100 text-xs">{description}</p>}

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none"
              aria-label="Close modal"
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
        )}

        <div className="overflow-y-auto flex-1 relative">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
