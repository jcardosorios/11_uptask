import { Link, useNavigate } from "react-router-dom";
import { PinInput, PinInputField } from '@chakra-ui/pin-input'
import { useState } from "react";
import { ConfirmToken } from "../../types/index";
import { useMutation } from "@tanstack/react-query";
import { confirmAccount } from "../../api/AuthAPI";
import { toast } from "react-toastify";

export default function ConfirmAccountView() {
    const navigate = useNavigate()
    const [token, setToken] = useState<ConfirmToken['token']>('')

    // Set token in state
    const handleChange = (token: ConfirmToken['token']) => {
        setToken(token)
    }

    // Muation to confirm account
    const { mutate } = useMutation({
        mutationFn: confirmAccount,
        onSuccess: (data) => {
            toast.success(data)
            setTimeout(() => {
              navigate('/')
          }, 3000)
        },
        onError: (errors : string[]) => {
            errors.forEach( (message) => toast.error(message))
        }
    })
    const handleComplete = (token: ConfirmToken['token']) => {
        mutate({token})
    }


  return (
    <>
      <h1 className="text-5xl font-black text-white">Confirm you Account</h1>
      <p className="text-2xl font-light text-white mt-5">
        Enter the code you received {''}
        <span className=" text-fuchsia-500 font-bold"> via email</span>
      </p>
      <form
        className="space-y-8 p-10 bg-white mt-10"
      >
        <label
          className="font-normal text-2xl text-center block"
        >6-digits code</label>
        <div className="flex justify-center gap-5">
            <PinInput 
                value={token} 
                onChange={handleChange}
                onComplete={handleComplete}
            >
                <PinInputField className="w-12 h-12 p-3 rounded-lg text-center border-gray-300 border placeholder-white" />
                <PinInputField className="w-12 h-12 p-3 rounded-lg text-center border-gray-300 border placeholder-white" />
                <PinInputField className="w-12 h-12 p-3 rounded-lg text-center border-gray-300 border placeholder-white" />
                <PinInputField className="w-12 h-12 p-3 rounded-lg text-center border-gray-300 border placeholder-white" />
                <PinInputField className="w-12 h-12 p-3 rounded-lg text-center border-gray-300 border placeholder-white" />
                <PinInputField className="w-12 h-12 p-3 rounded-lg text-center border-gray-300 border placeholder-white" />
            </PinInput>
        </div>

      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to='/auth/request-code'
          className="text-center text-gray-300 font-normal"
        >
          Request a new code
        </Link>
      </nav>

    </>
  )
}