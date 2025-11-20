import { Link } from 'react-router-dom';
import { UserProfile } from '../App';
import { Button } from '../components/ui/button';
import {
  MessageSquare,
  FileText,
  GitCompare,
  CheckCircle,
  CreditCard,
  TrendingUp,
  Users,
  Calendar,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  ChevronDown,
} from 'lucide-react';

interface HomePageProps {
  userProfile: UserProfile | null;
}

export function HomePage({ userProfile }: HomePageProps) {
  const quickLinks = [
    {
      icon: MessageSquare,
      title: 'AI 상담',
      description: '공고 내용을 쉽게 이해하세요',
      path: '/chat',
      color: 'from-emerald-500 to-green-600',
      badge: '추천',
    },
    {
      icon: FileText,
      title: '공고 목록',
      description: '최신 임대·분양 공고 보기',
      path: '/announcements',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: CheckCircle,
      title: '자격 진단',
      description: 'AI가 분석하는 신청 가능 주택',
      path: '/eligibility',
      color: 'from-emerald-600 to-green-500',
    },
    {
      icon: CreditCard,
      title: '대출 정보',
      description: '주거지원 대출 상품 비교',
      path: '/loans',
      color: 'from-green-600 to-emerald-500',
    },
  ];

  const features = [
    { 
      icon: Zap, 
      title: 'AI 기반 분석', 
      desc: '실시간 공고 분석',
      color: 'text-emerald-600 dark:text-emerald-400'
    },
    { 
      icon: Shield, 
      title: '정확한 정보', 
      desc: 'LH·SH·GH 공식 문서',
      color: 'text-green-600 dark:text-green-400'
    },
    { 
      icon: Users, 
      title: '맞춤형 추천', 
      desc: '개인별 최적화',
      color: 'text-emerald-600 dark:text-emerald-400'
    },
  ];

  const recentAnnouncements = [
    {
      id: '1',
      title: '고양 삼송지구 청년 행복주택',
      provider: 'LH',
      deadline: '2025.01.25',
      status: '모집중',
    },
    {
      id: '2',
      title: '서울 강남 신혼부부 특별공급',
      provider: 'SH',
      deadline: '2025.01.30',
      status: '모집중',
    },
    {
      id: '3',
      title: '경기 광교 행복주택 2차',
      provider: 'GH',
      deadline: '2025.02.05',
      status: '모집예정',
    },
  ];

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight - 64, behavior: 'smooth' });
  };

  return (
    <div className="min-h-full">
      {/* Hero Section with Premium Gradient - Full Screen */}
      <section className="relative h-[calc(100vh-4rem)] bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-700 text-white overflow-hidden flex items-center">
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-transparent to-green-500/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(5,150,105,0.3),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Hero Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4 sm:mb-6 border border-white/20">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">AI 기반 공공주택 정보 플랫폼</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-5xl text-white mb-3 sm:mb-4 leading-tight">
                {userProfile ? `${userProfile.name}님,\n환영합니다!` : '공공주택 정보를\n쉽게 찾아보세요'}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-emerald-50 mb-6 sm:mb-8 leading-relaxed">
                LH, SH, GH의 실제 공고 문서를 AI가 분석하여
                <br className="hidden sm:block" />
                정확하고 명확한 답변을 제공합니다
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to="/chat">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-emerald-600 hover:bg-zinc-50 hover:scale-105 transition-transform shadow-lg">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    AI 상담 시작하기
                  </Button>
                </Link>
                <Link to="/announcements">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white/80 text-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-emerald-600 transition-all">
                    공고 둘러보기
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Feature Cards */}
            <div className="grid gap-3 sm:gap-4">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={idx} 
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 sm:p-6 hover:bg-white/15 transition-all group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base text-white mb-0.5 sm:mb-1">{feature.title}</h3>
                        <p className="text-xs sm:text-sm text-emerald-100">{feature.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-10 lg:mt-12">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 sm:p-4 text-center">
              <p className="text-2xl sm:text-3xl text-white mb-0.5 sm:mb-1">1,247</p>
              <p className="text-xs sm:text-sm text-emerald-100">등록된 공고</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 sm:p-4 text-center">
              <p className="text-2xl sm:text-3xl text-white mb-0.5 sm:mb-1">42</p>
              <p className="text-xs sm:text-sm text-emerald-100">이번 주 신규</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 sm:p-4 text-center">
              <p className="text-2xl sm:text-3xl text-white mb-0.5 sm:mb-1">15,823</p>
              <p className="text-xs sm:text-sm text-emerald-100">누적 상담</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 sm:p-4 text-center">
              <p className="text-2xl sm:text-3xl text-white mb-0.5 sm:mb-1">3,492</p>
              <p className="text-xs sm:text-sm text-emerald-100">활성 사용자</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button 
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/80 hover:text-white transition-colors"
          aria-label="스크롤하여 더보기"
        >
          <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </section>

      {/* Quick Links Section */}
      <section className="bg-zinc-50 dark:bg-zinc-950 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl text-zinc-900 dark:text-zinc-100 mb-2">빠른 메뉴</h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">원하시는 서비스를 바로 이용하세요</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link key={index} to={link.path}>
                  <div className="group bg-white dark:bg-zinc-900 rounded-xl shadow-sm hover:shadow-xl transition-all p-4 sm:p-6 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700 h-full">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${link.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      {link.badge && (
                        <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 rounded-full font-medium">
                          {link.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg text-zinc-900 dark:text-zinc-100 mb-1 sm:mb-2">{link.title}</h3>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">{link.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Announcements Section */}
      <section className="bg-white dark:bg-zinc-900 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-zinc-900 dark:text-zinc-100 mb-2">최근 공고</h2>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">지금 신청 가능한 따끈따끈한 공고를 확인하세요</p>
            </div>
            <Link to="/announcements">
              <Button variant="ghost" className="hidden sm:flex text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
                전체 보기
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {recentAnnouncements.map((announcement) => (
              <Link key={announcement.id} to={`/announcements/${announcement.id}`}>
                <div className="bg-zinc-50 dark:bg-zinc-950 rounded-xl shadow-sm hover:shadow-xl transition-all p-4 sm:p-6 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700 h-full group">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className={`text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium ${
                      announcement.provider === 'LH' ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400' :
                      announcement.provider === 'SH' ? 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400' :
                      'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400'
                    }`}>
                      {announcement.provider}
                    </span>
                    <span className={`text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium ${
                      announcement.status === '모집중' ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}>
                      {announcement.status}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base text-zinc-900 dark:text-zinc-100 mb-3 sm:mb-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{announcement.title}</h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>마감: {announcement.deadline}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link to="/announcements">
              <Button variant="outline" className="w-full">
                전체 공고 보기
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {userProfile && (
        <section className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border-y border-zinc-200 dark:border-zinc-800 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-zinc-900 dark:text-zinc-100 mb-3 sm:mb-4">맞춤형 주택 정보를 받아보세요</h2>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mb-6 sm:mb-8">
                {userProfile.name}님의 조건에 맞는 공고를 AI가 자동으로 찾아드립니다
              </p>
              <Link to="/eligibility">
                <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  자격 진단 받기
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}