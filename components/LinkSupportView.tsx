
import React, { useState } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { MasterData, LinkSupportItem } from '../types';
import Swal from 'sweetalert2';

interface LinkSupportViewProps {
  masterData: MasterData;
}

const LinkSupportView: React.FC<LinkSupportViewProps> = ({ masterData }) => {
  const [formData, setFormData] = useState<LinkSupportItem>({
    name: '', url: '', type: '', detail: ''
  });

  const handleSave = async () => {
    if (!formData.name || !formData.url || !formData.type) {
        Swal.fire('Warning', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'warning');
        return;
    }
    
    let url = formData.url;
    if (!url.startsWith('http')) url = 'https://' + url;

    try {
      const ref = doc(db, 'settings', 'masterData');
      await updateDoc(ref, {
        linkSupport: arrayUnion({ ...formData, url })
      });
      setFormData({ name: '', url: '', type: '', detail: '' });
      Swal.fire({ icon: 'success', title: 'เพิ่มลิงก์เรียบร้อย', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
    } catch (err: any) {
        Swal.fire('Error', err.message, 'error');
    }
  };

  const removeItem = async (item: LinkSupportItem) => {
    try {
      const ref = doc(db, 'settings', 'masterData');
      await updateDoc(ref, {
        linkSupport: arrayRemove(item)
      });
      Swal.fire({ icon: 'success', title: 'ลบเรียบร้อย', toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
    } catch (err: any) {
        Swal.fire('Error', err.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6 animate-fadeIn">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                <span className="bg-brand-100 text-brand-600 p-2 rounded-lg mr-3 shadow-sm"><i className="fa-solid fa-link"></i></span> Link Support Center
            </h3>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8 shadow-inner">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ชื่อเว็บไซต์</label>
                        <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="เช่น Google Drive"/>
                    </div>
                    <div className="md:col-span-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">URL (Address)</label>
                        <input value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} type="url" className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="https://..."/>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ประเภท</label>
                        <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white">
                            <option value="">เลือก...</option>
                            <option value="Site Access">Site Access</option>
                            <option value="Link Support">Link Support</option>
                            <option value="Link File Shared">Link File Shared</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="md:col-span-3 flex gap-2">
                        <input value={formData.detail} onChange={e => setFormData({...formData, detail: e.target.value})} type="text" className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="รายละเอียด..."/>
                        <button onClick={handleSave} className="bg-brand-500 text-white px-6 py-2.5 rounded-xl hover:bg-brand-600 shadow-md transition font-bold">
                            <i className="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 font-bold uppercase text-xs text-gray-500 tracking-wider">
                        <tr>
                            <th className="px-6 py-4 text-left">ชื่อเว็บไซต์</th>
                            <th className="px-6 py-4 text-left">URL</th>
                            <th className="px-6 py-4 text-center">ประเภท</th>
                            <th className="px-6 py-4 text-left">รายละเอียด</th>
                            <th className="px-6 py-4 text-right">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100 text-sm">
                        {(masterData.linkSupport || []).map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4 font-bold text-gray-700">{item.name}</td>
                                <td className="px-6 py-4">
                                    <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center">
                                        {item.url.slice(0, 40)}{item.url.length > 40 ? '...' : ''}
                                        <i className="fa-solid fa-arrow-up-right-from-square ml-1.5 text-[10px] opacity-50"></i>
                                    </a>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.type === 'Site Access' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {item.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 italic">{item.detail || '-'}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => removeItem(item)} className="text-gray-300 hover:text-red-500 transition-colors">
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default LinkSupportView;
