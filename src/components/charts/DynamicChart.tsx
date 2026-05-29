'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { getChartMockDataForLabel } from '../../lib/runtime/mockData';

interface DynamicChartProps {
  label: string;
  chartType: 'line' | 'bar' | 'area' | 'pie';
  customData?: any[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'];

export default function DynamicChart({ label, chartType, customData }: DynamicChartProps) {
  const [mounted, setMounted] = useState(false);

  // Recharts requires a client-only render wrapper to avoid Hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  const data = useMemo(() => {
    if (customData) return customData;
    return getChartMockDataForLabel(label);
  }, [label, customData]);

  if (!mounted) {
    return (
      <div className="w-full h-[280px] bg-zinc-900/40 border border-zinc-800/60 rounded-2xl flex items-center justify-center text-zinc-500 animate-pulse text-xs font-semibold">
        Constructing dynamic chart canvas...
      </div>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: '#09090b',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fafafa',
                fontSize: '11px',
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', strokeWidth: 1 }} activeDot={{ r: 6 }} />
            {data[0]?.expenses !== undefined && (
              <Line type="monotone" dataKey="expenses" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', strokeWidth: 1 }} />
            )}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
              </linearGradient>
              {data[0]?.expenses !== undefined && (
                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              )}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: '#09090b',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fafafa',
                fontSize: '11px',
              }}
            />
            <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
            {data[0]?.expenses !== undefined && (
              <Area type="monotone" dataKey="expenses" stroke="#3b82f6" fillOpacity={1} fill="url(#colorExp)" strokeWidth={2} />
            )}
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#09090b',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fafafa',
                fontSize: '11px',
              }}
            />
          </PieChart>
        );

      case 'bar':
      default:
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: '#09090b',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fafafa',
                fontSize: '11px',
              }}
            />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={45}>
              {chartType === 'bar' && data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#8b5cf6'} />
              ))}
            </Bar>
          </BarChart>
        );
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
      
      {/* Dynamic legends footer */}
      {chartType === 'pie' && (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-1 text-[10px] font-medium text-zinc-400">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
              />
              <span>{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
