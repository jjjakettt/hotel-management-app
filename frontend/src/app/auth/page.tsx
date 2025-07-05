'use client';

import { useState, ChangeEvent, FormEvent } from "react";
import { FcGoogle } from "react-icons/fc"

const defaultFormData = {
    email: '',
    name: '',
    password:'',
};

const Auth = () => {
    const [formData, setFormData] = useState(defaultFormData)
    const inputStyles = 
        "border border-gray-300 sm:text-sm rounded-lg block w-full p-2.5 focus:outlines-none";

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            console.log(formData);
        } catch(error) {
            console.log(error)
        } finally {
            setFormData(defaultFormData)
        }
    }

  return (
    <section className="container mx-auto">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8 w-80 md:w-[70%] mx-auto">
            <div className="flex mb-8 flex-col md:flex-row items-center justify-between">
                <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
                    Create an Account
                </h1>
                <p>OR</p>
                <span className="inline-flex items-center">
                    <FcGoogle className="text-4xl cursor-pointer text-black dark:text-white"/>
                </span>
            </div>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="name" 
                    placeholder="John Doe"
                    required
                    className={inputStyles}
                    value = {formData.name}
                    onChange={handleInputChange}
                /> 
                <input 
                    type="email" 
                    name="email" 
                    placeholder="name@company.com"
                    required
                    className={inputStyles}
                    value = {formData.email}
                    onChange={handleInputChange}

                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Password"
                    required
                    minLength={6}
                    className={inputStyles}
                    value = {formData.password}
                    onChange={handleInputChange}

                />

                <button type="submit" className="w-full bg-tertiary-dark focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    Sign Up
                </button>
                <button className="text-blue-700 underline">login</button>
            </form>
        </div>

    </section>

  )
}

export default Auth