# Score Models
# ScoreResult, ComboState 등
# 참조: docs/02_Score_System_Detail.md

from pydantic import BaseModel, Field
from typing import Literal


class ScoreSnapshot(BaseModel):
    """
    턴별 점수 스냅샷
    참조: 02_Score_System_Detail.md Section 4 (점수 계산 공식)
    """
    turn_index: int = Field(..., ge=1, le=3, description="턴 번호 (1, 2, 3)")

    # 점수 구성 요소 (100점 만점)
    emotional_sense: float = Field(
        default=0.0,
        ge=0.0,
        le=100.0,
        description="감정센스 점수 (0~100)"
    )
    observation: float = Field(
        default=0.0,
        ge=0.0,
        le=100.0,
        description="관찰력 점수 (0~100)"
    )
    reflex: float = Field(
        default=0.0,
        ge=0.0,
        le=100.0,
        description="순발력 점수 (0~100)"
    )

    # 가중치 적용
    emotion_multiplier: float = Field(
        default=1.0,
        ge=0.8,
        le=1.2,
        description="감정 계수 (EEVE 분석 결과)"
    )

    combo_bonus: float = Field(
        default=0.0,
        ge=0.0,
        le=6.0,
        description="콤보 보너스 점수 (최대 +6점)"
    )

    turn_score: float = Field(
        default=0.0,
        ge=0.0,
        le=120.0,
        description="턴 최종 점수"
    )

    def calculate_turn_score(
        self,
        emotion_weight: float = 0.6,
        observation_weight: float = 0.25,
        reflex_weight: float = 0.15
    ) -> float:
        """
        턴 점수 계산
        TurnScore = (감정센스 × 0.6 + 관찰력 × 0.25 + 순발력 × 0.15) × EmotionMultiplier + ComboBonus
        """
        base_score = (
            self.emotional_sense * emotion_weight +
            self.observation * observation_weight +
            self.reflex * reflex_weight
        )
        self.turn_score = (base_score * self.emotion_multiplier) + self.combo_bonus
        return self.turn_score


class ComboState(BaseModel):
    """
    콤보 상태 관리
    참조: 02_Score_System_Detail.md Section 5 (콤보 시스템)
    """
    current_combo: int = Field(
        default=0,
        ge=0,
        le=3,
        description="현재 콤보 수 (최대 3콤보)"
    )
    max_combo: int = Field(
        default=0,
        ge=0,
        le=3,
        description="최대 콤보 수"
    )
    last_answer_correct: bool = Field(
        default=False,
        description="마지막 답변 정답 여부"
    )

    def update_combo(self, is_correct: bool) -> int:
        """
        콤보 업데이트
        - 정답: 콤보 +1 (최대 3)
        - 오답: 콤보 리셋
        """
        if is_correct:
            self.current_combo = min(self.current_combo + 1, 3)
            self.max_combo = max(self.max_combo, self.current_combo)
        else:
            self.current_combo = 0

        self.last_answer_correct = is_correct
        return self.current_combo

    def get_combo_bonus(self) -> float:
        """
        콤보 보너스 점수 반환
        1콤보: +2점, 2콤보: +4점, 3콤보: +6점
        """
        bonus_mapping = {
            0: 0.0,
            1: 2.0,
            2: 4.0,
            3: 6.0
        }
        return bonus_mapping.get(self.current_combo, 0.0)


class FinalScore(BaseModel):
    """
    최종 점수 및 엔딩 분기
    참조: 02_Score_System_Detail.md Section 7 (점수 시뮬레이션)
    """
    total_score: float = Field(
        default=0.0,
        ge=0.0,
        le=120.0,
        description="최종 점수 (100점 + 보너스)"
    )

    # 턴별 점수
    turn_scores: list[ScoreSnapshot] = Field(
        default_factory=list,
        description="턴별 점수 스냅샷 리스트"
    )

    # 엔딩 타입
    ending_type: Literal["love", "cute_upset", "breakup"] = Field(
        default="breakup",
        description="엔딩 타입 (80~100: love, 50~79: cute_upset, 0~49: breakup)"
    )

    ending_message: str = Field(
        default="",
        description="엔딩 메시지"
    )

    def determine_ending(self) -> tuple[str, str]:
        """
        점수에 따른 엔딩 결정
        참조: 01_Game_Structure.md Section 6 (엔딩 분기)
        """
        if self.total_score >= 80:
            self.ending_type = "love"
            self.ending_message = "오빠 너무 멋져... 사랑해♡"
        elif self.total_score >= 50:
            self.ending_type = "cute_upset"
            self.ending_message = "흠... 그래도 오늘은 봐줄게~"
        else:
            self.ending_type = "breakup"
            self.ending_message = "오빠... 우리 이제 그만하자..."

        return self.ending_type, self.ending_message

    def calculate_final_score(self) -> float:
        """
        최종 점수 계산 (모든 턴 점수 합산)
        """
        self.total_score = sum(turn.turn_score for turn in self.turn_scores)
        return self.total_score

