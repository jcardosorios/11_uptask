import React from "react";


export default function ErrorMessage({children}: {children: React.ReactNode}) {
  return (
    <div className="text-left text-red-600 font-bold p-1 uppercase text-xs">
        *{children}
    </div>
  )
}
