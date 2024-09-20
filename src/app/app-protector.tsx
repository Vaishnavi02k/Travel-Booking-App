"use client";

import { usePathname ,useRouter} from "next/navigation";
import React, { useEffect } from "react";
import { useAppStore } from "../store";
import axios from "axios";
import { USER_API_ROUTES } from "../Utils/api-routes";

const AppProtector = () =>{
    const router=useRouter();
    const pathName=usePathname();
    const { setUserInfo,userInfo}=useAppStore();
    useEffect(()=>{
        if(!userInfo){
            const getUserInfo = async () =>{
                const response = await axios.get(USER_API_ROUTES.ME);
                if(response.data.userInfo){
                    setUserInfo(response.data.userInfo);
                }
            }
            getUserInfo()
        }
    },[userInfo,setUserInfo])
    return null;
}

export default AppProtector