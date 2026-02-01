'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { signUp } from "next-auth-sanity/client";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/libs/translations";


const defaultFormData = {
    email: '',
    name: '',
    password:'',
};

const Auth = () => {
    const [formData, setFormData] = useState(defaultFormData);
    const { t } = useTranslation();
    const inputStyles =
        "border border-gray-300 sm:text-sm rounded-lg block w-full p-2.5 focus:outlines-none";

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({...formData, [name]: value});
    };

    const {data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) router.push("/");
    }, [router, session]);

    const loginHandler = async () => {
        try{
            await signIn();
            router.push("/");
        } catch (error) {
            console.log(error);
            toast.error(t("toast.loginFailed"));
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const user = await signUp(formData);
            if (user){
                toast.success(t("toast.signUpSuccess"));
            }
        } catch(error) {
            toast.error(t("toast.somethingWrong"));
            console.log(error);
        } finally {
            setFormData(defaultFormData);
        }
    };

  return (
    <section className="container mx-auto">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8 w-80 md:w-[70%] mx-auto">
            <div className="flex mb-8 flex-col md:flex-row items-center justify-between">
                <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
                    {t("auth.createAccount")}
                </h1>
                <p>{t("auth.or")}</p>
                <span className="inline-flex items-center">
                    <FcGoogle
                    onClick={loginHandler}
                    className="text-4xl cursor-pointer text-[var(--foreground)]"/>
                </span>
            </div>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder={t("auth.namePlaceholder")}
                    required
                    className={inputStyles}
                    value = {formData.name}
                    onChange={handleInputChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder={t("auth.emailPlaceholder")}
                    required
                    className={inputStyles}
                    value = {formData.email}
                    onChange={handleInputChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder={t("auth.passwordPlaceholder")}
                    required
                    minLength={6}
                    className={inputStyles}
                    value = {formData.password}
                    onChange={handleInputChange}
                />

                <button type="submit" className="w-full bg-tertiary-dark focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    {t("auth.signUp")}
                </button>
                <button
                onClick={loginHandler}
                className="text-blue-700 underline">{t("auth.login")}</button>
            </form>
        </div>

    </section>

  )
}

export default Auth;
