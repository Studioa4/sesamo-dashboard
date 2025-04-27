// /components/Modal.js

export default function Modal({ title, children, onClose }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6 relative">
          <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
          {children}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ✖️
          </button>
        </div>
      </div>
    );
  }
  