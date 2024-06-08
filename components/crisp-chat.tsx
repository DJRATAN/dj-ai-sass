"use client"

import { useEffect } from "react"
import { Crisp } from "crisp-sdk-web"
export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("e20a389c-854c-4223-a077-45b364b36ca4")
    }, [])
    return null
}