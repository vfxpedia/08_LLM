import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  CreditCard, 
  Calculator, 
  TrendingDown, 
  CheckCircle,
  ExternalLink,
  DollarSign,
  Percent,
  Calendar,
} from 'lucide-react';
import { mockLoanData } from '../utils/mockData';

interface LoanInfoPageProps {
  userProfile: UserProfile | null;
}

export function LoanInfoPage({ userProfile }: LoanInfoPageProps) {
  const [loanAmount, setLoanAmount] = useState<number>(50000000);
  const [interestRate, setInterestRate] = useState<number>(2.0);
  const [loanPeriod, setLoanPeriod] = useState<number>(10);

  const calculateMonthlyPayment = () => {
    const monthlyRate = interestRate / 100 / 12;
    const months = loanPeriod * 12;
    const payment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                    (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(payment);
  };

  const calculateTotalPayment = () => {
    return calculateMonthlyPayment() * loanPeriod * 12;
  };

  const calculateTotalInterest = () => {
    return calculateTotalPayment() - loanAmount;
  };

  const allLoans = [
    ...mockLoanData,
    {
      id: '4',
      name: '생애최초 구입자금 대출',
      provider: '주택도시기금',
      description: '생애 최초로 주택을 구입하는 무주택자를 위한 특별 지원',
      interestRate: '연 1.65%~2.40%',
      limit: '최대 3억원',
      eligibility: ['생애최초 주택 구입', '부부합산 소득 6,000만원 이하', '무주택자'],
    },
    {
      id: '5',
      name: '중소기업 취업청년 전월세보증금 대출',
      provider: '주택도시기금',
      description: '중소기업에 재직 중인 청년의 전월세 보증금 지원',
      interestRate: '연 1.2%',
      limit: '최대 1억원',
      eligibility: ['만 19~34세', '중소·중견기업 재직자', '무주택자'],
    },
  ];

  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2">대출 정보</h1>
          <p className="text-muted-foreground">
            주거지원 대출 상품을 비교하고 예상 상환액을 계산해보세요
          </p>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="products">대출 상품</TabsTrigger>
            <TabsTrigger value="calculator">상환 계산기</TabsTrigger>
          </TabsList>

          {/* Loan Products Tab */}
          <TabsContent value="products" className="space-y-6">
            {/* User Recommendation */}
            {userProfile && (
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-xl shadow-sm border border-emerald-200 dark:border-emerald-900 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-600 rounded-full flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-zinc-900 dark:text-zinc-100">{userProfile.name}님께 추천하는 대출</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">나이와 소득 조건을 고려한 맞춤 상품</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    청년 우대금리 적용 가능
                  </span>
                  <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">
                    소득 기준 충족
                  </span>
                </div>
              </div>
            )}

            {/* Loan Cards */}
            <div className="grid lg:grid-cols-2 gap-6">
              {allLoans.map((loan) => (
                <div key={loan.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <span className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                        {loan.provider}
                      </span>
                      <h3 className="text-gray-900 mt-2 mb-2">{loan.name}</h3>
                      <p className="text-sm text-gray-600">{loan.description}</p>
                    </div>
                    <CreditCard className="w-8 h-8 text-blue-600" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Percent className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">금리</span>
                      </div>
                      <p className="text-gray-900">{loan.interestRate}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">한도</span>
                      </div>
                      <p className="text-gray-900">{loan.limit}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">신청 자격</p>
                    <div className="space-y-1">
                      {loan.eligibility.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="secondary" className="flex-1">
                      <Calculator className="w-4 h-4 mr-2" />
                      계산하기
                    </Button>
                    <Button className="flex-1">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      신청하기
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl p-6">
              <h3 className="text-zinc-900 dark:text-zinc-100 mb-2">💡 대출 신청 전 확인사항</h3>
              <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                <li>• 대출 금리는 신용도와 소득 수준에 따라 차등 적용됩니다</li>
                <li>• 청년, 신혼부부, 생애최초 구입자는 우대금리가 적용될 수 있습니다</li>
                <li>• 대출 한도는 주택 가격과 소득 조건에 따라 달라집니다</li>
                <li>• 정확한 금리와 한도는 금융기관에 문의하시기 바랍니다</li>
              </ul>
            </div>
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-600 rounded-full flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-zinc-900 dark:text-zinc-100">상환 계산기</h2>
                </div>

                <div className="space-y-8">
                  {/* Loan Amount */}
                  <div>
                    <Label htmlFor="loanAmount" className="flex items-center justify-between mb-2">
                      <span>대출 금액</span>
                      <span className="text-blue-600">{loanAmount.toLocaleString()}원</span>
                    </Label>
                    <Input
                      id="loanAmount"
                      type="range"
                      min="10000000"
                      max="300000000"
                      step="1000000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1천만원</span>
                      <span>3억원</span>
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div>
                    <Label htmlFor="interestRate" className="flex items-center justify-between mb-2">
                      <span>연 이자율</span>
                      <span className="text-blue-600">{interestRate.toFixed(2)}%</span>
                    </Label>
                    <Input
                      id="interestRate"
                      type="range"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1.0%</span>
                      <span>5.0%</span>
                    </div>
                  </div>

                  {/* Loan Period */}
                  <div>
                    <Label htmlFor="loanPeriod" className="flex items-center justify-between mb-2">
                      <span>대출 기간</span>
                      <span className="text-blue-600">{loanPeriod}년</span>
                    </Label>
                    <Input
                      id="loanPeriod"
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={loanPeriod}
                      onChange={(e) => setLoanPeriod(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>5년</span>
                      <span>30년</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Result Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-gray-900 mb-6">계산 결과</h2>

                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-blue-900">월 상환액</span>
                    </div>
                    <p className="text-3xl text-blue-900">
                      {calculateMonthlyPayment().toLocaleString()}
                      <span className="text-xl ml-1">원</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">총 상환액</p>
                      <p className="text-xl text-gray-900">
                        {calculateTotalPayment().toLocaleString()}원
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">총 이자</p>
                      <p className="text-xl text-gray-900">
                        {calculateTotalInterest().toLocaleString()}원
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="text-sm text-gray-900 mb-3">상환 요약</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">대출 원금</span>
                        <span className="text-gray-900">{loanAmount.toLocaleString()}원</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">상환 기간</span>
                        <span className="text-gray-900">{loanPeriod}년 ({loanPeriod * 12}개월)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">이자율</span>
                        <span className="text-gray-900">연 {interestRate.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-900">
                      💡 실제 금리와 상환액은 금융기관과 개인 신용도에 따라 달라질 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
              <h3 className="text-gray-900 mb-2">대출 상담이 필요하신가요?</h3>
              <p className="text-gray-600 mb-4">AI 상담으로 나에게 맞는 대출 상품을 추천받아보세요</p>
              <Link to="/chat">
                <Button>
                  <CreditCard className="w-4 h-4 mr-2" />
                  AI 상담하기
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}