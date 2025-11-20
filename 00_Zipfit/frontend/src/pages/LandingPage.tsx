import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { ArrowRight, FileText, Brain, Target, CheckCircle, Sparkles } from 'lucide-react';
import { Logo } from '../components/Logo';

interface LandingPageProps {
  onStartClick: () => void;
}

export function LandingPage({ onStartClick }: LandingPageProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const handleLearnMore = () => {
    document.getElementById('why-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section - Mobile: 100vh, Desktop: min-h-screen */}
      <section className="relative h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Vignette Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.03)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        
        {/* Subtle Background Gradient - GREEN */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/15 via-green-500/10 to-transparent dark:from-emerald-500/10 dark:via-green-500/8 dark:to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-green-500/15 via-emerald-500/10 to-transparent dark:from-green-500/10 dark:via-emerald-500/8 dark:to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex justify-center"
            >
              <Logo className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" />
            </motion.div>

            {/* Main Slogan with Typography Hierarchy */}
            <div className="space-y-2 sm:space-y-4">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-zinc-600 dark:text-zinc-400"
              >
                나에게 딱 맞는 집,
              </motion.p>
              <motion.h1 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tight"
                style={{ fontWeight: 800, letterSpacing: '-0.02em' }}
              >
                <span className="bg-gradient-to-br from-emerald-600 via-green-500 to-emerald-700 dark:from-emerald-400 dark:via-green-300 dark:to-emerald-500 bg-clip-text text-transparent inline-block">
                  ZIPFIT
                </span>
              </motion.h1>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 sm:pt-8"
            >
              <Button
                onClick={onStartClick}
                size="lg"
                className="w-full sm:w-auto relative overflow-hidden bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-500 dark:to-green-500 hover:from-emerald-700 hover:to-green-700 dark:hover:from-emerald-400 dark:hover:to-green-400 text-white px-8 sm:px-10 py-5 sm:py-6 text-sm sm:text-base rounded-full shadow-lg hover:shadow-xl transition-all group"
              >
                <span className="relative z-10 flex items-center justify-center">
                  시작하기
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              <Button
                onClick={handleLearnMore}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 sm:px-10 py-5 sm:py-6 text-sm sm:text-base rounded-full border-2 border-zinc-200 dark:border-zinc-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all"
              >
                더 알아보기
              </Button>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="pt-12 sm:pt-20"
            >
              <button 
                onClick={handleLearnMore}
                className="inline-flex flex-col items-center gap-2 text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Section */}
      <section id="why-section" className="py-32 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-sm uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">Why ZIPFIT</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-zinc-900 dark:text-zinc-100">
              왜 <span className="bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent">집핏</span>인가요?
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 lg:gap-12"
          >
            {/* Card 1 */}
            <motion.div
              variants={fadeInUp}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent dark:from-emerald-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-8">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center mb-6">
                  <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl mb-4 text-zinc-900 dark:text-zinc-100">
                  복잡한 공고 문서
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  공공주거 공고는 복잡하고 구조가 달라서, 이해하기 어렵습니다.
                </p>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={fadeInUp}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent dark:from-green-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-8">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-950/50 rounded-2xl flex items-center justify-center mb-6">
                  <Brain className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl mb-4 text-zinc-900 dark:text-zinc-100">
                  AI 기반 문서 분석
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  LLM이 비정형 문서를 읽고, 맥락을 이해하며 질문에 답합니다.
                </p>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={fadeInUp}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 dark:from-emerald-500/10 dark:to-green-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-950/50 dark:to-green-950/50 rounded-2xl flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-emerald-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl mb-4 text-zinc-900 dark:text-zinc-100">
                  맞춤형 정보 제공
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  단순 나열이 아닌, 내 조건에 맞는지 분석하고 설명합니다.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-sm uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">Features</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-zinc-900 dark:text-zinc-100">
              핵심 기능
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: Brain, title: 'AI 상담', desc: '개인 맞춤형 AI 상담', path: '/chat' },
              { icon: FileText, title: '공고 분석', desc: '복잡한 공고 간편하게', path: '/announcements' },
              { icon: CheckCircle, title: '자격 진단', desc: '즉시 확인 가능', path: '/eligibility' },
              { icon: Sparkles, title: '대출 연계', desc: '주거 지원 정보', path: '/loans' },
            ].map((feature, idx) => (
              <motion.button
                key={idx}
                variants={fadeInUp}
                onClick={onStartClick}
                className="group p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all text-left hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                </div>
                <h4 className="mb-2 text-zinc-900 dark:text-zinc-100">{feature.title}</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{feature.desc}</p>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-zinc-900 dark:bg-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white">
              지금 바로 시작하세요
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              복잡한 공고 분석부터 자격 확인, AI 상담까지
            </p>
            <Button
              onClick={onStartClick}
              size="lg"
              className="bg-white text-zinc-900 hover:bg-zinc-100 px-10 py-6 text-base rounded-full shadow-xl hover:shadow-2xl transition-all"
            >
              무료로 시작하기
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                © 2025 ZIPFIT. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs px-3 py-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-full">LH</span>
              <span className="text-xs px-3 py-1.5 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-full">SH</span>
              <span className="text-xs px-3 py-1.5 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 rounded-full">GH</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}