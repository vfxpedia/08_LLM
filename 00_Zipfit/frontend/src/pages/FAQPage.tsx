import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Search,
  ChevronDown,
  MessageSquare,
  FileText,
  CreditCard,
  Home,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { id: 'general', label: '일반', icon: HelpCircle, color: 'text-blue-600 dark:text-blue-400' },
    { id: 'application', label: '신청', icon: FileText, color: 'text-green-600 dark:text-green-400' },
    { id: 'housing', label: '주택', icon: Home, color: 'text-purple-600 dark:text-purple-400' },
    { id: 'loan', label: '대출', icon: CreditCard, color: 'text-orange-600 dark:text-orange-400' },
  ];

  const faqs = [
    {
      id: '1',
      category: 'general',
      question: '공공주택 AI 어시스턴트는 무엇인가요?',
      answer: 'LH, SH, GH의 실제 공고 문서를 AI가 분석하여, 복잡한 공고 내용을 쉽게 이해하고 맞춤형 정보를 제공하는 서비스입니다. RAG(Retrieval-Augmented Generation) 기술을 활용하여 정확한 답변을 제공합니다.',
    },
    {
      id: '2',
      category: 'general',
      question: 'AI 상담은 어떻게 작동하나요?',
      answer: 'AI는 실제 공고 PDF 문서를 분석하고 VectorDB에 저장된 정보를 검색하여 답변합니다. 각 답변에는 참고한 문서 출처가 표시되므로, 정확한 정보를 확인할 수 있습니다.',
    },
    {
      id: '3',
      category: 'general',
      question: '서비스는 무료인가요?',
      answer: '네, 현재 모든 서비스는 무료로 제공됩니다. 공고 검색, AI 상담, 자격 진단 등 모든 기능을 제한 없이 이용하실 수 있습니다.',
    },
    {
      id: '4',
      category: 'application',
      question: '여러 공고에 중복 신청이 가능한가요?',
      answer: '동일한 주택에 대해서는 중복 신청이 불가능합니다. 하지만 서로 다른 지역이나 유형의 주택에는 중복 신청이 가능합니다. 구체적인 내용은 각 공고의 모집공고문을 확인하시거나 AI 상담을 이용해주세요.',
    },
    {
      id: '5',
      category: 'application',
      question: '신청 자격은 어떻게 확인하나요?',
      answer: '마이페이지에서 사용자 정보를 입력한 후, "자격 진단" 메뉴를 이용하시면 AI가 자동으로 신청 가능한 주택을 분석해드립니다. 나이, 거주지, 소득 등을 기준으로 맞춤형 결과를 제공합니다.',
    },
    {
      id: '6',
      category: 'application',
      question: '필요한 서류는 무엇인가요?',
      answer: '공고별로 필요한 서류가 다릅니다. 일반적으로 주민등록등본, 가족관계증명서, 소득증빙 서류 등이 필요합니다. 공고 상세 페이지의 "서류" 탭에서 확인하실 수 있습니다.',
    },
    {
      id: '7',
      category: 'housing',
      question: '청년 주택과 행복주택의 차이는?',
      answer: '청년 주택은 만 19~39세 청년을 대상으로 하며, 행복주택은 청년, 신혼부부, 고령자 등 다양한 계층을 대상으로 합니다. 청년 주택이 더 저렴하고 입지가 좋은 경우가 많습니다.',
    },
    {
      id: '8',
      category: 'housing',
      question: '최소 거주 기간이 있나요?',
      answer: '대부분의 공공임대주택은 최소 2년 거주가 원칙입니다. 중도 퇴거 시 위약금이 발생할 수 있으며, 구체적인 조건은 계약서를 확인해야 합니다.',
    },
    {
      id: '9',
      category: 'housing',
      question: '전세 계약 중도 해지 시 패널티는?',
      answer: '일반적으로 1년 미만 해지 시 보증금의 10% 위약금, 1~2년 해지 시 5% 위약금이 발생합니다. 부득이한 사유(전근, 질병 등)가 있는 경우 감면 가능합니다. 정확한 내용은 계약서를 확인하세요.',
    },
    {
      id: '10',
      category: 'housing',
      question: 'LH, SH, GH의 차이는?',
      answer: 'LH는 전국 단위 한국토지주택공사, SH는 서울주택도시공사, GH는 경기주택도시공사입니다. 각 기관이 담당하는 지역의 공공주택을 관리합니다.',
    },
    {
      id: '11',
      category: 'loan',
      question: '청년 전용 대출 상품은 무엇이 있나요?',
      answer: '청년전용 버팀목 전세자금대출(연 1.8~2.4%), 중소기업 취업청년 전월세보증금 대출(연 1.2%) 등이 있습니다. "대출 정보" 메뉴에서 자세한 내용을 확인하실 수 있습니다.',
    },
    {
      id: '12',
      category: 'loan',
      question: '대출 한도는 어떻게 결정되나요?',
      answer: '주택 가격, 개인 소득, 신용도 등을 종합적으로 고려하여 결정됩니다. 일반적으로 소득이 높고 신용도가 좋을수록 한도가 높아집니다. 정확한 한도는 금융기관에 문의하세요.',
    },
    {
      id: '13',
      category: 'loan',
      question: '우대금리는 어떻게 받나요?',
      answer: '청년(만 19~34세), 신혼부부(혼인 7년 이내), 생애최초 구입자 등의 조건을 충족하면 우대금리를 받을 수 있습니다. 여러 조건을 충족하면 중복 적용도 가능합니다.',
    },
  ];

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-full bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl text-zinc-900 dark:text-zinc-100 mb-2">자주 묻는 질문</h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            궁금한 내용을 검색하거나 AI 상담을 이용해보세요
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 sm:mb-8">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 dark:text-zinc-500" />
            <Input
              type="text"
              placeholder="궁금한 내용을 검색하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 sm:pl-12 h-12 sm:h-14 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* AI Chat CTA */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-xl p-4 sm:p-6 border border-emerald-200 dark:border-emerald-900 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm sm:text-base text-zinc-900 dark:text-zinc-100 mb-0.5 sm:mb-1">찾는 답변이 없으신가요?</h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">AI 상담으로 바로 답변을 받아보세요</p>
            </div>
            <Link to="/chat">
              <Button size="sm" className="w-full sm:w-auto">
                AI 상담하기
              </Button>
            </Link>
          </div>
        </div>

        {/* Categories - Always 4 columns on mobile */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            const count = faqs.filter((faq) => faq.category === category.id).length;
            return (
              <button
                key={category.id}
                onClick={() => {
                  const element = document.getElementById(`category-${category.id}`);
                  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-3 sm:p-4 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors text-center"
              >
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${category.color} mx-auto mb-1.5 sm:mb-2`} />
                <p className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 mb-0.5 sm:mb-1">{category.label}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{count}개</p>
              </button>
            );
          })}
        </div>

        {/* FAQs by Category */}
        {categories.map((category) => {
          const categoryFaqs = filteredFaqs.filter((faq) => faq.category === category.id);
          
          if (categoryFaqs.length === 0) return null;

          const Icon = category.icon;

          return (
            <div key={category.id} id={`category-${category.id}`} className="mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${category.color}`} />
                <h2 className="text-base sm:text-lg lg:text-xl text-zinc-900 dark:text-zinc-100">{category.label}</h2>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {categoryFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleExpand(faq.id)}
                      className="w-full flex items-start justify-between p-4 sm:p-6 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <div className="flex-1 pr-3 sm:pr-4">
                        <p className="text-sm sm:text-base text-zinc-900 dark:text-zinc-100">{faq.question}</p>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 dark:text-zinc-500 flex-shrink-0 transition-transform ${
                          expandedId === faq.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedId === faq.id && (
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                        <div className="p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-900">
                          <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">{faq.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mb-4">검색 결과가 없습니다</p>
            <Link to="/chat">
              <Button>
                <MessageSquare className="w-4 h-4 mr-2" />
                AI 상담하기
              </Button>
            </Link>
          </div>
        )}

        {/* Contact */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 mt-6 sm:mt-8">
          <h3 className="text-sm sm:text-base text-zinc-900 dark:text-zinc-100 mb-3 sm:mb-4">추가 문의</h3>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div>
              <p className="text-zinc-500 dark:text-zinc-400 mb-1">LH 고객센터</p>
              <p className="text-zinc-900 dark:text-zinc-100">1600-1004</p>
            </div>
            <div>
              <p className="text-zinc-500 dark:text-zinc-400 mb-1">SH 고객센터</p>
              <p className="text-zinc-900 dark:text-zinc-100">1600-3456</p>
            </div>
            <div>
              <p className="text-zinc-500 dark:text-zinc-400 mb-1">GH 고객센터</p>
              <p className="text-zinc-900 dark:text-zinc-100">1600-3002</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}