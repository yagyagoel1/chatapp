"use client"

import React, { useCallback, useContext, useEffect, useState } from "react"
import { Socket, io } from "socket.io-client"
interface SocketProviderProps{
    children : React.ReactNode
}
interface ISocketContext{
    sendMessage:(msg:string)=>any
    messages:string[]
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
    const [messages,setMessages]=useState<string[]>([])
    const sendMessage:ISocketContext["sendMessage"] =useCallback((msg)=>{
        if(socket){
            socket.emit("event:message",{message:msg})
        }
        console.log(msg)
    },[] )
    const onMessageRec= useCallback((msg:string)=>{
        console.log("from server msg rec",msg)
        const{ message}=  JSON.parse(msg)as {message:string}
        setMessages((prev)=>[...prev,message])
    },[]) 
    useEffect(()=>{ 
        const _socket= io("http://localhost:8000")
        _socket.on("message",onMessageRec)
        return ()=>{
            _socket.disconnect();
            _socket.off("message",onMessageRec)
            setSocket(undefined)
        }
    },[])
    return(
        <SocketContext.Provider  value={{sendMessage,messages}}>
            {children}
        </SocketContext.Provider>
    )
}