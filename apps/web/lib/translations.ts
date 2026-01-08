export type Language = "en" | "ko";

export const COOMON_TRANSLATIONS = {
  project_name: "DiaryTvideo",
  allRightsReserved: "All rights reserved",
  developedBy: "Developed by",
  poweredBy: "Powered by",
  contact: "Contact",
};

export const translations = {
  en: {
    // Navigation
    project_name: COOMON_TRANSLATIONS.project_name,
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
    easyWritingDesc:
      "Simple, distraction-free interface that lets you focus on what matters - your thoughts.",
    privateSecure: "Private & Secure",
    privateSecureDesc:
      "Your entries are personal. Keep your memories safe and accessible only to you.",
    aiVideoView: "AI Video View",
    aiVideoViewDesc:
      "View your diary entries as engaging video summaries or traditional text format.",
    readyToStart: "Ready to Start Your Journey?",
    joinThousands: "Join thousands who have made journaling a daily habit.",
    createFreeDiary: "Create Your Free Diary",
    allRightsReserved: COOMON_TRANSLATIONS.allRightsReserved,

    // Login Page
    welcomeBack: "Welcome Back",
    createAccount: "Create Account",
    signInToContinue: "Sign in to continue your journaling journey",
    startYourDiaryToday: "Start your personal diary today",
    alreayAccount: "I Already Have an Account",
    notyetAccount: "Don't have an account?",

    // Verification Page
    verifyEmail: "Verify Email",
    enterVerificationCode: "Enter verification code",
    verificationCodeSent: "Verification code sent to your email",
    didntReceiveCode: "Didn't receive the code?",
    resendCode: "Resend code",
    verifyAndContinue: "Verify and continue",
    codeExpired: "Verification code has expired",
    invalidCode: "Invalid verification code",

    // Password Reset Page
    forgotPassword: "Forgot your password?",
    resetPassword: "Reset Password",
    passwordResetEmailSent:
      "A password reset link has been sent to your email.",
    checkEmailForReset: "Check your email to reset your password.",
    didntReceiveEmail: "Didn't receive the email?",
    resendEmail: "Resend email",
    verificationCodeResent: "Verification code has been resent!",
    passwordResetEmailResent: "Password reset email has been resent!",

    // Diary Page
    newEntryTitle: "Title",
    newEntryDescription: "Write your thoughts",
    cancel: "Cancel",
    saveEntry: "Save Entry",
    newEntryTitlePlaceholder: "Give your entry a title...",
    newEntryDescriptionPlaceholder: "What's on your mind today...",
    noEntriesYet: "No Entries Yet",
    startWritingFirst: "Start writing your first diary entry now!",
    entry: "entry",
    entries: "entries",
    filtered: "filtered",
    noEntriesMatch: "No entries match your criteria.",
    clearAllFilters: "Clear All Filters",
    deleteEntryTitle: "Delete Entry",
    deleteEntryMessage:
      "Are you sure you want to delete this entry? This action cannot be undone.",
    deleteConfirm: "Delete",

    // Account Page
    account: "Account",
    accountSettings: "Account Settings",
    userInformation: "User Information",
    name: "Name",
    email: "Email",
    memberSince: "Member Since",
    changeName: "Change Name",
    newName: "New Name",
    updateName: "Update Name",
    nameUpdated: "Name updated successfully",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    updatePassword: "Update Password",
    passwordUpdated: "Password updated successfully",
    passwordsDoNotMatch: "Passwords do not match",
    cancelMembership: "Cancel Membership",
    cancelMembershipWarning:
      "This action will permanently delete your account and all your diary entries. This cannot be undone.",
    confirmPassword: "Confirm Password",
    deleteAccount: "Delete Account",
    accountDeleted: "Account deleted successfully",
    backToDiary: "Back to Diary",

    // Footer
    developedBy: COOMON_TRANSLATIONS.developedBy,
    poweredBy: COOMON_TRANSLATIONS.poweredBy,
    contact: COOMON_TRANSLATIONS.contact,
  },
  ko: {
    // Navigation
    project_name: COOMON_TRANSLATIONS.project_name,
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
    easyWritingDesc:
      "중요한 것에 집중할 수 있도록 방해 요소 없는 간단한 인터페이스를 제공합니다.",
    privateSecure: "개인정보 보호",
    privateSecureDesc:
      "당신의 일기는 개인적입니다. 안전하게 보관되며 오직 당신만 접근할 수 있습니다.",
    aiVideoView: "AI 비디오 뷰",
    aiVideoViewDesc:
      "일기를 영상 요약 형식이나 전통적인 텍스트 형식으로 볼 수 있습니다.",
    readyToStart: "여정을 시작할 준비가 되셨나요?",
    joinThousands: "일기 쓰기를 일상으로 만든 수천 명과 함께하세요.",
    createFreeDiary: "무료 일기장 만들기",
    allRightsReserved: COOMON_TRANSLATIONS.allRightsReserved,

    // Login Page
    welcomeBack: "다시 오신 것을 환영합니다",
    createAccount: "계정 만들기",
    signInToContinue: "일기 여정을 계속하려면 로그인하세요",
    startYourDiaryToday: "지금 개인 일기장을 시작하세요",
    alreayAccount: "이미 계정이 있습니다",
    notyetAccount: "계정이 없으신가요?",

    // Verification Page
    verifyEmail: "이메일 인증",
    enterVerificationCode: "인증 코드를 입력하세요",
    verificationCodeSent: "인증 코드가 이메일로 전송되었습니다",
    didntReceiveCode: "이메일을 받지 못하셨나요?",
    resendCode: "코드 재전송",
    verifyAndContinue: "인증하고 계속하기",
    codeExpired: "인증 코드가 만료되었습니다",
    invalidCode: "올바르지 않은 코드입니다",

    // Password Reset Page
    forgotPassword: "비밀번호를 잊으셨나요?",
    resetPassword: "비밀번호 재설정",
    passwordResetEmailSent: "비밀번호 재설정 링크가 이메일로 전송되었습니다.",
    checkEmailForReset: "이메일을 확인하여 비밀번호를 재설정하세요.",
    didntReceiveEmail: "이메일을 받지 못하셨나요?",
    resendEmail: "이메일 재전송",
    verificationCodeResent: "인증 코드가 재전송되었습니다!",
    passwordResetEmailResent: "비밀번호 재설정 이메일이 재전송되었습니다!",

    // Diary Page
    newEntryTitle: "제목",
    newEntryDescription: "생각을 적어보세요",
    cancel: "취소",
    saveEntry: "저장",
    newEntryTitlePlaceholder: "일기의 제목을 입력하세요.",
    newEntryDescriptionPlaceholder: "오늘의 생각은 무엇인가요.",
    noEntriesYet: "아직 작성된 일기가 없습니다",
    startWritingFirst: "지금 바로 첫 일기를 작성해보세요!",
    entry: "개",
    entries: "개",
    filtered: "필터링됨",
    noEntriesMatch: "조건에 맞는 일기가 없습니다.",
    clearAllFilters: "모든 필터 지우기",
    deleteEntryTitle: "일기 삭제",
    deleteEntryMessage:
      "정말로 이 일기를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
    deleteConfirm: "삭제",

    // Account Page
    account: "계정",
    accountSettings: "계정 설정",
    userInformation: "사용자 정보",
    name: "이름",
    email: "이메일",
    memberSince: "가입일",
    changeName: "이름 변경",
    newName: "새 이름",
    updateName: "이름 업데이트",
    nameUpdated: "이름이 성공적으로 업데이트되었습니다",
    changePassword: "비밀번호 변경",
    currentPassword: "현재 비밀번호",
    newPassword: "새 비밀번호",
    confirmNewPassword: "새 비밀번호 확인",
    updatePassword: "비밀번호 업데이트",
    passwordUpdated: "비밀번호가 성공적으로 업데이트되었습니다",
    passwordsDoNotMatch: "비밀번호가 일치하지 않습니다",
    cancelMembership: "회원 탈퇴",
    cancelMembershipWarning:
      "이 작업은 계정과 모든 일기를 영구적으로 삭제합니다. 되돌릴 수 없습니다.",
    confirmPassword: "비밀번호 확인",
    deleteAccount: "계정 삭제",
    accountDeleted: "계정이 성공적으로 삭제되었습니다",
    backToDiary: "일기장으로 돌아가기",

    // Footer
    developedBy: COOMON_TRANSLATIONS.developedBy,
    poweredBy: COOMON_TRANSLATIONS.poweredBy,
    contact: COOMON_TRANSLATIONS.contact,
  },
} as const;
