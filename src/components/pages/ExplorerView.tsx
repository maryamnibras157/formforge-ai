'use client';

import React, { useState } from 'react';
import { Terminal, Send, HelpCircle, Code, ShieldAlert, Cpu } from 'lucide-react';

export default function ExplorerView() {
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [endpoint, setEndpoint] = useState('/api/v1/projects/default-project/records');
  const [reqHeaders, setReqHeaders] = useState('{\n  "Authorization": "Bearer ff_live_58c2a4c1f9b8c2901a5d",\n  "Content-Type": "application/json"\n}');
  const [reqBody, setReqBody] = useState('{\n  "name": "Mechanical Keyboard Ultra",\n  "qty": 45,\n  "price": 89.99,\n  "status": "In Stock"\n}');
  const [isSending, setIsSending] = useState(false);
  
  // API Response States
  const [respStatus, setRespStatus] = useState<number | null>(null);
  const [respTime, setRespTime] = useState<number | null>(null);
  const [respBody, setRespBody] = useState<string>('');

  const handleSend = async () => {
    setIsSending(true);
    setRespStatus(null);
    setRespBody('');
    
    const startTime = Date.now();

    try {
      // Mock network latency for API generation simulation
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const duration = Date.now() - startTime;
      setRespTime(duration);

      if (method === 'GET') {
        setRespStatus(200);
        setRespBody(JSON.stringify({
          success: true,
          message: "Records fetched successfully",
          count: 5,
          data: [
            { id: 'PROD-001', name: 'Premium Mechanical Keyboard', qty: 142, price: 129.99, status: 'In Stock' },
            { id: 'PROD-002', name: 'Ergonomic Standing Desk Pro', qty: 3, price: 549.50, status: 'Low Stock' },
            { id: 'PROD-003', name: 'Noise-Cancelling Headphones', qty: 0, price: 299.00, status: 'Out of Stock' }
          ]
        }, null, 2));
      } else if (method === 'POST') {
        // Simple mock validator for POST
        try {
          const parsedBody = JSON.parse(reqBody);
          if (!parsedBody.name || parsedBody.qty === undefined || parsedBody.price === undefined) {
            setRespStatus(400);
            setRespBody(JSON.stringify({
              success: false,
              error: "Schema Mismatch",
              message: "Required fields name, qty, price are missing in POST body payload."
            }, null, 2));
          } else {
            setRespStatus(201);
            setRespBody(JSON.stringify({
              success: true,
              message: "Record created successfully",
              data: {
                id: `PROD-${Math.floor(100 + Math.random() * 900)}`,
                ...parsedBody,
                updated: new Date().toISOString().split('T')[0]
              }
            }, null, 2));
          }
        } catch (e) {
          setRespStatus(400);
          setRespBody(JSON.stringify({
            success: false,
            error: "Malformed JSON",
            message: "Failed to parse requested request body payload. Syntactical JSON error."
          }, null, 2));
        }
      } else {
        setRespStatus(200);
        setRespBody(JSON.stringify({
          success: true,
          message: "Operation completed successfully (Simulated)"
        }, null, 2));
      }
    } catch (err) {
      setRespStatus(500);
      setRespBody(JSON.stringify({ success: false, error: 'Internal Server Error' }, null, 2));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-zinc-800/60 pb-5 shrink-0">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
          CRUD API Explorer <Terminal className="w-5 h-5 text-blue-400" />
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Simulate raw HTTP requests directly against your generated serverless layouts schema boundaries.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Left terminal panel: Request Builder */}
        <div className="glass-panel p-6 rounded-2xl glow-blue/5 flex flex-col gap-4 min-h-[460px]">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider border-b border-zinc-850 pb-2">
            Dynamic Request Panel
          </h3>

          <div className="flex gap-2">
            <select
              value={method}
              onChange={(e: any) => setMethod(e.target.value)}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-zinc-300 bg-zinc-950 border border-zinc-800 focus:outline-none cursor-pointer shrink-0"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>

            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="flex-1 glass-input py-2.5 px-4 rounded-xl text-xs font-mono text-zinc-300"
            />
            
            <button
              onClick={handleSend}
              disabled={isSending}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-lg shadow-violet-500/10"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </div>

          {/* Request headers editor */}
          <div className="flex flex-col gap-1.5 mt-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Headers JSON</span>
            <textarea
              value={reqHeaders}
              onChange={(e) => setReqHeaders(e.target.value)}
              className="w-full p-3 font-mono text-[10px] leading-normal text-zinc-400 bg-zinc-950 rounded-xl border border-zinc-900 resize-none min-h-[90px] focus:outline-none"
            />
          </div>

          {/* Request body payload editor */}
          {method !== 'GET' && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Request Payload JSON Body</span>
              <textarea
                value={reqBody}
                onChange={(e) => setReqBody(e.target.value)}
                className="w-full p-3 font-mono text-[10px] leading-normal text-zinc-400 bg-zinc-950 rounded-xl border border-zinc-900 resize-none min-h-[120px] focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Right terminal panel: Response Terminal */}
        <div className="glass-panel p-6 rounded-2xl bg-zinc-950/80 border border-zinc-900 flex flex-col justify-between min-h-[460px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[80px] rounded-full" />
          
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-4.5 h-4.5 text-zinc-500" /> Response Terminal
              </h3>
              
              {respStatus !== null && (
                <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wider">
                  <span
                    className={`px-2 py-0.5 rounded border ${
                      respStatus >= 200 && respStatus < 300
                        ? 'bg-green-950/30 border-green-500/20 text-green-400'
                        : 'bg-red-950/20 border-red-500/20 text-red-400'
                    }`}
                  >
                    Status: {respStatus}
                  </span>
                  {respTime !== null && <span className="text-zinc-500">{respTime}ms</span>}
                </div>
              )}
            </div>

            {respBody ? (
              /* Compiled terminal body */
              <pre className="p-4 text-[10px] font-mono leading-relaxed bg-zinc-950/40 border border-zinc-900 text-zinc-400 rounded-xl overflow-y-auto max-h-[340px] whitespace-pre-wrap flex-1 select-all select-text">
                {respBody}
              </pre>
            ) : (
              /* Default prompt info */
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3.5 py-20 text-zinc-600">
                {isSending ? (
                  <>
                    <Cpu className="w-8 h-8 opacity-45 animate-spin text-blue-400" />
                    <span className="text-[11px] font-bold text-zinc-400">Processing REST query...</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-8 h-8 opacity-40 animate-pulse" />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-bold text-zinc-400">REST Telemetry Standby</span>
                      <p className="text-[10px] text-zinc-500 leading-normal px-6">
                        Configure method verb settings and headers JSON, then hit the Send button to dispatch and parse responses inside this inspector.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
