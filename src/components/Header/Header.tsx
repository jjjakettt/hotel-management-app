"use client";

import ThemeContext from "@/context/themeContext"
import { useSession } from "next-auth/react";
import Link from "next/link"
import { useContext } from "react"
import { FaUserCircle } from "react-icons/fa"
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md"
import Image from "next/image"

/**
 * Header component
 *
 * Renders the top navigation area including:
 * - Brand link on the left
 * - User auth & dark mode action icons
 * - Navigation links on the right
 *
 * Uses Tailwind CSS utility classes for spacing, layout, text sizing, and hover effects.
 */
const Header = () => {
    const { darkTheme, setDarkTheme } = useContext(ThemeContext);

    const { data: session } = useSession();
    console.log(session)

    return (
        <header className= "py-10 px-4 container mx-auto text-xl flex flex-wrap md:flex-nowrap items-center justify-between">
            <div className = "flex items-center w-full md:w-2/3">
                <Link href="/" className="font-black text-tertiary-dark">
                    Coconut Garden Villas
                </Link>
                
                <ul className="flex items-center ml-5">
                    {/* Link to user authentication page */}
                    
                    <li className="flex items-center">
                        {/* 1) Go to user profile : 2) go to authentication page */}
                        {session?.user ? (
                            <Link href={`/users/${session.user.id}`}>
                                {session.user.image ? (
                                    <div className="w-10 h-10 rounded-full overflow-hidden">
                                        <Image 
                                            src={session.user.image} 
                                            alt={session.user.name!}
                                            width = {40}
                                            height = {40}
                                            // Hover Animation -> app/(web)/global.css
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
                </ul>
                
            </div> 

            {/* Primary navigation links with hover translate effect */}
            <ul className="flex items-center justify-between w-full md:w-1/3 mt-4">
                <li className="hover:-translate-y-2 duration-500 transition-all">
                    <Link href="/">Home</Link>
                </li>
                <li className="hover:-translate-y-2 duration-500 transition-all">
                    <Link href="/rooms">Rooms</Link>
                </li>
                <li className="hover:-translate-y-2 duration-500 transition-all">
                    <Link href="/#footer">Contacts</Link>
                </li>

            </ul>

        </header>
    )
}

export default Header 