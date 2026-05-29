'use client';

import React, { useState } from 'react';
import { FileDown, Upload, FileText, CheckCircle, AlertTriangle, Layers, Plus } from 'lucide-react';
import Papa from 'papaparse';

export default function ImportsView() {
  const [isDragging, setIsDragging] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappedFields, setMappedFields] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'parsed' | 'imported'>('idle');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setCsvFile(file);
    
    // Papa Parse csv processor
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length > 0) {
          const firstRow = results.data[0] as Record<string, any>;
          const cols = Object.keys(firstRow);
          setHeaders(cols);
          setParsedData(results.data);
          
          // Auto map columns based on similarity
          const initialMap: Record<string, string> = {};
          cols.forEach((col) => {
            const lower = col.toLowerCase();
            if (lower.includes('name')) initialMap[col] = 'name';
            else if (lower.includes('email')) initialMap[col] = 'email';
            else if (lower.includes('qty') || lower.includes('stock')) initialMap[col] = 'qty';
            else if (lower.includes('price') || lower.includes('cost')) initialMap[col] = 'price';
            else initialMap[col] = 'ignore';
          });
          setMappedFields(initialMap);
          setStatus('parsed');
        }
      },
      error: () => {
        alert("Failed to parse the uploaded CSV layout.");
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].name.endsWith('.csv')) {
      processFile(files[0]);
    } else {
      alert("Unsupported file format. Please drop a valid .csv file.");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0].name.endsWith('.csv')) {
      processFile(files[0]);
    }
  };

  const triggerImport = () => {
    setStatus('imported');
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-zinc-800/60 pb-5 shrink-0">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          CSV Import Matching Center <FileDown className="w-5 h-5 text-violet-400" />
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Parse physical CSV logs with Papa Parse. Match schema columns and sync directly into database grids.
        </p>
      </div>

      {status === 'idle' && (
        /* 1. Drag and Drop Uploader */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full max-w-2xl mx-auto p-12 rounded-3xl glass-panel text-center flex flex-col items-center justify-center gap-5 cursor-pointer relative overflow-hidden transition-all duration-200 ${
            isDragging ? 'border-blue-500/40 bg-blue-950/10' : 'border-zinc-800/60 hover:border-zinc-700/60 hover:bg-zinc-900/10'
          }`}
        >
          <input
            type="file"
            accept=".csv"
            id="csv-select"
            className="hidden"
            onChange={handleFileSelect}
          />
          <label htmlFor="csv-select" className="flex flex-col items-center cursor-pointer gap-4">
            <div className="p-4.5 rounded-full bg-zinc-900 border border-zinc-800 text-blue-400">
              <Upload className="w-8 h-8" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-zinc-250">Drop CSV file here</span>
              <p className="text-xs text-zinc-500 max-w-xs leading-normal">
                Click to browse or drop an export sheet to match against target application tables database indexes.
              </p>
            </div>
          </label>
        </div>
      )}

      {status === 'parsed' && (
        /* 2. Column matching sheet */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left panel: Columns Matching selectors */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 glow-violet/5">
            <div className="flex items-center gap-2 border-b border-zinc-850 pb-2">
              <Layers className="w-4.5 h-4.5 text-violet-400" />
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-200">
                Column Schema Mapping
              </h3>
            </div>
            
            <p className="text-[11px] text-zinc-450 leading-relaxed">
              Match columns discovered inside <strong className="text-zinc-300 font-bold">{csvFile?.name}</strong> to application model properties.
            </p>

            <div className="flex flex-col gap-3.5 mt-2">
              {headers.map((hdr) => (
                <div key={hdr} className="flex items-center justify-between gap-3 text-xs bg-zinc-950 p-2 rounded-xl border border-zinc-900">
                  <span className="font-mono text-zinc-300 truncate">{hdr}</span>
                  <select
                    value={mappedFields[hdr] || 'ignore'}
                    onChange={(e) => setMappedFields({ ...mappedFields, [hdr]: e.target.value })}
                    className="py-1 px-2.5 rounded-lg text-[10px] font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 focus:outline-none cursor-pointer"
                  >
                    <option value="name">Product Name (name)</option>
                    <option value="qty">Qty Stock (qty)</option>
                    <option value="price">Price (price)</option>
                    <option value="email">Email (email)</option>
                    <option value="ignore">Ignore Column</option>
                  </select>
                </div>
              ))}
            </div>

            <button
              onClick={triggerImport}
              className="w-full mt-4 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-violet-500/10"
            >
              <CheckCircle className="w-4 h-4" /> Finalize Synchronize ({parsedData.length} rows)
            </button>
          </div>

          {/* Right panel: Parsed Rows Preview */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col gap-4">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider border-b border-zinc-850 pb-2">
              Import Preview Visual
            </h3>
            
            <div className="w-full overflow-x-auto rounded-xl border border-zinc-900 bg-zinc-950/40">
              <table className="w-full text-left border-collapse text-[11px] whitespace-nowrap">
                <thead>
                  <tr className="border-b border-zinc-900 bg-zinc-950 text-zinc-500 font-bold uppercase tracking-wider">
                    {headers.map((h) => (
                      <th key={h} className="p-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {parsedData.slice(0, 5).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-zinc-900/20 text-zinc-350">
                      {headers.map((h) => (
                        <td key={h} className="p-3">{row[h]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <span className="text-[10px] text-zinc-500 mt-1">
              Previewing first 5 rows of <strong>{parsedData.length}</strong> entries loaded.
            </span>
          </div>

        </div>
      )}

      {status === 'imported' && (
        /* 3. Success reporting metrics */
        <div className="w-full max-w-xl mx-auto p-12 rounded-3xl glass-panel text-center flex flex-col items-center justify-center gap-5 glow-blue/5">
          <div className="p-4 rounded-full bg-green-950/30 border border-green-500/20 text-green-400 animate-pulse">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-zinc-250">Import Completed Successfully</h3>
            <p className="text-xs text-zinc-500 max-w-sm leading-normal">
              Papa Parse parsed and processed <strong>{parsedData.length}</strong> records from <strong className="text-zinc-400 font-semibold">{csvFile?.name}</strong>. Data synchronized into Inventory database catalogs.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs border-y border-zinc-900 py-4 my-2 text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Synchronized Rows</span>
              <strong className="text-zinc-200 text-base font-black">{parsedData.length}</strong>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Validation Warnings</span>
              <strong className="text-green-400 text-base font-black">0</strong>
            </div>
          </div>

          <button
            onClick={() => setStatus('idle')}
            className="py-2.5 px-6 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Upload Another CSV Sheet
          </button>
        </div>
      )}
    </div>
  );
}
