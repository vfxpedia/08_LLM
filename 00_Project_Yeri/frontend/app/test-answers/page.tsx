"use client";

import { usePlayerAnswers } from "@/hooks/usePlayerAnswers";
import { useState } from "react";

export default function TestAnswersPage() {
  const { answers, addAnswer, updateAnswerResult, getCorrectCount, clearAnswers } = usePlayerAnswers();
  const [inputText, setInputText] = useState("");

  const handleAddText = () => {
    if (inputText.trim()) {
      addAnswer(inputText, "text", 2);
      setInputText("");
    }
  };

  const handleAddVoice = () => {
    addAnswer("음성 테스트 답변", "voice", 2);
  };

  const handleMarkCorrect = (index: number) => {
    updateAnswerResult(index, true, 0.85, 75, "정답이에요! 센스 대박!");
  };

  const handleMarkWrong = (index: number) => {
    updateAnswerResult(index, false, 0.45, 30, "아쉽네요...");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">연속 답변 시스템 테스트</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">답변 추가</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="텍스트 답변 입력..."
            className="flex-1 px-4 py-2 border rounded"
          />
          <button
            onClick={handleAddText}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            텍스트 추가
          </button>
        </div>

        <button
          onClick={handleAddVoice}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          음성 답변 추가 (테스트)
        </button>

        <button
          onClick={clearAnswers}
          className="ml-2 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          모두 삭제
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">
          저장된 답변 ({answers.length}개) | 정답: {getCorrectCount()}개
        </h2>

        {answers.length === 0 ? (
          <p className="text-gray-500">답변이 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {answers.map((answer, index) => (
              <div
                key={index}
                className={`border rounded p-4 ${
                  answer.isCorrect === true
                    ? "bg-green-50 border-green-300"
                    : answer.isCorrect === false
                    ? "bg-red-50 border-red-300"
                    : "bg-gray-50 border-gray-300"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold">#{answer.answerIndex}</span>
                    <span className="ml-2 text-sm text-gray-600">
                      턴 {answer.turnIndex} | {answer.inputType}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMarkCorrect(index)}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded"
                    >
                      ✓ 정답
                    </button>
                    <button
                      onClick={() => handleMarkWrong(index)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded"
                    >
                      ✗ 오답
                    </button>
                  </div>
                </div>

                <p className="mb-2">{answer.content}</p>

                {answer.isCorrect !== null && (
                  <div className="text-sm space-y-1">
                    <p>유사도: {answer.similarity?.toFixed(2)}</p>
                    <p>감정 점수: {answer.emotionalScore}</p>
                    {answer.feedback && <p className="text-purple-600">💬 {answer.feedback}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">전체 데이터 (JSON)</h2>
        <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(answers, null, 2)}
        </pre>
      </div>
    </div>
  );
}
