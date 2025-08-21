import Link from "next/link"
import { BiMessageDetail } from "react-icons/bi"
import { BsFillSendFill, BsTelephoneOutbound } from "react-icons/bs"

/**
 * Footer component
 *
 * Renders the bottom section including:
 * - Brand link
 * - Contact heading and methods (email, phone, message)
 * - Bottom brand bar
 * - A map showing the hotel's location
 *
 * Uses Tailwind CSS utilities for layout, spacing, typography, and colors.
 */
const Footer = () => {

    const MAP_EMBED_SRC = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105488.9622627596!2d107.99995157834294!3d10.83500279539904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31742b8ca43f4b0b%3A0x4cf0739a58765649!2zVmlsbGEgVsaw4budbiBE4burYSAvIENvY29udXQgR2FyZGVuIFZpbGxh!5e1!3m2!1sen!2s!4v1755804145032!5m2!1sen!2s";
    return (
        <footer id = "footer" className="mt-16">
            <div className="container mx-auto px-4">
                <Link href="/" className="font-black text-tertiary-dark">
                    Coconut Garden Villas
                </Link>

                <div className="grid gap-12 md:grid-cols-4 items-start mt-6">
                {/* Contact + Links */}
                    <div className="min-h-[20rem] flex flex-col md:col-span-3">
                        <h4 className="font-semibold text-[40px] py-6">Contact</h4>
                        <div className="grid gap-8 md:grid-cols-2">
                            {/* Contact details */}
                            <div>
                                <p>
                                    219 Lạc Long Quân, Tiến Thành, Thành phố Phan Thiết, Bình
                                    Thuận, Vietnam
                                </p>
                                <div className="flex items-center py-4">
                                    <BsFillSendFill />
                                    <p className="ml-2">coconutgardenvilla@gmail.com</p>
                                </div>
                                <div className="flex items-center">
                                    <BsTelephoneOutbound />
                                    <p className="ml-2">TELEPHONE NUMBER HERE</p>
                                </div>
                                <div className="flex items-center">
                                    <BiMessageDetail />
                                    <p className="ml-2">MESSAGE HERE</p>
                                </div>
                            </div>

                            {/* Quick links */}
                            <div className="md:text-right">
                                <p className="pb-4">Our Story</p>
                                <p className="pb-4">Get in Touch</p>
                                <p className="pb-4">Our Privacy Commitment</p>
                                <p className="pb-4">Terms of Service</p>
                                <p>Customer Assistance</p>
                            </div>
                            {/* <div className='flex-1 md:text-right'>
                                <p className='pb-4'>Dining Experience</p>
                                <p className='pb-4'>Wellness</p>
                                <p className='pb-4'>Fitness</p>
                                <p className='pb-4'>Sports</p>
                                <p>Events</p>
                            </div> */}
                        </div>
                    </div>
                    {/* Map */}
                    <div className="min-h-[20rem] flex flex-col md:col-span-1">
                        <h4 className="font-semibold text-[40px] py-6 md:text-right">Find Us</h4>
                        <div className="w-full h-50 rounded-lg overflow-hidden">
                            <iframe
                                title="Hotel location map"
                                src={MAP_EMBED_SRC}
                                width="100%"
                                height="100%"
                                style={{ border: 0, pointerEvents: 'auto'}}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-tertiary-light h-10 md:h-[70px] mt-16 w-full bottom-0 left-0"></div>
        </footer>
    )
}

export default Footer
