
import React from 'react';
import { Assignment } from '../types';

interface SummaryDashboardProps {
  assignments: Assignment[];
}

const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ assignments }) => {
  const data = assignments.filter(a => a.category === 'summary_plan');
  
  const total = data.length;
  const complete = data.filter(a => a.status === 'complete').length;
  const ongoing = data.filter(a => a.status === 'process').length;
  const totalDist = data.reduce((sum, a) => sum + (Number(a.distance) || 0), 0);
  const impactCount = data.filter(a => a.symImpact && a.symImpact !== 'Non Impact').length;

  return (
    <div className="animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-2xl shadow-lg text-white relative overflow-hidden">
            <p className="text-blue-100 text-xs font-bold uppercase mb-2 border-b border-blue-400 pb-1">Total Routes</p>
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-3xl font-bold">{total}</h3>
                    <p className="text-[10px] opacity-70">Jobs planned</p>
                </div>
                <div className="text-right">
                    <h3 className="text-xl font-bold">{totalDist.toFixed(1)}</h3>
                    <p className="text-[10px] opacity-70">Total KM</p>
                </div>
            </div>
            <i className="fa-solid fa-route absolute -bottom-4 -right-4 text-7xl text-white opacity-10"></i>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 rounded-2xl shadow-lg text-white relative overflow-hidden">
            <p className="text-orange-100 text-xs font-bold uppercase mb-2 border-b border-orange-400 pb-1">Impacted</p>
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-3xl font-bold">{impactCount}</h3>
                    <p className="text-[10px] opacity-70">SYMC Impacted</p>
                </div>
            </div>
            <i className="fa-solid fa-triangle-exclamation absolute -bottom-4 -right-4 text-7xl text-white opacity-10"></i>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-2xl shadow-lg text-white relative overflow-hidden">
            <p className="text-green-100 text-xs font-bold uppercase mb-2 border-b border-green-400 pb-1">Completed</p>
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-3xl font-bold">{complete}</h3>
                    <p className="text-[10px] opacity-70">Jobs finished</p>
                </div>
            </div>
            <i className="fa-solid fa-check-circle absolute -bottom-4 -right-4 text-7xl text-white opacity-10"></i>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-5 rounded-2xl shadow-lg text-white relative overflow-hidden">
            <p className="text-yellow-100 text-xs font-bold uppercase mb-2 border-b border-yellow-400 pb-1">On Going</p>
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-3xl font-bold">{ongoing}</h3>
                    <p className="text-[10px] opacity-70">In progress</p>
                </div>
            </div>
            <i className="fa-solid fa-person-digging absolute -bottom-4 -right-4 text-7xl text-white opacity-10"></i>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h4 className="font-bold text-gray-700 mb-6 border-b pb-2">Recent Project Plans</h4>
        <div className="space-y-4">
            {data.slice(0, 5).map(job => (
                <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-300 transition-colors">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4 font-bold text-xs">
                            {job.internalId.slice(-2)}
                        </div>
                        <div>
                            <p className="font-bold text-sm text-gray-800">{job.routeName || job.description}</p>
                            <p className="text-xs text-gray-400">{job.routeCode || 'No Code'} • {job.distance || 0} km.</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${job.status === 'complete' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {job.status.toUpperCase()}
                        </span>
                        <div className="w-24 bg-gray-200 rounded-full h-1 mt-2">
                            <div className={`h-1 rounded-full ${job.status === 'complete' ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${job.progressPercent || 0}%` }}></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryDashboard;
