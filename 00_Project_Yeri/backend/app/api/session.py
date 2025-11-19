# Session API Endpoints
# /session/start, /session/answer 등 게임 세션 관련 API
# 참조: docs/06_Technical_Implementation.md Section 6

from fastapi import APIRouter, HTTPException, status
from typing import Dict
from datetime import datetime

from app.models.session import (
    SessionState,
    SessionStartRequest,
    SessionStartResponse,
    PlayerAnswerRequest,
    PlayerAnswerResponse,
    SessionFinishResponse,
    ImagePair,
    TurnState
)
from app.core.logger import logger
from app.core.config import settings

router = APIRouter()

# 메모리 기반 세션 저장소 (MVP용, 추후 Redis/DB로 교체)
sessions_store: Dict[str, SessionState] = {}


def get_sample_image_pair(difficulty: str = "medium") -> ImagePair:
    """
    샘플 이미지 페어 반환 (MVP용)
    추후 실제 이미지 관리 시스템으로 교체
    """
    return ImagePair(
        before_url=f"{settings.IMAGE_CDN_URL}/yeri/set01_before.png",
        after_url=f"{settings.IMAGE_CDN_URL}/yeri/set01_after.png",
        differences=["헤어스타일", "립스틱 색상", "귀걸이", "네일아트", "목걸이"],
        difficulty=difficulty
    )


@router.post("/start", response_model=SessionStartResponse)
async def start_session(request: SessionStartRequest):
    """
    게임 세션 시작
    참조: 06_Technical_Implementation.md Section 6.1

    - 새 세션 생성
    - 이미지 페어 할당
    - 초기 EmotionStage (S0) 설정
    - 첫 번째 턴 시작
    """
    try:
        # 이미지 페어 선택
        image_pair = get_sample_image_pair(request.difficulty)

        # 세션 생성
        session = SessionState(
            player_id=request.player_id,
            image_pair=image_pair,
            emotion_stage="S0"
        )

        # 턴 초기화
        session.initialize_turns()

        # 세션 저장
        sessions_store[session.session_id] = session

        logger.info(
            f"Session started - ID: {session.session_id}, "
            f"Player: {request.player_id or 'Anonymous'}, "
            f"Difficulty: {request.difficulty}"
        )

        # 응답 생성
        return SessionStartResponse(
            session_id=session.session_id,
            image_pair=image_pair,
            current_turn=session.current_turn,
            emotion_stage=session.emotion_stage,
            time_limit_sec=TurnState.get_time_limit(session.current_turn),
            yeri_opening_text="오빠~~ 나 뭐 달라진 거 없어?",
            yeri_opening_voice_url=None  # MVP에서는 TTS 생략
        )

    except Exception as e:
        logger.error(f"Failed to start session: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"세션 생성 실패: {str(e)}"
        )


@router.post("/answer", response_model=PlayerAnswerResponse)
async def submit_answer(request: PlayerAnswerRequest):
    """
    플레이어 답변 제출
    참조: 06_Technical_Implementation.md Section 6.1

    동작 순서:
    1. 세션 조회
    2. input_type이 audio면 STT 변환 (MVP에서는 생략)
    3. EEVE로 감정 평가 (MVP에서는 Mock)
    4. 점수 계산
    5. EmotionStage 업데이트
    6. 예리 응답 생성 (MVP에서는 템플릿)
    7. TTS 변환 (MVP에서는 생략)
    """
    try:
        # 세션 조회
        session = sessions_store.get(request.session_id)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="세션을 찾을 수 없습니다."
            )

        if session.status != "playing":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이미 종료된 세션입니다."
            )

        # 현재 턴 상태 가져오기
        turn_state = session.get_current_turn_state()
        if not turn_state:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="유효하지 않은 턴입니다."
            )

        # 플레이어 답변 저장
        player_text = request.content
        if request.input_type == "audio":
            # MVP: STT 생략, 추후 구현
            logger.warning("Audio input not implemented in MVP")
            player_text = "[음성 입력]"

        turn_state.answers.append(player_text)

        # MVP: Mock 응답 (EEVE 연동 전)
        # 추후 실제 EEVE 호출 및 점수 계산으로 교체
        is_correct = len(turn_state.answers) <= 2  # Mock: 처음 2개 정답
        turn_state.combo_state.update_combo(is_correct)

        # Mock 예리 응답
        yeri_responses = {
            "S0": "응~ 잘 봐봐~",
            "S1": "오~ 오빠 감각 있는데?",
            "S2": "진짜 몰라? 나 바꿨단 말이야!",
            "S3": "하아... 이번에도 몰라?",
            "S4": "오빠, 역시 내 사람이야♡"
        }

        yeri_text = yeri_responses.get(session.emotion_stage, "응~")

        # 남은 시간 업데이트 (Mock)
        turn_state.remaining_sec = max(0, turn_state.remaining_sec - 5)

        # 턴 종료 체크
        is_turn_finished = turn_state.remaining_sec == 0 or len(turn_state.answers) >= 3
        if is_turn_finished:
            turn_state.is_finished = True
            if session.current_turn < 3:
                session.advance_turn()

        logger.info(
            f"Answer submitted - Session: {request.session_id}, "
            f"Turn: {request.turn_index}, Answer: {player_text[:20]}..."
        )

        return PlayerAnswerResponse(
            yeri_text=yeri_text,
            yeri_voice_url=None,  # MVP에서는 TTS 생략
            emotion_stage=session.emotion_stage,
            updated_scores={
                "turn_score": 0,  # Mock
                "combo": turn_state.combo_state.current_combo
            },
            remaining_sec=turn_state.remaining_sec,
            combo_count=turn_state.combo_state.current_combo,
            is_turn_finished=is_turn_finished
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to process answer: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"답변 처리 실패: {str(e)}"
        )


@router.post("/finish", response_model=SessionFinishResponse)
async def finish_session(session_id: str):
    """
    게임 세션 종료 및 최종 점수 계산
    참조: 06_Technical_Implementation.md Section 6.1
    """
    try:
        # 세션 조회
        session = sessions_store.get(session_id)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="세션을 찾을 수 없습니다."
            )

        # 세션 종료 처리
        session.finish_session()

        # MVP: Mock 최종 점수
        # 추후 실제 점수 계산 로직으로 교체
        session.final_score = 75.0

        # 엔딩 결정
        if session.final_score >= 80:
            ending_type = "love"
            ending_message = "오빠 너무 멋져... 사랑해♡"
        elif session.final_score >= 50:
            ending_type = "cute_upset"
            ending_message = "흠... 그래도 오늘은 봐줄게~"
        else:
            ending_type = "breakup"
            ending_message = "오빠... 우리 이제 그만하자..."

        logger.info(
            f"Session finished - ID: {session_id}, "
            f"Score: {session.final_score}, Ending: {ending_type}"
        )

        return SessionFinishResponse(
            session_id=session_id,
            final_score=session.final_score,
            ending_type=ending_type,
            yeri_ending_text=ending_message,
            yeri_ending_voice_url=None,
            can_retry=True,
            score_breakdown={
                "emotional_sense": 60,
                "observation": 25,
                "reflex": 15
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to finish session: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"세션 종료 실패: {str(e)}"
        )


@router.get("/{session_id}", response_model=dict)
async def get_session(session_id: str):
    """
    세션 상태 조회 (디버그용)
    """
    session = sessions_store.get(session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="세션을 찾을 수 없습니다."
        )

    return session.model_dump()

