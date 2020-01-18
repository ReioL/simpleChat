import React, { useState } from "react"
import Room from "./Room"

export default function App() {
  const [name, setName] = useState("")
  const [room, setRoom] = useState("")
  const [showRoom, setShowRoom] = useState(false)
  const goToRoom = () => {
    if (!name || !room) console.log("no room or name set")
    else setShowRoom(true)
  }
  return (
    <>
      {!showRoom ? (
        <div className="container">
          <h1 className="header">This is fancy chat, just join</h1>
          <input
            className="name"
            value={name}
            type="text"
            placeholder="Name"
            onChange={e => setName(e.target.value)}
          ></input>
          <input
            className="room"
            value={room}
            type="text"
            placeholder="Room"
            onChange={e => setRoom(e.target.value)}
          ></input>
          <button className="enter" type="button" onClick={goToRoom}>
            GO
          </button>
        </div>
      ) : (
        <Room room={room} name={name}></Room>
      )}
    </>
  )
}
