import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  FileText,
  ExternalLink,
  Download,
  MessageSquare,
  Heart,
  Share2,
  GitCompare,
} from 'lucide-react';
import { mockHousingData } from '../utils/mockData';

interface AnnouncementDetailPageProps {
  favorites: string[];
  compareList: string[];
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
}

export function AnnouncementDetailPage({ 
  favorites, 
  compareList, 
  onToggleFavorite, 
  onToggleCompare 
}: AnnouncementDetailPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();

  // In real app, fetch announcement by id
  const announcement = mockHousingData.find((a) => a.id === id) || mockHousingData[0];
  
  const isFavorite = favorites.includes(announcement.id);
  const isInCompareList = compareList.includes(announcement.id);

  // TODO: 미래 구현 - 실제 PDF 다운로드 기능
  // 실제 공고 사이트에서 크롤링한 PDF를 Supabase Storage에 저장 후
  // 다운로드 가능하도록 구현 예정
  const handleDownload = (docName: string) => {
    console.log('TODO: 실제 DB에서 문서 다운로드:', docName);
    // 미래: const url = await supabase.storage.from('announcements').download(`${announcement.id}/${docName}.pdf`);
  };

  const documents = [
    { name: '입주자 모집공고문', size: '2.4 MB', pages: 15 },
    { name: '청약 신청서', size: '1.2 MB', pages: 5 },
    { name: '임대차 계약서 (샘플)', size: '800 KB', pages: 8 },
    { name: '소득증빙 서류 안내', size: '600 KB', pages: 3 },
  ];

  const timeline = [
    { date: '2025.01.15', event: '모집공고 게시', status: 'completed' },
    { date: '2025.01.15 ~ 01.25', event: '청약 접수 기간', status: 'active' },
    { date: '2025.01.28', event: '당첨자 발표', status: 'upcoming' },
    { date: '2025.02.05', event: '계약 체결', status: 'upcoming' },
    { date: '2025.04.01', event: '입주 시작', status: 'upcoming' },
  ];

  const faqs = [
    {
      q: '중복 신청이 가능한가요?',
      a: '동일한 주택에 대해서는 중복 신청이 불가능하지만, 서로 다른 지역이나 유형의 주택에는 중복 신청이 가능합니다.',
    },
    {
      q: '최소 거주 기간이 있나요?',
      a: '청년 행복주택의 경우 최소 2년 거주가 원칙이며, 중도 퇴거시 위약금이 발생할 수 있습니다.',
    },
    {
      q: '보증금은 언제 납부하나요?',
      a: '계약 체결일로부터 7일 이내에 보증금을 납부하셔야 하며, 분할 납부는 불가능합니다.',
    },
  ];

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-3 sm:mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로
          </Button>

          <div className="flex items-start justify-between gap-4 mb-3 sm:mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <span className={`text-xs px-2.5 sm:px-3 py-1 rounded-full ${
                  announcement.provider === 'LH' ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400' :
                  announcement.provider === 'SH' ? 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400' :
                  'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400'
                }`}>
                  {announcement.provider}
                </span>
                <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 rounded-full">
                  모집중
                </span>
              </div>
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-gray-900 dark:text-zinc-100 mb-1 sm:mb-2">{announcement.title}</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400">{announcement.type}</p>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => onToggleFavorite(announcement.id)}
                className={isFavorite ? 'bg-red-500 dark:bg-red-500' : ''}
              >
                <Heart className="w-4 h-4" />
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => onToggleCompare(announcement.id)}
                className={isInCompareList ? 'bg-blue-500 dark:bg-blue-500' : ''}
              >
                <GitCompare className="w-4 h-4" />
              </Button>
              <Button variant="secondary" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-zinc-400">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {announcement.location}
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-zinc-400">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              모집: {announcement.recruitmentPeriod}
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-zinc-400">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              공급 {announcement.housingCount}호
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="overview" className="text-[10px] sm:text-xs md:text-sm px-1 sm:px-3 py-2">개요</TabsTrigger>
            <TabsTrigger value="eligibility" className="text-[10px] sm:text-xs md:text-sm px-1 sm:px-3 py-2">자격</TabsTrigger>
            <TabsTrigger value="documents" className="text-[10px] sm:text-xs md:text-sm px-1 sm:px-3 py-2">서류</TabsTrigger>
            <TabsTrigger value="faq" className="text-[10px] sm:text-xs md:text-sm px-1 sm:px-3 py-2">FAQ</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Key Info */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg lg:text-xl text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">주요 정보</h2>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-300" />
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">보증금</span>
                  </div>
                  <p className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">{announcement.deposit}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-300" />
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">월 임대료</span>
                  </div>
                  <p className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">{announcement.monthlyRent}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-300" />
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">입주 예정</span>
                  </div>
                  <p className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">{announcement.moveInDate}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-300" />
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">공급 호수</span>
                  </div>
                  <p className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">{announcement.housingCount}호</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg lg:text-xl text-gray-900 dark:text-zinc-100 mb-3 sm:mb-4">일정</h2>
              <div className="space-y-3 sm:space-y-4">
                {timeline.map((item, idx) => (
                  <div key={idx} className="flex gap-3 sm:gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
                        item.status === 'completed' ? 'bg-emerald-500' :
                        item.status === 'active' ? 'bg-green-600' :
                        'bg-zinc-300 dark:bg-zinc-600'
                      }`} />
                      {idx < timeline.length - 1 && (
                        <div className={`w-0.5 h-10 sm:h-12 ${
                          item.status === 'completed' ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'
                        }`} />
                      )}
                    </div>
                    <div className="flex-1 pb-6 sm:pb-8">
                      <p className={`text-xs sm:text-sm ${
                        item.status === 'active' ? 'text-green-600 dark:text-green-500' : 'text-zinc-500 dark:text-zinc-400'
                      }`}>
                        {item.date}
                      </p>
                      <p className={`text-sm sm:text-base ${
                        item.status === 'active' ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400'
                      }`}>
                        {item.event}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Chat CTA */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-xl p-4 sm:p-6 border border-emerald-200 dark:border-emerald-900">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base text-zinc-900 dark:text-zinc-100 mb-1">이 공고에 대해 궁금한 점이 있으신가요?</h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">AI 상담으로 쉽게 이해해보세요</p>
                </div>
                <Link to="/chat">
                  <Button size="sm" className="w-full sm:w-auto">
                    AI 상담하기
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          {/* Eligibility Tab */}
          <TabsContent value="eligibility">
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg lg:text-xl text-gray-900 dark:text-zinc-100 mb-3 sm:mb-4">신청 자격 요건</h2>
              <div className="space-y-3 sm:space-y-4">
                {announcement.eligibility.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center text-xs sm:text-sm flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm sm:text-base text-zinc-900 dark:text-zinc-100">{item}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
                <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-400">
                  ⚠️ 모든 자격 요건을 충족해야 신청 가능합니다. 정확한 자격 요건은 공고문을 확인해주세요.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg lg:text-xl text-gray-900 dark:text-zinc-100 mb-3 sm:mb-4">제출 서류</h2>
              <div className="space-y-2.5 sm:space-y-3">
                {documents.map((doc, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm sm:text-base text-zinc-900 dark:text-zinc-100">{doc.name}</p>
                        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">{doc.size} · {doc.pages}페이지</p>
                      </div>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full sm:w-auto"
                      onClick={() => handleDownload(doc.name)}
                    >
                      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                      다운로드
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg lg:text-xl text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">자주 묻는 질문</h2>
              <div className="space-y-3 sm:space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="p-3 sm:p-4 border border-gray-200 dark:border-zinc-700 rounded-lg">
                    <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100 mb-2">Q. {faq.q}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">A. {faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            onClick={() => window.open(announcement.url, '_blank')}
            className="flex-1"
            size="lg"
          >
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            공식 사이트에서 신청하기
          </Button>
          <Link to="/chat" className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              AI 상담하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}