
import React, { useState } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { MasterData } from '../types';
import Swal from 'sweetalert2';

interface SettingViewProps {
  masterData: MasterData;
}

const SettingView: React.FC<SettingViewProps> = ({ masterData }) => {
  const [newSub, setNewSub] = useState('');
  const [newNsName, setNewNsName] = useState('');
  const [newNsPhone, setNewNsPhone] = useState('');

  const addItem = async (key: string, value: string) => {
    if (!value) return;
    try {
      const ref = doc(db, 'settings', 'masterData');
      await updateDoc(ref, {
        [key]: arrayUnion(value)
      });
      Swal.fire({ icon: 'success', title: 'เพิ่มเรียบร้อย', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const removeItem = async (key: string, value: string) => {
    try {
      const ref = doc(db, 'settings', 'masterData');
      await updateDoc(ref, {
        [key]: arrayRemove(value)
      });
      Swal.fire({ icon: 'success', title: 'ลบเรียบร้อย', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const ListSection = ({ title, icon, color, data, keyName, addPlaceholder, onAdd, children }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col animate-fadeIn">
        <h4 className="font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100 flex items-center">
            <i className={`${icon} ${color} mr-2`}></i> {title}
        </h4>
        <div className="flex gap-2 mb-4">
            {children}
            <button onClick={onAdd} className={`${color.replace('text-', 'bg-')} text-white px-4 rounded-xl hover:opacity-80 shadow-md transition`}>
                <i className="fa-solid fa-plus"></i>
            </button>
        </div>
        <ul className="space-y-2 overflow-y-auto flex-1 max-h-96 pr-2">
            {data.length === 0 ? (
                <li className="text-gray-400 text-sm text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">ไม่มีข้อมูล</li>
            ) : data.map((item: string) => (
                <li key={item} className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm group hover:border-brand-300 transition-all">
                    <span className="font-medium text-gray-700">{item}</span>
                    <button onClick={() => removeItem(keyName, item)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <i className="fa-solid fa-trash-can"></i>
                    </button>
                </li>
            ))}
        </ul>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6 animate-fadeIn">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                    <i className="fa-solid fa-database mr-3 text-brand-500"></i> ฐานข้อมูล (Master Data)
                </h3>
                <p className="text-sm text-gray-500 mt-1">จัดการรายชื่อผู้รับเหมาและพนักงานรับแจ้งเหตุในระบบ</p>
            </div>
            <button className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 text-sm font-bold border border-red-100 transition flex items-center shadow-sm">
                <i className="fa-solid fa-trash-can mr-2"></i> Reset Database
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ListSection 
                title="Subcontractors (Round Robin)" 
                icon="fa-solid fa-helmet-safety" 
                color="text-orange-500" 
                data={masterData.subcontractors} 
                keyName="subcontractors"
                onAdd={() => { addItem('subcontractors', newSub); setNewSub(''); }}
            >
                <input 
                    type="text" 
                    value={newSub}
                    onChange={e => setNewSub(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none bg-gray-50" 
                    placeholder="เพิ่มชื่อทีม..."
                />
            </ListSection>

            <ListSection 
                title="NS Respond (พนักงานรับแจ้ง)" 
                icon="fa-solid fa-user-tag" 
                color="text-blue-500" 
                data={masterData.nsRespond} 
                keyName="nsRespond"
                onAdd={() => { 
                    const val = newNsPhone ? `${newNsName} - ${newNsPhone}` : newNsName;
                    if (newNsName) { addItem('nsRespond', val); setNewNsName(''); setNewNsPhone(''); }
                }}
            >
                <div className="flex-1 flex gap-2">
                    <input 
                        type="text" 
                        value={newNsName}
                        onChange={e => setNewNsName(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none bg-gray-50" 
                        placeholder="ชื่อ..."
                    />
                    <input 
                        type="text" 
                        value={newNsPhone}
                        onChange={e => setNewNsPhone(e.target.value)}
                        className="w-28 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none bg-gray-50" 
                        placeholder="โทร..."
                    />
                </div>
            </ListSection>
        </div>
    </div>
  );
};

export default SettingView;
