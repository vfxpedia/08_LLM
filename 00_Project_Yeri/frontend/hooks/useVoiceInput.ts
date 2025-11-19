/**
 * useVoiceInput.ts
 * 음성 입력 관리 훅 (Web Speech API)
 * 참조: docs/12_Game_Core_Design_Final.md Section 3
 */

"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface UseVoiceInputOptions {
  /** 자동 활성화 여부 */
  autoActivate?: boolean;
  /** 연속 인식 모드 */
  continuous?: boolean;
  /** 언어 (기본값: ko-KR) */
  lang?: string;
  /** 음성 인식 결과 콜백 */
  onResult?: (transcript: string) => void;
  /** 에러 콜백 */
  onError?: (error: string) => void;
}

export interface UseVoiceInputReturn {
  /** 음성 인식 활성화 여부 */
  isListening: boolean;
  /** 현재 인식 중인 텍스트 (임시) */
  interimTranscript: string;
  /** 최종 확정된 텍스트 */
  finalTranscript: string;
  /** 음성 인식 시작 */
  startListening: () => void;
  /** 음성 인식 중지 */
  stopListening: () => void;
  /** 음성 인식 토글 */
  toggleListening: () => void;
  /** 텍스트 초기화 */
  resetTranscript: () => void;
  /** Web Speech API 지원 여부 */
  isSupported: boolean;
  /** 에러 메시지 */
  error: string | null;
}

/**
 * 음성 입력 관리 훅
 *
 * 기능:
 * - Web Speech API 기반 음성 인식
 * - 자동 활성화 지원 (턴 2-3)
 * - 연속 인식 모드 (continuous: true)
 * - 실시간 텍스트 변환
 *
 * 사용 예시:
 * const { isListening, finalTranscript, startListening, stopListening } = useVoiceInput({
 *   autoActivate: true,
 *   continuous: true,
 *   onResult: (text) => {
 *     console.log("음성 인식 결과:", text);
 *     addAnswer(text, "voice", currentTurn);
 *   }
 * });
 */
export function useVoiceInput(options: UseVoiceInputOptions = {}): UseVoiceInputReturn {
  const {
    autoActivate = false,
    continuous = true,
    lang = "ko-KR",
    onResult,
    onError,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Web Speech API 지원 확인
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);

      const recognition = new SpeechRecognition();
      recognition.continuous = continuous;
      recognition.interimResults = true;
      recognition.lang = lang;

      // 음성 인식 결과 처리
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }

        setInterimTranscript(interim);

        if (final) {
          setFinalTranscript((prev) => prev + final);
          if (onResult) {
            onResult(final);
          }
        }
      };

      // 에러 처리
      recognition.onerror = (event: any) => {
        const errorMessage = `음성 인식 오류: ${event.error}`;
        setError(errorMessage);
        setIsListening(false);

        if (onError) {
          onError(errorMessage);
        }

        // 특정 에러는 자동 재시작 시도
        if (event.error === "no-speech" || event.error === "audio-capture") {
          setTimeout(() => {
            if (autoActivate) {
              startListening();
            }
          }, 1000);
        }
      };

      // 음성 인식 종료 처리
      recognition.onend = () => {
        setIsListening(false);

        // continuous 모드에서 자동 재시작
        if (continuous && autoActivate && !error) {
          setTimeout(() => {
            try {
              recognition.start();
              setIsListening(true);
            } catch (err) {
              // 이미 시작된 경우 무시
            }
          }, 100);
        }
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      setError("이 브라우저는 음성 인식을 지원하지 않습니다.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [autoActivate, continuous, lang, onResult, onError, error]);

  /**
   * 음성 인식 시작
   */
  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) {
      setError("음성 인식을 사용할 수 없습니다.");
      return;
    }

    try {
      setError(null);
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      // 이미 시작된 경우 무시
      if (err instanceof Error && !err.message.includes("already started")) {
        setError("음성 인식 시작 실패");
      }
    }
  }, [isSupported]);

  /**
   * 음성 인식 중지
   */
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  /**
   * 음성 인식 토글
   */
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  /**
   * 텍스트 초기화
   */
  const resetTranscript = useCallback(() => {
    setInterimTranscript("");
    setFinalTranscript("");
  }, []);

  // 자동 활성화
  useEffect(() => {
    if (autoActivate && isSupported) {
      startListening();

      return () => {
        stopListening();
      };
    }
  }, [autoActivate, isSupported, startListening, stopListening]);

  return {
    isListening,
    interimTranscript,
    finalTranscript,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
    isSupported,
    error,
  };
}
