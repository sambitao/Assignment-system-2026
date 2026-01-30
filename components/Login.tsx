
import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import Swal from 'sweetalert2';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currentDomain, setCurrentDomain] = useState('');

  useEffect(() => {
    const hostname = window.location.hostname || 'Unknown Host';
    setCurrentDomain(hostname);
    console.log("Current Application Domain:", hostname);
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email || '';
      
      if (!email.endsWith('@symphony.net.th')) {
        await Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: 'กรุณาเข้าสู่ระบบด้วยอีเมล @symphony.net.th เท่านั้น',
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
                <p class="text-red-700">โดเมนนี้ยังไม่ได้รับอนุญาตใน Google Auth</p>
              </div>

              <div class="mb-4">
                <p class="font-bold text-gray-800 mb-2 uppercase text-[10px] tracking-widest text-center">คัดลอกชื่อโดเมนด้านล่างนี้:</p>
                <div class="bg-black text-green-400 p-4 rounded-lg font-mono text-xs break-all shadow-inner border-2 border-brand-500 cursor-pointer text-center" onclick="navigator.clipboard.writeText('${currentDomain}')">
                  ${currentDomain}
                </div>
              </div>

              <div class="text-[11px] text-gray-600 bg-gray-100 p-4 rounded-lg space-y-2">
                <p class="font-bold text-gray-800">ขั้นตอนการแก้ไข:</p>
                <p>1. เปิด <b>Firebase Console</b></p>
                <p>2. ไปที่ <b>Authentication</b> > <b>Settings</b></p>
                <p>3. หัวข้อ <b>Authorized domains</b> กด <b>Add domain</b></p>
                <p>4. วางชื่อที่คัดลอกไป แล้วกด Add</p>
              </div>
            </div>
          `,
          confirmButtonColor: '#ea580c',
          confirmButtonText: 'รับทราบ',
          width: '450px'
        });
      } else if (error.code === 'auth/popup-blocked') {
        Swal.fire({
          icon: 'info',
          title: 'Popup ถูกบล็อก',
          text: 'กรุณาอนุญาตให้เปิด Popup หรือลองเปิดแอปในหน้าต่างใหม่ (New Tab)',
          confirmButtonColor: '#3b82f6'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Error',
          text: error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ',
          confirmButtonColor: '#ef4444'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-100 animate-fadeIn">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-50 rounded-2xl mb-6 shadow-inner">
            <i className="fa-solid fa-bolt text-4xl text-brand-500"></i>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
            Interruption System
          </h1>
          <p className="text-gray-400 text-sm font-medium">Assignment Tracking Tool</p>
        </div>

        <div className="space-y-8">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-brand-500 text-white py-4 px-6 rounded-2xl font-bold hover:bg-brand-600 transition-all shadow-lg shadow-brand-100 disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <i className="fa-solid fa-circle-notch fa-spin text-white"></i>
            ) : (
              <i className="fa-brands fa-google text-xl"></i>
            )}
            <span>Sign in with Company Email</span>
          </button>
          
          <div className="text-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
              <span className="w-8 h-[1px] bg-gray-200"></span>
              Security Policy
              <span className="w-8 h-[1px] bg-gray-200"></span>
            </span>
            <p className="text-[10px] text-gray-400 mt-2">
              Authorized personnel only. Access is monitored.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-100 flex justify-center space-x-6 grayscale opacity-30">
           <span className="text-[10px] font-bold text-gray-400 tracking-tighter">SYMPHONY COMMUNICATION PLC.</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
