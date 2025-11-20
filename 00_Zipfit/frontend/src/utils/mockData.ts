import { UserProfile } from '../App';

export const mockHousingData = [
  {
    id: '1',
    title: '고양 삼송지구 청년 행복주택',
    provider: 'LH' as const,
    type: '청년 행복주택',
    location: '경기도 고양시 덕양구 삼송동',
    recruitmentPeriod: '2025.01.15 ~ 2025.01.25',
    moveInDate: '2025년 4월 예정',
    deposit: '1,000만원',
    monthlyRent: '20만원',
    housingCount: 320,
    eligibility: ['만 19~39세', '무주택자', '소득 120% 이하', '고양시 거주/재직자 우선'],
    url: 'https://apply.lh.or.kr',
  },
  {
    id: '2',
    title: '일산 식사지구 행복주택',
    provider: 'LH' as const,
    type: '청년 행복주택',
    location: '경기도 고양시 일산동구 식사동',
    recruitmentPeriod: '2025.01.20 ~ 2025.01.30',
    moveInDate: '2025년 5월 예정',
    deposit: '1,200만원',
    monthlyRent: '23만원',
    housingCount: 280,
    eligibility: ['만 19~39세', '무주택자', '소득 100% 이하'],
    url: 'https://apply.lh.or.kr',
  },
  {
    id: '3',
    title: '파주 운정3지구 청년 매입임대',
    provider: 'GH' as const,
    type: '청년 매입임대',
    location: '경기도 파주시 운정동',
    recruitmentPeriod: '2025.02.01 ~ 2025.02.10',
    moveInDate: '2025년 3월 예정',
    deposit: '800만원',
    monthlyRent: '18만원',
    housingCount: 150,
    eligibility: ['만 19~39세', '무주택자', '소득 70% 이하', '경기도 거주자'],
    url: 'https://www.gh.or.kr',
  },
  {
    id: '4',
    title: '궁동 그루안 전세임대',
    provider: 'LH' as const,
    type: '공공지원 전세임대',
    location: '경기도 고양시 일산동구 궁동',
    recruitmentPeriod: '2025.01.10 ~ 2025.01.20',
    moveInDate: '즉시 입주 가능',
    deposit: '전세금의 5%',
    monthlyRent: '월 이자 납부',
    housingCount: 80,
    eligibility: ['소득 70% 이하', '무주택자', '2년 최소 거주'],
    url: 'https://apply.lh.or.kr',
  },
  {
    id: '5',
    title: '서울 강남 신혼부부 행복주택',
    provider: 'SH' as const,
    type: '신혼부부 행복주택',
    location: '서울특별시 강남구',
    recruitmentPeriod: '2025.01.15 ~ 2025.01.30',
    moveInDate: '2025년 6월 예정',
    deposit: '1,500만원',
    monthlyRent: '30만원',
    housingCount: 200,
    eligibility: ['혼인 7년 이내', '무주택자', '소득 100% 이하'],
    url: 'https://www.i-sh.co.kr',
  },
  {
    id: '6',
    title: '성남 판교 청년 전세임대',
    provider: 'GH' as const,
    type: '청년 전세임대',
    location: '경기도 성남시 분당구',
    recruitmentPeriod: '2025.02.01 ~ 2025.02.15',
    moveInDate: '2025년 3월 예정',
    deposit: '전세금의 5%',
    monthlyRent: '월 이자',
    housingCount: 100,
    eligibility: ['만 19~39세', '무주택자', '소득 70% 이하'],
    url: 'https://www.gh.or.kr',
  },
];

export const mockLoanData = [
  {
    id: '1',
    name: '청년전용 버팀목 전세자금대출',
    provider: '주택도시기금',
    description: '만 19세~34세 청년을 위한 저금리 전세자금 대출',
    interestRate: '연 1.8%~2.4%',
    limit: '최대 1억원',
    eligibility: ['만 19~34세', '무주택자', '소득 5,000만원 이하'],
  },
  {
    id: '2',
    name: '신혼부부 전용 구입자금대출',
    provider: '주택도시기금',
    description: '신혼부부의 내 집 마련을 위한 주택 구입자금 지원',
    interestRate: '연 1.85%~2.70%',
    limit: '최대 3억원',
    eligibility: ['혼인 7년 이내', '부부합산 소득 7,000만원 이하', '생애최초 구입 우대'],
  },
  {
    id: '3',
    name: '주거안정 월세대출',
    provider: '주택도시기금',
    description: '월세 부담을 덜어주는 임차보증금 지원',
    interestRate: '연 1.5%',
    limit: '최대 3,500만원',
    eligibility: ['무주택자', '소득 5,000만원 이하', '월세 거주자'],
  },
];

