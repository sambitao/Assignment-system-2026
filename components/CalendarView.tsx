
import React, { useState, useMemo } from 'react';
import { Assignment } from '../types';

interface CalendarViewProps {
  assignments: Assignment[];
  onJobClick: (job: Assignment) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ assignments, onJobClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const thaiMonths = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];

  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month]);
  const firstDay = useMemo(() => new Date(year, month, 1).getDay(), [year, month]);

  const changeDate = (step: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') newDate.setMonth(newDate.getMonth() + step);
    else if (viewMode === 'week') newDate.setDate(newDate.getDate() + (step * 7));
    else newDate.setDate(newDate.getDate() + step);
    setCurrentDate(newDate);
  };

  const getJobsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return assignments.filter(a => a.actionDate?.startsWith(dateStr) && a.status !== 'cancel' && a.category !== 'summary_plan');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 h-full flex flex-col animate-fadeIn">
      <div className="flex flex-col xl:flex-row justify-between items-center mb-6 flex-none gap-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => changeDate(-1)} className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-600 transition flex items-center justify-center border border-gray-200 shadow-sm">
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <h2 className="text-2xl font-bold text-gray-800 w-64 text-center">
            {thaiMonths[month]} {year + 543}
          </h2>
          <button onClick={() => changeDate(1)} className="w-10 h-10 rounded-full hover:bg-gray-100 text-gray-600 transition flex items-center justify-center border border-gray-200 shadow-sm">
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        <div className="flex gap-2">
            <div className="bg-gray-100 p-1 rounded-xl flex text-sm font-medium text-gray-500 border border-gray-200">
                <button onClick={() => setViewMode('month')} className={`px-4 py-2 rounded-lg transition-all ${viewMode === 'month' ? 'bg-white text-brand-600 shadow-sm' : 'hover:text-gray-700'}`}>Month</button>
                <button onClick={() => setViewMode('week')} className={`px-4 py-2 rounded-lg transition-all ${viewMode === 'week' ? 'bg-white text-brand-600 shadow-sm' : 'hover:text-gray-700'}`}>Week</button>
                <button onClick={() => setViewMode('day')} className={`px-4 py-2 rounded-lg transition-all ${viewMode === 'day' ? 'bg-white text-brand-600 shadow-sm' : 'hover:text-gray-700'}`}>Day</button>
            </div>
            <button onClick={() => setCurrentDate(new Date())} className="px-5 py-2 bg-brand-500 text-white rounded-xl text-sm hover:bg-brand-600 shadow-md transition font-bold">วันนี้</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2 text-center font-bold text-gray-500 text-xs uppercase tracking-widest border-b border-gray-100 pb-2">
        <div className="text-red-500">อาทิตย์</div><div>จันทร์</div><div>อังคาร</div><div>พุธ</div><div>พฤหัสบดี</div><div>ศุกร์</div><div className="text-brand-500">เสาร์</div>
      </div>

      <div className="flex-1 grid grid-cols-7 gap-2 overflow-y-auto pr-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="bg-gray-50/30 rounded-xl" />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const jobs = getJobsForDate(dayNum);
            const isToday = new Date().toDateString() === new Date(year, month, dayNum).toDateString();
            
            return (
                <div key={dayNum} className={`min-h-[120px] border rounded-2xl p-2 transition-all hover:border-brand-300 hover:shadow-md ${isToday ? 'bg-brand-50 border-brand-200' : 'bg-white border-gray-100'}`}>
                    <div className={`text-right text-sm font-bold mb-2 ${isToday ? 'text-brand-600' : 'text-gray-400'}`}>{dayNum}</div>
                    <div className="space-y-1">
                        {jobs.map(job => (
                            <div 
                                key={job.id} 
                                onClick={() => onJobClick(job)}
                                className={`text-[10px] px-2 py-1 rounded border truncate cursor-pointer transition-colors shadow-sm
                                    ${job.status === 'complete' ? 'bg-green-100 text-green-800 border-green-200' : 
                                      job.status === 'process' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                                      'bg-blue-50 text-blue-700 border-blue-100'}`}
                            >
                                <span className="font-bold mr-1">{job.actionDate.split('T')[1].slice(0,5)}</span>
                                {job.internalId}
                            </div>
                        ))}
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
