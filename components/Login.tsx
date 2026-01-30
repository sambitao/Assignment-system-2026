
import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail
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
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateEmail = (emailStr: string) => {
    return emailStr.toLowerCase().endsWith('@symphony.net.th');
  };

  const handleForgotPassword = async () => {
    if (!email || !validateEmail(email)) {
      Swal.fire({
        icon: 'info',
        title: 'ระบุอีเมลบริษัท',
        text: 'กรุณากรอกอีเมล @symphony.net.th ของคุณในช่องด้านบนก่อนกดลืมรหัสผ่าน',
        confirmButtonColor: '#ea580c'
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire({
        icon: 'success',
        title: 'ส่งลิงก์กู้คืนแล้ว',
        text: 'กรุณาตรวจสอบใน Inbox ของอีเมลบริษัทคุณ',
        confirmButtonColor: '#22c55e'
      });
    } catch (error: any) {
      Swal.fire('Error', 'ไม่สามารถส่งอีเมลลืมรหัสผ่านได้: ' + error.message, 'error');
    }
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

    if (isRegister && password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'รหัสผ่านไม่ตรงกัน',
        text: 'กรุณาตรวจสอบการยืนยันรหัสผ่านอีกครั้ง',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Use email prefix as default display name since name field was removed
        const defaultName = email.split('@')[0];
        await updateProfile(user, { displayName: defaultName });

        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: defaultName,
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
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      console.error("Auth Error:", error);
      let message = "เกิดข้อผิดพลาดในการทำรายการ";
      
      if (error.code === 'auth/user-not-found') message = "ไม่พบผู้ใช้งานนี้ในระบบ";
      if (error.code === 'auth/wrong-password') message = "รหัสผ่านไม่ถูกต้อง";
      
      if (error.code === 'auth/email-already-in-use') {
        const result = await Swal.fire({
          icon: 'info',
          title: 'อีเมลนี้มีในระบบแล้ว',
          text: 'อีเมลนี้ถูกสมัครใช้งานไปแล้ว คุณต้องการเข้าสู่ระบบแทนหรือไม่?',
          showCancelButton: true,
          confirmButtonText: 'ใช่, เข้าสู่ระบบ',
          cancelButtonText: 'ยกเลิก',
          confirmButtonColor: '#ea580c'
        });
        if (result.isConfirmed) {
          setIsRegister(false);
          setLoading(false);
          return;
        }
        message = "อีเมลนี้ถูกใช้งานไปแล้ว";
      }

      if (error.code === 'auth/invalid-credential') message = "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
      if (error.code === 'auth/weak-password') message = "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร";
      
      Swal.fire({
        icon: 'error',
        title: isRegister ? 'ลงทะเบียนไม่สำเร็จ' : 'เข้าสู่ระบบไม่สำเร็จ',
        text: message,
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 lg:p-12 border border-gray-100 animate-fadeIn relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-50 rounded-full opacity-50"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-50 rounded-full opacity-30"></div>
        
        <div className="text-center mb-10 relative">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-500 rounded-2xl mb-6 shadow-lg shadow-orange-100 rotate-3">
            <i className="fa-solid fa-bolt text-3xl text-white"></i>
          </div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight mb-1">
            {isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          </h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Interruption System
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5 relative">
          <div className="bg-orange-50 border border-orange-100 p-3 rounded-2xl mb-4">
            <p className="text-[10px] text-brand-700 font-black uppercase text-center flex items-center justify-center gap-2">
              <i className="fa-solid fa-building"></i> Symphony Corporate Account Only
            </p>
          </div>

          <div className="group">
            <label className="block text-[10px] font-bold text-gray-400 uppercase ml-4 mb-1 tracking-widest">Email Address</label>
            <div className="relative">
              <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-500 transition-colors"></i>
              <input
                type="email"
                required
                placeholder="user@symphony.net.th"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-transparent focus:border-brand-500 focus:bg-white rounded-2xl py-3.5 pl-11 pr-4 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="group">
            <div className="flex justify-between items-center px-4 mb-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
              {!isRegister && (
                <button type="button" onClick={handleForgotPassword} className="text-[10px] font-bold text-brand-600 hover:underline">
                  Forgot?
                </button>
              )}
            </div>
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

          {isRegister && (
            <div className="group animate-fadeIn">
              <label className="block text-[10px] font-bold text-gray-400 uppercase ml-4 mb-1 tracking-widest">Confirm Password</label>
              <div className="relative">
                <i className="fa-solid fa-shield-check absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-500 transition-colors"></i>
                <input
                  type="password"
                  required
                  placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-transparent focus:border-brand-500 focus:bg-white rounded-2xl py-3.5 pl-11 pr-4 outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-700 transition-all shadow-xl shadow-orange-100 active:scale-95 disabled:opacity-50 mt-2"
          >
            {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : (isRegister ? 'ลงทะเบียนพนักงาน' : 'เข้าสู่ระบบ')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => {
              setIsRegister(!isRegister);
              setPassword('');
              setConfirmPassword('');
            }}
            className="text-xs font-bold text-gray-500 hover:text-brand-600 transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            {isRegister ? <><i className="fa-solid fa-arrow-left"></i> กลับไปหน้าเข้าสู่ระบบ</> : <>พนักงานใหม่? <span className="text-brand-600">ลงทะเบียนที่นี่</span></>}
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
