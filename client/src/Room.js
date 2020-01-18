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

  return (
    <div className="roomContent">
      <div className="roomHeader">
        <p className="roomName">Room: {room}</p>
        <div className="close">X</div>
      </div>
      <div className="content">
        <div className="chatArea"></div>
        <div className="info">
          This is sa simple realtime chat application <br />
          <br />
          Created with React, Express, Socket.IO
          <br />
          <br />
          Try it out!
        </div>
        <div className="users">Users in room:</div>
      </div>
      <div className="footer">
        <input
          className="textInput"
          value={message}
          type="text"
          placeholder="Enter text..."
          onChange={e => setMessage(e.target.value)}
          onKeyPress={e => (e.key === "Enter" ? sendMessage(e) : null)}
        ></input>
        <button className="send">SEND</button>
      </div>
    </div>
  )
}
