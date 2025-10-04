import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid
} from 'recharts';
import { Multiplier, RangeCategory } from '../types';

interface HistoryViewProps {
  history: Multiplier[];
  t: (key: string) => string;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, t }) => {
    const categoryCounts = {
        [RangeCategory.LOW]: history.filter(h => h.category === RangeCategory.LOW).length,
        [RangeCategory.MEDIUM]: history.filter(h => h.category === RangeCategory.MEDIUM).length,
        [RangeCategory.HIGH]: history.filter(h => h.category === RangeCategory.HIGH).length,
    };

    const chartData = [
        { name: t('low'), count: categoryCounts[RangeCategory.LOW], color: '#ef4444' },
        { name: t('medium'), count: categoryCounts[RangeCategory.MEDIUM], color: '#f59e0b' },
        { name: t('high'), count: categoryCounts[RangeCategory.HIGH], color: '#22c55e' },
    ];
    
    const lineChartData = [...history].reverse().map((item, index) => ({
        round: `${index + 1}`,
        value: item.value,
    }));
    
    const categoryColorClass = (category: RangeCategory) => {
        switch(category) {
            case RangeCategory.LOW: return 'text-red-400';
            case RangeCategory.MEDIUM: return 'text-yellow-400';
            case RangeCategory.HIGH: return 'text-green-400';
        }
    }

  return (
    <div className="p-4 space-y-4 animate-fade-in h-[550px] flex flex-col">
        <div>
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">{t('distribution')}</h3>
            <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} cursor={{fill: 'rgba(100, 116, 139, 0.1)'}}/>
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div>
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">{t('multiplierTrend')}</h3>
            <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={lineChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="round" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={50} />
                        <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin', 'auto']} width={40}/>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} 
                            cursor={{stroke: '#67e8f9', strokeWidth: 1}} 
                            labelFormatter={(label) => `${t('round')} #${label}`} 
                            formatter={(value: number) => [`${value.toFixed(2)}x`, t('multiplier')]}
                        />
                        <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={2} dot={false} activeDot={{ r: 5, strokeWidth: 1 }} />
                     </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
        
        <div className="flex-grow flex flex-col min-h-0">
            <h3 className="text-sm font-semibold text-cyan-400 mb-2">{t('multiplierHistory')}</h3>
            <div className="flex-grow bg-slate-800/50 rounded-lg overflow-y-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-400 uppercase bg-slate-900 sticky top-0">
                        <tr>
                            <th scope="col" className="px-4 py-2">{t('round')}</th>
                            <th scope="col" className="px-4 py-2">{t('multiplier')}</th>
                            <th scope="col" className="px-4 py-2">{t('category')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((item, index) => (
                            <tr key={item.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                                <td className="px-4 py-1.5 text-gray-300">#{history.length - index}</td>
                                <td className="px-4 py-1.5 font-mono font-semibold text-white">{item.value.toFixed(2)}x</td>
                                <td className={`px-4 py-1.5 font-semibold ${categoryColorClass(item.category)}`}>{t(item.category.toLowerCase())}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default HistoryView;
