'use client';
import { useState, useEffect } from 'react';

export default function AppPreviewPage() {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'hide-palm-chrome';
    style.textContent = `
      header, footer, nav, [class*="MobileNav"], [class*="mobile-nav"],
      body > div > header, body > div > footer { display: none !important; }
      body { padding: 0 !important; background: #111827 !important; }
      main { padding: 0 !important; max-width: 100% !important; }
    `;
    document.head.appendChild(style);
    return () => document.getElementById('hide-palm-chrome')?.remove();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#111827',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '12px 16px 24px',
    }}>
      <MediReferralApp />
    </div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────
const PATIENTS = [
  { id: 101, name: 'Ramesh Kumar', phone: '+91 98765 43210', age: 45, gender: 'M', specialty: 'Ortho', procedure: 'Knee Replacement', status: 'ipd_confirmed', commission: 4500, surgeryDate: '25 May 2024', city: 'Hyderabad', hospital: 'Apollo Hospitals', doctor: 'Dr. Suresh Reddy', packageCost: 120000, commPct: 3.75, opd: '15 May 2024', discharge: '28 May 2024', notes: 'Patient prefers morning slot. Has diabetes - needs special care.', urgency: 'Within a week', budget: '1L-2L', insurance: false },
  { id: 102, name: 'Priya Sharma', phone: '+91 97654 32109', age: 35, gender: 'F', specialty: 'Urology', procedure: 'Stone Removal', status: 'opd_scheduled', commission: 3900, surgeryDate: null, city: 'Bangalore', hospital: 'Manipal Hospital', doctor: 'Dr. Anil Mehta', packageCost: 80000, commPct: 4.0, opd: '22 May 2024', discharge: null, notes: '', urgency: 'Within a month', budget: '50k-1L', insurance: true, insuranceProv: 'Star Health' },
  { id: 103, name: 'Suresh Rao', phone: '+91 96543 21098', age: 52, gender: 'M', specialty: 'Cardiology', procedure: 'Angioplasty', status: 'new', commission: 8000, surgeryDate: null, city: 'Chennai', hospital: null, doctor: null, packageCost: 200000, commPct: 4.0, urgency: 'Immediate', budget: 'Above 2L', insurance: true, insuranceProv: 'HDFC ERGO', notes: 'Urgent - chest pain reported', opd: null, discharge: null },
  { id: 104, name: 'Meena Devi', phone: '+91 95432 10987', age: 28, gender: 'F', specialty: 'Gynecology', procedure: 'Laparoscopy', status: 'contacted', commission: 2800, surgeryDate: null, city: 'Mumbai', hospital: 'Kokilaben Hospital', doctor: null, packageCost: 70000, commPct: 4.0, urgency: 'Flexible', budget: '50k-1L', insurance: false, notes: '', opd: null, discharge: null },
  { id: 105, name: 'Vijay Patel', phone: '+91 94321 09876', age: 60, gender: 'M', specialty: 'General Surgery', procedure: 'Gallbladder Removal', status: 'completed', commission: 3200, surgeryDate: '1 May 2024', city: 'Delhi', hospital: 'Fortis Hospital', doctor: 'Dr. Ravi Gupta', packageCost: 80000, commPct: 4.0, urgency: 'Within a week', budget: '50k-1L', insurance: false, notes: 'Surgery successful', opd: '28 Apr 2024', discharge: '3 May 2024' },
  { id: 106, name: 'Kavitha Reddy', phone: '+91 93210 98765', age: 42, gender: 'F', specialty: 'ENT', procedure: 'Tonsillectomy', status: 'lost', commission: 1500, surgeryDate: null, city: 'Hyderabad', hospital: null, doctor: null, packageCost: 35000, commPct: 4.0, urgency: 'Within a month', budget: 'Below 50k', insurance: false, notes: 'Opted for govt hospital', opd: null, discharge: null },
];

const ACTIVITY = [
  { id: 1, patient: 'Ramesh Kumar', event: 'Surgery completed', time: '2h ago', type: 'surgery' },
  { id: 2, patient: 'Priya Sharma', event: 'OPD scheduled', time: '5h ago', type: 'opd' },
  { id: 3, patient: null, event: 'Commission credited ₹4,200', time: '1d ago', type: 'commission' },
  { id: 4, patient: 'Suresh Rao', event: 'IPD Admission confirmed', time: '1d ago', type: 'ipd' },
];

