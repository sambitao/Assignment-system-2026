
import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signOut 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Swal from 'sweetalert2';

const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const validateEmail = (emailStr: string) => {
    return emailStr.toLowerCase().endsWith('@symphony.net.th');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Email ไม่ถูกต้อง',
        text: 'กรุณาใช้อีเมลบริษัท @symphony.net.th เท่านั้น',
        confirmButtonColor: '#ea580c'
      });
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        // Registration Logic
        if (!displayName) {
          throw new Error("กรุณาระบุชื่อ-นามสกุล");
        }
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update Auth Profile
        await updateProfile(user, { displayName });

        // Save to Firestore users collection
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          role: 'user',
          createdAt: serverTimestamp()
        });

        Swal.fire({
          icon: 'success',
          title: 'ลงทะเบียนสำเร็จ',
          text: 'ยินดีต้อนรับเข้าสู่ระบบ',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        // Login Logic
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      console.error("Auth Error:", error);
      let message = "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
      
      if (error.code === 'auth/user-not-found') message = "ไม่พบผู้ใช้งานนี้ในระบบ";
      if (error.code === 'auth/wrong-password') message = "รหัสผ่านไม่ถูกต้อง";
      if (error.code === 'auth/email-already-in-use') message = "อีเมลนี้ถูกใช้งานไปแล้ว";
      if (error.code === 'auth/weak-password') message = "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร";
      
      Swal.fire({
        icon: 'error',
        title: isRegister ? 'ลงทะเบียนไม่สำเร็จ' : 'เข้าสู่ระบบไม่สำเร็จ',
        text: error.message || message,
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 lg:p-12 border border-gray-100 animate-fadeIn relative overflow-hidden">
        {/* Decorative Circle */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-50 rounded-full opacity-50"></div>
        
        <div className="text-center mb-10 relative">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-500 rounded-2xl mb-6 shadow-lg shadow-orange-100 rotate-3">
            <i className="fa-solid fa-bolt text-3xl text-white"></i>
          </div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight mb-1">
            {isRegister ? 'สร้างบัญชีใหม่' : 'เข้าสู่ระบบ'}
          </h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Interruption Management System
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5 relative">
          <div className="bg-orange-50/50 border border-orange-100 p-3 rounded-2xl mb-6">
            <p className="text-[10px] text-brand-700 font-black uppercase text-center flex items-center justify-center gap-2">
              <i className="fa-solid fa-shield-halved"></i> Corporate Security Policy
            </p>
          </div>

          {isRegister && (
            <div className="group">
              <label className="block text-[10px] font-bold text-gray-400 uppercase ml-4 mb-1 tracking-widest">Full Name</label>
              <div className="relative">
                <i className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-500 transition-colors"></i>
                <input
                  type="text"
                  required
                  placeholder="ชื่อ - นามสกุล"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-gray-50 border border-transparent focus:border-brand-500 focus:bg-white rounded-2xl py-3.5 pl-11 pr-4 outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>
          )}

          <div className="group">
            <label className="block text-[10px] font-bold text-gray-400 uppercase ml-4 mb-1 tracking-widest">Corporate Email</label>
            <div className="relative">
              <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-500 transition-colors"></i>
              <input
                type="email"
                required
                placeholder="example@symphony.net.th"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-transparent focus:border-brand-500 focus:bg-white rounded-2xl py-3.5 pl-11 pr-4 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-[10px] font-bold text-gray-400 uppercase ml-4 mb-1 tracking-widest">Password</label>
            <div className="relative">
              <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-500 transition-colors"></i>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-transparent focus:border-brand-500 focus:bg-white rounded-2xl py-3.5 pl-11 pr-4 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-700 transition-all shadow-xl shadow-orange-100 active:scale-95 disabled:opacity-50 mt-4"
          >
            {loading ? (
              <i className="fa-solid fa-circle-notch fa-spin"></i>
            ) : (
              isRegister ? 'Confirm Registration' : 'Sign In Now'
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs font-bold text-gray-500 hover:text-brand-600 transition-colors"
          >
            {isRegister ? 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ' : 'ยังไม่มีบัญชี? ลงทะเบียนใหม่ที่นี่'}
          </button>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-50 text-center">
           <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">
             Symphony Communication Public Co., Ltd.
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
