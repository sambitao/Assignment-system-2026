
import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, microsoftProvider } from '../firebase';
import Swal from 'sweetalert2';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currentDomain, setCurrentDomain] = useState('');

  useEffect(() => {
    const hostname = window.location.hostname || 'Unknown Host';
    setCurrentDomain(hostname);
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, microsoftProvider);
      const email = result.user.email || '';
      
      if (!email.endsWith('@symphony.net.th')) {
        await Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: 'กรุณาเข้าสู่ระบบด้วยอีเมลบริษัท @symphony.net.th เท่านั้น',
          confirmButtonColor: '#ea580c'
        });
        await signOut(auth);
      }
    } catch (error: any) {
      console.error("Login Error Details:", error);
      
      if (error.code === 'auth/unauthorized-domain' || error.message?.includes('unauthorized')) {
        Swal.fire({
          icon: 'warning',
          title: '<span class="text-red-600">ต้องตั้งค่า Firebase</span>',
          html: `
            <div class="text-left text-sm">
              <div class="bg-red-50 p-4 rounded-xl border border-red-200 mb-4">
                <p class="font-bold text-red-800 underline">สาเหตุ:</p>
                <p class="text-red-700">โดเมนนี้ยังไม่ได้รับอนุญาตใน Firebase Auth</p>
              </div>

              <div class="mb-4 text-center">
                <p class="font-bold text-gray-800 mb-2 uppercase text-[10px] tracking-widest">ชื่อโดเมนของคุณ:</p>
                <div class="bg-black text-green-400 p-3 rounded-lg font-mono text-xs break-all shadow-inner border border-gray-700">
                  ${currentDomain}
                </div>
              </div>

              <div class="text-[11px] text-gray-600 bg-gray-100 p-4 rounded-lg space-y-2">
                <p class="font-bold text-gray-800">วิธีแก้ (Microsoft Auth):</p>
                <p>1. เปิด <b>Firebase Console</b></p>
                <p>2. ไปที่ <b>Authentication</b> > <b>Sign-in method</b></p>
                <p>3. เพิ่ม <b>Microsoft</b> (ต้องใช้ Client ID/Secret จาก Azure Portal)</p>
                <p>4. ไปที่ <b>Settings</b> > <b>Authorized domains</b> เพื่อเพิ่มโดเมนด้านบน</p>
              </div>
            </div>
          `,
          confirmButtonColor: '#ea580c',
          confirmButtonText: 'รับทราบ',
          width: '450px'
        });
      } else if (error.code === 'auth/operation-not-allowed') {
        Swal.fire({
          icon: 'error',
          title: 'Provider Not Enabled',
          text: 'กรุณาเปิดใช้งาน Microsoft Sign-in ใน Firebase Console',
          confirmButtonColor: '#ef4444'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Error',
          text: error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ Microsoft Account',
          confirmButtonColor: '#ef4444'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-100 animate-fadeIn">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-2xl mb-6 shadow-inner">
            <i className="fa-solid fa-bolt text-4xl text-blue-600"></i>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
            Interruption System
          </h1>
          <p className="text-gray-400 text-sm font-medium">Assignment Tracking Tool</p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl mb-2">
            <p className="text-[11px] text-blue-700 font-bold uppercase text-center flex items-center justify-center gap-2">
              <i className="fa-solid fa-shield-halved"></i> Corporate Login Policy
            </p>
            <p className="text-[10px] text-blue-600/70 text-center mt-1">ใช้อีเมลบริษัท (@symphony.net.th) เท่านั้น</p>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-[#0078d4] text-white py-4 px-6 rounded-2xl font-bold hover:bg-[#005a9e] transition-all shadow-lg shadow-blue-100 disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <i className="fa-solid fa-circle-notch fa-spin text-white"></i>
            ) : (
              <i className="fa-brands fa-microsoft text-xl"></i>
            )}
            <span>Sign in with Outlook / Office 365</span>
          </button>
          
          <div className="text-center pt-4">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
              <span className="w-8 h-[1px] bg-gray-200"></span>
              SYMPHONY COMMUNICATION
              <span className="w-8 h-[1px] bg-gray-200"></span>
            </span>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-50 text-center">
           <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tighter">
             Information Security & Quality Management System
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
