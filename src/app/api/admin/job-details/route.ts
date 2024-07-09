import { NextResponse } from "next/server";
import {prisma} from "@/src/lib"

export async function GET() {
    try{
        const jobs = await prisma.jobs.findMany({orderBy:{createdAt:"desc"}});
        const onGoingJobs = await prisma.jobs.findMany({
            where:{isComplete:false},
        });
        return NextResponse.json({
            jobs, onGoingJobs:onGoingJobs?.length ?? 0
        },{status:200});
    }
    catch(error){
        return NextResponse.json (
            { message: "An unexpected eroor occured." },
            { status: 500 }
        );
    };
}