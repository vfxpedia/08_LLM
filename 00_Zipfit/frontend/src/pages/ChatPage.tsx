import { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Send, Bot, User, Sparkles, FileText, ExternalLink } from 'lucide-react';
import { HousingCard } from '../components/HousingCard';
import { getAIResponse, mockHousingData, mockLoanData } from '../utils/mockData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  housingData?: typeof mockHousingData;
  loanData?: typeof mockLoanData;
  sources?: DocumentSource[];
  timestamp: Date;
}

interface DocumentSource {
  documentName: string;
  pageNumber: number;
  excerpt: string;
  relevanceScore: number;
}

interface ChatPageProps {
  userProfile: UserProfile | null;
}

export function ChatPage({ userProfile }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: userProfile
        ? `안녕하세요 ${userProfile.name}님! 👋\n\n저는 LH, SH, GH 공공주택 전문 AI 어시스턴트입니다.\n\n**저의 강점:**\n• 실제 공고 PDF 문서를 분석하여 정확한 정보 제공\n• 복잡한 공고 내용을 쉽게 설명\n• 맞춤형 자격 요건 확인\n• 대출 및 지원 제도 안내\n\n공고에 대해 궁금하신 점을 편하게 물어보세요!`
        : '안녕하세요! 먼저 사용자 정보를 입력해주세요.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !userProfile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate RAG response with document sources
    setTimeout(() => {
      const response = getAIResponse(input, userProfile);
      
      // Add mock document sources for demonstration
      const sources: DocumentSource[] = [];
      if (response.housingData && response.housingData.length > 0) {
        sources.push({
          documentName: `${response.housingData[0].provider}_${response.housingData[0].title}_공고문.pdf`,
          pageNumber: 3,
          excerpt: '신청자격: 만 19세 이상 39세 이하 무주택 청년으로서...',
          relevanceScore: 0.95,
        });
        sources.push({
          documentName: `${response.housingData[0].provider}_입주자모집공고.pdf`,
          pageNumber: 7,
          excerpt: '보증금 및 임대료: 보증금 1,000만원, 월 임대료 20만원...',
          relevanceScore: 0.87,
        });
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        housingData: response.housingData,
        loanData: response.loanData,
        sources: sources.length > 0 ? sources : undefined,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestionQuestions = [
    '고양시 청년 주택 공고를 알려줘',
    '궁동 그루안 전세 중도 해지 패널티는?',
    '신혼부부 특별공급 자격 조건은?',
    '청년 전용 대출 상품을 추천해줘',
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 1 && userProfile && (
          <div className="max-w-4xl mx-auto mb-4">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-900">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-zinc-900 dark:text-zinc-100">추천 질문</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {suggestionQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    className="text-left p-3 rounded-lg bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900 hover:border-emerald-400 dark:hover:border-emerald-700 hover:shadow-md transition-all"
                  >
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">{question}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            } max-w-4xl mx-auto w-full`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={`flex flex-col gap-2 max-w-[85%] ${
                message.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-2.5 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
                    : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
              </div>

              {/* Document Sources */}
              {message.sources && message.sources.length > 0 && (
                <div className="w-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-blue-900 dark:text-blue-300">참고 문서</span>
                  </div>
                  <div className="space-y-2">
                    {message.sources.map((source, idx) => (
                      <div key={idx} className="bg-white dark:bg-zinc-900 rounded-lg p-2.5 border border-blue-100 dark:border-blue-900">
                        <div className="flex items-start justify-between mb-1.5">
                          <div className="flex-1">
                            <p className="text-xs text-zinc-900 dark:text-zinc-100">{source.documentName}</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">페이지 {source.pageNumber}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 rounded">
                              {Math.round(source.relevanceScore * 100)}%
                            </div>
                            <button className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                              <ExternalLink className="w-3 h-3 text-zinc-400" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">"{source.excerpt}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Housing cards */}
              {message.housingData && message.housingData.length > 0 && (
                <div className="space-y-2 w-full">
                  {message.housingData.map((housing) => (
                    <HousingCard key={housing.id} housing={housing} />
                  ))}
                </div>
              )}

              {/* Loan information */}
              {message.loanData && message.loanData.length > 0 && (
                <div className="space-y-2 w-full">
                  {message.loanData.map((loan) => (
                    <div
                      key={loan.id}
                      className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-xl p-3 border border-purple-200 dark:border-purple-900"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm text-zinc-900 dark:text-zinc-100">{loan.name}</h4>
                        <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 rounded-full">
                          {loan.provider}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">{loan.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-zinc-500 dark:text-zinc-400">금리</p>
                          <p className="text-zinc-900 dark:text-zinc-100">{loan.interestRate}</p>
                        </div>
                        <div>
                          <p className="text-zinc-500 dark:text-zinc-400">한도</p>
                          <p className="text-zinc-900 dark:text-zinc-100">{loan.limit}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                {message.timestamp.toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 max-w-4xl mx-auto w-full">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl px-4 py-2.5 shadow-sm border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-emerald-600 dark:bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-emerald-600 dark:bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-emerald-600 dark:bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">문서 검색 중...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                userProfile
                  ? '공고에 대해 궁금한 점을 물어보세요...'
                  : '먼저 사용자 정보를 입력해주세요'
              }
              disabled={!userProfile || isTyping}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || !userProfile || isTyping}
              className="px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 text-center">
            <FileText className="w-3 h-3 inline mr-1" />
            AI가 실제 공고 문서를 분석하여 답변합니다. 정확한 정보는 공식 사이트를 확인해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}