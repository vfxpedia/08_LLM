"""
예리는 못 말려 Backend API 테스트 스크립트
서버가 실행 중일 때 이 스크립트를 실행하여 API를 테스트합니다.
"""

import requests
import json
from typing import Dict, Any

# API 기본 URL
BASE_URL = "http://localhost:8000"


def print_response(title: str, response: requests.Response):
    """응답을 보기 좋게 출력"""
    print("\n" + "=" * 60)
    print(f"🔍 {title}")
    print("=" * 60)
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response:\n{json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    except:
        print(f"Response: {response.text}")
    print("=" * 60)


def test_health_check():
    """헬스 체크 테스트"""
    print("\n\n🏥 [TEST 1] Health Check")
    response = requests.get(f"{BASE_URL}/api/health")
    print_response("Health Check", response)
    return response.status_code == 200


def test_config():
    """설정 확인 테스트"""
    print("\n\n⚙️ [TEST 2] Config Check")
    response = requests.get(f"{BASE_URL}/api/config")
    print_response("Config", response)
    return response.status_code == 200


def test_session_start():
    """세션 시작 테스트"""
    print("\n\n🎮 [TEST 3] Session Start")
    payload = {
        "player_id": "test_player_001",
        "difficulty": "medium"
    }
    response = requests.post(f"{BASE_URL}/api/session/start", json=payload)
    print_response("Session Start", response)

    if response.status_code == 200:
        return response.json().get("session_id")
    return None


def test_submit_answer(session_id: str):
    """답변 제출 테스트"""
    print("\n\n💬 [TEST 4] Submit Answer")
    payload = {
        "session_id": session_id,
        "turn_index": 1,
        "input_type": "text",
        "content": "헤어스타일 바꿨어!"
    }
    response = requests.post(f"{BASE_URL}/api/session/answer", json=payload)
    print_response("Submit Answer", response)
    return response.status_code == 200


def test_session_status(session_id: str):
    """세션 상태 조회 테스트"""
    print("\n\n📊 [TEST 5] Session Status")
    response = requests.get(f"{BASE_URL}/api/session/{session_id}")
    print_response("Session Status", response)
    return response.status_code == 200


def test_finish_session(session_id: str):
    """세션 종료 테스트"""
    print("\n\n🏁 [TEST 6] Finish Session")
    response = requests.post(f"{BASE_URL}/api/session/finish", params={"session_id": session_id})
    print_response("Finish Session", response)
    return response.status_code == 200


def main():
    """메인 테스트 실행"""
    print("\n" + "=" * 60)
    print("🚀 예리는 못 말려 Backend API 테스트 시작")
    print("=" * 60)

    try:
        # 1. Health Check
        if not test_health_check():
            print("\n❌ Health check failed. Is the server running?")
            return

        # 2. Config Check
        test_config()

        # 3. Session Start
        session_id = test_session_start()
        if not session_id:
            print("\n❌ Failed to start session")
            return

        print(f"\n✅ Session created: {session_id}")

        # 4. Submit Answer (여러 번)
        for i in range(3):
            print(f"\n📝 답변 {i+1} 제출 중...")
            test_submit_answer(session_id)

        # 5. Session Status
        test_session_status(session_id)

        # 6. Finish Session
        test_finish_session(session_id)

        print("\n\n" + "=" * 60)
        print("✅ 모든 테스트 완료!")
        print("=" * 60)

    except requests.exceptions.ConnectionError:
        print("\n\n❌ ERROR: 서버에 연결할 수 없습니다.")
        print("서버가 실행 중인지 확인해주세요: http://localhost:8000")
    except Exception as e:
        print(f"\n\n❌ ERROR: {str(e)}")


if __name__ == "__main__":
    main()
