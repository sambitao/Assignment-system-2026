
import React, { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  updateDoc, 
  serverTimestamp, 
  increment 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Assignment, MasterData } from '../types';
import { CONST_DATA, MENU_CONFIGS } from '../constants';
import Swal from 'sweetalert2';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingJob: Assignment | null;
  currentCategory: string;
  masterData: MasterData;
  onSaveSuccess: () => void;
}

const JobModal: React.FC<JobModalProps> = ({ 
  isOpen, 
  onClose, 
  editingJob, 
  currentCategory, 
  masterData,
  onSaveSuccess
}) => {
  const [formData, setFormData] = useState<Partial<Assignment>>({
    internalId: 'Auto ID',
    jobType: '',
    description: '',
    agency: '',
    location: '',
    nsRespond: [],
    actionDate: new Date().toISOString().slice(0, 16),
    status: 'new',
    subcontractor: '',
    expenses: 0,
    routeCode: '',
    project: '',
    dueDate: '',
    remark: ''
  });

  const [loading, setLoading] = useState(false);
  const [prevSub, setPrevSub] = useState<string>('-');
  const [nextSub, setNextSub] = useState<string>('-');

  const config = MENU_CONFIGS[currentCategory] || MENU_CONFIGS['team'];

  useEffect(() => {
    if (editingJob) {
      setFormData({
        ...editingJob,
        actionDate: editingJob.actionDate.slice(0, 16)
      });
    } else {
      generateId();
      calculateRoundRobin();
    }
  }, [editingJob, currentCategory]);

  const generateId = async () => {
    const now = new Date();
    const prefix = `${config.prefix}${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const q = query(
      collection(db, 'assignments'), 
      where('internalId', '>=', prefix),
      where('internalId', '<=', prefix + '\uf8ff')
    );
    
    try {
      const snap = await getDocs(q);
      let maxNum = 0;
      snap.forEach(d => {
        const id = d.data().internalId;
        const num = parseInt(id.slice(prefix.length));
        if (!isNaN(num) && num > maxNum) maxNum = num;
      });
      const newId = `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
      setFormData(prev => ({ ...prev, internalId: newId }));
    } catch (err) {
      console.error("Error generating ID", err);
    }
  };

  const calculateRoundRobin = () => {
    if (!config.isSub) return;
    const subs = masterData.subcontractors;
    if (subs.length === 0) return;
    
    const rrState = masterData.rrIndexes?.[currentCategory] || { index: 0, lastJob: '-' };
    const idx = rrState.index % subs.length;
    const pIdx = (idx - 1 + subs.length) % subs.length;
    
    setPrevSub(subs[pIdx]);
    setNextSub(subs[idx]);
    setFormData(prev => ({ ...prev, subcontractor: subs[idx] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.jobType) {
        Swal.fire('Warning', 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน', 'warning');
        return;
    }

    setLoading(true);
    try {
      const finalData = {
        ...formData,
        category: currentCategory,
        updatedAt: serverTimestamp(),
      };

      if (editingJob) {
        await updateDoc(doc(db, 'assignments', editingJob.id), finalData);
      } else {
        await addDoc(collection(db, 'assignments'), {
          ...finalData,
          createdAt: serverTimestamp(),
          status: 'new'
        });

        // Update Round Robin Index if applicable
        if (config.isSub && formData.jobType !== 'Special Job') {
          const rrRef = doc(db, 'settings', 'masterData');
          const currentIdx = masterData.rrIndexes?.[currentCategory]?.index || 0;
          await updateDoc(rrRef, {
            [`rrIndexes.${currentCategory}`]: {
              index: currentIdx + 1,
              lastJob: formData.description
            }
          });
        }
      }

      Swal.fire({
        icon: 'success',
        title: 'บันทึกสำเร็จ',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
      });
      onSaveSuccess();
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-white px-8 py-6 border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="bg-brand-100 text-brand-600 p-2 rounded-lg mr-3 shadow-sm">
              <i className={`fa-solid ${editingJob ? 'fa-pen-to-square' : 'fa-plus'}`}></i>
            </span>
            {editingJob ? `แก้ไขงาน: ${formData.internalId}` : `บันทึกงานใหม่: ${config.title}`}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors text-2xl">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-6">
          {config.isSub && !editingJob && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 shadow-sm flex justify-between items-center mb-6">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">ทีมก่อนหน้า (Previous)</p>
                <p className="text-lg font-bold text-gray-400">{prevSub}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest mb-1">ทีมที่ได้รับงานนี้ (Current)</p>
                <p className="text-4xl font-extrabold text-brand-600 animate-pulse-slow">{nextSub}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-bold text-gray-600 uppercase">ประเภทงาน (Job Type) <span className="text-red-500">*</span></label>
              <select 
                className="border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                value={formData.jobType}
                onChange={(e) => setFormData({...formData, jobType: e.target.value})}
                required
              >
                <option value="">เลือกประเภทงาน...</option>
                {CONST_DATA.jobTypes[config.jobTypeKey].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex flex-col space-y-2">
              <label className="text-xs font-bold text-gray-600 uppercase">รายละเอียด (Description) <span className="text-red-500">*</span></label>
              <input 
                type="text"
                className="border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                placeholder="ระบุรายละเอียดงาน..."
              />
            </div>

            <div className="flex flex-col space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase">วันดำเนินการ (Action Date)</label>
                <input 
                  type="datetime-local"
                  className="border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  value={formData.actionDate}
                  onChange={(e) => setFormData({...formData, actionDate: e.target.value})}
                />
            </div>

            <div className="flex flex-col space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase">สถานที่ (Location)</label>
                <input 
                  type="text"
                  className="border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="หมู่บ้าน, ถนน, ซอย..."
                />
            </div>

            <div className="flex flex-col space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase">หน่วยงานแจ้ง (Agency)</label>
                <select 
                  className="border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  value={formData.agency}
                  onChange={(e) => setFormData({...formData, agency: e.target.value})}
                >
                  <option value="">เลือกหน่วยงาน...</option>
                  {CONST_DATA.agencies.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
            </div>

            {config.isSub && (
                <>
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase">รหัสเส้นทาง (Route Code)</label>
                    <input type="text" className="border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500" value={formData.routeCode} onChange={e => setFormData({...formData, routeCode: e.target.value})} />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase">งบประมาณ (Expenses)</label>
                    <input type="number" className="border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500" value={formData.expenses} onChange={e => setFormData({...formData, expenses: Number(e.target.value)})} />
                  </div>
                </>
            )}

            <div className="md:col-span-2 lg:col-span-3 flex flex-col space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase">ผู้รับผิดชอบ (NS Respond)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    {masterData.nsRespond.map(name => (
                        <label key={name} className="flex items-center space-x-2 cursor-pointer hover:bg-white p-1 rounded transition-colors">
                            <input 
                              type="checkbox" 
                              checked={formData.nsRespond?.includes(name)} 
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setFormData(prev => ({
                                    ...prev,
                                    nsRespond: checked 
                                        ? [...(prev.nsRespond || []), name]
                                        : (prev.nsRespond || []).filter(n => n !== name)
                                }));
                              }}
                              className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500" 
                            />
                            <span className="text-xs font-medium text-gray-700">{name}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="md:col-span-2 lg:col-span-3 flex flex-col space-y-2">
                <label className="text-xs font-bold text-gray-600 uppercase">หมายเหตุ (Remark)</label>
                <textarea 
                  rows={2}
                  className="border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  value={formData.remark}
                  onChange={(e) => setFormData({...formData, remark: e.target.value})}
                  placeholder="ระบุหมายเหตุเพิ่มเติม (ถ้ามี)..."
                />
            </div>
          </div>
        </form>

        <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex flex-col sm:flex-row-reverse gap-3 sticky bottom-0">
          <button 
            type="button" 
            onClick={handleSave}
            disabled={loading}
            className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl px-8 py-3 bg-brand-600 text-white font-bold hover:bg-brand-700 focus:outline-none shadow-lg shadow-orange-200 transition-all disabled:opacity-50"
          >
            {loading ? (
                <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i> กำลังบันทึก...
                </>
            ) : (
                <>
                    <i className="fa-solid fa-save mr-2"></i> บันทึกข้อมูล
                </>
            )}
          </button>
          <button 
            type="button" 
            onClick={onClose}
            className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-gray-300 px-8 py-3 bg-white text-gray-700 font-bold hover:bg-gray-100 focus:outline-none transition-all"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobModal;
