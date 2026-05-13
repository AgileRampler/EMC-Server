const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()


const app = express()

const PORT=process.env.PORT || 5000


// MiddleWare Conneciton

app.use(cors())
app.use(express.json())

// Routes Connection

app.use("/api/auth", require("./routes/authRoutes"))


// Mongose database connection 

mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log("MongoDB Connected"))
.catch((err)=>console.log("MongoDB not connected",err))







app.listen(PORT,()=>{
    console.log(`Server Running on Port ${PORT}`)
    
})
