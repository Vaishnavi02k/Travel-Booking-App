import { UserType } from "@/src/types/user";
import { userInfo } from "os";
import { StateCreator } from "zustand";

export interface AuthSlice{
    userInfo:undefined | UserType;
    setUserInfo:(userInfo:UserType)=>void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) =>({
    userInfo:undefined,
    setUserInfo: (userInfo:UserType) => set({userInfo}),
})