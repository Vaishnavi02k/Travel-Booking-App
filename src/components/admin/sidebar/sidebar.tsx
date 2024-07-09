"use client"
import React, { useState } from "react";
import { Sidebar as ReactProSideBar, Menu, MenuItem, sidebarClasses } from "react-pro-sidebar";
import { Architects_Daughter } from "next/font/google";
import Image from "next/image";

import { BiSolidCategory } from "react-icons/bi";
import { FaBookOpen, FaHome, FaHotel } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import { MdOutlineDataUsage } from "react-icons/md";
import { useRouter } from "next/navigation";

const ArchitectsDaughter = Architects_Daughter({
    weight: "400",
    style: "normal",
    subsets: ["latin"],
});

const Sidebar = () => {
    const [selectedItem, setSelectedItem] = useState("/admin/dashboard");

    const router = useRouter();
    const menuItems = [
        { label: "Dashboard", icon: <FaHome />, link: "/admin/dashboard" },
        {
            label: "Trips",
            icon: <BiSolidCategory />,
            link: "/admin/trips",
        },
        {
            label: "Hotels",
            icon: <FaHotel />,
            link: "/admin/hotels",
        },
        { label: "Booking", icon: <FaBookOpen />, link: "/adminbooking" },
        {
            label: "Scrape Data",
            icon: <MdOutlineDataUsage />,
            link: "/admin/scrape-data",
        },
    ];

    const handleItemClick = (link: string) => {
        setSelectedItem(link);
        router.push(link);
    }

    return (
        <div className="min-h-[100vh] overflow-hidden">
            <ReactProSideBar className="h-full overflow-hidden" rootStyles={{
                [`${sidebarClasses.container}`]: {
                    backgroundColor: "#ffffff",
                    "&:hover": {
                        backgroundColor: "#ffffff"
                    },
                },
            }}
            >
                <Menu className="h-[100vh] max-h-[100vh] text-black overflow-hidden" menuItemStyles={{
                    button: ({ level, active }) => {
                        return {
                            backgroundColor: active ? "#0E1428" : "#ffffff",
                            color: active ? "#ffffff" : "#000000",
                            "&:hover": {
                                backgroundColor: "#0E1428",
                                color:"#ffffff",
                            }
                        };
                    },
                }}>
                    <div className="flex items-center justify-center my-10 flex-col">
                        <Image src="/logo.png"
                            alt="logo"
                            height={150}
                            width={150} className="cursor-pointer"
                            onClick={() => router.push("/admin/dashboard")} />
                        <span className="text-3xl uppercase font-medium italic">
                            <span> Word Explorer</span>
                        </span>
                    </div>
                    {
                        menuItems.map((item, index) => (
                            <React.Fragment key={index}>
                                <MenuItem icon={item.icon}
                                    active={selectedItem === item.link} onClick={() => handleItemClick(item.link)}>
                                    {item.label}
                                </MenuItem>
                            </React.Fragment>
                        ))
                    }
                    <MenuItem icon={<LuLogOut />} active={selectedItem === "/admin/logout"} onClick={() => handleItemClick("/admin/logout")} >LogOut</MenuItem>
                </Menu>
            </ReactProSideBar>
        </div>
    );
};

export default Sidebar;