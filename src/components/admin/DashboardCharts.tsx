"use client";

import { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

interface DashboardChartsProps {
  roomDistributionData: { name: string; rooms: number }[];
  trafficData: { date: string; visitors: number }[];
  deviceData: { name: string; value: number }[];
}

const COLORS = ['#1a56db', '#f05136', '#10b981', '#f59e0b'];

export default function DashboardCharts({ roomDistributionData, trafficData, deviceData }: DashboardChartsProps) {
  // 1. Buat State untuk mengecek apakah halaman sudah di-render oleh Browser
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. Jika belum di-render oleh browser, tampilkan efek "Loading" (Skeleton)
  // Ini mencegah server Next.js salah menebak ukuran layar dan menyebabkan error Node.removeChild
  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-neutral-100/50 p-6 rounded-[1.5rem] border border-neutral-100 lg:col-span-2 min-h-[300px] animate-pulse"></div>
        <div className="bg-neutral-100/50 p-6 rounded-[1.5rem] border border-neutral-100 min-h-[250px] animate-pulse"></div>
        <div className="bg-neutral-100/50 p-6 rounded-[1.5rem] border border-neutral-100 lg:col-span-3 min-h-[300px] animate-pulse"></div>
      </div>
    );
  }

  // 3. Render grafik asli hanya ketika browser sudah siap
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      
      {/* 1. Grafik Pengunjung Website (Line Chart) */}
      <div className="bg-white p-6 rounded-[1.5rem] border border-neutral-100 shadow-sm lg:col-span-2 hover:shadow-md transition">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-neutral-900">Traffic Pengunjung Website</h3>
          {/* Teks di bawah ini sudah diperbarui menjadi 30 Hari Terakhir */}
          <p className="text-sm text-neutral-500">Total pengunjung harian (30 Hari Terakhir)</p>
        </div>
        <div className="h-72 w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={trafficData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              />
              <Line 
                type="monotone" 
                dataKey="visitors" 
                name="Pengunjung"
                stroke="#1a56db" 
                strokeWidth={4} 
                dot={{ r: 4, fill: '#1a56db', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Grafik Perangkat Pengunjung (Pie Chart) */}
      <div className="bg-white p-6 rounded-[1.5rem] border border-neutral-100 shadow-sm hover:shadow-md transition">
        <div className="mb-6 text-center">
          <h3 className="text-lg font-bold text-neutral-900">Perangkat Pengunjung</h3>
          <p className="text-sm text-neutral-500">Mobile vs Desktop (30 Hari)</p>
        </div>
        <div className="h-64 w-full min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Grafik Distribusi Kamar per Hotel (Bar Chart) */}
      <div className="bg-white p-6 rounded-[1.5rem] border border-neutral-100 shadow-sm lg:col-span-3 hover:shadow-md transition">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-neutral-900">Distribusi Tipe Kamar</h3>
          <p className="text-sm text-neutral-500">Berdasarkan properti hotel (Data Sistem)</p>
        </div>
        <div className="h-72 w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={roomDistributionData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }} barSize={50}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} allowDecimals={false} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              />
              <Bar dataKey="rooms" name="Total Kamar" fill="#f05136" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}