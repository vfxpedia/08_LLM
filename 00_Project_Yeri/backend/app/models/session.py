# Session Models
# SessionState, SessionConfig 등
# 참조: docs/06_Technical_Implementation.md Section 5

from pydantic import BaseModel, Field
from typing import Literal, Optional
from datetime import datetime
import uuid

from app.models.emotion import EmotionScore
from app.models.score import ScoreSnapshot, ComboState


class TurnState(BaseModel):
    """
    턴 상태 관리
    참조: 06_Technical_Implementation.md Section 5.1
    """
    turn_index: int = Field(..., ge=1, le=3, description="턴 번호 (1, 2, 3)")
    time_limit_sec: int = Field(..., description="제한 시간 (3, 10, 30초)")
    remaining_sec: int = Field(..., description="남은 시간")
    start_time: datetime = Field(default_factory=datetime.now, description="턴 시작 시간")

    answers: list[str] = Field(default_factory=list, description="플레이어 답변 텍스트 리스트")
    emotion_scores: list[EmotionScore] = Field(
        default_factory=list,
        description="EEVE 감정 평가 결과 리스트"
    )

    combo_state: ComboState = Field(
        default_factory=ComboState,
        description="콤보 상태"
    )

    is_finished: bool = Field(default=False, description="턴 종료 여부")

    @staticmethod
    def get_time_limit(turn_index: int) -> int:
        """턴별 제한 시간 반환"""
        time_limits = {1: 3, 2: 10, 3: 30}
        return time_limits.get(turn_index, 30)


class ImagePair(BaseModel):
    """
    예리 Before/After 이미지 세트
    """
    pair_id: str = Field(default_factory=lambda: str(uuid.uuid4()), description="이미지 세트 ID")
    before_url: str = Field(..., description="Before 이미지 URL")
    after_url: str = Field(..., description="After 이미지 URL")
    differences: list[str] = Field(
        default_factory=list,
        description="변화 포인트 리스트 (예: 헤어스타일, 립스틱, 귀걸이)"
    )
    difficulty: Literal["easy", "medium", "hard"] = Field(
        default="medium",
        description="난이도"
    )


class SessionState(BaseModel):
    """
    게임 세션 상태
    참조: 06_Technical_Implementation.md Section 5.1
    """
    session_id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        description="세션 고유 ID"
    )
    player_id: Optional[str] = Field(None, description="플레이어 ID (선택)")

    current_turn: int = Field(default=1, ge=1, le=3, description="현재 턴 (1~3)")
    turns: list[TurnState] = Field(default_factory=list, description="턴 상태 리스트")

    emotion_stage: Literal["S0", "S1", "S2", "S3", "S4"] = Field(
        default="S0",
        description="예리의 현재 감정 단계"
    )

    final_score: Optional[float] = Field(None, description="최종 점수")

    status: Literal["playing", "finished", "timeout", "error"] = Field(
        default="playing",
        description="세션 상태"
    )

    image_pair: ImagePair = Field(..., description="사용 중인 이미지 세트")

    created_at: datetime = Field(default_factory=datetime.now, description="세션 생성 시간")
    updated_at: datetime = Field(default_factory=datetime.now, description="마지막 업데이트 시간")

    def initialize_turns(self):
        """3턴 초기화"""
        self.turns = [
            TurnState(
                turn_index=i,
                time_limit_sec=TurnState.get_time_limit(i),
                remaining_sec=TurnState.get_time_limit(i)
            )
            for i in range(1, 4)
        ]

    def get_current_turn_state(self) -> Optional[TurnState]:
        """현재 턴 상태 반환"""
        if 1 <= self.current_turn <= 3:
            return self.turns[self.current_turn - 1]
        return None

    def advance_turn(self) -> bool:
        """다음 턴으로 진행"""
        if self.current_turn < 3:
            current_turn_state = self.get_current_turn_state()
            if current_turn_state:
                current_turn_state.is_finished = True
            self.current_turn += 1
            return True
        return False

    def finish_session(self):
        """세션 종료"""
        self.status = "finished"
        current_turn_state = self.get_current_turn_state()
        if current_turn_state:
            current_turn_state.is_finished = True


class SessionStartRequest(BaseModel):
    """세션 시작 요청"""
    player_id: Optional[str] = Field(None, description="플레이어 ID (선택)")
    difficulty: Literal["easy", "medium", "hard"] = Field(
        default="medium",
        description="난이도 선택"
    )


class SessionStartResponse(BaseModel):
    """세션 시작 응답"""
    session_id: str
    image_pair: ImagePair
    current_turn: int
    emotion_stage: Literal["S0", "S1", "S2", "S3", "S4"]
    time_limit_sec: int
    yeri_opening_text: str = Field(
        default="오빠~~ 나 뭐 달라진 거 없어?",
        description="예리 오프닝 대사"
    )
    yeri_opening_voice_url: Optional[str] = Field(
        None,
        description="예리 오프닝 음성 URL"
    )


class PlayerAnswerRequest(BaseModel):
    """플레이어 답변 요청"""
    session_id: str
    turn_index: int = Field(..., ge=1, le=3)
    input_type: Literal["text", "audio"] = Field(default="text", description="입력 유형")
    content: str = Field(..., description="텍스트 또는 오디오 base64")


class PlayerAnswerResponse(BaseModel):
    """플레이어 답변 응답"""
    yeri_text: str = Field(..., description="예리 응답 텍스트")
    yeri_voice_url: Optional[str] = Field(None, description="예리 응답 음성 URL")
    emotion_stage: Literal["S0", "S1", "S2", "S3", "S4"]
    updated_scores: dict = Field(default_factory=dict, description="업데이트된 점수 정보")
    remaining_sec: int = Field(..., description="남은 시간")
    combo_count: int = Field(default=0, description="현재 콤보")
    is_turn_finished: bool = Field(default=False, description="턴 종료 여부")


class SessionFinishResponse(BaseModel):
    """세션 종료 응답"""
    session_id: str
    final_score: float
    ending_type: Literal["love", "cute_upset", "breakup"]
    yeri_ending_text: str
    yeri_ending_voice_url: Optional[str] = None
    can_retry: bool = True
    score_breakdown: dict = Field(default_factory=dict, description="점수 상세")

