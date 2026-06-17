import { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

/**
 * Drag-and-drop image upload zone.
 * @param {function} onFiles - called with FileList when files are selected/dropped
 * @param {boolean} multiple - allow multiple files
 * @param {string} previewUrl - existing image URL to show as preview
 * @param {string} label
 */
export default function ImageUploader({ onFiles, multiple = false, previewUrl, label }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(previewUrl || null);

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    if (!multiple) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(files[0]);
    }
    onFiles(files);
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
        dragOver ? 'border-navy bg-white' : 'border-[#E2DFD8] bg-[#F8F7F4] hover:border-navy hover:bg-white'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {preview && !multiple ? (
        <img src={preview} alt="Preview" className="max-h-32 mx-auto rounded-lg object-cover" />
      ) : (
        <>
          <div className="flex justify-center mb-2 text-navy/40">
            {multiple ? <Upload size={28} /> : <ImageIcon size={28} />}
          </div>
          <p className="text-sm text-gray-500">
            <span className="text-navy font-semibold">Click to upload</span> or drag & drop
            {multiple ? ' multiple files' : ''}
          </p>
          <p className="text-xs text-gray-400 mt-1">{label || 'JPG, PNG, WebP — max 5MB'}</p>
        </>
      )}
    </div>
  );
}
