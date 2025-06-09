import { IRegister, IResendCode, IVerifyAccount } from "@/types/auth.type";
import { sendRequest } from "@/utils/api";


const AUTH_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auths`

const postAuthRegister = async (data: IRegister): Promise<IBackendRes<IRegister>> => {
    const { name, username, email, password } = data;
    const response = await  sendRequest<IBackendRes<IRegister>>({
        url: `${AUTH_BASE_URL}/register`,
        method: "POST",
        body: {
            name,
            username,
            email,
            password
        }
    })
    return response
}

const postAuthVerifyAccount = async (data: IVerifyAccount): Promise<IBackendRes<IVerifyAccount>> => {
    const response = await  sendRequest<IBackendRes<IVerifyAccount>>({
        url: `${AUTH_BASE_URL}/verify`,
        method: "POST",
        body: {
            id: data.id,
            code: data.code
        }
    })
    return response
}
const postResendCode = async (data: IResendCode): Promise<IBackendRes<IResendCode>> =>{
    const {username, email} = data;
    const response = await sendRequest<IBackendRes<IResendCode>>({
        url: `${AUTH_BASE_URL}/resend-active-code`,
        method: "POST",
        body: {
            username,
            email,
        }        
    })
    return response
} 
export {postAuthRegister, postAuthVerifyAccount, postResendCode}