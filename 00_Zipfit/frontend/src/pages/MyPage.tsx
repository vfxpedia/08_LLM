import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../App';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  User, 
  Heart, 
  MessageSquare, 
  Bell,
  Edit2,
  Calendar,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { mockHousingData } from '../utils/mockData';

interface MyPageProps {
  userProfile: UserProfile | null;
  favorites: string[];
  onEditProfile: () => void;
}

export function MyPage({ userProfile, favorites, onEditProfile }: MyPageProps) {
  if (!userProfile) {
    return (
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-card rounded-xl shadow-sm border p-8 text-center max-w-md">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-gray-900 mb-2">로그인이 필요합니다</h2>
          <p className="text-gray-600">
            사용자 정보를 입력해주세요.
          </p>
        </div>
      </div>
    );
  }

  const favoriteAnnouncements = mockHousingData.filter((a) => favorites.includes(a.id));

  const chatHistory = [
    {
      id: '1',
      title: '고양시 청년 주택 공고 문의',
      date: '2025.01.13',
      preview: '고양시 청년 주택 공고를 알려줘',
    },
    {
      id: '2',
      title: '궁동 그루안 전세 계약 관련',
      date: '2025.01.12',
      preview: '궁동 그루안 전세 중도 해지 패널티는?',
    },
    {
      id: '3',
      title: '신혼부부 특별공급 자격',
      date: '2025.01.10',
      preview: '신혼부부 특별공급 자격 조건은?',
    },
  ];

  const activityStats = [
    { label: '관심 공고', value: favorites.length, icon: Heart, color: 'text-red-600' },
    { label: '상담 횟수', value: chatHistory.length, icon: MessageSquare, color: 'text-blue-600' },
    { label: '알림 설정', value: '활성', icon: Bell, color: 'text-green-600' },
  ];

  return (
    <div className="min-h-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Profile Header - More Compact */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-xl sm:text-2xl text-white">{userProfile.name[0]}</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl text-gray-900 dark:text-zinc-100 mb-0.5 sm:mb-1">{userProfile.name}님</h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400">{userProfile.age}세</p>
              </div>
            </div>
            <Button onClick={onEditProfile} variant="secondary" size="sm" className="w-full sm:w-auto">
              <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
              프로필 수정
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 dark:text-zinc-500" />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400">거주지</span>
              </div>
              <p className="text-sm sm:text-base text-gray-900 dark:text-zinc-100">{userProfile.residence}</p>
              <p className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5 sm:mt-1">{userProfile.residenceDuration}년 거주</p>
            </div>
            <div className="p-3 sm:p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 dark:text-zinc-500" />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400">가구 형태</span>
              </div>
              <p className="text-sm sm:text-base text-gray-900 dark:text-zinc-100">
                {userProfile.maritalStatus === 'single' ? '1인 가구' : '가족 가구'}
              </p>
              {userProfile.hasChildren && (
                <p className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5 sm:mt-1">자녀 {userProfile.numberOfChildren}명</p>
              )}
            </div>
            <div className="p-3 sm:p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 dark:text-zinc-500" />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400">연소득</span>
              </div>
              <p className="text-sm sm:text-base text-gray-900 dark:text-zinc-100">{userProfile.income.toLocaleString()}만원</p>
            </div>
          </div>
        </div>

        {/* Activity Stats - Always 3 columns */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          {activityStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-3 sm:p-6">
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                </div>
                <p className="text-lg sm:text-2xl text-gray-900 dark:text-zinc-100 mb-0.5 sm:mb-1">{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="favorites" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="favorites" className="text-xs sm:text-sm">관심 공고</TabsTrigger>
            <TabsTrigger value="history" className="text-xs sm:text-sm">상담 내역</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">설정</TabsTrigger>
          </TabsList>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            {favoriteAnnouncements.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {favoriteAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`text-xs px-2 sm:px-3 py-1 rounded-full ${
                            announcement.provider === 'LH' ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400' :
                            announcement.provider === 'SH' ? 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400' :
                            'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400'
                          }`}>
                            {announcement.provider}
                          </span>
                          <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 rounded-full">
                            모집중
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base text-gray-900 dark:text-zinc-100 mb-1">{announcement.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400">{announcement.location}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 dark:text-red-400 fill-current" />
                      </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link to={`/announcements/${announcement.id}`} className="flex-1">
                        <Button variant="secondary" size="sm" className="w-full">
                          상세보기
                        </Button>
                      </Link>
                      <Link to="/chat" className="flex-1">
                        <Button size="sm" className="w-full">
                          AI 상담
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-8 sm:p-12 text-center">
                <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 dark:text-zinc-700 mx-auto mb-4" />
                <p className="text-sm sm:text-base text-gray-500 dark:text-zinc-400 mb-4">아직 관심 공고가 없습니다</p>
                <Link to="/announcements">
                  <Button>
                    공고 둘러보기
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <div className="space-y-3 sm:space-y-4">
              {chatHistory.map((chat) => (
                <Link key={chat.id} to="/chat">
                  <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-4 sm:p-6 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 dark:bg-blue-950/50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base text-gray-900 dark:text-zinc-100 mb-1">{chat.title}</h3>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">{chat.preview}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-zinc-400 ml-11 sm:ml-0">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>{chat.date}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-4 sm:p-6">
                <h3 className="text-sm sm:text-base text-gray-900 dark:text-zinc-100 mb-3 sm:mb-4">계정 설정</h3>
                <div className="space-y-2 sm:space-y-3">
                  <Button variant="secondary" size="sm" className="w-full justify-start text-sm" onClick={onEditProfile}>
                    <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                    프로필 정보 수정
                  </Button>
                  <Link to="/notifications" className="block">
                    <Button variant="secondary" size="sm" className="w-full justify-start text-sm">
                      <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                      알림 설정
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-4 sm:p-6">
                <h3 className="text-sm sm:text-base text-gray-900 dark:text-zinc-100 mb-3 sm:mb-4">데이터 관리</h3>
                <div className="space-y-2 sm:space-y-3">
                  <Button variant="secondary" size="sm" className="w-full justify-start text-sm">
                    상담 내역 다운로드
                  </Button>
                  <Button variant="secondary" size="sm" className="w-full justify-start text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                    상담 내역 삭제
                  </Button>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-red-200 dark:border-red-900 p-4 sm:p-6">
                <h3 className="text-sm sm:text-base text-red-600 dark:text-red-400 mb-3 sm:mb-4">계정</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border-red-200 dark:border-red-900"
                  onClick={() => {
                    if (confirm('정말 로그아웃 하시겠습니까?')) {
                      localStorage.removeItem('userProfile');
                      window.location.reload();
                    }
                  }}
                >
                  로그아웃
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}