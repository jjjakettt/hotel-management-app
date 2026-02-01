"use client";

import { useContext } from "react";
import LanguageContext, { Language } from "@/context/languageContext";

const translations: Record<Language, Record<string, string>> = {
    en: {
        // Header
        "brand": "Coconut Garden Villa",
        "nav.home": "Home",
        "nav.rooms": "Rooms",
        "nav.contacts": "Contacts",

        // Hero
        "hero.title": "Explore Our Exquisite Villas.",
        "hero.subtitle": "Experience an Exquisite Hotel Immersed in Rich History and Timeless Elegance.",
        "hero.cta": "Get Started",

        // Featured Room
        "featured.startFrom": "Start From",
        "featured.discount": "Discount",
        "featured.available": "Available",
        "featured.moreDetails": "More Details",

        // Search
        "search.roomType": "Room Type",
        "search.all": "All",
        "search.deluxe": "Deluxe",
        "search.premium": "Premium",
        "search.suite": "Suite",
        "search.presidential": "Presidential",
        "search.search": "Search",
        "search.placeholder": "Search...",

        // Book Room CTA
        "booking.checkin": "Check In date",
        "booking.checkout": "Check Out date",
        "booking.adults": "Adults",
        "booking.children": "Children",
        "booking.rooms": "Rooms",
        "booking.availability": "Availability",
        "booking.available": "available",
        "booking.of": "of",
        "booking.noRooms": "No rooms available for selected dates",
        "booking.totalPrice": "Total Price",
        "booking.room": "room",
        "booking.rooms_plural": "rooms",
        "booking.day": "day",
        "booking.days": "days",
        "booking.fullyBooked": "Fully Booked",
        "booking.bookNow": "Book Now",
        "booking.discount": "discount",
        "booking.now": "Now",
        "booking.perNight": "per night",

        // Newsletter
        "newsletter.explore": "Explore More About Our Hotel",
        "newsletter.signup": "Sign Up for Our Newsletter",
        "newsletter.placeholder": "Your email",
        "newsletter.subscribe": "Subscribe",

        // Footer
        "footer.brand": "Coconut Garden Villas",
        "footer.contact": "Contact",
        "footer.findUs": "Find Us",
        "footer.ourStory": "Our Story",
        "footer.getInTouch": "Get in Touch",
        "footer.privacy": "Our Privacy Commitment",
        "footer.terms": "Terms of Service",
        "footer.customerAssistance": "Customer Assistance",

        // Auth
        "auth.createAccount": "Create an Account",
        "auth.or": "OR",
        "auth.signUp": "Sign Up",
        "auth.login": "login",
        "auth.namePlaceholder": "John Doe",
        "auth.emailPlaceholder": "name@company.com",
        "auth.passwordPlaceholder": "Password",

        // User Page
        "user.hello": "Hello",
        "user.about": "About",
        "user.signOut": "Sign Out",
        "user.joinedIn": "Joined In",
        "user.currentBookings": "Current Bookings",
        "user.amountSpent": "Amount Spent",

        // Table
        "table.roomName": "Room name",
        "table.unitPrice": "Unit Price",
        "table.price": "Price",
        "table.discount": "Discount",
        "table.daysBooked": "No. Days Booked",
        "table.quantity": "Quantity",
        "table.rate": "Rate",

        // Rating Modal
        "rating.title": "Rate Your Experience",
        "rating.rating": "Rating",
        "rating.reviewText": "Review Text",
        "rating.submit": "Submit",
        "rating.submitting": "Submitting",
        "rating.cancel": "Cancel",

        // Room Detail
        "room.description": "Description",
        "room.offeredAmenities": "Offered Amenities",
        "room.safetyHygiene": "Safety And Hygiene",
        "room.dailyCleaning": "Daily Cleaning",
        "room.fireExtinguishers": "Fire Extinguishers",
        "room.disinfections": "Disinfections and Sterilizations",
        "room.smokeDetectors": "Smoke Detectors",
        "room.customerReviews": "Customer Reviews",
        "room.available": "available",

        // Toast messages
        "toast.loginRequired": "Please login before booking a room.",
        "toast.provideDates": "Please provide checkin / checkout dates.",
        "toast.invalidDates": "Please choose a valid checkin period.",
        "toast.creatingBooking": "Creating your booking...",
        "toast.bookingConfirmed": "Booking confirmed! Payment will be collected at reception.",
        "toast.bookingFailed": "Failed to create booking. Please try again.",
        "toast.loginFailed": "Login Unsuccessful.",
        "toast.signUpSuccess": "Sign Up Successful. Please Sign In.",
        "toast.somethingWrong": "Something went wrong.",
        "toast.reviewSubmitted": "Review Submitted",
        "toast.reviewFailed": "Review Failed",
        "toast.provideRating": "Please provide a rating text and a rating",
    },
    vi: {
        // Header
        "brand": "Coconut Garden Villa",
        "nav.home": "Trang ch\u1EE7",
        "nav.rooms": "Ph\u00F2ng",
        "nav.contacts": "Li\u00EAn h\u1EC7",

        // Hero
        "hero.title": "Kh\u00E1m Ph\u00E1 Bi\u1EC7t Th\u1EF1 Tuy\u1EC7t \u0110\u1EB9p.",
        "hero.subtitle": "Tr\u1EA3i Nghi\u1EC7m Kh\u00E1ch S\u1EA1n Sang Tr\u1ECDng V\u1EDBi L\u1ECBch S\u1EED Phong Ph\u00FA V\u00E0 V\u1EBB \u0110\u1EB9p V\u01B0\u1EE3t Th\u1EDDi Gian.",
        "hero.cta": "B\u1EAFt \u0110\u1EA7u",

        // Featured Room
        "featured.startFrom": "Gi\u00E1 t\u1EEB",
        "featured.discount": "Gi\u1EA3m gi\u00E1",
        "featured.available": "C\u00F2n tr\u1ED1ng",
        "featured.moreDetails": "Chi ti\u1EBFt",

        // Search
        "search.roomType": "Lo\u1EA1i ph\u00F2ng",
        "search.all": "T\u1EA5t c\u1EA3",
        "search.deluxe": "Cao c\u1EA5p",
        "search.premium": "H\u1EA1ng sang",
        "search.suite": "Suite",
        "search.presidential": "T\u1ED5ng th\u1ED1ng",
        "search.search": "T\u00ECm ki\u1EBFm",
        "search.placeholder": "T\u00ECm ki\u1EBFm...",

        // Book Room CTA
        "booking.checkin": "Ng\u00E0y nh\u1EADn ph\u00F2ng",
        "booking.checkout": "Ng\u00E0y tr\u1EA3 ph\u00F2ng",
        "booking.adults": "Ng\u01B0\u1EDDi l\u1EDBn",
        "booking.children": "Tr\u1EBB em",
        "booking.rooms": "Ph\u00F2ng",
        "booking.availability": "T\u00ECnh tr\u1EA1ng",
        "booking.available": "c\u00F2n tr\u1ED1ng",
        "booking.of": "trong",
        "booking.noRooms": "Kh\u00F4ng c\u00F2n ph\u00F2ng tr\u1ED1ng cho ng\u00E0y \u0111\u00E3 ch\u1ECDn",
        "booking.totalPrice": "T\u1ED5ng gi\u00E1",
        "booking.room": "ph\u00F2ng",
        "booking.rooms_plural": "ph\u00F2ng",
        "booking.day": "ng\u00E0y",
        "booking.days": "ng\u00E0y",
        "booking.fullyBooked": "\u0110\u00E3 \u0111\u1EA7y",
        "booking.bookNow": "\u0110\u1EB7t ngay",
        "booking.discount": "gi\u1EA3m gi\u00E1",
        "booking.now": "C\u00F2n",
        "booking.perNight": "m\u1ED7i \u0111\u00EAm",

        // Newsletter
        "newsletter.explore": "Kh\u00E1m Ph\u00E1 Th\u00EAm V\u1EC1 Kh\u00E1ch S\u1EA1n",
        "newsletter.signup": "\u0110\u0103ng K\u00FD Nh\u1EADn B\u1EA3n Tin",
        "newsletter.placeholder": "Email c\u1EE7a b\u1EA1n",
        "newsletter.subscribe": "\u0110\u0103ng k\u00FD",

        // Footer
        "footer.brand": "Coconut Garden Villas",
        "footer.contact": "Li\u00EAn h\u1EC7",
        "footer.findUs": "T\u00ECm ch\u00FAng t\u00F4i",
        "footer.ourStory": "C\u00E2u chuy\u1EC7n c\u1EE7a ch\u00FAng t\u00F4i",
        "footer.getInTouch": "Li\u00EAn l\u1EA1c",
        "footer.privacy": "Cam k\u1EBFt b\u1EA3o m\u1EADt",
        "footer.terms": "\u0110i\u1EC1u kho\u1EA3n d\u1ECBch v\u1EE5",
        "footer.customerAssistance": "H\u1ED7 tr\u1EE3 kh\u00E1ch h\u00E0ng",

        // Auth
        "auth.createAccount": "T\u1EA1o T\u00E0i Kho\u1EA3n",
        "auth.or": "HO\u1EB6C",
        "auth.signUp": "\u0110\u0103ng k\u00FD",
        "auth.login": "\u0111\u0103ng nh\u1EADp",
        "auth.namePlaceholder": "Nguy\u1EC5n V\u0103n A",
        "auth.emailPlaceholder": "ten@congty.com",
        "auth.passwordPlaceholder": "M\u1EADt kh\u1EA9u",

        // User Page
        "user.hello": "Xin ch\u00E0o",
        "user.about": "Gi\u1EDBi thi\u1EC7u",
        "user.signOut": "\u0110\u0103ng xu\u1EA5t",
        "user.joinedIn": "Tham gia ng\u00E0y",
        "user.currentBookings": "\u0110\u1EB7t ph\u00F2ng hi\u1EC7n t\u1EA1i",
        "user.amountSpent": "S\u1ED1 ti\u1EC1n \u0111\u00E3 chi",

        // Table
        "table.roomName": "T\u00EAn ph\u00F2ng",
        "table.unitPrice": "\u0110\u01A1n gi\u00E1",
        "table.price": "Gi\u00E1",
        "table.discount": "Gi\u1EA3m gi\u00E1",
        "table.daysBooked": "S\u1ED1 ng\u00E0y",
        "table.quantity": "S\u1ED1 l\u01B0\u1EE3ng",
        "table.rate": "\u0110\u00E1nh gi\u00E1",

        // Rating Modal
        "rating.title": "\u0110\u00E1nh Gi\u00E1 Tr\u1EA3i Nghi\u1EC7m",
        "rating.rating": "\u0110\u00E1nh gi\u00E1",
        "rating.reviewText": "N\u1ED9i dung \u0111\u00E1nh gi\u00E1",
        "rating.submit": "G\u1EEDi",
        "rating.submitting": "\u0110ang g\u1EEDi",
        "rating.cancel": "H\u1EE7y",

        // Room Detail
        "room.description": "M\u00F4 t\u1EA3",
        "room.offeredAmenities": "Ti\u1EC7n nghi",
        "room.safetyHygiene": "An to\u00E0n v\u00E0 V\u1EC7 sinh",
        "room.dailyCleaning": "D\u1ECDn ph\u00F2ng h\u00E0ng ng\u00E0y",
        "room.fireExtinguishers": "B\u00ECnh ch\u1EEFa ch\u00E1y",
        "room.disinfections": "Kh\u1EED tr\u00F9ng v\u00E0 Ti\u1EC7t tr\u00F9ng",
        "room.smokeDetectors": "\u0110\u1EA7u b\u00E1o kh\u00F3i",
        "room.customerReviews": "\u0110\u00E1nh gi\u00E1 c\u1EE7a kh\u00E1ch",
        "room.available": "c\u00F2n tr\u1ED1ng",

        // Toast messages
        "toast.loginRequired": "Vui l\u00F2ng \u0111\u0103ng nh\u1EADp tr\u01B0\u1EDBc khi \u0111\u1EB7t ph\u00F2ng.",
        "toast.provideDates": "Vui l\u00F2ng ch\u1ECDn ng\u00E0y nh\u1EADn / tr\u1EA3 ph\u00F2ng.",
        "toast.invalidDates": "Vui l\u00F2ng ch\u1ECDn th\u1EDDi gian h\u1EE3p l\u1EC7.",
        "toast.creatingBooking": "\u0110ang t\u1EA1o \u0111\u1EB7t ph\u00F2ng...",
        "toast.bookingConfirmed": "\u0110\u1EB7t ph\u00F2ng th\u00E0nh c\u00F4ng! Thanh to\u00E1n t\u1EA1i l\u1EC5 t\u00E2n.",
        "toast.bookingFailed": "\u0110\u1EB7t ph\u00F2ng th\u1EA5t b\u1EA1i. Vui l\u00F2ng th\u1EED l\u1EA1i.",
        "toast.loginFailed": "\u0110\u0103ng nh\u1EADp th\u1EA5t b\u1EA1i.",
        "toast.signUpSuccess": "\u0110\u0103ng k\u00FD th\u00E0nh c\u00F4ng. Vui l\u00F2ng \u0111\u0103ng nh\u1EADp.",
        "toast.somethingWrong": "\u0110\u00E3 x\u1EA3y ra l\u1ED7i.",
        "toast.reviewSubmitted": "\u0110\u00E3 g\u1EEDi \u0111\u00E1nh gi\u00E1",
        "toast.reviewFailed": "G\u1EEDi \u0111\u00E1nh gi\u00E1 th\u1EA5t b\u1EA1i",
        "toast.provideRating": "Vui l\u00F2ng nh\u1EADp n\u1ED9i dung v\u00E0 \u0111i\u1EC3m \u0111\u00E1nh gi\u00E1",
    },
};

export function useTranslation() {
    const { language } = useContext(LanguageContext);
    const t = (key: string): string => {
        return translations[language][key] ?? translations["en"][key] ?? key;
    };
    return { t, language };
}
