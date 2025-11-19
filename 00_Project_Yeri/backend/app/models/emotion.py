# Emotion Models
# EmotionState, EmotionScore 등
# 참조: docs/03_Character_Design.md, docs/04_LLM_Prompt_Design.md

from pydantic import BaseModel, Field
from typing import Literal


class EmotionScore(BaseModel):
    """
    감정 평가 점수 (EEVE LLM 분석 결과)
    참조: 04_LLM_Prompt_Design.md Section 2.1
    """
    emotion_depth: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="감정 표현의 강도 (0.0 ~ 1.0)"
    )
    empathy_score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="예리의 감정에 대한 이해도 (0.0 ~ 1.0)"
    )
    sense_score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="대사나 표현의 센스/매력도 (0.0 ~ 1.0)"
    )
    overall_stage: Literal["S0", "S1", "S2", "S3", "S4"] = Field(
        ...,
        description="전체 감정 단계 (S0: 기본, S1: 장난, S2: 짜증, S3: 실망, S4: 감동)"
    )


class EmotionStage(BaseModel):
    """
    예리의 감정 단계 정의
    참조: 03_Character_Design.md Section 2 (Emotion Stage Design)
    """
    stage: Literal["S0", "S1", "S2", "S3", "S4"] = Field(
        default="S0",
        description="현재 감정 단계"
    )
    emotion_name: str = Field(
        default="Neutral",
        description="감정 상태 이름 (Neutral, Playful, Curious, Upset, Affectionate)"
    )
    description: str = Field(
        default="기본 표정, 밝은 톤",
        description="감정 단계 설명"
    )
    expression_file: str = Field(
        default="YERI_S0_default.png",
        description="표정 이미지 파일명"
    )
    emotion_multiplier: float = Field(
        default=1.0,
        ge=0.8,
        le=1.2,
        description="감정 계수 (점수 계산에 사용)"
    )

    @staticmethod
    def get_stage_info(stage: str) -> dict:
        """감정 단계별 정보 반환"""
        stage_mapping = {
            "S0": {
                "emotion_name": "Neutral",
                "description": "기본 표정, 밝은 톤",
                "expression_file": "YERI_S0_default.png",
                "emotion_multiplier": 1.0
            },
            "S1": {
                "emotion_name": "Playful",
                "description": "장난스러움, 미소",
                "expression_file": "YERI_S1_smile.png",
                "emotion_multiplier": 1.0
            },
            "S2": {
                "emotion_name": "Curious",
                "description": "약간 짜증, 눈살 찌푸림",
                "expression_file": "YERI_S2_curiosity.png",
                "emotion_multiplier": 0.95
            },
            "S3": {
                "emotion_name": "Upset",
                "description": "울상, 낮은 톤",
                "expression_file": "YERI_S3_sad.png",
                "emotion_multiplier": 0.85
            },
            "S4": {
                "emotion_name": "Affectionate",
                "description": "눈웃음, 부드러운 미소",
                "expression_file": "YERI_S4_love.png",
                "emotion_multiplier": 1.2
            }
        }
        return stage_mapping.get(stage, stage_mapping["S0"])


class EmotionTransition(BaseModel):
    """
    감정 전환 로직
    참조: 03_Character_Design.md Section 5 (Expression Trigger Map)
    """
    from_stage: Literal["S0", "S1", "S2", "S3", "S4"]
    to_stage: Literal["S0", "S1", "S2", "S3", "S4"]
    trigger: str = Field(..., description="전환 트리거 (예: 콤보 발생, 시간 초과)")
    condition: str = Field(..., description="전환 조건 (예: EEVE 공감도 >= 0.8)")


class YeriDialogue(BaseModel):
    """
    예리의 대사 데이터
    참조: 03_Character_Design.md Section 6 (음성 톤 및 대사 캐싱 구조)
    """
    emotion_stage: Literal["S0", "S1", "S2", "S3", "S4"]
    text: str = Field(..., description="대사 텍스트")
    tone: str = Field(..., description="음성 톤 (밝고 자연스러움, 장난스러움 등)")
    cache_file: str | None = Field(None, description="캐시 파일명 (예: S0_neutral.mp3)")
    is_cached: bool = Field(default=False, description="캐시 여부")
    weight: float = Field(default=0.5, ge=0.0, le=1.0, description="선택 가중치")

