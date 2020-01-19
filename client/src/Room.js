import React, { useState, useEffect } from "react"
import io from "socket.io-client"
import Message from "./Message"

let socket
const ENDPOINT = "localhost:5000"
export default function Room({ room, name }) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  useEffect(() => {
    console.log("inside join useeffect")
    socket = io(ENDPOINT)
    socket.emit("join", { name, room }, user => {
      console.log(user)
    })
    /*     socket.on("roomData", data => {
      console.log("set user data later")
    }) */
    return () => {
      console.log("join disconnect")
      socket.emit("disconnect")
      socket.off()
    }
  }, [room, name])

  useEffect(() => {
    console.log("inside messages useeffect")
    socket.on("message", msg => {
      setMessages([...messages, msg])
    })

    socket.on("roomData", data => {
      setUsers([...data.users])
      console.log(data)
    })
    return () => {
      console.log("inside disconnect")
      //socket.emit("disconnect")

      //no idea why socket.off helps, but without it it basically breakes
      //seems to be related with scoket.on in client side
      socket.off()
    }
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
        <div className="chatArea">
          {messages.map(({ user, msg }, index) => {
            return (
              <div key={index} className="message">
                <Message msg={msg} user={user}></Message>
              </div>
            )
          })}
        </div>
        <div className="info">
          This is sa simple realtime chat application <br />
          <br />
          Created with React, Express, Socket.IO
          <br />
          <br />
          Try it out!
        </div>
        <div className="users">
          Users in room:
          {users.map(user => (
            <div
              key={user.id}
              style={{ color: user.name === name ? "blue" : "" }}
            >
              {user.name}
            </div>
          ))}
        </div>
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
        <button className="send" onClick={e => sendMessage(e)}>
          SEND
        </button>
      </div>
    </div>
  )
}
