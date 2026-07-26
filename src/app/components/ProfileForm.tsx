'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import PasswordInput from './PasswordInput';

// Data types that will be populated by the page
export interface ProfileStats {
  totalPnl: number;
  winRate: number;
  profitFactor: number | null;
  totalTrades: number;
}

export interface UserPreferences {
  isDarkMode: boolean;
  emailNotifications: boolean;
  isPublicProfile: boolean;
}

export interface UserProfileData {
  name: string;
  email: string;
  role: string; // e.g. PRO TIER or TRADER
}

interface ProfileFormProps {
  stats?: ProfileStats;
  preferences?: UserPreferences;
  userData?: UserProfileData;
  milestones?: {
    tenDayStreak: { achieved: boolean; maxStreak: number; };
    first10kMonth: { achieved: boolean; highestMonthPnl: number; };
  };
}

export default function ProfileForm({ stats, preferences: initialPreferences, userData, milestones }: ProfileFormProps) {
  // Skeleton / Defaults
  const defaultStats = { totalPnl: 0, winRate: 0, profitFactor: 0, totalTrades: 0 };
  const s = stats || defaultStats;

  const [preferences, setPreferences] = React.useState<UserPreferences | undefined>(initialPreferences);
  const [isUpdatingPrefs, setIsUpdatingPrefs] = React.useState(false);
  const { toggleTheme } = useTheme();

  // Sync state if initialPreferences changes (e.g. hydrated from server)
  React.useEffect(() => {
    if (initialPreferences) {
      setPreferences(initialPreferences);
    }
  }, [initialPreferences]);

  const handlePreferenceChange = async (key: keyof UserPreferences, value: boolean) => {
    if (!preferences || isUpdatingPrefs) return;
    
    if (key === 'isDarkMode') {
      toggleTheme(value);
      setPreferences({ ...preferences, isDarkMode: value });
      return;
    }
    
    // Optimistic UI update
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    setIsUpdatingPrefs(true);

    try {
      const res = await fetch('/api/users/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value })
      });
      if (!res.ok) {
        throw new Error("Failed to update preferences");
      }
    } catch (err) {
      console.error(err);
      // Revert on error
      setPreferences(preferences);
      alert("Gagal memperbarui preferensi. Silakan coba lagi.");
    } finally {
      setIsUpdatingPrefs(false);
    }
  };


  const [userDataState, setUserDataState] = React.useState<UserProfileData | undefined>(userData);
  React.useEffect(() => {
    if (userData) setUserDataState(userData);
  }, [userData]);

  const [isEditingProfile, setIsEditingProfile] = React.useState(false);
  const [profileForm, setProfileForm] = React.useState({ name: '', email: '' });
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);

  const startEditProfile = () => {
    if (userDataState) {
      setProfileForm({ name: userDataState.name, email: userDataState.email });
    }
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    if (isSavingProfile) return;
    setIsSavingProfile(true);
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal menyimpan profil");
        return;
      }
      setUserDataState(prev => prev ? { ...prev, ...data.profile } : undefined);
      setIsEditingProfile(false);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const [isEditingPassword, setIsEditingPassword] = React.useState(false);
  const [passwordForm, setPasswordForm] = React.useState({ oldPassword: '', newPassword: '' });
  const [isSavingPassword, setIsSavingPassword] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);

  const handleSavePassword = async () => {
    if (isSavingPassword) return;
    setPasswordError(null);
    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      setPasswordError("Harap isi password lama dan baru");
      return;
    }
    setIsSavingPassword(true);
    try {
      const res = await fetch('/api/users/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordForm)
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || "Gagal mengganti password");
        return;
      }
      alert("Password berhasil diubah!");
      setIsEditingPassword(false);
      setPasswordForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      console.error(err);
      setPasswordError("Terjadi kesalahan saat mengganti password.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const formatCurrency = (val: number) => {
    const isPositive = val >= 0;
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(val));
    return isPositive ? `+${formatted}` : `-${formatted}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-surface-container-low p-6 rounded-xl border border-outline-variant relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-container opacity-5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-6 z-10">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-container bg-surface-container-highest flex items-center justify-center">
            <span className="text-3xl font-bold text-on-surface-variant">
              {userData?.name ? userData.name.substring(0, 2).toUpperCase() : 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-headline-lg font-headline-lg text-on-surface flex items-center gap-3">
              {userDataState?.name || 'Loading...'}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-mono-label font-mono-label bg-primary-container/10 text-primary border border-primary-container/20">
                {userDataState?.role || 'TRADER'}
              </span>
            </h2>
            <p className="text-body-md font-body-md text-on-surface-variant mt-1">
              {userDataState?.email ? `@${userDataState.email.split('@')[0]}` : '@user'}
            </p>
          </div>
        </div>
        <div className="z-10 flex gap-3">
          <button className="px-4 py-2 bg-transparent border border-outline-variant text-on-surface rounded-lg text-body-sm font-body-sm hover:bg-surface-bright transition-colors">
            Edit Profile
          </button>
          <button className="px-4 py-2 bg-on-surface text-surface rounded-lg text-body-sm font-body-sm font-bold hover:bg-surface-bright hover:text-on-surface border border-transparent hover:border-outline-variant transition-colors">
            Share Profile
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Stats & Milestones) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trading Statistics */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2 md:col-span-2 bg-surface-container-low p-6 rounded-xl border border-outline-variant">
              <h3 className="text-body-sm font-body-sm text-on-surface-variant uppercase tracking-wider mb-2">Total PnL</h3>
              <div className="flex items-baseline gap-2">
                <span className={`text-display font-display ${s.totalPnl >= 0 ? 'text-primary' : 'text-error'}`}>
                  {formatCurrency(s.totalPnl)}
                </span>
              </div>
              <div className="mt-4 h-16 opacity-50">
                {/* Static SVG for visual only */}
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path className="text-primary" d="M0 100 L 20 80 L 40 90 L 60 40 L 80 50 L 100 10" fill="none" stroke="currentColor" strokeWidth="2"></path>
                  <path className="text-primary/10" d="M0 100 L 20 80 L 40 90 L 60 40 L 80 50 L 100 10 L 100 100 Z" fill="currentColor"></path>
                </svg>
              </div>
            </div>
            
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant flex flex-col justify-between">
              <h3 className="text-body-sm font-body-sm text-on-surface-variant uppercase tracking-wider">Win Rate</h3>
              <span className="text-headline-lg font-headline-lg text-on-surface">{s.winRate.toFixed(1)}%</span>
            </div>
            
            <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant flex flex-col justify-between">
              <h3 className="text-body-sm font-body-sm text-on-surface-variant uppercase tracking-wider">Profit Factor</h3>
              <span className="text-headline-lg font-headline-lg text-on-surface">
                {s.profitFactor === null ? (s.totalPnl > 0 ? "Perfect" : "-") : s.profitFactor.toFixed(2)}
              </span>
            </div>
            
            <div className="col-span-2 bg-surface-container-low p-6 rounded-xl border border-outline-variant flex justify-between items-center">
              <div>
                <h3 className="text-body-sm font-body-sm text-on-surface-variant uppercase tracking-wider mb-1">Total Trades</h3>
                <span className="text-headline-md font-headline-md text-on-surface">{s.totalTrades}</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant text-4xl">candlestick_chart</span>
            </div>
          </section>

          {/* Recent Achievements */}
          <section className="bg-ink-light p-6 rounded-xl border border-ink-border">
            <h3 className="text-xl font-bold text-slate-50 mb-6 border-b border-ink-border pb-4">Milestones</h3>
            <div className="space-y-4">
              <div className={`flex items-center gap-4 p-4 rounded-lg border ${milestones?.tenDayStreak.achieved ? 'bg-profit/10 border-profit/20' : 'bg-ink border-ink-border opacity-60'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${milestones?.tenDayStreak.achieved ? 'bg-profit/20 border-profit/30' : 'bg-ink-light border-ink-border'}`}>
                  <span className={`material-symbols-outlined ${milestones?.tenDayStreak.achieved ? 'text-profit-text' : 'text-slate-400'}`}>local_fire_department</span>
                </div>
                <div>
                  <h4 className="text-base text-slate-50 font-semibold">10-Day Green Streak</h4>
                  <p className="text-sm text-slate-400">
                    {milestones?.tenDayStreak.achieved 
                      ? 'Achieved consecutive profitable days.' 
                      : `Belum tercapai (Current Best: ${milestones?.tenDayStreak.maxStreak || 0}/10)`}
                  </p>
                </div>
              </div>
              
              <div className={`flex items-center gap-4 p-4 rounded-lg border ${milestones?.first10kMonth.achieved ? 'bg-info/10 border-info/20' : 'bg-ink border-ink-border opacity-60'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${milestones?.first10kMonth.achieved ? 'bg-info/20 border-info/30' : 'bg-ink-light border-ink-border'}`}>
                  <span className={`material-symbols-outlined ${milestones?.first10kMonth.achieved ? 'text-info' : 'text-slate-400'}`}>monetization_on</span>
                </div>
                <div>
                  <h4 className="text-base text-slate-50 font-semibold">First $10k Month</h4>
                  <p className="text-sm text-slate-400">
                    {milestones?.first10kMonth.achieved 
                      ? 'Cleared $10,000 in realized net profit.' 
                      : `Belum tercapai (Current Best: $${(milestones?.first10kMonth.highestMonthPnl || 0).toLocaleString()})`}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (Settings) */}
        <div className="space-y-6">
          {/* Account Information */}
          <section className="bg-surface-container-low p-6 rounded-xl border border-outline-variant">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-body-lg font-body-lg text-on-surface font-semibold">Account Information</h3>
              {!isEditingProfile ? (
                 <button onClick={startEditProfile} className="text-primary hover:text-primary-container text-body-sm font-semibold transition-colors">
                   Edit
                 </button>
              ) : (
                 <div className="flex gap-2">
                   <button onClick={() => setIsEditingProfile(false)} className="text-on-surface-variant hover:text-on-surface text-body-sm transition-colors">Cancel</button>
                   <button onClick={handleSaveProfile} disabled={isSavingProfile} className="text-primary hover:text-primary-container text-body-sm font-semibold transition-colors">{isSavingProfile ? 'Saving...' : 'Save'}</button>
                 </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-mono-label font-mono-label text-on-surface-variant mb-1">Name</label>
                <input className={`w-full bg-surface border rounded-md px-3 py-2 text-body-md font-body-md text-on-surface focus:ring-0 ${isEditingProfile ? 'border-primary' : 'border-outline-variant focus:border-outline'}`}
                  readOnly={!isEditingProfile} 
                  type="text" 
                  value={isEditingProfile ? profileForm.name : (userDataState?.name || '')} 
                  onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-mono-label font-mono-label text-on-surface-variant mb-1">Email</label>
                <input className={`w-full bg-surface border rounded-md px-3 py-2 text-body-md font-body-md text-on-surface focus:ring-0 ${isEditingProfile ? 'border-primary' : 'border-outline-variant focus:border-outline'}`}
                  readOnly={!isEditingProfile} 
                  type="email" 
                  value={isEditingProfile ? profileForm.email : (userDataState?.email || '')} 
                  onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))}
                />
              </div>
              
              <div className="pt-2 border-t border-outline-variant mt-6">
                 {!isEditingPassword ? (
                   <div>
                     <label className="block text-mono-label font-mono-label text-on-surface-variant mb-1">Password</label>
                     <div className="flex gap-2">
                       <input className="w-full bg-surface border border-outline-variant rounded-md px-3 py-2 text-body-md font-body-md text-on-surface focus:border-outline focus:ring-0 cursor-not-allowed" 
                         readOnly type="password" value="••••••••" />
                       <button onClick={() => setIsEditingPassword(true)} className="px-3 py-2 border border-outline-variant rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-bright transition-colors">
                         <span className="material-symbols-outlined text-sm">edit</span>
                       </button>
                     </div>
                   </div>
                 ) : (
                   <div className="space-y-4">
                     <div className="flex items-center justify-between">
                       <label className="block text-mono-label font-mono-label text-on-surface-variant">Change Password</label>
                     </div>
                       <div>
                        <div className="mb-2">
                          <PasswordInput 
                            className="w-full bg-surface border border-primary rounded-md pl-3 pr-10 py-2 text-body-md font-body-md text-on-surface focus:ring-0" 
                            placeholder="Old Password"
                            value={passwordForm.oldPassword} 
                            onChange={(e) => setPasswordForm(p => ({ ...p, oldPassword: e.target.value }))}
                          />
                        </div>
                        <div>
                          <PasswordInput 
                            className="w-full bg-surface border border-primary rounded-md pl-3 pr-10 py-2 text-body-md font-body-md text-on-surface focus:ring-0" 
                            placeholder="New Password"
                            value={passwordForm.newPassword} 
                            onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                          />
                        </div>
                       {passwordError && (
                         <p className="text-error text-body-sm mt-2">{passwordError}</p>
                       )}
                     </div>
                     <div className="flex gap-2 justify-end">
                       <button onClick={() => { setIsEditingPassword(false); setPasswordForm({ oldPassword: '', newPassword: '' }); setPasswordError(null); }} className="text-on-surface-variant hover:text-on-surface text-body-sm transition-colors">Cancel</button>
                       <button onClick={handleSavePassword} disabled={isSavingPassword} className="px-3 py-1 bg-primary text-on-primary rounded text-body-sm font-semibold btn-interactive">{isSavingPassword ? 'Saving...' : 'Save Password'}</button>
                     </div>
                   </div>
                 )}
              </div>

            </div>
          </section>

          {/* Preferences */}
          <section className="bg-surface-container-low p-6 rounded-xl border border-outline-variant">
            <h3 className="text-body-lg font-body-lg text-on-surface font-semibold mb-6">Preferences</h3>
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-body-md font-body-md text-on-surface">Dark Mode</h4>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">System default theme</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={preferences?.isDarkMode || false} onChange={(e) => handlePreferenceChange('isDarkMode', e.target.checked)} disabled={isUpdatingPrefs} />
                  <div className="w-11 h-6 bg-ink-border rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-profit"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-body-md font-body-md text-on-surface">Notifications</h4>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Trade alerts and updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={preferences?.emailNotifications || false} onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)} disabled={isUpdatingPrefs} />
                  <div className="w-11 h-6 bg-ink-border rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-profit"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-body-md font-body-md text-on-surface">Public Profile</h4>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Visible to community</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={preferences?.isPublicProfile || false} onChange={(e) => handlePreferenceChange('isPublicProfile', e.target.checked)} disabled={isUpdatingPrefs} />
                  <div className="w-11 h-6 bg-ink-border rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-profit"></div>
                </label>
              </div>

            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
