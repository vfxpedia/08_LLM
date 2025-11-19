"use client";

import { IntroScreen } from "@/components/game";

export default function TestIntroPage() {
  const handleStart = () => {
    alert("게임 시작! (실제로는 게임 페이지로 이동)");
  };

  return (
    <IntroScreen
      nickname="테스터"
      beforeImageUrl="/images/test01_before.png"
      onStart={handleStart}
    />
  );
}
