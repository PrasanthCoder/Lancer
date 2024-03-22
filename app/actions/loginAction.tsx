'use server'

import dbconnect from "../../lib/bdconnect"
import User from "../../models/User"
import { redirect } from 'next/navigation';
import {login} from "@/lib/auth";

export async function LoginAction(prevState: any, userdata: FormData){
    await dbconnect();
    const rawFormData = {
        email: userdata.get('email')?.toString(),
        password: userdata.get('password')?.toString(),
    }
    const userExist = await User.findOne({email: rawFormData.email});
    
    if(userExist && userExist.password === rawFormData.password){
        userdata.append("id", userExist._id);
        await login(userdata);
        redirect("../dashboard");   
    }
    else{
        console.log("Email or password are incorrect");
        return {
            message: 'Please enter a valid email and password',
        }
    }

}