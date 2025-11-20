import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../App';
import { Button } from '../components/ui/button';
import { CheckCircle, XCircle, AlertCircle, Sparkles, MessageSquare } from 'lucide-react';
import { mockHousingData } from '../utils/mockData';

interface EligibilityCheckPageProps {
  userProfile: UserProfile | null;
}

export function EligibilityCheckPage({ userProfile }: EligibilityCheckPageProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 2000);
  };

  if (!userProfile) {
    return (
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-card rounded-xl shadow-sm border p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="mb-2">사용자 정보가 필요합니다</h2>
          <p className="text-muted-foreground mb-6">
            자격 진단을 위해서는 먼저 사용자 정보를 입력해주세요.
          </p>
        </div>
      </div>
    );
  }

  const eligibilityResults = [
    {
      announcement: mockHousingData[0],
      status: 'eligible' as const,
      score: 95,
      reasons: [
        '연령 조건 충족 (만 19~39세)',
        '거주지 조건 충족 (고양시 거주 2년)',
        '소득 조건 충족',
      ],
      tips: '우선 공급 대상에 해당합니다. 신청 추천!',
    },
    {
      announcement: mockHousingData[1],
      status: 'eligible' as const,
      score: 88,
      reasons: [
        '연령 조건 충족',
        '소득 조건 충족',
      ],
      warnings: ['거주 지역 우선 공급 해당 안됨'],
      tips: '일반 공급으로 신청 가능합니다.',
    },
    {
      announcement: mockHousingData[3],
      status: 'partial' as const,
      score: 65,
      reasons: [
        '소득 조건 충족',
      ],
      warnings: [
        '최소 거주 기간 2년 필수',
        '보증금 5% 초기 납부 필요',
      ],
      tips: '계약 조건을 신중히 검토하세요.',
    },
    {
      announcement: {
        ...mockHousingData[0],
        id: '999',
        title: '서울 강남 신혼부부 특별공급',
        type: '신혼부부 특별공급',
        eligibility: ['혼인 7년 이내', '무주택자'],
      },
      status: 'ineligible' as const,
      score: 30,
      reasons: [],
      warnings: [
        '혼인 상태가 미혼으로 신청 불가',
        '신혼부부 대상 주택입니다',
      ],
      tips: '현재 조건으로는 신청이 어렵습니다.',
    },
  ];

  return (
    <div className="min-h-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl mb-2">자격 진단</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            AI가 {userProfile.name}님의 조건을 분석하여 신청 가능한 주택을 찾아드립니다
          </p>
        </div>

        {/* User Profile Summary - Compact */}
        <div className="bg-card rounded-xl shadow-sm border p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg mb-3 sm:mb-4">내 정보</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">나이</p>
              <p className="text-sm sm:text-base">{userProfile.age}세</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">거주지</p>
              <p className="text-sm sm:text-base">{userProfile.residence}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">거주 기간</p>
              <p className="text-sm sm:text-base">{userProfile.residenceDuration}년</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">연소득</p>
              <p className="text-sm sm:text-base">{userProfile.income.toLocaleString()}만원</p>
            </div>
          </div>
        </div>

        {!analyzed ? (
          /* Analysis CTA - Compact for mobile */
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-xl shadow-sm border border-emerald-200 dark:border-emerald-900 p-6 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl text-gray-900 dark:text-zinc-100 mb-3 sm:mb-4">AI 자격 진단 시작</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400 mb-6 sm:mb-8 max-w-md mx-auto">
              현재 모집 중인 모든 공고를 분석하여<br />
              신청 가능 여부와 적합도를 판단합니다
            </p>
            <Button
              size="lg"
              onClick={handleAnalyze}
              disabled={analyzing}
              className="px-6 sm:px-8"
            >
              {analyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  분석 중...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  자격 진단 시작하기
                </>
              )}
            </Button>
          </div>
        ) : (
          /* Results */
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <h2 className="text-gray-900">진단 결과</h2>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">신청 가능</p>
                  <p className="text-2xl text-green-600">
                    {eligibilityResults.filter((r) => r.status === 'eligible').length}개
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">조건부 가능</p>
                  <p className="text-2xl text-yellow-600">
                    {eligibilityResults.filter((r) => r.status === 'partial').length}개
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">신청 불가</p>
                  <p className="text-2xl text-gray-600">
                    {eligibilityResults.filter((r) => r.status === 'ineligible').length}개
                  </p>
                </div>
              </div>
            </div>

            {/* Results List */}
            {eligibilityResults.map((result, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-xl shadow-sm border-2 p-6 ${
                  result.status === 'eligible'
                    ? 'border-green-200'
                    : result.status === 'partial'
                    ? 'border-yellow-200'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {result.status === 'eligible' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : result.status === 'partial' ? (
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          result.announcement.provider === 'LH'
                            ? 'bg-blue-100 text-blue-700'
                            : result.announcement.provider === 'SH'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {result.announcement.provider}
                      </span>
                    </div>
                    <h3 className="text-gray-900 mb-1">{result.announcement.title}</h3>
                    <p className="text-sm text-gray-500">{result.announcement.type}</p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-3xl mb-1 ${
                        result.status === 'eligible'
                          ? 'text-green-600'
                          : result.status === 'partial'
                          ? 'text-yellow-600'
                          : 'text-gray-400'
                      }`}
                    >
                      {result.score}
                    </div>
                    <p className="text-xs text-gray-500">적합도</p>
                  </div>
                </div>

                {result.reasons.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">✅ 충족 조건</p>
                    <div className="space-y-1">
                      {result.reasons.map((reason, ridx) => (
                        <div key={ridx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.warnings && result.warnings.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">⚠️ 주의 사항</p>
                    <div className="space-y-1">
                      {result.warnings.map((warning, widx) => (
                        <div key={widx} className="flex items-start gap-2 text-sm text-gray-700">
                          <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <span>{warning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-blue-50 rounded-lg mb-4">
                  <p className="text-sm text-blue-900">💡 {result.tips}</p>
                </div>

                <div className="flex gap-2">
                  {result.status !== 'ineligible' && (
                    <Link to={`/announcements/${result.announcement.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full">
                        공고 상세보기
                      </Button>
                    </Link>
                  )}
                  <Link to="/chat" className="flex-1">
                    <Button variant="secondary" className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      AI 상담
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}