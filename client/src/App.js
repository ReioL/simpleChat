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
    <div>
      {!showRoom ? (
        <div>
          <h1>This is fancy chat, just join</h1>
          <input
            value={name}
            type="text"
            placeholder="name"
            onChange={e => setName(e.target.value)}
          ></input>
          <input
            value={room}
            type="text"
            placeholder="room"
            onChange={e => setRoom(e.target.value)}
          ></input>
          <button type="button" onClick={goToRoom}>
            GO
          </button>
        </div>
      ) : (
        <Room room={room} name={name}></Room>
      )}
    </div>
  )
}
