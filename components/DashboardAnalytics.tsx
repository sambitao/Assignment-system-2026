
import React from 'react';
import { Assignment } from '../types';

interface DashboardAnalyticsProps {
  assignments: Assignment[];
}

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ assignments }) => {
  const data = assignments.filter(a => a.category !== 'summary_plan');
  
  const total = data.length;
  const success = data.filter(a => ['finish', 'complete', 'update_fms'].includes(a.status)).length;
  const pending = data.filter(a => ['new', 'process', 'assign', 'approve'].includes(a.status)).length;
  const cancel = data.filter(a => a.status === 'cancel').length;
  
  const successRate = total > 0 ? Math.round((success / total) * 100) : 0;

  const StatCard = ({ title, value, sub, color, icon }: any) => (
    <div className={`bg-white p-5 rounded-2xl shadow-sm border-l-4 ${color}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-bold mt-1">{value}</h3>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`p-2 rounded-lg opacity-20 text-xl`}>
          <i className={icon}></i>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Jobs" value={total} color="border-blue-500" icon="fa-solid fa-list-check" />
        <StatCard title="Success Rate" value={`${successRate}%`} sub={`${success} completed`} color="border-green-500" icon="fa-solid fa-circle-check" />
        <StatCard title="Pending" value={pending} color="border-yellow-500" icon="fa-solid fa-clock" />
        <StatCard title="Cancelled" value={cancel} color="border-red-500" icon="fa-solid fa-ban" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h4 className="font-bold text-gray-700 mb-4 border-b pb-2 flex items-center">
            <i className="fa-solid fa-chart-pie mr-2 text-blue-500"></i> ปริมาณงานแยกตามสถานะ
          </h4>
          <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl">
             <div className="text-center">
                <i className="fa-solid fa-chart-simple text-4xl mb-2 opacity-20"></i>
                <p className="text-sm">Chart rendering visualization</p>
             </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h4 className="font-bold text-gray-700 mb-4 border-b pb-2 flex items-center">
            <i className="fa-solid fa-chart-line mr-2 text-green-500"></i> แนวโน้มงานรายวัน
          </h4>
          <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl">
             <div className="text-center">
                <i className="fa-solid fa-wave-square text-4xl mb-2 opacity-20"></i>
                <p className="text-sm">Daily trend visualization</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
