import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        // 페이드 인/아웃
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        // 팝업 애니메이션 (팡!)
        popIn: {
          "0%": {
            opacity: "0",
            transform: "scale(0.3) rotate(-10deg)"
          },
          "50%": {
            transform: "scale(1.1) rotate(5deg)"
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) rotate(0deg)"
          },
        },
        popOut: {
          "0%": {
            opacity: "1",
            transform: "scale(1)"
          },
          "100%": {
            opacity: "0",
            transform: "scale(0.8)"
          },
        },
        // 슬라이드 애니메이션
        slideInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          },
        },
        slideInDown: {
          "0%": {
            opacity: "0",
            transform: "translateY(-20px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          },
        },
        // 흔들기 (정답/오답 시)
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
        // 펄스 (강조)
        pulseScale: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        fadeOut: "fadeOut 0.3s ease-out",
        popIn: "popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        popOut: "popOut 0.3s ease-out",
        slideInUp: "slideInUp 0.4s ease-out",
        slideInDown: "slideInDown 0.4s ease-out",
        shake: "shake 0.5s ease-in-out",
        pulseScale: "pulseScale 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
