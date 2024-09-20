"use client"
import { url } from "inspector";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaTwitter, FaX } from "react-icons/fa6";

const Footer = () => {
    const router = useRouter();
    return (
        <footer className="min-h-[20vh] px-48 py-10 relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/home/home-bg.png')" }}>
            <div className="absolute inset-0 bg-white bg-opacity-30 backdrop-blur-2xl"></div>
            <div className="relative z-10 p-4 grid grid-cols-4 gap-20 text-white">
                <div>
                    <div className="cursor-pointer" onClick={() => router.push("/")}>
                        <Image src="/logo.png"
                            alt="logo"
                            height={80}
                            width={80} />
                        <span className="text-xl uppercase font-medium italic">
                            <span> Word Explorer</span>
                        </span>
                    </div>
                    <p>
                    Explore handpicked tours with our easy-to-use travel app. Quickly find, compare, and book flights, hotels, and tours for your next adventure. 
                    Powered by Next.js.
                    </p>
                </div>
                <div className="flex flex-col gap-3 pt-10">
                    <h3 className="text-3xl font-medium">Destination</h3>
                    <ul className="flex flex-col gap-1">
                        <li className="cursor-pointer">India</li>
                        <li className="cursor-pointer">France</li>
                        <li className="cursor-pointer">USA</li>
                        <li className="cursor-pointer"> United Kingdom</li>
                    </ul>
                </div>
                <div className="flex flex-col gap-3 pt-10">
                    <h3 className="text-3xl font-medium">Adventures</h3>
                    <ul className="flex flex-col gap-1">
                        <li className="cursor-pointer">Water Sports</li>
                        <li className="cursor-pointer">In the Air</li>
                        <li className="cursor-pointer">Nature and Wildlife</li>
                        <li className="cursor-pointer">Winter Sports</li>
                        <li className="cursor-pointer">Extreme</li>
                    </ul>
                </div>
                <div className="flex flex-col gap-3 pt-10">
                <h3 className="text-3xl font-medium ">Get in Touch</h3>
                    <ul className="flex gap-5  mt-5">
                        <li className=" bg-opacity-30 text-3xl p-3 cursor-pointer">
                            <FaFacebook/>
                        </li>
                        <li className=" bg-opacity-30 text-3xl p-3 cursor-pointer">
                            <FaInstagram/>
                        </li>
                        <li className=" bg-opacity-30 text-3xl p-3 cursor-pointer">
                            <FaLinkedin/>
                        </li>
                        {/* <li className="bg-purple-500 bg-opacity-30 text-purple-500 text-3xl p-3 cursor-pointer">
                            <Fa/>
                        </li> */}
                    </ul>
                </div>
            </div>
        </footer >
    )
}

export default Footer;