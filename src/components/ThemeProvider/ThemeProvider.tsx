'use client';

import { useEffect, useState } from "react";

import ThemeContext from "@/context/themeContext";

const ThemeProvider = ({ children } : { children: React.ReactNode }) => {
    const themeFromStorage: boolean = 
        typeof localStorage !== "undefined" && localStorage.getItem("hotel-theme") 
            ? JSON.parse(localStorage.getItem("hotel-theme")!)
            : false;

    const [darkTheme, setDarkTheme] = useState<boolean>(themeFromStorage);
    const [renderComponent, setRenderComponent] = useState(false);

    useEffect(() => {
        setRenderComponent(true);
    }, []);

    useEffect(() => {
        // Add or remove the 'dark' class on the root element
        if (darkTheme) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkTheme]);

    if (!renderComponent) return <></>;

    return (
        <ThemeContext.Provider value={{ darkTheme, setDarkTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;

