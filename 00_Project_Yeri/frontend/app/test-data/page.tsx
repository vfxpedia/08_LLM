"use client";

import { GAME_DATA_SETS, getRandomGameData, getGameDataByDifficulty } from "@/data/gameData";
import { useState, useEffect } from "react";

export default function TestDataPage() {
  const [randomGame, setRandomGame] = useState<any>(null);
  const hardGames = getGameDataByDifficulty("hard");

  useEffect(() => {
    setRandomGame(getRandomGameData());
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">게임 데이터 테스트</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">전체 게임 데이터 ({GAME_DATA_SETS.length}개)</h2>
        <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(GAME_DATA_SETS, null, 2)}
        </pre>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">랜덤 게임</h2>
        {randomGame ? (
          <pre className="bg-gray-50 p-4 rounded overflow-auto">
            {JSON.stringify(randomGame, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-500">로딩 중...</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">난이도: Hard ({hardGames.length}개)</h2>
        <pre className="bg-gray-50 p-4 rounded overflow-auto">
          {JSON.stringify(hardGames, null, 2)}
        </pre>
      </div>
    </div>
  );
}