const NOTIFICATIONS = [
  { id: 1, type: 'commission', title: 'Commission Credited', body: '₹4,500 for Ramesh Kumar credited to your account', time: '2h ago', read: false },
  { id: 2, type: 'patient', title: 'Patient Status Update', body: 'Priya Sharma - Surgery completed successfully', time: '5h ago', read: false },
  { id: 3, type: 'appointment', title: 'OPD Appointment Reminder', body: 'Suresh Rao has OPD tomorrow at Apollo, 10:00 AM', time: '12h ago', read: true },
  { id: 4, type: 'alert', title: 'Action Required', body: 'Upload documents for Meena Devi to proceed with IPD', time: '1d ago', read: true },
  { id: 5, type: 'commission', title: 'Commission Processed', body: '₹12,300 for 3 cases paid via Bank Transfer. UTR: HDFC240520XXXX', time: '2d ago', read: true },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  new:           { label: 'New',           color: 'text-blue-600',    bg: 'bg-blue-50',    dot: 'bg-blue-500' },
  contacted:     { label: 'Contacted',     color: 'text-amber-600',   bg: 'bg-amber-50',   dot: 'bg-amber-500' },
  opd_scheduled: { label: 'OPD Scheduled', color: 'text-green-600',   bg: 'bg-green-50',   dot: 'bg-green-500' },
  ipd_confirmed: { label: 'IPD Confirmed', color: 'text-purple-600',  bg: 'bg-purple-50',  dot: 'bg-purple-500' },
  completed:     { label: 'Completed',     color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
  lost:          { label: 'Lost',          color: 'text-red-600',     bg: 'bg-red-50',     dot: 'bg-red-500' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const fmtC = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(0)}K` : `₹${n}`;

// ─── Main App ─────────────────────────────────────────────────────────────────
function MediReferralApp() {
  const [screen, setScreen] = useState<string>('splash');
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPatient, setSelectedPatient] = useState<typeof PATIENTS[0] | null>(null);
  const [patientTab, setPatientTab] = useState('overview');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [phone, setPhone] = useState('');
  const [earningsTab, setEarningsTab] = useState('overview');
  const [notifFilter, setNotifFilter] = useState('all');
  const [addStep, setAddStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (screen === 'splash') {
      const t = setTimeout(() => setScreen('login'), 2200);
      return () => clearTimeout(t);
    }
  }, [screen]);

  const navigate = (s: string) => {
    setScreen(s);
    if (['home', 'patients', 'earnings', 'notifications', 'profile'].includes(s)) {
      setActiveTab(s);
    }
  };

  const filteredPatients = PATIENTS.filter(p => {
    const matchStatus = statusFilter === 'all' || p.status === statusFilter ||
      (statusFilter === 'opd' && p.status === 'opd_scheduled') ||
      (statusFilter === 'ipd' && p.status === 'ipd_confirmed');
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search);
    return matchStatus && matchSearch;
  });

  const allScreens = [
    { s: 'splash', label: '🚀 Splash' },
    { s: 'login', label: '🔐 Login' },
    { s: 'otp', label: '📱 OTP' },
    { s: 'home', label: '🏠 Dashboard' },
    { s: 'patients', label: '👥 Patients' },
    { s: 'patient-detail', label: '🏥 Details' },
    { s: 'add-patient', label: '➕ Add Lead' },
    { s: 'earnings', label: '💰 Earnings' },
    { s: 'notifications', label: '🔔 Alerts' },
    { s: 'profile', label: '👤 Profile' },
  ];

  return (
    <div style={{ width: '100%', maxWidth: 900, fontFamily: 'sans-serif' }}>
      {/* Title bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ color: '#fff', fontSize: 20, fontWeight: 700, letterSpacing: '-0.3px' }}>
            🏥 MediReferral
          </div>
          <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 2 }}>
            Referral Agent App — Interactive Preview
          </div>
        </div>
        <div style={{ color: '#6B7280', fontSize: 11, background: '#1F2937', padding: '6px 12px', borderRadius: 8, border: '1px solid #374151' }}>
          Demo OTP: <strong style={{ color: '#93C5FD' }}>1 2 3 4 5 6</strong>
        </div>
      </div>

      {/* Screen nav pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {allScreens.map(({ s, label }) => (
          <button key={s}
            onClick={() => {
              if (s === 'patient-detail' && !selectedPatient) setSelectedPatient(PATIENTS[0]);
              navigate(s);
            }}
            style={{
              padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
              border: 'none', cursor: 'pointer', transition: 'all .15s',
              background: screen === s ? '#2563EB' : '#1F2937',
              color: screen === s ? '#fff' : '#9CA3AF',
            }}
          >{label}</button>
        ))}
      </div>

      {/* Main area: phone + sidebar */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* Phone frame */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{
            width: 340, background: '#1F2937', borderRadius: 40,
            padding: 10, border: '2px solid #374151',
            boxShadow: '0 25px 60px rgba(0,0,0,0.7), inset 0 0 0 1px #4B5563',
          }}>
            {/* Side buttons */}
            <div style={{ position: 'absolute', right: -3, top: 100, width: 3, height: 60, background: '#374151', borderRadius: '0 2px 2px 0' }} />
            <div style={{ position: 'absolute', left: -3, top: 80, width: 3, height: 35, background: '#374151', borderRadius: '2px 0 0 2px' }} />
            <div style={{ position: 'absolute', left: -3, top: 125, width: 3, height: 35, background: '#374151', borderRadius: '2px 0 0 2px' }} />

            {/* Screen area */}
            <div style={{ borderRadius: 30, overflow: 'hidden', background: '#F9FAFB', height: 680, position: 'relative' }}>
              {/* Dynamic island */}
              <div style={{
                position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
                width: 90, height: 22, background: '#111827', borderRadius: 12, zIndex: 50,
              }} />

              {/* Screen content */}
              <div style={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
                {screen === 'splash'         && <SplashScreen />}
                {screen === 'login'          && <LoginScreen navigate={navigate} phone={phone} setPhone={setPhone} />}
                {screen === 'otp'            && <OtpScreen navigate={navigate} phone={phone} otp={otpValues} setOtp={setOtpValues} />}
                {screen === 'home'           && <DashboardScreen navigate={navigate} />}
                {screen === 'patients'       && <PatientsScreen navigate={navigate} filter={statusFilter} setFilter={setStatusFilter} search={search} setSearch={setSearch} filtered={filteredPatients} onSelect={(p: typeof PATIENTS[0]) => { setSelectedPatient(p); setPatientTab('overview'); navigate('patient-detail'); }} />}
                {screen === 'patient-detail' && selectedPatient && <PatientDetailScreen patient={selectedPatient} tab={patientTab} setTab={setPatientTab} navigate={navigate} />}
                {screen === 'add-patient'    && <AddPatientScreen step={addStep} setStep={setAddStep} navigate={navigate} showSuccess={showSuccess} setShowSuccess={setShowSuccess} />}
                {screen === 'earnings'       && <EarningsScreen tab={earningsTab} setTab={setEarningsTab} />}
                {screen === 'notifications'  && <NotificationsScreen filter={notifFilter} setFilter={setNotifFilter} />}
                {screen === 'profile'        && <ProfileScreen navigate={navigate} />}
              </div>

              {/* Bottom Nav */}
              {['home','patients','earnings','notifications','profile'].includes(screen) && (
                <BottomNav active={activeTab} navigate={navigate} />
              )}
            </div>
          </div>
          {/* Home bar */}
          <div style={{ width: 80, height: 4, background: '#374151', borderRadius: 2, margin: '10px auto 0' }} />
        </div>

        {/* Info sidebar */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: '#1F2937', borderRadius: 14, padding: 16, marginBottom: 12, border: '1px solid #374151' }}>
            <div style={{ color: '#6B7280', fontSize: 10, fontWeight: 600, letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>Current Screen</div>
            <div style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>
              {allScreens.find(s => s.s === screen)?.label ?? screen}
            </div>
          </div>

          <div style={{ background: '#1F2937', borderRadius: 14, padding: 16, border: '1px solid #374151', marginBottom: 12 }}>
            <div style={{ color: '#6B7280', fontSize: 10, fontWeight: 600, letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>App Features</div>
            {[
              { icon: '🔐', label: 'Phone + OTP Login' },
              { icon: '📊', label: 'Live Dashboard Stats' },
              { icon: '👥', label: 'Patient Management' },
              { icon: '🔍', label: 'Search & Filter' },
              { icon: '📋', label: '3-Step Lead Form' },
              { icon: '📅', label: 'Journey Timeline' },
              { icon: '💰', label: 'Commission Tracker' },
              { icon: '📈', label: 'Earnings Bar Chart' },
              { icon: '🔔', label: 'Smart Notifications' },
              { icon: '⚙️', label: 'Profile & Settings' },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 14 }}>{f.icon}</span>
                <span style={{ color: '#D1D5DB', fontSize: 12 }}>{f.label}</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#1F2937', borderRadius: 14, padding: 16, border: '1px solid #374151' }}>
            <div style={{ color: '#6B7280', fontSize: 10, fontWeight: 600, letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>Flutter Stack</div>
            {[
              ['Framework', 'Flutter 3.10+'],
              ['State', 'Riverpod 2.x'],
              ['Navigation', 'Go Router'],
              ['HTTP', 'Dio + Interceptors'],
              ['Charts', 'FL Chart'],
              ['OTP UI', 'Pinput'],
              ['Storage', 'SharedPreferences'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#6B7280', fontSize: 11 }}>{k}</span>
                <span style={{ color: '#93C5FD', fontSize: 11, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Bottom Navigation ────────────────────────────────────────────────────────
function BottomNav({ active, navigate }: { active: string; navigate: (s: string) => void }) {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'patients', icon: '👥', label: 'Patients' },
    { id: 'earnings', icon: '💰', label: 'Earnings' },
    { id: 'notifications', icon: '🔔', label: 'Alerts' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40" style={{ paddingBottom: 12 }}>
      <div className="flex justify-around pt-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => navigate(t.id)}
            className={`flex flex-col items-center px-3 py-1 rounded-xl transition-all ${active === t.id ? 'text-blue-600' : 'text-gray-400'}`}>
            <span className="text-lg">{t.icon}</span>
            <span className={`text-[10px] mt-0.5 font-medium ${active === t.id ? 'text-blue-600' : 'text-gray-400'}`}>{t.label}</span>
            {active === t.id && <div className="w-1 h-1 rounded-full bg-blue-600 mt-0.5" />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Splash Screen ────────────────────────────────────────────────────────────
function SplashScreen() {
  return (
    <div className="h-full flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB, #1D4ED8)' }}>
      <div className="w-24 h-24 rounded-3xl bg-white/20 flex items-center justify-center mb-6 animate-bounce">
        <span className="text-5xl">🏥</span>
      </div>
      <div className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'sans-serif' }}>MediReferral</div>
      <div className="text-white/70 text-sm mb-16">Empowering Healthcare Partners</div>
      <div className="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin" />
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ navigate, phone, setPhone }: { navigate: (s: string) => void; phone: string; setPhone: (v: string) => void }) {
  return (
    <div className="h-full overflow-y-auto bg-white pt-12 px-6 pb-6">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg,#2563EB,#1D4ED8)' }}>
          <span className="text-3xl">🏥</span>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">Welcome Back! 👋</div>
        <div className="text-gray-500 text-sm text-center">Login to manage your patient referrals and track commissions.</div>
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 block mb-2">Phone Number</label>
        <div className="flex gap-2">
          <div className="flex items-center border border-gray-200 rounded-xl px-3 bg-white text-sm text-gray-700 h-13 whitespace-nowrap">
            🇮🇳 +91 ▾
          </div>
          <input
            type="tel" maxLength={10}
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
            placeholder="98765 43210"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        onClick={() => phone.length === 10 ? navigate('otp') : undefined}
        className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${phone.length === 10 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}>
        <span>📤</span> Send OTP
      </button>

      <div className="mt-8 space-y-4">
        {[
          { icon: '🔒', title: 'Secure Login', sub: 'OTP-based authentication' },
          { icon: '📍', title: 'Track Patients', sub: 'Real-time status updates' },
          { icon: '₹', title: 'Earn Commissions', sub: 'Transparent payment tracking' },
        ].map(f => (
          <div key={f.title} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-lg font-bold">{f.icon}</div>
            <div><div className="text-sm font-semibold text-gray-800">{f.title}</div><div className="text-xs text-gray-500">{f.sub}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── OTP Screen ───────────────────────────────────────────────────────────────
function OtpScreen({ navigate, phone, otp, setOtp }: { navigate: (s: string) => void; phone: string; otp: string[]; setOtp: (v: string[]) => void }) {
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  useEffect(() => {
    const t = setInterval(() => setTimer(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);
  const filled = otp.join('');

  const verify = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate('home'); }, 1200);
  };

  return (
    <div className="h-full bg-white px-6 pt-16 pb-6 flex flex-col">
      <button onClick={() => navigate('login')} className="text-gray-500 flex items-center gap-1 text-sm mb-8">← Back</button>
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 text-3xl">💬</div>
      <div className="text-2xl font-bold text-gray-900 mb-2">Enter OTP</div>
      <div className="text-gray-500 text-sm mb-8">We sent a 6-digit OTP to <span className="font-semibold text-gray-800">+91 {phone}</span></div>

      <div className="flex gap-2 mb-8 justify-center">
        {otp.map((v, i) => (
          <input key={i} type="text" maxLength={1} value={v}
            onChange={e => {
              const val = e.target.value.replace(/\D/,'');
              const next = [...otp]; next[i] = val; setOtp(next);
              if (val && i < 5) (document.getElementById(`otp-${i+1}`) as HTMLInputElement)?.focus();
            }}
            id={`otp-${i}`}
            className="w-11 border-2 border-gray-200 rounded-xl text-center text-lg font-semibold focus:outline-none focus:border-blue-500 text-gray-900"
            style={{ height: 52 }}
          />
        ))}
      </div>

      <button onClick={verify} disabled={filled.length !== 6 || loading}
        className={`w-full py-4 rounded-xl font-semibold text-white mb-4 flex items-center justify-center gap-2 ${filled.length === 6 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}>
        {loading ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><span>✅</span> Verify OTP</>}
      </button>

      <div className="text-center text-sm text-gray-500">
        {timer > 0 ? `Resend in ${timer}s` : <button className="text-blue-600 font-semibold">Resend OTP</button>}
      </div>

      <div className="mt-auto p-3 bg-amber-50 rounded-xl flex gap-2 text-amber-700 text-xs">
        <span>ℹ️</span> Demo mode: Enter any 6-digit OTP (e.g. 1 2 3 4 5 6)
      </div>
    </div>
  );
}

