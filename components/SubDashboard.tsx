
import React from 'react';
import { Assignment } from '../types';

interface SubDashboardProps {
  assignments: Assignment[];
}

const SubDashboard: React.FC<SubDashboardProps> = ({ assignments }) => {
  const data = assignments.filter(a => ['sub_preventive', 'sub_reroute', 'sub_reconfigure'].includes(a.category));
  
  const total = data.length;
  const totalCost = data.reduce((sum, a) => sum + (Number(a.expenses) || 0), 0);
  const activeSubs = Array.from(new Set(data.map(a => a.subcontractor).filter(Boolean)));
  const avgCost = total > 0 ? totalCost / total : 0;

  return (
    <div className="animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-orange-500">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Sub Jobs</p>
            <h3 className="text-3xl font-bold mt-1">{total}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-green-500">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Expenses</p>
            <h3 className="text-3xl font-bold text-green-600 mt-1">{totalCost.toLocaleString()} ฿</h3>
            <p className="text-xs text-gray-400 mt-1">Estimate Cost</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-blue-500">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Active Subs</p>
            <h3 className="text-3xl font-bold text-blue-600 mt-1">{activeSubs.length}</h3>
            <p className="text-xs text-gray-400 mt-1">Teams with jobs</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-purple-500">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Avg Cost/Job</p>
            <h3 className="text-3xl font-bold text-purple-600 mt-1">{Math.round(avgCost).toLocaleString()} ฿</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h4 className="font-bold text-gray-700 flex items-center">
                <i className="fa-solid fa-list-check mr-2 text-orange-500"></i> สรุปผลงานผู้รับเหมา
            </h4>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
                    <tr>
                        <th className="p-4">ชื่อผู้รับเหมา</th>
                        <th className="p-4 text-center">จำนวนงาน</th>
                        <th className="p-4 text-center">เสร็จสิ้น</th>
                        <th className="p-4 text-right">ค่าใช้จ่ายรวม</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {activeSubs.map(sub => {
                        const subJobs = data.filter(a => a.subcontractor === sub);
                        const subFinish = subJobs.filter(a => ['finish', 'complete'].includes(a.status)).length;
                        const subCost = subJobs.reduce((sum, a) => sum + (Number(a.expenses) || 0), 0);
                        return (
                            <tr key={sub} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-700">{sub}</td>
                                <td className="p-4 text-center">{subJobs.length}</td>
                                <td className="p-4 text-center text-green-600 font-bold">{subFinish}</td>
                                <td className="p-4 text-right font-mono font-bold text-brand-600">{subCost.toLocaleString()} ฿</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default SubDashboard;