export function getAIResponse(userInput: string, userProfile: UserProfile) {
  const input = userInput.toLowerCase();

  // 청년 주택 관련 질문
  if (input.includes('청년') && (input.includes('주택') || input.includes('공고'))) {
    const filteredHousing = mockHousingData.filter(
      (h) =>
        (h.type.includes('청년') || h.eligibility.some((e) => e.includes('19~39세'))) &&
        (input.includes('고양') || input.includes('일산')
          ? h.location.includes('고양') || h.location.includes('일산')
          : true)
    );

    return {
      content: `${userProfile.name}님의 조건에 맞는 청년 주택 공고를 찾았습니다!\n\n현재 ${userProfile.age}세, ${userProfile.residence} 거주 중이시니 아래 공고들이 적합할 것 같습니다. 특히 해당 지역 거주자는 우선 공급 대상이 됩니다.`,
      housingData: filteredHousing,
    };
  }

  // 전세 계약 관련 질문
  if (
    (input.includes('전세') || input.includes('궁동') || input.includes('그루안')) &&
    (input.includes('계약') || input.includes('패널티') || input.includes('나오면') || input.includes('해지'))
  ) {
    const housingData = mockHousingData.filter((h) => h.title.includes('궁동 그루안'));

    return {
      content: `궁동 그루안 전세임대 계약에 대해 안내드립니다.\n\n📋 **계약 기간 관련**\n• 공공지원 전세임대는 최소 2년 거주가 원칙입니다\n• 중도 해지시에는 위약금이 발생할 수 있습니다\n\n💰 **중도 해지 시 조건**\n1. **1년 미만 해지**: 보증금의 10% 위약금 + 지원받은 이자 전액 반환\n2. **1년~2년 해지**: 보증금의 5% 위약금 + 잔여기간 이자 반환\n3. **2년 이후**: 위약금 없이 자유롭게 계약 해지 가능\n\n⚠️ **주의사항**\n• 부득이한 사유(전근, 질병 등)가 있는 경우 위약금 감면 가능\n• 계약서에 명시된 정확한 조건을 반드시 확인하세요\n• LH 고객센터(1600-1004)를 통해 상담받으시는 것을 권장합니다`,
      housingData: housingData.length > 0 ? housingData : undefined,
    };
  }

  // 신혼부부 관련 질문
  if (input.includes('신혼') || (input.includes('결혼') && input.includes('공급'))) {
    const filteredHousing = mockHousingData.filter((h) => h.type.includes('신혼') || h.title.includes('신혼'));

    return {
      content: `신혼부부 특별공급에 대해 안내드립니다.\n\n✅ **기본 자격 요건**\n• 혼인 기간 7년 이내\n• 무주택 세대 구성원\n• 부부합산 소득 기준 충족\n\n📝 **우대 사항**\n• 자녀가 있는 경우 추가 가점\n• 해당 지역 거주자 우선 공급\n• 생애최초 구입자 가점\n\n현재 등록된 신혼부부 특별공급 공고가 없지만, 정기적으로 확인하시면 좋습니다.`,
      loanData: mockLoanData.filter((l) => l.name.includes('신혼')),
    };
  }

  // 대출 관련 질문
  if (input.includes('대출') || input.includes('금리') || input.includes('이자')) {
    return {
      content: `${userProfile.name}님께 적합한 주거지원 대출 상품을 안내드립니다.\n\n현재 ${userProfile.age}세이시고 연소득 ${userProfile.income.toLocaleString()}만원이시니, 아래 대출 상품을 신청하실 수 있습니다.\n\n💡 **Tip**: 청년 우대금리와 생애최초 구입자 우대금리를 중복 적용받을 수 있습니다!`,
      loanData: mockLoanData,
    };
  }

  // 자격 확인 관련 질문
  if (input.includes('자격') || input.includes('조건') || input.includes('신청')) {
    return {
      content: `${userProfile.name}님의 현재 조건을 확인해드립니다.\n\n👤 **기본 정보**\n• 나이: ${userProfile.age}세\n• 거주지: ${userProfile.residence} (${userProfile.residenceDuration}년 거주)\n• 가구형태: ${userProfile.maritalStatus === 'single' ? '1인 가구' : '가족 가구'}\n• 연소득: ${userProfile.income.toLocaleString()}만원\n\n✅ **신청 가능한 주택 유형**\n• 청년 주택 (만 19~39세 대상)\n• 행복주택\n• 매입임대주택\n${userProfile.maritalStatus === 'married' ? '• 신혼부부 특별공급\n' : ''}\n\n구체적으로 어떤 유형의 주택을 찾으시나요?`,
    };
  }

  // 기본 응답
  return {
    content: `궁금하신 내용을 더 자세히 말씀해주시면 정확한 정보를 안내해드리겠습니다.\n\n다음과 같은 질문을 해보세요:\n• "청년 주택 공고를 알려줘"\n• "신혼부부 특별공급 자격이 궁금해"\n• "전세 계약 중도 해지시 패널티는?"\n• "주거지원 대출 조건을 알려줘"\n• "내 자격으로 신청 가능한 주택은?"`,
  };
}