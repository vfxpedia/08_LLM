/**
 * gameData.ts
 * 게임 데이터 (이미지 쌍 + 정답 세트)
 * 참조: docs/12_Game_Core_Design_Final.md Section 4
 *
 * 난이도별 변화 개수:
 * - Easy: 2개
 * - Medium: 3개
 * - Hard: 5개
 */

import type { GameData } from "@/types";

/**
 * 게임 데이터 세트 (총 10개)
 *
 * 각 게임은 Before/After 이미지 쌍과 정답 세트를 포함합니다.
 * 정답은 키워드 기반 + 감정 표현 키워드로 구성되며,
 * VectorDB 유사도 70% 이상이면 정답으로 판정합니다.
 *
 * **중요**: 모든 정답을 맞춰야 턴 조기 종료 (100% 정답 정책)
 */
export const GAME_DATA_SETS: GameData[] = [
  // Easy 난이도 (2개 변화)
  {
    id: "game_01_earring",
    beforeImage: "/images/game01_before.png",
    afterImage: "/images/game01_after.png",
    difficulty: "easy",
    totalChanges: 2,
    changeDescription: "귀걸이 착용 + 립스틱 색상 변경",
    correctAnswers: {
      keywords: [
        "귀걸이", "귀", "액세서리", "하트", "착용", "립스틱", "입술", "색", "핑크", "레드"
      ],
      emotionalKeywords: [
        "예쁘다", "귀엽다", "잘 어울리다", "화사하다", "섹시하다", "매력적이다"
      ],
      threshold: 0.7,
    },
  },
  {
    id: "game_02_hair_length",
    beforeImage: "/images/game02_before.png",
    afterImage: "/images/game02_after.png",
    difficulty: "easy",
    totalChanges: 2,
    changeDescription: "머리 길이 변경 + 헤어밴드 착용",
    correctAnswers: {
      keywords: [
        "머리", "길이", "길다", "짧다", "헤어밴드", "머리띠", "액세서리"
      ],
      emotionalKeywords: [
        "예쁘다", "잘 어울리다", "귀엽다", "여성스럽다", "우아하다"
      ],
      threshold: 0.7,
    },
  },

  // Medium 난이도 (3개 변화)
  {
    id: "game_03_makeup_set",
    beforeImage: "/images/game03_before.png",
    afterImage: "/images/game03_after.png",
    difficulty: "medium",
    totalChanges: 3,
    changeDescription: "립스틱 색상 + 아이라인 + 블러셔",
    correctAnswers: {
      keywords: [
        "립스틱", "색", "아이라인", "눈", "블러셔", "볼터치", "화장", "메이크업"
      ],
      emotionalKeywords: [
        "예쁘다", "화사하다", "섹시하다", "매력적이다", "잘 어울리다"
      ],
      threshold: 0.7,
    },
  },
  {
    id: "game_04_accessory_set",
    beforeImage: "/images/game04_before.png",
    afterImage: "/images/game04_after.png",
    difficulty: "medium",
    totalChanges: 3,
    changeDescription: "귀걸이 + 목걸이 + 가방",
    correctAnswers: {
      keywords: [
        "귀걸이", "목걸이", "가방", "액세서리", "장신구", "핸드백"
      ],
      emotionalKeywords: [
        "예쁘다", "잘 어울리다", "화려하다", "센스있다", "멋지다"
      ],
      threshold: 0.7,
    },
  },
  {
    id: "game_05_hair_style",
    beforeImage: "/images/test01_before.png",
    afterImage: "/images/test01_after.png",
    difficulty: "medium",
    totalChanges: 3,
    changeDescription: "가르마 방향 + 머리 길이 + 헤어 컬",
    correctAnswers: {
      keywords: [
        "가르마", "머리", "방향", "길이", "컬", "웨이브", "헤어스타일"
      ],
      emotionalKeywords: [
        "예쁘다", "잘 어울리다", "여성스럽다", "신선하다", "멋지다"
      ],
      threshold: 0.7,
    },
  },

  // Hard 난이도 (5개 변화)
  {
    id: "game_06_total_makeover",
    beforeImage: "/images/game06_before.png",
    afterImage: "/images/game06_after.png",
    difficulty: "hard",
    totalChanges: 5,
    changeDescription: "립스틱 + 아이라인 + 블러셔 + 귀걸이 + 목걸이",
    correctAnswers: {
      keywords: [
        "립스틱", "아이라인", "블러셔", "귀걸이", "목걸이", "화장", "액세서리"
      ],
      emotionalKeywords: [
        "완벽하다", "예쁘다", "화사하다", "섹시하다", "매력적이다", "잘 어울리다"
      ],
      threshold: 0.7,
    },
  },
  {
    id: "game_07_subtle_details",
    beforeImage: "/images/game07_before.png",
    afterImage: "/images/game07_after.png",
    difficulty: "hard",
    totalChanges: 5,
    changeDescription: "가르마 2cm + 눈썹 굵기 + 렌즈 색상 + 립 글로스 + 귀걸이 디자인",
    correctAnswers: {
      keywords: [
        "가르마", "눈썹", "렌즈", "눈", "립글로스", "입술", "귀걸이", "미묘", "디테일"
      ],
      emotionalKeywords: [
        "섬세하다", "센스있다", "예쁘다", "잘 어울리다", "눈썰미", "관찰력"
      ],
      threshold: 0.7,
    },
  },
  {
    id: "game_08_tone_change",
    beforeImage: "/images/game08_before.png",
    afterImage: "/images/game08_after.png",
    difficulty: "hard",
    totalChanges: 5,
    changeDescription: "메이크업 톤 + 피부 마무리 + 쇄골 하이라이트 + 헤어 컬러 + 가방",
    correctAnswers: {
      keywords: [
        "톤", "쿨톤", "웜톤", "피부", "마무리", "하이라이트", "쇄골", "헤어", "컬러", "가방"
      ],
      emotionalKeywords: [
        "분위기", "달라지다", "예쁘다", "잘 어울리다", "세련되다", "우아하다"
      ],
      threshold: 0.7,
    },
  },
  {
    id: "game_09_professional",
    beforeImage: "/images/game09_before.png",
    afterImage: "/images/game09_after.png",
    difficulty: "hard",
    totalChanges: 5,
    changeDescription: "아이섀도우 + 아이라인 각도 + 코 하이라이트 + 립 라인 + 치크 위치",
    correctAnswers: {
      keywords: [
        "아이섀도우", "아이라인", "각도", "코", "하이라이트", "립라인", "입술", "치크", "볼터치", "위치"
      ],
      emotionalKeywords: [
        "프로다", "완벽하다", "예쁘다", "세련되다", "전문가", "섬세하다"
      ],
      threshold: 0.7,
    },
  },
  {
    id: "game_10_master",
    beforeImage: "/images/game10_before.png",
    afterImage: "/images/game10_after.png",
    difficulty: "hard",
    totalChanges: 5,
    changeDescription: "눈동자 방향 + 미간 간격 + 콧방울 크기 + 인중 길이 + 턱선 각도",
    correctAnswers: {
      keywords: [
        "눈동자", "방향", "미간", "간격", "콧방울", "크기", "인중", "길이", "턱선", "각도", "윤곽"
      ],
      emotionalKeywords: [
        "신", "천재", "완벽", "대단하다", "놀랍다", "관찰력", "눈썰미"
      ],
      threshold: 0.7,
    },
  },
];

/**
 * 게임 데이터 랜덤 선택
 */
export function getRandomGameData(): GameData {
  const randomIndex = Math.floor(Math.random() * GAME_DATA_SETS.length);
  return GAME_DATA_SETS[randomIndex];
}

/**
 * 난이도별 게임 데이터 필터링
 */
export function getGameDataByDifficulty(difficulty: "easy" | "medium" | "hard"): GameData[] {
  return GAME_DATA_SETS.filter((game) => game.difficulty === difficulty);
}

/**
 * ID로 게임 데이터 찾기
 */
export function getGameDataById(id: string): GameData | undefined {
  return GAME_DATA_SETS.find((game) => game.id === id);
}
