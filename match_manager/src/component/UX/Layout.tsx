import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SettingsSidebar } from './SettingsSidebar';
import { supabase } from '../../../../backend/supabase';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    const fetchSettings = async () => {
      const { data } = await supabase.from('settings').select('*').single();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body min-h-screen">
      <Header 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        isAdmin={isAdmin}
      />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <SettingsSidebar isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={settings} />
      <Outlet />
    </div>
  );
};

export default Layout;