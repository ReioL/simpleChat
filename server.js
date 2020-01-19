const express = require("express")
const http = require("http")
const socketio = require("socket.io")

const app = express()
const server = http.Server(app)
const io = socketio(server)

const PORT = process.env.PORT || 5000

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
    if (typeof user === "string") return callback(user) //check if username and room are not empty
    //joing a specified room
    socket.join(user.room)
    // sending to the client
    socket.emit("message", { msg: `Welcome ${user.name} to room ${user.room}` })
    // sending to all clients in the same room except sender
    socket.broadcast
      .to(user.room)
      .emit("message", { msg: `${user.name} has joined` })

    //sending to all clients in specified room including sender
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room)
    })

    callback(user)
  })

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id)
    //sending to all clients in specified room including sender
    io.to(user.room).emit("message", { user: user.name, msg: message })
    //this callback makes input into empty string in frontend side
    callback()
  })

  socket.on("disconnect", () => {
    console.log("user disconnected")

    const user = getUser(socket.id)
    console.log(user)
    //sending to all clients in specified room excluding sender
    if (user) {
      socket.to(user.room).emit("message", { msg: `${user.name} has left` })
      socket.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room)
      })
    }

    removeUser(socket.id)
  })
})

server.listen(PORT, () => console.log("Server has started!"))
