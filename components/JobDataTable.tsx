
import React, { useState, useMemo } from 'react';
import { Assignment, MasterData } from '../types';
import { MENU_CONFIGS } from '../constants';

interface JobDataTableProps {
  currentView: string;
  assignments: Assignment[];
  openModal: (job?: Assignment) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: string, extra?: any) => void;
  masterData: MasterData;
}

const JobDataTable: React.FC<JobDataTableProps> = ({ 
  currentView, 
  assignments, 
  openModal, 
  onDelete, 
  onUpdateStatus,
  masterData 
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const config = MENU_CONFIGS[currentView];

  const filtered = useMemo(() => {
    return assignments.filter(a => {
      const matchesSearch = [
        a.internalId, a.description, a.location, a.jobType, a.agency, a.subcontractor
      ].some(val => val?.toLowerCase().includes(search.toLowerCase()));
      
      const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [assignments, search, filterStatus]);

  const paginated = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const getStatusBadge = (status: string) => {
    const labels: Record<string, string> = {
      new: 'New Job',
      process: 'Inprocess',
      assign: 'Assign',
      approve: 'Approve',
      finish: 'Finish',
      complete: 'Complete',
      update_fms: 'Update FMS',
      cancel: 'Cancel'
    };
    return (
      <span className={`status-badge status-${status} border-current`}>
        {labels[status] || status.toUpperCase()}
      </span>
    );
  };

  const ActionButtons = ({ job }: { job: Assignment }) => {
    const isSub = config?.isSub;
    const isPlan = config?.isPlan;

    if (currentView === 'summary_plan') {
        if (job.status === 'new') {
            return (
              <>
                <button onClick={() => onUpdateStatus(job.id, 'process')} className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-[10px] shadow-sm transition">Receive</button>
                <button onClick={() => onUpdateStatus(job.id, 'cancel')} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-[10px] shadow-sm ml-1 transition">Cancel</button>
              </>
            );
        }
        if (job.status === 'process') {
            return <button onClick={() => onUpdateStatus(job.id, 'complete', { progressPercent: 100 })} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-[10px] shadow-sm transition">Complete</button>;
        }
    }

    if (isSub) {
      if (job.status === 'new') return <button onClick={() => onUpdateStatus(job.id, 'process')} className="bg-blue-500 text-white px-2 py-1 rounded text-[10px]">Receive</button>;
      if (job.status === 'process') return <button onClick={() => onUpdateStatus(job.id, 'assign')} className="bg-purple-500 text-white px-2 py-1 rounded text-[10px]">Assign</button>;
      if (job.status === 'assign') return <button onClick={() => onUpdateStatus(job.id, 'approve')} className="bg-cyan-600 text-white px-2 py-1 rounded text-[10px]">Approve</button>;
      if (job.status === 'approve') return <button onClick={() => onUpdateStatus(job.id, 'finish')} className="bg-green-500 text-white px-2 py-1 rounded text-[10px]">Finish</button>;
    }

    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col animate-fadeIn">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <i className="fa-solid fa-list-ul mr-2 text-brand-500"></i> รายการงาน {config?.title}
            </h3>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition flex items-center text-sm font-medium">
              <i className="fa-solid fa-file-excel mr-2"></i> Export
            </button>
            <button 
              onClick={() => openModal()}
              className="px-4 py-2 bg-brand-500 text-white rounded-lg shadow hover:bg-brand-600 transition flex items-center text-sm font-medium"
            >
              <i className="fa-solid fa-plus mr-2"></i> เพิ่มงาน
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="ค้นหา Job ID, รายละเอียด..." 
              value={search}
              onChange={(e) => {setSearch(e.target.value); setPage(1);}}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition"
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => {setFilterStatus(e.target.value); setPage(1);}}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 bg-white min-w-[160px]"
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="new">New Job</option>
            <option value="process">Inprocess</option>
            <option value="assign">Assign</option>
            <option value="approve">Approve</option>
            <option value="finish">Finish</option>
            <option value="complete">Complete</option>
            <option value="cancel">Cancel</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase sticky top-0 z-10 font-bold tracking-wider">
            <tr className="border-b border-gray-200">
              <th className="p-4 text-center">Job ID</th>
              <th className="p-4">Job Type</th>
              <th className="p-4">Description</th>
              <th className="p-4">Action Date</th>
              <th className="p-4">Responsible</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Manage</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-gray-400 italic">ไม่พบข้อมูลในระบบ</td>
              </tr>
            ) : paginated.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-center font-mono font-bold text-brand-600">{item.internalId}</td>
                <td className="p-4 text-xs font-semibold">{item.jobType}</td>
                <td className="p-4 max-w-[300px] truncate" title={item.description}>{item.description}</td>
                <td className="p-4 text-xs">
                  {new Date(item.actionDate).toLocaleDateString('th-TH')}
                  <br/>
                  <span className="text-gray-400">{new Date(item.actionDate).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span>
                </td>
                <td className="p-4">
                  <div className="text-xs font-medium text-blue-600">
                    {item.subcontractor || item.teamReq || '-'}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {item.nsRespond?.join(', ') || '-'}
                  </div>
                </td>
                <td className="p-4 text-center">{getStatusBadge(item.status)}</td>
                <td className="p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="flex gap-1">
                      <ActionButtons job={item} />
                    </div>
                    <div className="h-4 w-px bg-gray-200 mx-1"></div>
                    <button 
                      onClick={() => openModal(item)}
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                      title="แก้ไข"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="ลบ"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
        <div>
          Showing {filtered.length > 0 ? (page - 1) * rowsPerPage + 1 : 0} to {Math.min(page * rowsPerPage, filtered.length)} of {filtered.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <button 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-2 py-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <span className="font-bold text-gray-700">Page {page} of {totalPages || 1}</span>
          <button 
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
            className="px-2 py-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDataTable;
