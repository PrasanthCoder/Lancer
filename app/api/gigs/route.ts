import { NextResponse, NextRequest}from "next/server";
import dbconnect from "@/lib/bdconnect";
import Gig from "@/models/Gig";
import { getSession } from "@/lib/auth";
export const GET = async (request: NextRequest) => {
    const session = await getSession();
    if(session){
        try {
            await dbconnect();
            const gigs = await Gig.find();
            return new NextResponse(JSON.stringify(gigs), {status: 200});
        } catch(error) {
            return new NextResponse("Error in fetching users " + error, {status: 500});
        }
    }
    else{
        return NextResponse.redirect(new URL('/login', request.url));
    }
}