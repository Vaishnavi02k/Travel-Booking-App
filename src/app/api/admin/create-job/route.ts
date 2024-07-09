import { NextResponse } from "next/server";
import { prisma } from "@/src/lib";

export async function POST(request:Request) {
    try{
        const {url,jobType} = await request.json();
        const response = await prisma.jobs.create({data:{url,jobType}});

        return NextResponse.json({jobCreated:true},{status:201})
    }
    catch(error){
        return NextResponse.json (
            { message: "An unexpected eroor occured." },
            { status: 500 }
        );
    }
    
}