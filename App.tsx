
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  onSnapshot, 
  collection, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  serverTimestamp,
  getDoc,
  setDoc,
  getDocs,
  where
} from 'firebase/firestore';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { db, auth } from './firebase';
import { Assignment, MasterData, LinkSupportItem } from './types';
import { MENU_CONFIGS, CONST_DATA } from './constants';
import Swal from 'sweetalert2';

// Helper Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardAnalytics from './components/DashboardAnalytics';
import SummaryDashboard from './components/SummaryDashboard';
import SubDashboard from './components/SubDashboard';
import CalendarView from './components/CalendarView';
import JobDataTable from './components/JobDataTable';
import SettingView from './components/SettingView';
import LinkSupportView from './components/LinkSupportView';
import JobModal from './components/JobModal';
import Login from './components/Login';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentView, setCurrentView] = useState<string>('dashboard_analytics');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [masterData, setMasterData] = useState<MasterData>({
    subcontractors: [],
    nsRespond: [],
    linkSupport: [],
    rrIndexes: {}
  });
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Assignment | null>(null);

  // Auth Status Tracking
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email?.endsWith('@symphony.net.th')) {
        setUser(currentUser);
        setOnline(true);
      } else {
        setUser(null);
        setOnline(false);
      }
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Real-time Data Listeners
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'assignments'), orderBy('internalId', 'desc'));
    const unsubscribeAssignments = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Assignment));
      setAssignments(data);
      setLoading(false);
    }, (err) => {
      console.error("Assignments listener error", err);
    });

    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'masterData'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as MasterData;
        setMasterData({
          subcontractors: data.subcontractors || [],
          nsRespond: data.nsRespond || [],
          linkSupport: data.linkSupport || [],
          rrIndexes: data.rrIndexes || {}
        });
      }
    }, (err) => {
      console.error("Settings listener error", err);
    });

    return () => {
      unsubscribeAssignments();
      unsubscribeSettings();
    };
  }, [user]);

  const switchView = useCallback((view: string) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  }, []);

  const openModal = useCallback((job: Assignment | null = null) => {
    setEditingJob(job);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingJob(null);
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'ต้องการออกจากระบบ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#ea580c',
      confirmButtonText: 'ออกจากระบบ',
      cancelButtonText: 'ยกเลิก'
    });
    if (result.isConfirmed) {
      await signOut(auth);
    }
  };

  const handleDelete = useCallback(async (id: string) => {
    const result = await Swal.fire({
      title: 'คุณต้องการลบงานนี้ใช่หรือไม่?',
      text: "การลบจะไม่สามารถกู้คืนได้",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'ลบข้อมูล',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, 'assignments', id));
        Swal.fire({
          icon: 'success',
          title: 'ลบข้อมูลเรียบร้อย',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500
        });
      } catch (err: any) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  }, []);

  const handleUpdateStatus = useCallback(async (id: string, status: string, extra: any = {}) => {
    try {
      await updateDoc(doc(db, 'assignments', id), {
        status,
        ...extra,
        updatedAt: serverTimestamp()
      });
      Swal.fire({
        icon: 'success',
        title: 'อัปเดตสถานะเรียบร้อย',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
    }
  }, []);

  const filteredAssignments = useMemo(() => {
    if (MENU_CONFIGS[currentView]) {
      return assignments.filter(a => a.category === currentView);
    }
    return assignments;
  }, [assignments, currentView]);

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-bold animate-pulse">Checking Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex h-screen overflow-hidden text-gray-800">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <Sidebar 
        currentView={currentView} 
        switchView={switchView} 
        isOpen={isSidebarOpen} 
      />
      
      <main className="flex-1 flex flex-col h-full relative bg-gray-50 overflow-hidden">
        <Header 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
          online={online} 
          currentView={currentView}
          user={user}
          onLogout={handleLogout}
        />
        
        <div className="flex-1 overflow-auto p-4 lg:p-6 pb-24 lg:pb-6">
          {currentView === 'dashboard_analytics' && (
            <DashboardAnalytics assignments={assignments} />
          )}
          
          {currentView === 'summary_dashboard' && (
            <SummaryDashboard assignments={assignments} />
          )}

          {currentView === 'sub_dashboard' && (
            <SubDashboard assignments={assignments} />
          )}

          {currentView === 'calendar' && (
            <CalendarView assignments={assignments} onJobClick={openModal} />
          )}

          {MENU_CONFIGS[currentView] && (
            <JobDataTable 
              currentView={currentView}
              assignments={filteredAssignments}
              openModal={openModal}
              onDelete={handleDelete}
              onUpdateStatus={handleUpdateStatus}
              masterData={masterData}
            />
          )}

          {currentView === 'setting' && (
            <SettingView masterData={masterData} />
          )}

          {currentView === 'link_support' && (
            <LinkSupportView masterData={masterData} />
          )}
        </div>
      </main>

      {isModalOpen && (
        <JobModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          editingJob={editingJob}
          currentCategory={MENU_CONFIGS[currentView] ? currentView : (currentView === 'summary_dashboard' ? 'summary_plan' : 'team')}
          masterData={masterData}
          onSaveSuccess={closeModal}
        />
      )}
    </div>
  );
};

export default App;
