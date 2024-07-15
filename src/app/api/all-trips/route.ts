import { NextResponse } from "next/server";
import {prisma} from "@/src/lib"

export async function GET() {
    try{
       const trips= await prisma.trips.findMany({
        orderBy:{scrappedOn:"desc"}
       });
       if(trips) return NextResponse.json({trips},{status:200});
        else return NextResponse.json({msg:"No trips found"},{status:404});
    }
    catch(error){
        return NextResponse.json(
            {message:"An unexpected error occured"},
            {status:500}
        );
    }
}