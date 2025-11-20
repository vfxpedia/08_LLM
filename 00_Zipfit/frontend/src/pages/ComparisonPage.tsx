import { useLocation, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft, Check, X } from 'lucide-react';
import { mockHousingData } from '../utils/mockData';

interface ComparisonPageProps {
  compareList?: string[];
}

export function ComparisonPage({ compareList: propCompareList }: ComparisonPageProps) {
  const location = useLocation();
  const compareIds = (location.state as any)?.compareIds || propCompareList || ['1', '2', '3'];
  
  const announcements = mockHousingData.filter((a) => compareIds.includes(a.id));

  // Don't pad - use actual number of announcements
  const actualCount = announcements.length;

  const comparisonItems = [
    { label: '기관', key: 'provider' },
    { label: '유형', key: 'type' },
    { label: '위치', key: 'location' },
    { label: '모집 기간', key: 'recruitmentPeriod' },
    { label: '입주 예정', key: 'moveInDate' },
    { label: '보증금', key: 'deposit' },
    { label: '월 임대료', key: 'monthlyRent' },
    { label: '공급 호수', key: 'housingCount' },
  ];

  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link to="/announcements">
            <Button variant="ghost" className="mb-3 sm:mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl lg:text-3xl mb-2">공고 비교</h1>
          <p className="text-sm sm:text-base text-muted-foreground">최대 3개의 공고를 비교할 수 있습니다</p>
        </div>

        {/* Mobile: Card Layout */}
        <div className="block lg:hidden space-y-6">
          {announcements.map((announcement, idx) => (
            <div key={idx} className="bg-card rounded-xl shadow-sm border p-4 sm:p-6 space-y-4">
              {/* Header */}
              <div>
                <span className={`inline-block text-xs px-2.5 py-1 rounded-full mb-2 ${
                  announcement.provider === 'LH' ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400' :
                  announcement.provider === 'SH' ? 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400' :
                  'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400'
                }`}>
                  {announcement.provider}
                </span>
                <h3 className="text-sm sm:text-base font-medium">{announcement.title}</h3>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {comparisonItems.map((item, itemIdx) => (
                  <div key={itemIdx} className="space-y-1">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-medium">
                      {item.key === 'housingCount'
                        ? `${announcement[item.key]}호`
                        : announcement[item.key as keyof typeof announcement]}
                    </p>
                  </div>
                ))}
              </div>

              {/* Eligibility */}
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-3">신청 자격</p>
                <div className="space-y-2">
                  {announcement.eligibility.map((item, eidx) => (
                    <div key={eidx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <Link to={`/announcements/${announcement.id}`}>
                <Button variant="outline" size="sm" className="w-full">
                  상세보기
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Desktop: Table Layout */}
        <div className="hidden lg:block bg-card rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left bg-muted text-sm" style={{ width: '160px', minWidth: '160px' }}>항목</th>
                  {announcements.map((announcement, idx) => (
                    <th key={idx} className="p-4" style={{ width: `${Math.floor(100 / actualCount)}%` }}>
                      {announcement ? (
                        <div>
                          <span className={`inline-block text-xs px-3 py-1 rounded-full mb-2 ${
                            announcement.provider === 'LH' ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400' :
                            announcement.provider === 'SH' ? 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400' :
                            'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400'
                          }`}>
                            {announcement.provider}
                          </span>
                          <p className="text-sm">{announcement.title}</p>
                        </div>
                      ) : (
                        <div className="text-muted-foreground text-sm">비교 항목 없음</div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonItems.map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-4 text-sm text-muted-foreground bg-muted">{item.label}</td>
                    {announcements.map((announcement, aidx) => (
                      <td key={aidx} className="p-4 text-center">
                        {announcement ? (
                          <span className="text-sm">
                            {item.key === 'housingCount'
                              ? `${announcement[item.key]}호`
                              : announcement[item.key as keyof typeof announcement]}
                          </span>
                        ) : (
                          <span className="text-muted-foreground/30">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Eligibility */}
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-4 text-sm text-muted-foreground bg-muted align-top">신청 자격</td>
                  {announcements.map((announcement, idx) => (
                    <td key={idx} className="p-4">
                      {announcement ? (
                        <div className="space-y-2">
                          {announcement.eligibility.map((item, eidx) => (
                            <div key={eidx} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/30">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions - Desktop Only */}
        <div className="hidden lg:grid mt-8 sm:grid-cols-3 gap-4">
          {announcements.map((announcement, idx) => (
            <div key={idx}>
              {announcement && (
                <Link to={`/announcements/${announcement.id}`}>
                  <Button variant="outline" className="w-full">
                    {announcement.title} 상세보기
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}