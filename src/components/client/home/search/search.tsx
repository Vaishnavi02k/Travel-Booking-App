import { Button, Input, Listbox, ListboxItem } from "@nextui-org/react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaCalendarAlt, FaSearch } from "react-icons/fa";

const Search = () => {
    const router = useRouter();

    const [searchLocation, setSearchLocation] = useState("");
    const [dates, setDates] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });

    const [cities, setCities] = useState([]);

    const handleSearch = () => {
        if (searchLocation && dates) {
            router.push(`/trips?city=${searchLocation}&dates=${dates}`);
        }
    }

    const searchCities = async (searchQuery: string) => {
        const response = await axios.get(`https://secure.geonames.org/searchJSON?q=${searchQuery}&maxRows=4&username=vaishnavi&style=SHORT`);
        const parsed = response.data?.geonames;
        setCities(parsed?.map((city: { name: string }) => city.name) ?? []);
    }

    const activities = [
        { name: "Sea & Sailing", icon: "/home/ship.svg" },
        { name: "Trekking Tours", icon: "/home/hiking.svg" },
        { name: "City Tours", icon: "/home/trolley-bag.svg" },
        { name: "Motor Sports", icon: "/home/motor-boat.svg" },
        { name: "Jungle Safari", icon: "/home/cedar.svg" },
    ];

    return (
        <div className="h-[90vh] flex items-center justify-center">
            {/* removed absolute from below classname */}
            <div className="left-0 top-0 h-[100vh] width-[100vw] max-w-[100vw] overflow-hidden">
                <Image src="/home/home-bg.png" fill alt="Search" />
            </div>
            <div className="absolute h-[50vh] w-[60vw] flex flex-col gap-5 ">
                <div className="text-white text-center flex flex-col gap-5 p-5 backdrop-blur-3xl">
                    <h3 className="text-xl textfont-bold">Discover the best tours tailored just for you. </h3>
                    <h2 className="text-6xl  font-extrabold"> Explore exotic destinations.</h2>
                </div>
                <div className="grid grid-cols-3 gap-5 p-5 rounded-xl">
                    <Input
                        color="danger"
                        variant="bordered"
                        className="text-white placeholder:text-white relative backdrop-blur-3xl"
                        startContent={<FaSearch />}
                        placeholder="Search Location"
                        classNames={{
                            input: ["placeholder:text-white"],
                        }}
                        value={searchLocation}
                        onChange={e => {
                            setSearchLocation(e.target.value);
                            searchCities(e.target.value);
                        }}
                    />
                    {
                        cities.length > 0 &&
                        <div className="w-full min-h-[200px] max-w-[280px] border-small rounded-sm mt-11 border-white absolute z-20 backdrop-blur-lg">
                            <div className="bg-cover bg-center bg-no-repeat relative min-h-[200px] h-full w-full px-1 py-2 rounded-sm"
                            style={{
                                backgroundImage:'url("/home/home-bg.png")',
                            }}>
                                <div className="absolute inset-0 bg-white bg-opacity-30 backdrop-blur-md rounded-sm"></div>
                                <Listbox className="rounded-sm" onAction={(key) => {
                                    setSearchLocation(key as string);
                                    setCities([]);
                                }}
                                >
                                    {cities.map((city) => (
                                        <ListboxItem key={city} color="danger" className="text-white">
                                            {city}
                                        </ListboxItem>

                                    ))}
                                </Listbox>
                            </div>
                        </div>
                    }
                    <Input
                        type="date"
                        color="danger"
                        variant="bordered"
                        className="text-white accent-white backdrop-blur-3xl"
                        startContent={<FaCalendarAlt />}
                        placeholder="Dates"
                        classNames={{
                            input: ["placeholder:text-white"],
                        }}
                    />
                    <Button size="lg" className="h-full cursor-pointer" color="danger" variant="shadow" onPress={handleSearch}>Search</Button>
                </div>
                <div>
                    <ul className="text-white grid grid-cols-5 mt-5">
                        {activities.map((activity) => (
                            <li className="flex items-center justify-center gap-5 flex-col cursor-pointer"
                                key={activity.name}>
                                <div className="p-5 bg-white bg-opacity-20 backdrop-blur-lg border rounded-full hover:bg-opacity-40 transition-all duration-300">
                                    <div className="relative h-12 w-12">
                                        <Image src={activity.icon} fill alt="Activity" />
                                    </div>
                                </div>
                                <span className="text-lg font-medium text-white backdrop-blur-lg">{activity.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Search;