// ─── Dashboard Screen ─────────────────────────────────────────────────────────
function DashboardScreen({ navigate }: { navigate: (s: string) => void }) {
  return (
    <div className="h-full flex flex-col" style={{ paddingBottom: 72 }}>
      <div className="px-5 pt-10 pb-5 text-white" style={{ background: 'linear-gradient(135deg,#2563EB,#1D4ED8)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">R</div>
            <div>
              <div className="text-white/70 text-xs">Welcome back,</div>
              <div className="font-bold text-lg">Rajesh</div>
            </div>
          </div>
          <button onClick={() => navigate('notifications')} className="relative">
            <span className="text-2xl">🔔</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border border-blue-700" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="rounded-2xl text-white p-5" style={{ background: 'linear-gradient(135deg,#2563EB,#1D4ED8)' }}>
          <div className="text-white/70 text-xs mb-1">This Month&apos;s Earnings</div>
          <div className="text-3xl font-bold mb-4">₹45,230</div>
          <div className="flex gap-3">
            <div className="bg-white/15 rounded-xl px-3 py-2">
              <div className="text-white/60 text-[10px]">Total Earned</div>
              <div className="font-bold text-amber-300 text-sm">₹2.3L</div>
            </div>
            <div className="bg-white/15 rounded-xl px-3 py-2">
              <div className="text-white/60 text-[10px]">Pending</div>
              <div className="font-bold text-white text-sm">₹8,400</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '👥', label: 'Active Patients', val: '12', color: '#2563EB', bg: '#EFF6FF' },
            { icon: '🏥', label: 'Pending Surgeries', val: '3', color: '#D97706', bg: '#FFFBEB' },
            { icon: '📈', label: 'Conversion Rate', val: '68%', color: '#10B981', bg: '#ECFDF5' },
            { icon: '💵', label: 'Avg Commission', val: '₹3.8K', color: '#8B5CF6', bg: '#F5F3FF' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-4" style={{ background: s.bg, border: `1px solid ${s.color}20` }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base mb-2" style={{ background: `${s.color}18` }}>{s.icon}</div>
              <div className="text-xl font-bold text-gray-900">{s.val}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <div className="font-semibold text-gray-800">🔔 Recent Activity</div>
            <button onClick={() => navigate('notifications')} className="text-blue-600 text-xs font-medium">See all</button>
          </div>
          <div className="space-y-2">
            {ACTIVITY.map(a => (
              <div key={a.id} className="bg-white rounded-xl p-3 flex gap-3 items-center border border-gray-100">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                  style={{ background: a.type === 'surgery' ? '#ECFDF5' : a.type === 'commission' ? '#EFF6FF' : a.type === 'opd' ? '#F5F3FF' : '#FFFBEB' }}>
                  {a.type === 'surgery' ? '✅' : a.type === 'commission' ? '₹' : a.type === 'opd' ? '📅' : '🏥'}
                </div>
                <div className="flex-1 min-w-0">
                  {a.patient && <div className="text-xs font-semibold text-gray-800 truncate">{a.patient}</div>}
                  <div className="text-xs text-gray-500 truncate">{a.event}</div>
                </div>
                <div className="text-[10px] text-gray-400 shrink-0">{a.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-4" />
      </div>

      <button onClick={() => navigate('add-patient')}
        className="absolute bottom-20 right-5 bg-blue-600 text-white rounded-2xl px-4 py-3 flex items-center gap-2 shadow-lg font-semibold text-sm"
        style={{ zIndex: 30 }}>
        <span>+</span> Add Patient
      </button>
    </div>
  );
}

// ─── Patients Screen ──────────────────────────────────────────────────────────
function PatientsScreen({ navigate, filter, setFilter, search, setSearch, filtered, onSelect }: {
  navigate: (s: string) => void;
  filter: string;
  setFilter: (f: string) => void;
  search: string;
  setSearch: (s: string) => void;
  filtered: typeof PATIENTS;
  onSelect: (p: typeof PATIENTS[0]) => void;
}) {
  const filters = [
    { k: 'all', l: 'All' }, { k: 'new', l: 'New' }, { k: 'contacted', l: 'Contacted' },
    { k: 'opd', l: 'OPD' }, { k: 'ipd', l: 'IPD' }, { k: 'completed', l: 'Done' }, { k: 'lost', l: 'Lost' },
  ];

  return (
    <div className="h-full flex flex-col" style={{ paddingBottom: 72 }}>
      <div className="bg-white px-4 pt-10 pb-3 border-b border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <div className="text-lg font-bold text-gray-900">My Patients</div>
          <button onClick={() => navigate('add-patient')} className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl">+</button>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search patients..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 mb-3" />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map(f => (
            <button key={f.k} onClick={() => setFilter(f.k)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-medium whitespace-nowrap border transition-all ${filter === f.k ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}>
              {f.l}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-3 space-y-3">
        <div className="text-xs text-gray-500 mb-1">{filtered.length} patient{filtered.length !== 1 ? 's' : ''}</div>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-16 text-gray-400">
            <span className="text-4xl mb-3">👥</span>
            <div className="font-semibold">No patients found</div>
            <div className="text-sm mt-1">Try a different filter</div>
          </div>
        ) : filtered.map((p) => (
          <PatientCard key={p.id} patient={p} onTap={() => onSelect(p)} />
        ))}
        <div className="h-4" />
      </div>
    </div>
  );
}

function PatientCard({ patient: p, onTap }: { patient: typeof PATIENTS[0]; onTap: () => void }) {
  const st = STATUS_CONFIG[p.status];
  return (
    <div onClick={onTap} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer active:scale-[0.99] transition-transform">
      <div className="p-4">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 bg-blue-50 text-blue-700">
            {p.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div className="font-semibold text-gray-900 text-sm truncate">{p.name}</div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${st.bg} ${st.color}`}>{st.label}</span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{p.phone} · Age {p.age} · {p.gender === 'M' ? 'Male' : 'Female'}</div>
            <div className="mt-2 inline-block bg-blue-50 text-blue-700 text-[10px] font-medium px-2 py-0.5 rounded-md">
              {p.specialty} · {p.procedure}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-50 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
          <span>₹</span>{p.commission.toLocaleString('en-IN')} <span className="text-gray-400 font-normal">commission</span>
        </div>
        <div className="flex gap-2">
          <button className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-xs" onClick={e => e.stopPropagation()}>📞</button>
          <button className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-xs" onClick={e => e.stopPropagation()}>💬</button>
        </div>
      </div>
    </div>
  );
}

// ─── Patient Detail Screen ────────────────────────────────────────────────────
function PatientDetailScreen({ patient: p, tab, setTab, navigate }: {
  patient: typeof PATIENTS[0];
  tab: string;
  setTab: (t: string) => void;
  navigate: (s: string) => void;
}) {
  const st = STATUS_CONFIG[p.status];
  const tabs = ['overview', 'timeline', 'documents', 'notes'];

  const timeline = [
    { label: 'Lead Created', desc: 'By you', done: true, date: '10 May 2024' },
    { label: 'Contacted by Team', desc: `Category Team: ${p.specialty}`, done: ['contacted','opd_scheduled','ipd_confirmed','completed'].includes(p.status), date: '' },
    { label: 'OPD Scheduled', desc: p.hospital ?? 'TBD', done: ['opd_scheduled','ipd_confirmed','completed'].includes(p.status), date: p.opd ?? '' },
    { label: 'IPD Confirmed', desc: p.surgeryDate ? `Surgery: ${p.surgeryDate}` : '', done: ['ipd_confirmed','completed'].includes(p.status), date: '' },
    { label: 'Surgery', desc: p.status === 'completed' ? 'Completed' : 'Awaiting', done: p.status === 'completed', date: p.surgeryDate ?? '' },
    { label: 'Commission Payment', desc: '', done: p.status === 'completed', date: '' },
  ];

  return (
    <div className="h-full flex flex-col" style={{ paddingBottom: 72 }}>
      <div className="text-white pt-10 pb-0" style={{ background: 'linear-gradient(135deg,#2563EB,#1D4ED8)' }}>
        <div className="flex items-center gap-3 px-4 mb-4">
          <button onClick={() => navigate('patients')} className="text-white/80 text-xl">←</button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">{p.name[0]}</div>
            <div>
              <div className="font-bold text-base">{p.name}</div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white">{st.label}</span>
            </div>
          </div>
          <button className="text-white/80">✏️</button>
        </div>
        <div className="flex">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-medium capitalize border-b-2 transition-all ${tab === t ? 'border-white text-white' : 'border-transparent text-white/60'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === 'overview' && (
          <div className="p-4 space-y-4">
            {[
              { title: '📱 Contact', rows: [['Phone', p.phone], ['Age', `${p.age} years`], ['Gender', p.gender === 'M' ? 'Male' : 'Female'], ['City', p.city]] as [string,string][] },
              { title: '🏥 Medical', rows: [['Specialty', p.specialty], ['Procedure', p.procedure], ['Hospital', p.hospital ?? 'TBD'], ['Doctor', p.doctor ?? 'TBD'], ['Urgency', p.urgency ?? '—']] as [string,string][] },
              { title: '💰 Financial', rows: [['Package Cost', fmt(p.packageCost)], ['Commission', `${fmt(p.commission)} (${p.commPct}%)`], ['Budget', p.budget ?? '—'], ['Insurance', p.insurance ? `Yes (${(p as any).insuranceProv ?? 'Unknown'})` : 'No']] as [string,string][] },
              { title: '📅 Dates', rows: ([['Created', '10 May 2024'], p.opd ? ['OPD Date', p.opd] : null, p.surgeryDate ? ['Surgery', p.surgeryDate] : null, p.discharge ? ['Discharge', p.discharge] : null].filter(Boolean)) as [string,string][] },
            ].map(card => (
              <div key={card.title} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="font-semibold text-sm text-gray-900 mb-3">{card.title}</div>
                {card.rows.map(([label, val]) => (
                  <div key={label} className="flex py-1.5 border-b border-gray-50 last:border-0">
                    <div className="w-28 text-xs text-gray-500 flex-shrink-0">{label}</div>
                    <div className="text-xs font-medium text-gray-800 flex-1">{val}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {tab === 'timeline' && (
          <div className="p-4">
            <div className="relative pl-6">
              {timeline.map((e, i) => (
                <div key={i} className="relative mb-5">
                  {i < timeline.length - 1 && (
                    <div className="absolute left-[-13px] top-5 bottom-[-20px] w-0.5" style={{ background: e.done ? '#10B981' : '#E5E7EB' }} />
                  )}
                  <div className={`absolute left-[-20px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs ${e.done ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {e.done ? '✓' : '•'}
                  </div>
                  <div className={e.done ? 'text-gray-900' : 'text-gray-400'}>
                    <div className="text-sm font-semibold">{e.label}</div>
                    {e.desc && <div className="text-xs mt-0.5">{e.desc}</div>}
                    {e.date && <div className="text-[10px] mt-0.5 text-gray-400">{e.date}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'documents' && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <span className="text-4xl mb-3">📁</span>
            <div className="font-semibold">No Documents Yet</div>
            <div className="text-sm mt-1 text-center px-8">Documents will appear here once uploaded by the medical team.</div>
          </div>
        )}
        {tab === 'notes' && (
          <div className="p-4">
            {p.notes ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-4 text-sm text-gray-700 leading-relaxed">{p.notes}</div>
            ) : (
              <div className="text-center text-gray-400 text-sm pt-12">No notes added yet.</div>
            )}
            <button className="mt-4 w-full border-2 border-blue-200 text-blue-600 rounded-xl py-3 text-sm font-medium">+ Add Note</button>
          </div>
        )}
      </div>

      <div className="absolute bottom-16 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-2">
        <button className="flex-1 bg-emerald-50 text-emerald-700 rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-1">📞 Call</button>
        <button className="flex-1 bg-green-50 text-green-700 rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-1">💬 WhatsApp</button>
        <button className="flex-[2] bg-blue-600 text-white rounded-xl py-2.5 text-xs font-semibold flex items-center justify-center gap-1">🔄 Update Status</button>
      </div>
    </div>
  );
}

// ─── Add Patient Screen ───────────────────────────────────────────────────────
function AddPatientScreen({ step, setStep, navigate, showSuccess, setShowSuccess }: {
  step: number;
  setStep: (s: number) => void;
  navigate: (s: string) => void;
  showSuccess: boolean;
  setShowSuccess: (v: boolean) => void;
}) {
  const steps = ['Basic Info', 'Medical Details', 'Financial & Other'];

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => { setShowSuccess(false); setStep(0); navigate('patients'); }, 1800);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-4 pt-10 pb-4 border-b border-gray-100 flex items-center gap-3">
        <button onClick={() => step === 0 ? navigate('patients') : setStep(step - 1)} className="text-gray-600 text-xl">✕</button>
        <div className="font-bold text-gray-900 flex-1">Add New Patient</div>
      </div>

      <div className="px-4 py-3 flex gap-2">
        {steps.map((s, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className={`h-1.5 w-full rounded-full transition-all ${i <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`text-[9px] font-medium ${i <= step ? 'text-blue-600' : 'text-gray-400'}`}>{s}</div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {step === 0 && (
          <div className="space-y-4">
            {[
              { label: 'Patient Full Name *', ph: 'e.g. Ramesh Kumar', type: 'text' },
              { label: 'Phone Number *', ph: '98765 43210', type: 'tel', prefix: '+91' },
              { label: 'Age *', ph: 'e.g. 45', type: 'number' },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs font-medium text-gray-700 block mb-1.5">{f.label}</label>
                <div className="flex gap-2">
                  {f.prefix && <div className="border border-gray-200 rounded-xl px-3 flex items-center text-sm text-gray-600 bg-gray-50">{f.prefix}</div>}
                  <input type={f.type} placeholder={f.ph}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            ))}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1.5">Gender *</label>
              <div className="flex gap-2">
                {['Male', 'Female', 'Other'].map(g => (
                  <button key={g} className="flex-1 border border-gray-200 rounded-xl py-3 text-sm text-gray-600 hover:border-blue-500 hover:text-blue-600">{g}</button>
                ))}
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4">
            {[
              { label: 'Specialty *', opts: ['Ortho', 'Urology', 'Cardiology', 'ENT', 'General Surgery', 'Gynecology'] },
              { label: 'City *', opts: ['Hyderabad', 'Bangalore', 'Mumbai', 'Delhi', 'Chennai'] },
              { label: 'Urgency *', opts: ['Immediate', 'Within a week', 'Within a month', 'Flexible'] },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs font-medium text-gray-700 block mb-1.5">{f.label}</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 bg-white">
                  <option value="">Select…</option>
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1.5">Procedure Interest</label>
              <textarea rows={2} placeholder="e.g. Knee replacement, Gallbladder removal..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none" />
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1.5">Budget Range</label>
              <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 bg-white">
                <option>Below 50k</option><option>50k-1L</option><option>1L-2L</option><option>Above 2L</option>
              </select>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-800">Has Insurance?</div>
                <div className="text-xs text-gray-500">Toggle if patient has insurance</div>
              </div>
              <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1.5">Additional Notes</label>
              <textarea rows={3} placeholder="Any special requirements..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 resize-none" />
            </div>
            <div className="bg-blue-50 rounded-xl p-3 flex gap-2 text-blue-700 text-xs">
              <span>ℹ️</span> Our medical team will contact the patient within 24 hours.
            </div>
          </div>
        )}
      </div>

      <div className="px-4 pb-4 pt-3 border-t border-gray-100 flex gap-3">
        {step > 0 && (
          <button onClick={() => setStep(step - 1)}
            className="flex-1 border-2 border-gray-200 text-gray-700 rounded-xl py-3 text-sm font-semibold">← Back</button>
        )}
        <button
          onClick={() => step < 2 ? setStep(step + 1) : handleSubmit()}
          className="flex-[2] bg-blue-600 text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2">
          {step < 2 ? <>Next →</> : <>📤 Submit Lead</>}
        </button>
      </div>

      {showSuccess && (
        <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-50">
          <div className="text-6xl mb-4 animate-bounce">✅</div>
          <div className="text-xl font-bold text-gray-900 mb-2">Lead Submitted!</div>
          <div className="text-gray-500 text-sm text-center px-8">Our team will contact the patient within 24 hours.</div>
        </div>
      )}
    </div>
  );
}

// ─── Earnings Screen ──────────────────────────────────────────────────────────
function EarningsScreen({ tab, setTab }: { tab: string; setTab: (t: string) => void }) {
  const months = [{ m: 'Dec', v: 28 }, { m: 'Jan', v: 32 }, { m: 'Feb', v: 35.5 }, { m: 'Mar', v: 38.2 }, { m: 'Apr', v: 40.4 }, { m: 'May', v: 45.2 }];
  const maxV = 50;

  return (
    <div className="h-full flex flex-col" style={{ paddingBottom: 72 }}>
      <div className="bg-white px-4 pt-10 pb-0 border-b border-gray-100">
        <div className="text-lg font-bold text-gray-900 mb-3">Commissions 💰</div>
        <div className="flex border-b border-gray-100">
          {['overview', 'pending', 'paid'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-medium capitalize border-b-2 -mb-px transition-all ${tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {tab === 'overview' && (
          <div className="space-y-4">
            <div className="rounded-2xl text-white p-5" style={{ background: 'linear-gradient(135deg,#2563EB,#1D4ED8)' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white/70 text-xs">This Month</span>
                <span className="bg-emerald-500/30 text-white text-[10px] px-2 py-0.5 rounded-full">↑ 12% from last month</span>
              </div>
              <div className="text-3xl font-bold mb-4">₹45,230</div>
              <div className="flex gap-3">
                <div className="bg-white/15 rounded-xl px-3 py-2 flex items-center gap-2">
                  <span className="text-lg">⏳</span>
                  <div><div className="text-white/60 text-[10px]">Pending</div><div className="text-amber-300 font-bold text-sm">₹8,400</div></div>
                </div>
                <div className="bg-white/15 rounded-xl px-3 py-2 flex items-center gap-2">
                  <span className="text-lg">💼</span>
                  <div><div className="text-white/60 text-[10px]">Total Earned</div><div className="text-white font-bold text-sm">₹2.3L</div></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="font-semibold text-sm text-gray-900 mb-4">📊 Monthly Breakdown</div>
              <div className="flex items-end gap-2 h-32">
                {months.map((m, i) => (
                  <div key={m.m} className="flex-1 flex flex-col items-center gap-1">
                    <div className="text-[9px] font-semibold text-gray-600">₹{m.v}K</div>
                    <div className="w-full rounded-t-lg transition-all" style={{
                      height: `${(m.v / maxV) * 100}%`,
                      background: i === months.length - 1 ? '#2563EB' : '#93C5FD',
                    }} />
                    <div className="text-[9px] text-gray-500">{m.m}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="font-semibold text-sm text-gray-900 mb-3">🏆 Top Earning Procedures</div>
              {[
                { proc: 'Knee Replacement', amt: 18200 },
                { proc: 'Gallbladder Surgery', amt: 9600 },
                { proc: 'Cataract Surgery', amt: 7200 },
                { proc: 'Stone Removal', amt: 6800 },
              ].map((item, i) => (
                <div key={item.proc} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>{i + 1}</div>
                  <div className="flex-1 text-xs font-medium text-gray-800">{item.proc}</div>
                  <div className="text-sm font-bold text-emerald-600">{fmt(item.amt)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'pending' && (
          <div className="space-y-3">
            {[
              { name: 'Ramesh Kumar', proc: 'Knee Replacement', amt: 4500, stage: 'Awaiting bill verification', est: '5 June 2024' },
              { name: 'Priya Sharma', proc: 'Stone Removal', amt: 3900, stage: 'Awaiting finance approval', est: '8 June 2024' },
            ].map(item => (
              <div key={item.name} className="bg-white rounded-2xl border border-gray-100 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-gray-900 text-sm">{item.name}</div>
                  <div className="text-emerald-600 font-bold">{fmt(item.amt)}</div>
                </div>
                <div className="text-xs text-gray-500 mb-3">{item.proc}</div>
                <div className="inline-block bg-amber-50 text-amber-700 text-[10px] font-medium px-3 py-1 rounded-full mb-2">{item.stage}</div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400"><span>📅</span> Est. payout: {item.est}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'paid' && (
          <div className="space-y-3">
            {[
              { date: '20 May 2024', amt: 12300, cases: 3, method: 'Bank Transfer', utr: 'HDFC240520XXXX' },
              { date: '5 May 2024', amt: 8700, cases: 2, method: 'UPI', utr: 'UPI240505XXXX' },
              { date: '20 Apr 2024', amt: 15600, cases: 4, method: 'Bank Transfer', utr: 'HDFC240420XXXX' },
            ].map(item => (
              <div key={item.date} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-3 items-center">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-xl flex-shrink-0">✅</div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">{item.date}</div>
                  <div className="text-xs text-gray-500">{item.cases} cases · {item.method}</div>
                  <div className="text-[10px] text-gray-400">UTR: {item.utr}</div>
                </div>
                <div className="text-emerald-600 font-bold text-sm">{fmt(item.amt)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Notifications Screen ─────────────────────────────────────────────────────
function NotificationsScreen({ filter, setFilter }: { filter: string; setFilter: (f: string) => void }) {
  const categories = [
    { k: 'all', l: 'All', icon: '🔔' },
    { k: 'commission', l: 'Commission', icon: '₹' },
    { k: 'patient', l: 'Patients', icon: '👤' },
    { k: 'appointment', l: 'Appointments', icon: '📅' },
    { k: 'alert', l: 'Alerts', icon: '⚠️' },
  ];

  const typeColor: Record<string, string> = {
    commission: 'bg-emerald-50 text-emerald-600',
    patient: 'bg-blue-50 text-blue-600',
    appointment: 'bg-purple-50 text-purple-600',
    alert: 'bg-amber-50 text-amber-600',
  };

  const filtered = filter === 'all' ? NOTIFICATIONS : NOTIFICATIONS.filter(n => n.type === filter);

  return (
    <div className="h-full flex flex-col" style={{ paddingBottom: 72 }}>
      <div className="bg-white px-4 pt-10 pb-3 border-b border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <div className="text-lg font-bold text-gray-900">Notifications 🔔</div>
          <button className="text-blue-600 text-xs font-medium">Mark all read</button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(c => (
            <button key={c.k} onClick={() => setFilter(c.k)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-medium whitespace-nowrap border transition-all ${filter === c.k ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200'}`}>
              <span>{c.icon}</span>{c.l}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {filtered.map(n => (
          <div key={n.id} className={`rounded-xl border p-4 transition-all ${n.read ? 'bg-white border-gray-100' : 'bg-blue-50/40 border-blue-100'}`}>
            <div className="flex gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 relative ${typeColor[n.type] ?? 'bg-gray-50 text-gray-600'}`}>
                {n.type === 'commission' ? '₹' : n.type === 'patient' ? '👤' : n.type === 'appointment' ? '📅' : '⚠️'}
                {!n.read && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-600 rounded-full" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 mb-0.5">{n.title}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{n.body}</div>
                <div className="text-[10px] text-gray-400 mt-1">{n.time}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Profile Screen ───────────────────────────────────────────────────────────
function ProfileScreen({ navigate }: { navigate: (s: string) => void }) {
  const [notifs, setNotifs] = useState(true);
  const [bio, setBio] = useState(false);
  const [dark, setDark] = useState(false);
  void navigate;

  return (
    <div className="h-full flex flex-col" style={{ paddingBottom: 72 }}>
      <div className="text-white pt-10 pb-6 flex flex-col items-center" style={{ background: 'linear-gradient(135deg,#2563EB,#1D4ED8)' }}>
        <div className="relative mb-2">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold text-white border-4 border-white/30">R</div>
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-xs">✏️</div>
        </div>
        <div className="text-lg font-bold">Rajesh Sharma</div>
        <div className="flex gap-2 mt-2">
          <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full">ID: AG-HYD-001</span>
          <span className="bg-emerald-500/30 text-white text-xs px-2.5 py-1 rounded-full font-semibold">4% Commission</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="font-semibold text-sm text-gray-900 mb-3">📊 Performance</div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[{ v: '45', l: 'Total Leads', c: 'text-blue-600' }, { v: '68%', l: 'Conversion', c: 'text-emerald-600' }, { v: '< 2h', l: 'Avg Response', c: 'text-amber-600' }].map(s => (
              <div key={s.l}>
                <div className={`text-xl font-bold ${s.c}`}>{s.v}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <ProfileSection title="👤 Profile Information" items={[
          { icon: '👤', label: 'Rajesh Sharma', sub: 'Full Name' },
          { icon: '📱', label: '+91 98765 43210', sub: 'Phone' },
          { icon: '📧', label: 'rajesh@example.com', sub: 'Email' },
          { icon: '📍', label: 'Hyderabad', sub: 'City' },
        ]} />

        <ProfileSection title="🏦 Bank Details" items={[
          { icon: '🏛️', label: 'HDFC Bank ••••4521', sub: 'Bank Account' },
          { icon: '💳', label: 'UPI: rajesh@hdfc', sub: 'UPI ID' },
        ]} />

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 text-xs font-semibold text-gray-500 border-b border-gray-50">⚙️ App Settings</div>
          {[
            { label: 'Push Notifications', icon: '🔔', val: notifs, set: setNotifs },
            { label: 'Biometric Login', icon: '🔐', val: bio, set: setBio },
            { label: 'Dark Mode', icon: '🌙', val: dark, set: setDark },
          ].map(s => (
            <div key={s.label} className="flex items-center px-4 py-3 border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center mr-3">{s.icon}</div>
              <div className="flex-1 text-sm font-medium text-gray-800">{s.label}</div>
              <div onClick={() => s.set(!s.val)}
                className={`w-11 h-6 rounded-full cursor-pointer transition-all relative ${s.val ? 'bg-blue-600' : 'bg-gray-200'}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${s.val ? 'right-0.5' : 'left-0.5'}`} />
              </div>
            </div>
          ))}
        </div>

        <ProfileSection title="💬 Support & Help" items={[
          { icon: '❓', label: 'FAQ', sub: '' },
          { icon: '🎧', label: 'Contact Support', sub: '' },
          { icon: '📚', label: 'Training Materials', sub: '' },
          { icon: '📄', label: 'Terms & Conditions', sub: '' },
        ]} />

        <button className="w-full border-2 border-red-200 text-red-600 rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2">
          🚪 Logout
        </button>
        <div className="text-center text-xs text-gray-400 pb-2">MediReferral v1.0.0</div>
      </div>
    </div>
  );
}

function ProfileSection({ title, items }: { title: string; items: { icon: string; label: string; sub: string }[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 text-xs font-semibold text-gray-500 border-b border-gray-50">{title}</div>
      {items.map((item, i) => (
        <div key={i} className="flex items-center px-4 py-3 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center mr-3 text-sm">{item.icon}</div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-800">{item.label}</div>
            {item.sub && <div className="text-[10px] text-gray-400">{item.sub}</div>}
          </div>
          <span className="text-gray-300">›</span>
        </div>
      ))}
    </div>
  );
}
