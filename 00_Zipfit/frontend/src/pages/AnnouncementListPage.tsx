import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Building2,
  Heart,
  GitCompare,
} from 'lucide-react';
import { mockHousingData } from '../utils/mockData';

interface AnnouncementListPageProps {
  userProfile: UserProfile | null;
  favorites: string[];
  compareList: string[];
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
}

export function AnnouncementListPage({ 
  userProfile, 
  favorites, 
  compareList, 
  onToggleFavorite, 
  onToggleCompare 
}: AnnouncementListPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // 모든 공고는 mockHousingData에서 가져옴 (중복 제거)
  const announcements = mockHousingData;

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvider = selectedProvider === 'all' || announcement.provider === selectedProvider;
    const matchesType = selectedType === 'all' || announcement.type.includes(selectedType);
    
    return matchesSearch && matchesProvider && matchesType;
  });

  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl text-zinc-900 dark:text-zinc-100 mb-2">공고 목록</h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            총 <span className="text-emerald-600 dark:text-emerald-400">{filteredAnnouncements.length}</span>개의 공고가 있습니다
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Search */}
            <div className="sm:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="지역 또는 공고명 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 sm:pl-10 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Provider Filter */}
            <div>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="기관 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 기관</SelectItem>
                  <SelectItem value="LH">LH 한국토지주택공사</SelectItem>
                  <SelectItem value="SH">SH 서울주택도시공사</SelectItem>
                  <SelectItem value="GH">GH 경기주택도시공사</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="유형 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 유형</SelectItem>
                  <SelectItem value="청년">청년 주택</SelectItem>
                  <SelectItem value="신혼부부">신혼부부 주택</SelectItem>
                  <SelectItem value="전세">전세임대</SelectItem>
                  <SelectItem value="행복주택">행복주택</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Compare Bar */}
        {compareList.length > 0 && (
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <GitCompare className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">{compareList.length}개 선택됨</span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // 모든 항목 선택 해제
                  compareList.forEach(id => onToggleCompare(id));
                }}
                className="flex-1 sm:flex-none bg-white text-emerald-600 hover:bg-zinc-100"
              >
                선택 해제
              </Button>
              <Link to="/comparison" state={{ compareIds: compareList }} className="flex-1 sm:flex-none">
                <Button size="sm" className="w-full bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-800 dark:hover:bg-emerald-900">
                  비교하기
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Announcements Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
          {filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className={`bg-white dark:bg-zinc-900 rounded-xl shadow-sm border-2 transition-all ${
                compareList.includes(announcement.id)
                  ? 'border-emerald-400 dark:border-emerald-600 shadow-lg'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-700'
              }`}
            >
              <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-xs px-2 sm:px-3 py-1 rounded-full ${
                        announcement.provider === 'LH' ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400' :
                        announcement.provider === 'SH' ? 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400' :
                        'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400'
                      }`}>
                        {announcement.provider}
                      </span>
                      <span className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded">
                        {announcement.type}
                      </span>
                    </div>
                    <Link to={`/announcements/${announcement.id}`}>
                      <h3 className="text-sm sm:text-base text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate">
                        {announcement.title}
                      </h3>
                    </Link>
                  </div>
                  <div className="flex gap-1.5 sm:gap-2 ml-2">
                    <button
                      onClick={() => onToggleFavorite(announcement.id)}
                      className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                        favorites.includes(announcement.id)
                          ? 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400'
                          : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-red-600 dark:hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${favorites.includes(announcement.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => onToggleCompare(announcement.id)}
                      className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                        compareList.includes(announcement.id)
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400'
                          : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      <GitCompare className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    {announcement.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    모집: {announcement.recruitmentPeriod}
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    <DollarSign className="w-4 h-4 text-zinc-400" />
                    보증금 {announcement.deposit} / 월세 {announcement.monthlyRent}
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    <Users className="w-4 h-4 text-zinc-400" />
                    공급 {announcement.housingCount}호
                  </div>
                </div>

                {/* Eligibility */}
                <div className="mb-4">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">신청 자격</p>
                  <div className="flex flex-wrap gap-2">
                    {announcement.eligibility.map((item, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link to={`/announcements/${announcement.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      상세 보기
                    </Button>
                  </Link>
                  <Button
                    onClick={() => window.open(announcement.url, '_blank')}
                    className="flex-1"
                  >
                    공식 사이트
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 dark:text-zinc-400">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}