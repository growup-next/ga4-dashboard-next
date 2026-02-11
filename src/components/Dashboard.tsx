// src/components/Dashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, Users, MousePointerClick, 
  Clock, Award, Activity, TrendingUp, Zap, type LucideIcon, AlertCircle 
} from 'lucide-react';

interface KPIValue {
  value: string;
  prev: string;
}

interface KPIData {
  users: KPIValue;
  sessions: KPIValue;
  conversions: KPIValue;
  avgDuration: KPIValue;
}

interface TrendData {
  name: string;
  users: number;
  sessions: number;
}

interface DeviceData {
  name: string;
  value: number;
  color: string;
}

interface CountryData {
  name: string;
  value: number;
  color: string;
}

interface DashboardData {
  kpi: KPIData;
  trend: TrendData[];
  daily: TrendData[]; // New: Daily Activity
  device: DeviceData[];
  country: CountryData[]; // New: User Attribute (Geo)
  propertyId?: string;
}

// Helper: Calculate percentage change
const calculateChange = (current: string, prev: string) => {
  const currVal = parseFloat(current);
  const prevVal = parseFloat(prev);
  if (prevVal === 0) return '+0%';
  const change = ((currVal - prevVal) / prevVal) * 100;
  return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
};

// Helper: Format duration (seconds -> mm:ss)
const formatDuration = (secondsStr: string) => {
  const seconds = parseInt(secondsStr);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}分${remainingSeconds}秒`;
};

// Helper: Format large numbers
const formatNumber = (numStr: string) => {
  return parseInt(numStr).toLocaleString();
};

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  delay: number;
}

const KPICard = ({ title, value, change, icon: Icon, delay }: KPICardProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon size={64} className="text-blue-500" />
    </div>
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl ring-1 ring-blue-100 dark:ring-blue-800">
        <Icon className="text-blue-600 dark:text-blue-400" size={24} />
      </div>
      <div className={`flex items-center text-sm font-bold ${change.startsWith('+') ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'text-rose-500 bg-rose-50 dark:bg-rose-900/20'} px-2.5 py-1 rounded-full`}>
        {change.startsWith('+') ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
        {change}
      </div>
    </div>
    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
    <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">{value}</div>
    <p className="text-xs text-slate-400 mt-2">対前年比</p>
  </motion.div>
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [chartRange, setChartRange] = useState<'12m' | '30d'>('12m');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/ga4?propertyId='); // Empty propertyId triggers sheet lookup
        
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || `API Error: ${res.status}`);
        }
        
        const jsonData = await res.json();
        // Fallback for daily/country if older API response format
        if (!jsonData.daily) jsonData.daily = [];
        if (!jsonData.country) jsonData.country = [];
        setData(jsonData);
        setLoading(false);

      } catch (err: any) {
        console.error(err);
        setErrorDetails(err.message);
        
        // Fallback Mock Data
        const mockData: DashboardData = {
            kpi: {
                users: { value: '15420', prev: '12000' },
                sessions: { value: '24500', prev: '21000' },
                conversions: { value: '340', prev: '280' },
                avgDuration: { value: '185', prev: '190' }
            },
            trend: [
                { name: '2025/02', users: 800, sessions: 1200 },
                { name: '2025/03', users: 950, sessions: 1400 },
                { name: '2025/04', users: 1100, sessions: 1600 },
                { name: '2025/05', users: 1050, sessions: 1550 },
                { name: '2025/06', users: 1200, sessions: 1800 },
                { name: '2025/07', users: 1350, sessions: 1950 },
                { name: '2025/08', users: 1500, sessions: 2200 },
                { name: '2025/09', users: 1400, sessions: 2100 },
                { name: '2025/10', users: 1600, sessions: 2400 },
                { name: '2025/11', users: 1800, sessions: 2700 },
                { name: '2025/12', users: 1900, sessions: 2850 },
                { name: '2026/01', users: 2100, sessions: 3100 },
            ],
            daily: [
              { name: '01/12', users: 120, sessions: 180 },
              { name: '01/13', users: 150, sessions: 220 },
              { name: '01/14', users: 130, sessions: 190 },
              { name: '01/15', users: 140, sessions: 210 },
              { name: '01/16', users: 180, sessions: 260 },
              { name: '01/17', users: 210, sessions: 310 }, // Weekend spike
              { name: '01/18', users: 230, sessions: 340 },
              { name: '01/19', users: 160, sessions: 240 },
              { name: '01/20', users: 150, sessions: 230 },
              { name: '01/21', users: 140, sessions: 220 },
              { name: '01/22', users: 170, sessions: 250 },
              { name: '01/23', users: 190, sessions: 280 },
              { name: '01/24', users: 220, sessions: 330 },
              { name: '01/25', users: 240, sessions: 360 },
              { name: '01/26', users: 160, sessions: 240 },
              { name: '01/27', users: 150, sessions: 230 },
              { name: '01/28', users: 140, sessions: 210 },
              { name: '01/29', users: 130, sessions: 200 },
              { name: '01/30', users: 170, sessions: 260 },
              { name: '01/31', users: 210, sessions: 310 },
              { name: '02/01', users: 230, sessions: 340 },
              { name: '02/02', users: 160, sessions: 240 },
              { name: '02/03', users: 150, sessions: 230 },
              { name: '02/04', users: 140, sessions: 210 },
              { name: '02/05', users: 130, sessions: 200 },
              { name: '02/06', users: 170, sessions: 260 },
              { name: '02/07', users: 210, sessions: 310 },
              { name: '02/08', users: 230, sessions: 340 },
              { name: '02/09', users: 160, sessions: 240 },
              { name: '02/10', users: 150, sessions: 230 },
            ],
            device: [
                { name: 'Mobile', value: 8500, color: '#3b82f6' },
                { name: 'Desktop', value: 5200, color: '#10b981' },
                { name: 'Tablet', value: 1720, color: '#f59e0b' },
            ],
            country: [
              { name: 'Japan', value: 12400, color: '#8b5cf6' },
              { name: 'United States', value: 1800, color: '#ec4899' },
              { name: 'Taiwan', value: 650, color: '#6366f1' },
              { name: 'Korea', value: 320, color: '#14b8a6' },
              { name: 'China', value: 250, color: '#f97316' },
            ]
        };
        setData(mockData);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600 font-bold">
            <Activity size={24} className="animate-pulse"/>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Debug Error Alert */}
        {errorDetails && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="text-red-600 dark:text-red-400 mt-0.5" size={20} />
                <div>
                    <h3 className="text-red-800 dark:text-red-200 font-bold text-sm">データ取得エラー（デバッグ用）</h3>
                    <p className="text-red-600 dark:text-red-300 text-xs mt-1 font-mono break-all">{errorDetails}</p>
                    <p className="text-red-500 dark:text-red-400 text-xs mt-2">※現在はダミーデータを表示しています。</p>
                </div>
            </div>
        )}

        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">Beta</span>
              <span className="text-slate-400 text-xs">v2.0.1</span>
              {data.propertyId && <span className="text-xs text-slate-400 ml-2">ID: {data.propertyId}</span>}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              経営層向け GA4 分析ダッシュボード
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">
              AIによる自動分析とビジネスインサイト
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition shadow-sm text-slate-700 dark:text-slate-200">
              レポート出力
            </button>
            <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-blue-500/20 flex items-center gap-2">
              <Activity size={18} />
              最新データに更新
            </button>
          </div>
        </motion.header>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            title="訪問ユーザー数" 
            value={formatNumber(data.kpi.users.value)} 
            change={calculateChange(data.kpi.users.value, data.kpi.users.prev)} 
            icon={Users} 
            delay={0.1} 
          />
          <KPICard 
            title="セッション数" 
            value={formatNumber(data.kpi.sessions.value)} 
            change={calculateChange(data.kpi.sessions.value, data.kpi.sessions.prev)} 
            icon={MousePointerClick} 
            delay={0.2} 
          />
          <KPICard 
            title="平均滞在時間" 
            value={formatDuration(data.kpi.avgDuration.value)} 
            change={calculateChange(data.kpi.avgDuration.value, data.kpi.avgDuration.prev)} 
            icon={Clock} 
            delay={0.3} 
          />
          <KPICard 
            title="コンバージョン数" 
            value={formatNumber(data.kpi.conversions.value)} 
            change={calculateChange(data.kpi.conversions.value, data.kpi.conversions.prev)} 
            icon={Award} 
            delay={0.4} 
          />
        </div>

        {/* Charts & Insights Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-100 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <TrendingUp className="text-blue-500" size={20} />
                {chartRange === '12m' ? '年間トラフィック推移' : '過去30日のアクティビティ'}
              </h2>
              <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-1 flex text-xs font-medium">
                <button 
                  onClick={() => setChartRange('12m')}
                  className={`px-3 py-1 shadow-sm rounded-md transition-all ${chartRange === '12m' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                >
                  過去1年
                </button>
                <button 
                  onClick={() => setChartRange('30d')}
                  className={`px-3 py-1 shadow-sm rounded-md transition-all ${chartRange === '30d' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                >
                  過去30日
                </button>
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartRange === '12m' ? data.trend : data.daily} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} minTickGap={30} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#1e293b' }}
                    labelStyle={{ color: '#64748b', marginBottom: '0.5rem' }}
                  />
                  <Area type="monotone" dataKey="users" name="ユーザー数" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                  <Area type="monotone" dataKey="sessions" name="セッション" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSessions)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* AI Insights Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500 opacity-20 rounded-full blur-3xl pointer-events-none"></div>
            
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
              <Zap className="text-yellow-400 fill-current" size={20} />
              AI インサイト
            </h2>
            
            <div className="space-y-4 flex-1 relative z-10">
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-300 mt-1 group-hover:scale-110 transition-transform">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 text-slate-100">コンバージョン率が急上昇</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      週末にかけてCVRが <strong className="text-white">15%</strong> 向上しました。特にモバイル経由の流入が貢献しています。
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg text-amber-300 mt-1 group-hover:scale-110 transition-transform">
                    <Activity size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1 text-slate-100">離脱率の改善提案</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      「料金プラン」ページの滞在時間が短くなっています。FAQセクションの追加を検討してください。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-500 transition shadow-lg shadow-blue-500/25 relative z-10">
              詳細レポートを表示
            </button>
          </motion.div>
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-100 dark:border-slate-700"
            >
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">デバイス別比率</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.device} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{fill: '#64748b', fontSize: 14, fontWeight: 500}} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={32}>
                      {data.device.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </motion.div>

           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md border border-slate-100 dark:border-slate-700"
            >
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">地域別ユーザー分布 (Top 5)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.country} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} opacity={0.3} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{fill: '#64748b', fontSize: 14, fontWeight: 500}} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                      {data.country.map((entry, index) => (
                        <Cell key={`cell-country-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </motion.div>
        </div>

      </div>
    </div>
  );
}
