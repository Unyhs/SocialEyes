const socket=io();
const btn=document.getElementById('send')
const text=document.getElementById('message')
const chat=document.getElementById('chat')
const uname=document.getElementById('username')
const form=document.getElementById("userNameForm")
const welcome=document.getElementById("welcome")
const sendMsg=document.getElementById('sendMsg')

btn.addEventListener('click',()=>{
    const val=text.value
    if(val){
        const msgDiv=document.createElement('div')
        msgDiv.setAttribute('class','ownMsg message')
        const s1=document.createElement('span')
        s1.innerText="You: "
        s1.setAttribute('class','sender')

        const s2=document.createElement('span')
        s2.innerText=`${val}`
        s2.setAttribute('class','msg')

        msgDiv.appendChild(s1)
        msgDiv.appendChild(s2)

        chat.appendChild(msgDiv)
        socket.emit("message",{message:val})
        text.value=''
        chat.style.display='block'
        chat.scrollTop = chat.scrollHeight;
    }
})

form.addEventListener("submit",(e)=>{
        e.preventDefault()
        if(uname.value)
        {
            socket.emit('checkUserNameExists',{userName:uname.value})           
        }else
        {
            alert("Username cannot be empty")
        }
    }
)

socket.on('userNameTaken',value=>{
    alert(value.message)
    uname.value=""
    uname.focus()
})

socket.on('userNameAvailable',value=>{
    socket.emit('register',{userName:value.userName})  
})

socket.on('registrationSuccess',()=>{
        form.style.display='none'
        const s=document.createElement('span')
        s.innerText=`Hello, ${uname.value} ! Welcome to chat.`
        welcome.appendChild(s)
        sendMsg.style.display='flex'
        
    })

socket.on('broadcast',data=>{
    const msgDiv=document.createElement('div')
    msgDiv.setAttribute('class','otherMsg message')

    const s1=document.createElement('span')
    s1.innerText=`${data.userName} :`
    s1.setAttribute('class','sender')

    const s2=document.createElement('span')
    s2.innerText=`${data.message}`
    s2.setAttribute('class','msg')

    msgDiv.appendChild(s1)
    msgDiv.appendChild(s2)

    chat.appendChild(msgDiv) 
    chat.style.display='block'

    chat.scrollTop = chat.scrollHeight;
})