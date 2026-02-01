"use client";

import ThemeContext from "@/context/themeContext"
import LanguageContext from "@/context/languageContext"
import { useTranslation } from "@/libs/translations"
import { useSession } from "next-auth/react";
import Link from "next/link"
import { useContext } from "react"
import { FaUserCircle } from "react-icons/fa"
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md"
import Image from "next/image"

const Header = () => {
    const { darkTheme, setDarkTheme } = useContext(ThemeContext);
    const { language, setLanguage } = useContext(LanguageContext);
    const { t } = useTranslation();

    const { data: session } = useSession();

    return (
        <header className= "py-10 px-4 container mx-auto text-xl flex flex-wrap md:flex-nowrap items-center justify-between">
            <div className = "flex items-center w-full md:w-2/3">
                <Link href="/" className="font-black text-tertiary-dark">
                    {t("brand")}
                </Link>

                <ul className="flex items-center ml-5">
                    <li className="flex items-center">
                        {session?.user ? (
                            <Link href={`/users/${session.user.id}`}>
                                {session.user.image ? (
                                    <div className="w-10 h-10 rounded-full overflow-hidden">
                                        <Image
                                            src={session.user.image}
                                            alt={session.user.name!}
                                            width = {40}
                                            height = {40}
                                            className="scale-animation img"
                                        />
                                    </div>
                                ):(
                                    <FaUserCircle className="cursor-pointer"/>
                                )}
                            </Link>
                        ) : (
                            <Link href="/auth">
                                <FaUserCircle className="cursor-pointer"/>
                            </Link>
                        )}
                    </li>
                    {/* Dark Mode Icon */}
                    <li className="ml-2">
                        {darkTheme ? (
                            <MdOutlineLightMode className="cursor-pointer"
                            onClick={() => {
                                setDarkTheme(false);
                                localStorage.removeItem("hotel-theme");
                            }}/>
                            ) : (
                            <MdDarkMode className="cursor-pointer"
                            onClick={() => {
                                setDarkTheme(true);
                                localStorage.setItem("hotel-theme", "true");
                            }}/>
                            )}
                    </li>
                    {/* Language Toggle */}
                    <li className="ml-2">
                        <button
                            onClick={() => setLanguage(language === "en" ? "vi" : "en")}
                            className="cursor-pointer text-sm font-bold px-2 py-1 rounded-lg border border-[var(--border)] text-[var(--foreground)] bg-[var(--background-secondary)] hover:scale-110 duration-300 transition-all"
                        >
                            {language === "en" ? "VI" : "EN"}
                        </button>
                    </li>
                </ul>
            </div>
            <ul className="flex items-center justify-between w-full md:w-1/3 mt-4">
                <li className="hover:-translate-y-2 duration-500 transition-all">
                    <Link href="/">{t("nav.home")}</Link>
                </li>
                <li className="hover:-translate-y-2 duration-500 transition-all">
                    <Link href="/rooms">{t("nav.rooms")}</Link>
                </li>
                <li className="hover:-translate-y-2 duration-500 transition-all">
                    <Link href="/#footer">{t("nav.contacts")}</Link>
                </li>
            </ul>
        </header>
    )
}
export default Header
