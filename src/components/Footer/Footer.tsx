import Link from "next/link"
import { BiMessageDetail } from "react-icons/bi"
import { BsFillSendFill, BsTelephoneOutbound } from "react-icons/bs"

/**
 * Footer component
 *
 * Renders the bottom section including:
 * - Brand link
 * - Contact heading and methods (email, phone, message)
 * - Two groups of navigation links
 * - Bottom brand bar
 *
 * Uses Tailwind CSS utilities for layout, spacing, typography, and colors.
 */
const Footer = () => {
    return (
        <footer id = "footer" className="mt-16">
            <div className="container mx-auto px-4">
                <Link href="/" className="font-black text-tertiary-dark">
                    Coconut Garden Villas
                </Link>

                <h4 className="font-semibold text-[40px] py-6">Contact</h4>
                <div className="flex flex-wrap gap-16 items-center justify-between">
                    <div className="flex-1">
                        <p>ADDRESS HERE</p>
                        <div className="flex items-center py-4">
                            <BsFillSendFill/>
                            <p className="ml-2">EMAIL HERE</p>
                        </div>

                        <div className="flex items-center">
                            <BsTelephoneOutbound/>
                            <p className="ml-2">TELEPHONE NUMBER HERE</p>
                        </div>

                        <div className="flex items-center">
                            <BiMessageDetail/>
                            <p className="ml-2">MESSAGE HERE</p>
                        </div>
                    </div>

                    <div className="flex-1 md:text-right">
                        <p className="pb-4">Our Story</p>
                        <p className="pb-4">Get in Touch</p>
                        <p className="pb-4">Our Privacy Commitment</p>
                        <p className="pb-4">Terms of Service</p>
                        <p>Customer Assistance</p>
                    </div>
      
                    <div className="flex-1 md:text-right">
                        <p className="pb-4">Dining Experience</p>
                        <p className="pb-4">Wellness</p>
                        <p className="pb-4">Fitness</p>
                        <p className="pb-4">Sports</p>
                        <p>Events</p>
                    </div>
                </div>
            </div>
            <div className="bg-tertiary-light h-10 md:h-[70px] mt-16 w-full bottom-0 left-0"></div>
        </footer>
    )
}

export default Footer