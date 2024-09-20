"use client"
import React from "react";
import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, NavbarBrand, NavbarContent, NavbarItem, Navbar as NextNavbar } from "@nextui-org/react";
import { useAppStore } from "@/src/store";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";


const Navbar = ({ onOpen }: { onOpen: () => void }) => {
    const router = useRouter();
    const { userInfo } = useAppStore();
    const pathname = usePathname();//current path name
    const routeWithImages = ["/", "/search-flights", "/search-hotels"];
    return (
        <NextNavbar isBordered className="min-h-[10vh] bg-blue-500 bg-opacity-50 text-white relative">
            {
                !routeWithImages.includes(pathname) && (
                    <>
                        <div className="fixed left-0 top-0 h-[10vh] wid-[100vw] overflow-hidden z-0">
                            <div className="h-[70vh] w-[100vw] absolute z-10 top-0 left-0 ">
                                <Image
                                    src="/home/home-bg.png"
                                    layout="fill"
                                    objectFit="cover"
                                    alt="Search"
                                />
                            </div>
                        </div>
                        <div className="fixed left-0 top-0 h-[10vh] w-[100vw] overflow-hidden z-0"
                            style={{
                                backdropFilter: "blur(12px) saturate(280%)",
                                WebkitBackdropFilter: "blur(12px) saturate(280%)"
                            }}></div>
                    </>
                )}
            <div className="z-10 w-full flex items-center">
                <NavbarBrand>
                    <div className="cursor-pointer flex items-center">
                        <Image src="/logo.png" height={80} width={80} alt="logo" />
                        <span className="text-xl uppercase font-medium italic">
                            <span> Word Explorer</span>
                        </span>
                    </div>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarItem isActive>
                        <Link
                            href="/"
                            className={`${pathname === "/" ? "text-blue-700" : "text-white"}`}>
                            Tours
                        </Link>
                    </NavbarItem>
                    <NavbarItem >
                        <Link href="/search-flights"
                            className={`${pathname === "/search-flights" ? "text-blue-700" : "text-white"}`}
                            aria-current="page">
                            Flights
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link
                            href="/search-hotels"
                            className={`${pathname === "/search-hotels" ? "text-blue-700" : "text-white"}`}
                        >
                            Hotels
                        </Link>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                    {
                        userInfo && <>
                            <Dropdown placement="bottom-end">
                                <DropdownTrigger>
                                    <Avatar
                                        isBordered
                                        as="button"
                                        className="transition-transform"
                                        color="primary"
                                        classNames={
                                            {
                                                base: "bg-gradient-to-br from-[#3b82f6] to-[#fff]",
                                                icon: "text-white/80",
                                            }
                                        }
                                        size="md"
                                    />
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Profile Actions" variant="flat"
                                    onAction={key => router.push(key as string)}>
                                    <DropdownItem key="profile" className="h-14 gap-2">
                                        <p className="font-semibold">Signed in as</p>
                                        <p className="font-semibold">{userInfo.email}</p>
                                    </DropdownItem>
                                    <DropdownItem key="settings">My Settings</DropdownItem>
                                    <DropdownItem key="/my-bookings">My Bookings</DropdownItem>
                                    <DropdownItem key="/wishlist">Wishlists</DropdownItem>
                                    <DropdownItem key="logout" color="danger">
                                        Log Out
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>

                        </>
                    }

                    {!userInfo && (
                        <>
                            {/* <NavbarItem className="hidden lg:flex">
                                <Button className="text-white border-white"
                                    variant="ghost"
                                    onPress={onOpen}
                                >
                                    Sign Up
                                </Button>
                            </NavbarItem> */}
                            < NavbarItem >
                                <Button color="primary"
                                    className="bg-white"
                                    variant="flat"
                                    onPress={onOpen}

                                >
                                    Login
                                </Button>
                            </NavbarItem>
                        </>)
                    }
                </NavbarContent>
            </div>
        </NextNavbar >
    )
};

export default Navbar;