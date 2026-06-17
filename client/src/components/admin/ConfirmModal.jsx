export default function ConfirmModal({ open, title, message, onConfirm, onCancel, danger = true }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl">
        <h3 className="text-[15px] font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-5">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm bg-[#F8F7F4] hover:bg-[#E2DFD8] transition-colors">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm text-white transition-colors ${
              danger ? 'bg-red-600 hover:bg-red-700' : 'bg-navy hover:bg-navy-light'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
