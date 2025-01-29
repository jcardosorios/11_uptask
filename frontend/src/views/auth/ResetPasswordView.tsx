import NewPasswordForm from "@/components/auth/NewPasswordForm"
import NewPasswordToken from "@/components/auth/NewPasswordToken"
import { ConfirmToken } from "@/types/index"
import { useState } from "react"

export default function ResetPasswordView() {
  const [ token, setToken ] = useState<ConfirmToken['token']>('') 
  const [isValidToken, setIsValidToken] = useState(false)

  
  return (
    <>
      <h1 className="text-5xl font-black text-white">Reset password</h1>
      <p className="text-2xl font-light text-white mt-5">
          Enter the code you received {''}
          <span className=" text-fuchsia-500 font-bold"> via email</span>
      </p>
      { !isValidToken ? (
        <NewPasswordToken
          token={token}
          setToken={setToken}
          setIsValidToken={setIsValidToken}
        />) : (<NewPasswordForm 
          token={token}
        />) }

    </>
  )
}
