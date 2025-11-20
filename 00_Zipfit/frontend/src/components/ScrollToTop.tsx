import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 브라우저의 자동 스크롤 복원 비활성화
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 강력한 스크롤 리셋 함수
    const resetScroll = () => {
      // window 스크롤
      window.scrollTo(0, 0);
      
      // document.documentElement 스크롤
      document.documentElement.scrollTop = 0;
      
      // document.body 스크롤
      document.body.scrollTop = 0;
      
      // Layout의 main 요소 스크롤 (가장 중요!)
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.scrollTop = 0;
      }
    };

    // 1. 즉시 실행
    resetScroll();

    // 2. 다음 프레임에서 실행 (DOM 업데이트 후)
    requestAnimationFrame(() => {
      resetScroll();
    });

    // 3. 약간의 지연 후 최종 실행
    const timer = setTimeout(() => {
      resetScroll();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
