import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function FileUpload({ label, required, onChange, accept = 'image/jpeg,image/png,application/pdf' }) {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setError('');

    if (file.size > 5 * 1024 * 1024) {
      setError('Файл слишком большой (макс. 5 МБ)');
      return;
    }

    setUploading(true);
    try {
      const res = await base44.integrations.Core.UploadFile({ file });
      const url = res.file_url;
      setFileUrl(url);
      setFileName(file.name);
      onChange(url);
    } catch {
      setError('Ошибка загрузки файла');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setFileUrl('');
    setFileName('');
    setError('');
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <label className="text-sm font-medium text-foreground flex items-center gap-1 mb-1.5">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {fileUrl ? (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-green-50 border border-green-200 rounded-lg">
          <FileText className="w-4 h-4 text-green-600 shrink-0" />
          <span className="text-sm text-green-800 truncate flex-1">{fileName || 'Файл загружен'}</span>
          <button type="button" onClick={handleRemove} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-1 px-3 py-5 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors"
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
          ) : (
            <Upload className="w-5 h-5 text-muted-foreground" />
          )}
          <span className="text-xs text-muted-foreground">
            {uploading ? 'Загрузка...' : 'Нажмите или перетащите файл'}
          </span>
        </div>
      )}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}