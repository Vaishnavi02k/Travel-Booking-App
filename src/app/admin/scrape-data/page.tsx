"use client"
import { ScrapingQueue } from "@/src/components/admin/scraping-queue";
import { apiClient } from "@/src/lib";
import { ADMIN_API_ROUTES } from "@/src/Utils";
import { Card, CardBody, CardFooter, Input, Tabs, Tab, Listbox, ListboxItem, Button } from "@nextui-org/react";
import axios from "axios";
import React, { useActionState, useEffect, useState } from "react";
import { CurrentlyScrappingTable } from "./components/currently-scrapping-table";

const ScrapeData = () => {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState<undefined | string>(
        undefined
    );
    const [jobs, setJobs] = useState([])
    const SearchCities = async (searchString: string) => {
        const response = await axios.get(`https://secure.geonames.org/searchJSON?q=${searchString}&maxRows=4&username=vaishnavi&style=SHORT`);
        const parsed = response.data?.geonames;
        setCities(parsed?.map((city: { name: string }) => city.name) ?? []);
    };

    const startScraping = async () => {
        await axios.post(ADMIN_API_ROUTES.CREATE_JOB, {
            url: `https://packages.yatra.com/holidays/intl/search.htm?destination=${selectedCity}`,
            jobType: { type: "location" },
        });
    };

    useEffect(() => {
        const getData = async () => {
            const data = await axios.get(ADMIN_API_ROUTES.JOB_DETAILS);
            setJobs(data.data.jobs);
        }
        const interval = setInterval(() => getData(), 3000);

        return () => {
            clearInterval(interval);
        };
    }, []);


    return (
        <section className="m-5 grid grid-cols-3 gap-5">
            <Card className="col-span-2">
                <CardBody>
                    <Tabs>
                        <Tab key="location" title="Location">
                            <Input type="text" label="Search for a loaction" onChange={(e) => SearchCities(e.target.value)}></Input>
                            <div className="w-full min-h-[220px] max-w-[260px] px-1 py-1 rounded-small border-default-100 mt-5 border" >
                                <Listbox onAction={(key) => setSelectedCity(key as string)}>
                                    {
                                        cities.map(city => <ListboxItem key={city} color="primary" className="text-primary-500" >{city}</ListboxItem>)
                                    }

                                </Listbox>
                            </div>
                        </Tab>
                    </Tabs>
                </CardBody>
                <CardFooter className="flex flex-col gap-5">
                    <div>
                        {selectedCity && (
                            <h1 className=" text-xl">Scrape data for {selectedCity}</h1>
                        )}
                    </div>
                    <Button size="lg" className="w-full" color="primary" onClick={startScraping}>Scrape</Button>
                </CardFooter>
            </Card>
            <ScrapingQueue />
            <div className="col-span-3">
                <CurrentlyScrappingTable jobs={jobs} />
            </div>

        </section >
    );
};

export default ScrapeData;