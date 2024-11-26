const express=require('express')
const app=express()
app.use(express.static('public'))
const {Server}=require('socket.io')
const http=require('http')
const server=http.createServer(app)
const io=new Server(server)

const users={}

io.on('connection',(socket)=>{
    socket.on('checkUserNameExists',value=>{
        for(let key in users)
            {
                if(users[key]===value.userName)
                {
                    socket.emit('userNameTaken',{message: `The username ${value.userName} already exists`})
                    return
                }
            }
        
        socket.emit('userNameAvailable',{userName:value.userName})
    })

    socket.on('register',value=>{
        users[socket.id]=value.userName
        socket.emit('registrationSuccess')
    })

    socket.on('message',(data)=>{
        socket.broadcast.emit("broadcast",{message:data.message,userName:users[socket.id]})
    })

    socket.on("disconnect",()=>{
        delete users[socket.id]
    })   
})

app.get('/greet',(req,res)=>{
    res.send("Hello World")
})

server.listen(3000, ()=>{
    console.log(`server is running at 3000`)
})