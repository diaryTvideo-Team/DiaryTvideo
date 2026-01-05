export type Language = "en" | "ko"

export const translations = {
  en: {
    // Navigation
    myDiary: "My Diary",
    signIn: "Sign In",
    getStarted: "Get Started",
    newEntry: "New Entry",
    logout: "Logout",

    // Intro Page
    heroTitle: "Your Personal Space for",
    heroSubtitle: "Thoughts & Memories",
    heroDescription:
      "Capture your daily moments, reflect on your journey, and preserve your memories in a beautiful, private digital diary that's always with you.",
    startWritingToday: "Start Writing Today",
    alreadyHaveAccount: "I Already Have an Account",
    whyDigitalDiary: "Why Keep a Digital Diary?",
    easyWriting: "Easy Writing",
    easyWritingDesc: "Simple, distraction-free interface that lets you focus on what matters - your thoughts.",
    privateSecure: "Private & Secure",
    privateSecureDesc: "Your entries are personal. Keep your memories safe and accessible only to you.",
    aiVideoView: "AI Video View",
    aiVideoViewDesc: "View your diary entries as engaging video summaries or traditional text format.",
    readyToStart: "Ready to Start Your Journey?",
    joinThousands: "Join thousands who have made journaling a daily habit.",
    createFreeDiary: "Create Your Free Diary",
    allRightsReserved: "All rights reserved",

    // Footer
    developedBy: "Developed by",
    poweredBy: "Powered by",
    contact: "Contact",
  },
  ko: {
    // Navigation
    myDiary: "나의 일기",
    signIn: "로그인",
    getStarted: "시작하기",
    newEntry: "새 일기",
    logout: "로그아웃",

    // Intro Page
    heroTitle: "당신만의 공간",
    heroSubtitle: "생각과 추억을 위한",
    heroDescription:
      "일상의 순간을 기록하고, 여정을 돌아보며, 아름답고 안전한 디지털 일기장에 소중한 기억을 보관하세요.",
    startWritingToday: "지금 시작하기",
    alreadyHaveAccount: "이미 계정이 있습니다",
    whyDigitalDiary: "디지털 일기장의 장점",
    easyWriting: "간편한 작성",
    easyWritingDesc: "중요한 것에 집중할 수 있도록 방해 요소 없는 간단한 인터페이스를 제공합니다.",
    privateSecure: "개인정보 보호",
    privateSecureDesc: "당신의 일기는 개인적입니다. 안전하게 보관되며 오직 당신만 접근할 수 있습니다.",
    aiVideoView: "AI 비디오 뷰",
    aiVideoViewDesc: "일기를 영상 요약 형식이나 전통적인 텍스트 형식으로 볼 수 있습니다.",
    readyToStart: "여정을 시작할 준비가 되셨나요?",
    joinThousands: "일기 쓰기를 일상으로 만든 수천 명과 함께하세요.",
    createFreeDiary: "무료 일기장 만들기",
    allRightsReserved: "모든 권리 보유",

    // Footer
    developedBy: "개발:",
    poweredBy: "기술:",
    contact: "연락처",
  },
} as const

export function useTranslation(lang: Language) {
  return translations[lang]
}
