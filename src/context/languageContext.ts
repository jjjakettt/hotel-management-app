import { createContext } from "react";

type Language = "en" | "vi";

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType>({
    language: "en",
    setLanguage: () => null,
});

export default LanguageContext;
export type { Language };
