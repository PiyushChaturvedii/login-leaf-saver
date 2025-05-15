
type LanguageStrings = {
  [key: string]: {
    en: string;
    hi: string;
  };
};

// Application-wide translations
export const translations: LanguageStrings = {
  // Auth common strings
  login: {
    en: "Login",
    hi: "लॉग इन करें",
  },
  register: {
    en: "Register",
    hi: "पंजीकरण करें",
  },
  email: {
    en: "Email",
    hi: "ईमेल",
  },
  password: {
    en: "Password",
    hi: "पासवर्ड",
  },
  confirmPassword: {
    en: "Confirm Password",
    hi: "पासवर्ड की पुष्टि करें",
  },
  name: {
    en: "Name",
    hi: "नाम",
  },
  role: {
    en: "Role",
    hi: "भूमिका",
  },
  student: {
    en: "Student",
    hi: "छात्र",
  },
  instructor: {
    en: "Instructor",
    hi: "शिक्षक",
  },
  accounting: {
    en: "Accounting",
    hi: "अकाउंटिंग",
  },
  admin: {
    en: "Admin",
    hi: "एडमिन",
  },
  
  // Login form
  academyLogin: {
    en: "Academy Login",
    hi: "अकादमी लॉगिन",
  },
  forgotPassword: {
    en: "Forgot Password?",
    hi: "पासवर्ड भूल गए?",
  },
  enterYourEmail: {
    en: "Enter your email address",
    hi: "आपका ईमेल पता दर्ज करें",
  },
  enterYourPassword: {
    en: "Enter your password",
    hi: "आपका पासवर्ड दर्ज करें",
  },
  loggingIn: {
    en: "Logging in...",
    hi: "लॉग इन कर रहा है...",
  },
  dontHaveAccount: {
    en: "Don't have an account?",
    hi: "खाता नहीं है?",
  },
  
  // Registration form
  registration: {
    en: "Registration",
    hi: "पंजीकरण",
  },
  enterYourFullName: {
    en: "Enter your full name",
    hi: "अपना पूरा नाम दर्ज करें",
  },
  chooseYourRole: {
    en: "Choose your role",
    hi: "अपनी भूमिका चुनें",
  },
  createStrongPassword: {
    en: "Create a strong password",
    hi: "एक मजबूत पासवर्ड बनाएं",
  },
  reenterPassword: {
    en: "Re-enter your password",
    hi: "अपना पासवर्ड फिर से दर्ज करें",
  },
  registering: {
    en: "Registering...",
    hi: "पंजीकरण हो रहा है...",
  },
  alreadyHaveAccount: {
    en: "Already have an account?",
    hi: "पहले से ही एक खाता है?",
  },
  
  // Password reset form
  passwordReset: {
    en: "Password Reset",
    hi: "पासवर्ड रीसेट",
  },
  emailAddress: {
    en: "Email Address",
    hi: "ईमेल पता",
  },
  enterRegisteredEmail: {
    en: "Enter your registered email address",
    hi: "अपना पंजीकृत ईमेल पता दर्ज करें",
  },
  resetInstructions: {
    en: "We will send you a password reset link that you can use to regain access to your account.",
    hi: "हम आपको एक पासवर्ड रीसेट लिंक भेजेंगे जिसे आप अपने खाते तक पुन: पहुंच प्राप्त करने के लिए उपयोग कर सकते हैं।",
  },
  back: {
    en: "Back",
    hi: "वापस जाएं",
  },
  sending: {
    en: "Sending...",
    hi: "भेज रहा है...",
  },
  sendReset: {
    en: "Send Reset",
    hi: "रीसेट भेजें",
  },
  
  // Reset success
  passwordResetSent: {
    en: "Password Reset Sent",
    hi: "पासवर्ड रीसेट भेजा गया",
  },
  checkInbox: {
    en: "We've sent password reset instructions to",
    hi: "हमने पासवर्ड रीसेट निर्देश भेज दिए हैं",
  },
  followInstructions: {
    en: "Please check your inbox and follow the instructions.",
    hi: "कृपया अपना इनबॉक्स देखें और निर्देशों का पालन करें।",
  },
  backToLogin: {
    en: "Back to Login",
    hi: "लॉगिन पर वापस जाएं",
  },
  
  // Error messages
  invalidCredentials: {
    en: "Invalid credentials. Please try again.",
    hi: "अमान्य प्रमाण पत्र। कृपया पुन: प्रयास करें।",
  },
  loginError: {
    en: "Login error. Please try again.",
    hi: "लॉगिन में त्रुटि हुई। कृपया पुन: प्रयास करें।",
  },
  passwordsDontMatch: {
    en: "Passwords don't match",
    hi: "पासवर्ड मेल नहीं खाते",
  },
  registrationFailed: {
    en: "Registration failed. Please try again.",
    hi: "पंजीकरण विफल हो गया। कृपया पुन: प्रयास करें।",
  },
  registrationError: {
    en: "Registration error. Please try again.",
    hi: "पंजीकरण में त्रुटि हुई। कृपया पुन: प्रयास करें।",
  },
  noAccountFound: {
    en: "No account found with that email",
    hi: "उस ईमेल से कोई खाता नहीं मिला",
  },
  resetError: {
    en: "Password reset error. Please try again.",
    hi: "पासवर्ड रीसेट में त्रुटि हुई। कृपया पुन: प्रयास करें।",
  },
  
  // Success messages
  loginSuccess: {
    en: "Login successful!",
    hi: "सफलतापूर्वक लॉगिन किया गया!",
  },
  registrationSuccess: {
    en: "Registration successful!",
    hi: "पंजीकरण सफल!",
  },
  resetSuccess: {
    en: "Password reset instructions have been sent to your email",
    hi: "पासवर्ड रीसेट निर्देश आपके ईमेल पर भेजे गए हैं",
  },
  profileUpdated: {
    en: "Profile successfully updated!",
    hi: "प्रोफ़ाइल सफलतापूर्वक अपडेट किया गया!",
  },
  
  // Profile setup
  welcome: {
    en: "Welcome, ",
    hi: "स्वागत है, ",
  },
  completeProfile: {
    en: "Please complete your profile to continue",
    hi: "आगे बढ़ने के लिए कृपया अपनी प्रोफ़ाइल पूरी करें",
  },
  goToDashboard: {
    en: "Go to Dashboard",
    hi: "डैशबोर्ड पर जाएं",
  },
  adminNoProfileSetup: {
    en: "Admin users don't need additional profile setup",
    hi: "एडमिन उपयोगकर्ताओं के लिए अतिरिक्त प्रोफ़ाइल सेटअप की आवश्यकता नहीं है",
  },
  loading: {
    en: "Loading...",
    hi: "लोड हो रहा है...",
  },
};

/**
 * Get a translated string based on current language
 * @param key - The translation key
 * @param language - The current language code ('en' or 'hi')
 * @returns The translated string
 */
export const t = (key: keyof typeof translations, language: 'en' | 'hi'): string => {
  if (translations[key]) {
    return translations[key][language];
  }
  
  // Fallback to the key itself if translation is missing
  console.warn(`Translation missing for key: ${key}`);
  return key;
};
