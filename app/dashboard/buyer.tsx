
import Giglist from "./giglist"
import { getSession } from "@/lib/auth";
export default async function buyer(){
    const session = await getSession();
    return (
        <div>
            <p>Choose any service you want to Avail</p>
            <Giglist/>
        </div>
    )
}