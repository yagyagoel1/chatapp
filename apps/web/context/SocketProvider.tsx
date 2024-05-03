"use client"

import React, { useCallback, useContext, useEffect, useState } from "react"
import { Socket, io } from "socket.io-client"
interface SocketProviderProps{
    children : React.ReactNode
}
interface ISocketContext{
    sendMessage:(msg:string)=>any
}
const SocketContext = React.createContext<ISocketContext|null>(null)

export const useSocket=()=>{
    const state =useContext(SocketContext)
    if(!state)
    throw new Error("state is undefined")
    return state
}




export const SocketProvider :React.FC<SocketProviderProps>=({children})=>{
    const [socket,setSocket] = useState<Socket>()
    const sendMessage:ISocketContext["sendMessage"] =useCallback((msg)=>{
        if(socket){
            socket.emit("event:message",{message:msg})
        }
        console.log(msg)
    },[] )
    useEffect(()=>{ 
        const _socket= io("http://localhost:8000")
        return ()=>{
            _socket.disconnect();
            setSocket(undefined)
        }
    },[])
    return(
        <SocketContext.Provider  value={null}>
            {children}
        </SocketContext.Provider>
    )
}