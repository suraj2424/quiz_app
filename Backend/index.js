const express =  require("express");
const mongoConnect = require("./db");
const cors = require("cors");
const quizRoutes = require("./routes/quiz");
const userRoutes = require("./routes/users");
const attemptsRouter = require('./routes/attempts');
const cookieParser = require('cookie-parser');
const { Server } = require("socket.io");
const { v4: uuidv4 } = require('uuid');

const app = express();
const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
}

// Socket.io
const server = require('http').createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});


// middlewares
app.use(express.json())
app.use(cookieParser());
app.use(cors(corsOptions))

app.use("/api", userRoutes)
app.use("/api/quiz", quizRoutes);
app.use('/api/attempts', attemptsRouter);


// configuring mongodb
mongoConnect(process.env.mongoURL)

// Providing PORT
const PORT = process.env.PORT || 3000

server.listen(PORT, ()=> console.log(`Server is running on PORT ${PORT}`))

