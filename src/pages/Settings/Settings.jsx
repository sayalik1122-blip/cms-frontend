import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  MdDarkMode, MdLightMode, MdNotifications, MdSecurity, MdLanguage, 
  MdBusiness, MdCalendarToday, MdPeopleAlt, MdSave 
} from 'react-icons/md';
import { toast } from 'react-toastify';

const SETTINGS_API = 'http://localhost:5000/settings';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'English (India)',
    timezone: '(GMT+05:30) India Standard Time',
    institutionName: '',
    institutionEmail: '',
    address: '',
    notifications: true
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(SETTINGS_API);
      const data = await response.json();
      setSettings(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(SETTINGS_API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        toast.success('System configuration saved successfully!');
      }
    } catch (error) {
      toast.error('Failed to save settings.');
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: 'general', name: 'General', icon: <MdLanguage /> },
    { id: 'profile', name: 'Institution', icon: <MdBusiness /> },
    { id: 'academic', name: 'Academic', icon: <MdCalendarToday /> },
    { id: 'users', name: 'User Roles', icon: <MdPeopleAlt /> },
    { id: 'security', name: 'Security', icon: <MdSecurity /> },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Admin Control Panel</h2>
        <button onClick={handleSave} className="btn-primary flex items-center px-6">
          <MdSave className="mr-2" /> Save All Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center p-3 text-sm font-medium rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-xl mr-3">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === 'general' && (
            <div className="card p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 border-b dark:border-slate-700 pb-2">Appearance</h3>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">Dark Mode</p>
                    <p className="text-sm text-slate-500">Toggle between light and dark system themes</p>
                  </div>
                  <button 
                    onClick={() => {
                      toggleTheme();
                      handleChange('theme', theme === 'light' ? 'dark' : 'light');
                    }}
                    className="p-3 bg-white dark:bg-slate-800 shadow-sm rounded-xl text-primary-600"
                  >
                    {theme === 'dark' ? <MdDarkMode size={24} /> : <MdLightMode size={24} />}
                  </button>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 border-b dark:border-slate-700 pb-2">Localization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Default Language</label>
                    <select 
                      className="input-field" 
                      value={settings.language} 
                      onChange={(e) => handleChange('language', e.target.value)}
                    >
                      <option>English (India)</option>
                      <option>Hindi</option>
                      <option>Marathi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Time Zone</label>
                    <select 
                      className="input-field"
                      value={settings.timezone}
                      onChange={(e) => handleChange('timezone', e.target.value)}
                    >
                      <option>(GMT+05:30) India Standard Time</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="card p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 border-b dark:border-slate-700 pb-2">Institution Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Institution Name</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={settings.institutionName} 
                    onChange={(e) => handleChange('institutionName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Institution Email</label>
                  <input 
                    type="email" 
                    className="input-field" 
                    value={settings.institutionEmail} 
                    onChange={(e) => handleChange('institutionEmail', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <textarea 
                    className="input-field" 
                    rows="3"
                    value={settings.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'academic' && (
            <div className="card p-6 animate-in fade-in duration-300">
              <h3 className="text-lg font-bold mb-6">Academic Configuration</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border dark:border-slate-700 rounded-xl">
                  <div>
                    <p className="font-bold">Current Academic Year</p>
                    <p className="text-sm text-slate-500">2025 - 2026</p>
                  </div>
                  <button className="btn-primary py-1.5 px-4 text-xs">Manage Sessions</button>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'users' || activeTab === 'security') && (
            <div className="card p-12 text-center text-slate-500">
               <MdSecurity size={64} className="mx-auto mb-4 opacity-20" />
               <p className="text-lg font-medium">Access Management Module</p>
               <p className="text-sm">This module is currently in development.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
