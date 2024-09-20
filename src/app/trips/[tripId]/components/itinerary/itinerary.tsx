import { DetailedItineraryType } from "@/src/types/trips";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import React from "react";

const Itinerary = ({ data }: { data: DetailedItineraryType[] }) => {
    return (
        <div>
            <div className="flex flex-col gap-10 justify-center mt-10 relative ">
                {
                    data.map((dt, index) => {
                        return <div key={dt.title} className="grid grid-cols-4 z-30">
                            <div className="flex items-start justify-center z-20">
                                <div className="flex h-[90px] w-[90px] bg-white items-center justify-center rounded-full border-3 border-dotted border-blue-500 z-20">
                                    <div className="h-[80px] w-[80px] bg-blue-500 rounded-full items-center justify-center flex z-20">
                                        <h1 className="text-white font-medium text-xl">Day {index + 1}</h1>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-3 ml-5" >
                                <Card className="text-blue-text-title p-5 ">
                                    <CardHeader>
                                        <h1 className="font-semibold">{dt.title}</h1>
                                    </CardHeader>
                                    <CardBody>
                                        <h2>{dt.value}</h2>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    })
                }
                <div className="h-[95%] w-[5px] absolute left-[12.5%] top-12 bg-blue-200 z-10"></div>
            </div>
        </div>
    )
}

export default Itinerary;