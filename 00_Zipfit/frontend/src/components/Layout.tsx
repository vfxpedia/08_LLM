import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserProfile } from '../App';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';
import { Logo } from './Logo';
import {
  Home,
  MessageSquare,
  FileText,
  GitCompare,
  CheckCircle,
  CreditCard,
  User,
  Bell,
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  Moon,
  Sun,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  userProfile: UserProfile | null;
  onEditProfile: () => void;
  onLogout: () => void;
}

const menuItems = [
  { path: '/home', icon: Home, label: '홈' },
  { path: '/chat', icon: MessageSquare, label: 'AI 상담', badge: 'Main' },
  { path: '/announcements', icon: FileText, label: '공고 목록' },
  { path: '/comparison', icon: GitCompare, label: '공고 비교' },
  { path: '/eligibility', icon: CheckCircle, label: '자격 진단' },
  { path: '/loans', icon: CreditCard, label: '대출 정보' },
  { path: '/mypage', icon: User, label: '마이페이지' },
  { path: '/notifications', icon: Bell, label: '알림 설정' },
  { path: '/faq', icon: HelpCircle, label: 'FAQ' },
];

export function Layout({ children, userProfile, onEditProfile, onLogout }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:border-zinc-200 dark:border-zinc-800 lg:bg-white dark:bg-zinc-900">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
          <Link to="/home" className="flex items-center gap-3">
            <Logo className="w-9 h-9" />
            <div>
              <h2 className="text-zinc-900 dark:text-zinc-100">집핏</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">ZIPFIT</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs px-2 py-0.5 bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-500 dark:to-green-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        {userProfile && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 dark:from-emerald-400 dark:to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white">{userProfile.name[0]}</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm text-zinc-900 dark:text-zinc-100">{userProfile.name}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{userProfile.age}세 · {userProfile.residence.split(' ')[0]}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>
            {profileOpen && (
              <div className="mt-2 p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                <button
                  onClick={() => {
                    onEditProfile();
                    setProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 rounded transition-colors"
                >
                  프로필 수정
                </button>
                <button
                  onClick={() => {
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-white dark:hover:bg-zinc-800 rounded transition-colors"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 dark:bg-black/70"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 bg-white dark:bg-zinc-900 shadow-xl">
            <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800">
              <Link to="/home" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                <Logo className="w-9 h-9" />
                <div>
                  <h2 className="text-zinc-900 dark:text-zinc-100">집핏</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">ZIPFIT</p>
                </div>
              </Link>
              <button onClick={() => setSidebarOpen(false)} className="p-2">
                <X className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
              </button>
            </div>

            <nav className="p-4 overflow-y-auto" style={{ height: 'calc(100vh - 64px)' }}>
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        active
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto text-xs px-2 py-0.5 bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-500 dark:to-green-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              <Menu className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
            </button>
            <div>
              <h1 className="text-zinc-900 dark:text-zinc-100">
                {menuItems.find((item) => item.path === location.pathname)?.label || '공공주택 AI'}
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">LH · SH · GH 공식 정보 기반</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-full">LH</span>
              <span className="text-xs px-2 py-1 bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 rounded-full">SH</span>
              <span className="text-xs px-2 py-1 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-full">GH</span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              ) : (
                <Sun className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              )}
            </button>
            {userProfile && (
              <div className="lg:hidden">
                <Link to="/mypage">
                  <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-600 dark:from-emerald-400 dark:to-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">{userProfile.name[0]}</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
          {children}
        </main>
      </div>
    </div>
  );
}