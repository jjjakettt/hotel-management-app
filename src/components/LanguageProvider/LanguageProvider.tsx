'use client';

import { useEffect, useState } from "react";
import LanguageContext, { Language } from "@/context/languageContext";

const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const langFromStorage: Language =
        typeof localStorage !== "undefined" && localStorage.getItem("hotel-language")
            ? (localStorage.getItem("hotel-language") as Language)
            : "en";

    const [language, setLanguage] = useState<Language>(langFromStorage);
    const [renderComponent, setRenderComponent] = useState(false);

    useEffect(() => {
        setRenderComponent(true);
    }, []);

    useEffect(() => {
        localStorage.setItem("hotel-language", language);
    }, [language]);

    if (!renderComponent) return <></>;

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageProvider;
