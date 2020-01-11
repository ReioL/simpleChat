import React, { useState, useEffect } from "react"
import io from "socket.io-client"

let socket
const ENDPOINT = "localhost:5000"
export default function Room({ room, name }) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit("join", { name, room }, msg => console.log(msg))
    socket.on("roomData", data => {
      console.log("data", data)
    })
    return () => {
      socket.emit("disconnect")
      socket.off()
    }
  }, [])

  useEffect(() => {
    socket.on("message", message => {
      setMessages([...messages, message])
    })
  }, [messages])

  const sendMessage = e => {
    console.log("inside message")
    e.preventDefault()

    if (message) {
      socket.emit("sendMessage", message, () => {
        setMessage("")
      })
    }
  }
  console.log(message, messages)
  return (
    <div className="container">
      <input
        value={message}
        type="text"
        onChange={e => setMessage(e.target.value)}
        onKeyPress={e => (e.key === "Enter" ? sendMessage(e) : null)}
      ></input>
    </div>
  )
}
