import { Building2, MapPin, Calendar, DollarSign, Users, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';

interface Housing {
  id: string;
  title: string;
  provider: 'LH' | 'SH' | 'GH';
  type: string;
  location: string;
  recruitmentPeriod: string;
  moveInDate: string;
  deposit: string;
  monthlyRent: string;
  housingCount: number;
  eligibility: string[];
  url: string;
}

interface HousingCardProps {
  housing: Housing;
}

export function HousingCard({ housing }: HousingCardProps) {
  const providerColors = {
    LH: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900',
    SH: 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900',
    GH: 'bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900',
  };

  const providerBadgeColors = {
    LH: 'bg-blue-500 dark:bg-blue-600',
    SH: 'bg-green-500 dark:bg-green-600',
    GH: 'bg-purple-500 dark:bg-purple-600',
  };

  return (
    <div className={`rounded-xl p-4 border-2 ${providerColors[housing.provider]}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-1 ${providerBadgeColors[housing.provider]} text-white rounded`}>
              {housing.provider}
            </span>
            <span className="text-xs px-2 py-1 bg-white/50 dark:bg-zinc-900/50 rounded">
              {housing.type}
            </span>
          </div>
          <h4 className="text-zinc-900 dark:text-zinc-100 mb-1 text-sm">{housing.title}</h4>
        </div>
        <Building2 className="w-5 h-5 text-zinc-400 flex-shrink-0" />
      </div>

      {/* Details */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2 text-xs">
          <MapPin className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          <span className="text-zinc-700 dark:text-zinc-300">{housing.location}</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          <span className="text-zinc-700 dark:text-zinc-300">모집: {housing.recruitmentPeriod}</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          <span className="text-zinc-700 dark:text-zinc-300">입주: {housing.moveInDate}</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <DollarSign className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          <span className="text-zinc-700 dark:text-zinc-300">
            보증금 {housing.deposit} / 월세 {housing.monthlyRent}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Users className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          <span className="text-zinc-700 dark:text-zinc-300">공급 {housing.housingCount}호</span>
        </div>
      </div>

      {/* Eligibility */}
      <div className="mb-3">
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1.5">신청 자격</p>
        <div className="flex flex-wrap gap-1.5">
          {housing.eligibility.map((item, index) => (
            <span
              key={index}
              className="text-xs px-2 py-0.5 bg-white/70 dark:bg-zinc-900/50 text-zinc-700 dark:text-zinc-300 rounded"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Action */}
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => window.open(housing.url, '_blank')}
      >
        공고 자세히 보기
        <ExternalLink className="w-3.5 h-3.5 ml-2" />
      </Button>
    </div>
  );
}
