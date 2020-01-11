const express = require("express")
const http = require("http")
const socketio = require("socket.io")

const app = express()
const server = http.Server(app)
const io = socketio(server)

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log("Server has started!"))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/src/index.html")
})

let users = []
const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase()
  room = room.trim().toLowerCase()
  const existingUser = users.find(
    user => user.room === room && user.name === name
  )
  if (existingUser) return "Username is taken"
  const newUser = { id, name, room }
  users.push(newUser)
  return newUser
}
const removeUser = id => {
  const user = users.find(user => user.id === id)
  users = users.filter(user => user.id !== id)
  return user
}

const getUser = id => {
  return users.find(user => user.id === id)
}
const getUsersInRoom = room => {
  return users.filter(user => user.room === room)
}

io.on("connection", socket => {
  console.log("user connected " + socket.id)

  socket.on("join", ({ name, room }, callback) => {
    const user = addUser({ id: socket.id, name, room })
    if (typeof user === "string") return callback(user)

    socket.emit("message", { msg: `Welcome ${user.name} to room ${user.room}` })
    socket.broadcast
      .to(user.room)
      .emit("message", { msg: `${user.name} has joined` })
    socket.join(user.room)

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room)
    })

    callback(user)
  })

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id)
    io.to(user.room).emit("message", { user: user.name, msg: message })
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room)
    })
    callback()
  })

  socket.on("disconnect", () => {
    console.log("user disconnected")

    const user = getUser(socket.id)
    io.to(user.room).emit("message", { msg: `${user.name} has left` })
    removeUser(socket.id)
  })
})
