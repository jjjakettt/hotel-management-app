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
    // const themeFromStorage : boolean = 
    //     typeof localStorage !== "undefined" && localStorage.getItem("hotel-theme") 
    //         ? JSON.parse(localStorage.getItem("hotel-theme")!)
    //         : false;

    // const [darkTheme, setDarkTheme] = useState<boolean>(themeFromStorage);

    // const [renderComponent, setRenderComponent] = useState(false);

    // useEffect(() => {
    //     setRenderComponent(true); 
    // }, [])

    // if (!renderComponent) return <></>;
    return (
        <ThemeContext.Provider value={{ darkTheme, setDarkTheme }}>
            {children}
        </ThemeContext.Provider>
    );
    // return (
    //     <ThemeContext.Provider value={{darkTheme, setDarkTheme}}>
    //         <div className={`${darkTheme ? "dark" : ""} min-h-screen`}>
    //             <div className="dark:text-white dark:bg-black text-[#1E1E1E]">
    //                 {children}
    //             </div>
    //         </div>

    //     </ThemeContext.Provider>
    // );

    
    
}

export default ThemeProvider;

