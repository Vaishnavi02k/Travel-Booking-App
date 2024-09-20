import React, { useState } from "react";
import { Button, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/src/store";
import Image from "next/image";
import axios from "axios";
import { USER_API_ROUTES } from "@/src/Utils/api-routes";

const AuthModal = ({
    isOpen,
    onOpenChange,
}: {
    isOpen: boolean;
    onOpen?: (login:boolean) => void;
    onOpenChange: () => void;
}) => {

    const [modalType, setModalType] = useState("login");
    const router = useRouter();
    const { setUserInfo } = useAppStore();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async (onClose: () => void) => {
        const response = await axios.post(USER_API_ROUTES.SIGNUP, {
            firstName,
            lastName,
            email,
            password,
        });
        if (response.data.userInfo) {
            setUserInfo(response.data.userInfo);
            onClose();
            setEmail("");
            setPassword("");
            setFirstName("");
            setLastName("");
        }
    };

    const handleLogin = async (onClose: () => void) => {
        const response = await axios.post(USER_API_ROUTES.LOGIN, {
            email,
            password,
        });
        if (response.data.userInfo) {
            setUserInfo(response.data.userInfo);
            onClose();
            setEmail("");
            setPassword("");
            setFirstName("");
            setLastName("");
        }
    };

    const switchModalType = () => {
        if (modalType === "login") setModalType("signup");
        else setModalType("login");
    }

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop="blur"
            className="bg-opacity-25 bg-blue-500 text-white"
        >
            <ModalContent>{(onClose) => (<>
                <ModalHeader className="flex flex-col capitalize text-3xl items-center">
                    {modalType}
                </ModalHeader>
                <ModalBody className="flex flex-col items-center w-full justify-center">
                    <div className="cursor-pointer flex flex-col items-center">
                        <Image src="/logo.png" height={120} width={120} alt="logo" />
                        <span className="text-xl uppercase font-medium italic">
                            <span> Word Explorer</span>
                        </span>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        <Input
                            placeholder="Email"
                            type="email"
                            value={email}
                            defaultValue="vaishnavi@gmail.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {modalType === "signup" && (
                            <>
                                <Input
                                    placeholder="First Name"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                                <Input
                                    placeholder="Last Name"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </>
                        )}
                        <Input
                            placeholder="Password"
                            type="password"
                            value={password}
                            defaultValue="vaishu"
                            onChange={(e) => setPassword(e.target.value)}
                        />

                    </div>
                </ModalBody>
                <ModalFooter className=" flex flex-col gap-2 items-center justify-center">
                    <Button color="primary" className="w-full capitalize" onPress={() => {
                        modalType === "login" ? handleLogin(onClose) : handleSignup(onClose);
                    }}>
                        {modalType}
                    </Button>
                    {
                        modalType === "signup" && (<p>Already have an account ? &nbsp; <Link className="cursor-pointer" onClick={() => switchModalType()}>{""}Login Now</Link></p>)
                    }
                    {
                        modalType === "login" && (<p>Don{`'`}t an account ? &nbsp; <Link className="cursor-pointer" onClick={() => switchModalType()}>{""}Signup Now</Link></p>)
                    }
                </ModalFooter>
            </>
            )}
            </ModalContent>
        </Modal>
    )
}

export default AuthModal;