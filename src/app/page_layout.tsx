"use client"
import React from "react";
import { Navbar } from "../components/client/navbar";
import { Footer } from "../components/client/footer";
import { useDisclosure } from "@nextui-org/react";
import { AuthModal } from "../components/client/auth-modal";
import { usePathname } from "next/navigation";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const pathname = usePathname()
    return (
        <>
        {
            pathname.includes("/admin") ? (children) :
                (
                    <div className="relative flex flex-col" id="app-container">
                        <main className="flex flex-col relative">
                            <Navbar onOpen={onOpen} />
                            <section className="h-full flex-1">
                                {children}
                            </section>
                            <AuthModal
                                isOpen={isOpen}
                                onOpen={onOpen}
                                onOpenChange={onOpenChange} />
                            <Footer />
                        </main>
                    </div>
                )
        }
        </>
    );
};

export default PageLayout;