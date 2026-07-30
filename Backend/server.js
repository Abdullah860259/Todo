console.log("🚀 Railway: Server file loaded");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const mongourl = process.env.MONGO_URL;
const jwtSecret = process.env.JWT_SECRET;
const express = require("express");
const User = require("./models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task = require("./models/taskSchems");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const PORT = process.env.PORT || 8080;
const isValidEmail = require('./utils/validateEmail.js')
const app = express();



app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});
// https://todoapp1.up.railway.app/googleLogin
// https://todo-backend-brown-three.vercel.app/
app.use(cors({
    origin: ["https://todoabdullah.vercel.app", "http://localhost:5174"],
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    exposedHeaders: ['Authorization']
}));

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log(mongourl);

mongoose.connect(mongourl)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Error:", err));


const islogged = async (req, res, next) => {
    const token = req.cookies.token;
    console.log(token, 'token is 😂😂');
    if (!token || token === "null") {
        console.log("token is not available");
        return res.status(401).send('Unauthorized')
    };
    const data = jwt.verify(token, jwtSecret);
    let user = await User.findOne({ _id: data.id });
    req.user = user;
    return next();
}

app.use((req, res, next) => {
    console.log("REQ METHOD:", req.method);
    console.log("REQ PATH:", req.path);
    next();
});


app.get("/", (req, res) => {
    res.send("✅ Backend is alive!");
});

app.post("/register", async (req, res) => {
    const { name, username, email, password, dob } = req.body;
    if (!isValidEmail(email)) return res.json({ status: '401', message: 'Invalid Email' });
    const curUser = await User.findOne({ email: email });
    console.log(curUser);
    if (curUser) {
        return res.status(401).json({ message: "This email is already registered in this website. It is better to login with respective method" });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedpass = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            username,
            email,
            password: hashedpass,
            dob,
        })
        const token = jwt.sign({ id: newUser.id }, jwtSecret);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60
        })
        res.status(201).json("done")
    } catch (error) {
        console.error(error);
        return res.status(500).send("An Error Occured, Please try again later")
    }
})


app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    let curUser = await User.findOne({ email });
    if (!curUser) {
        return res.status(401).send("User Does not exist")
    }
    // if (!curUser.password) {
    //     return res.status(401).send("This email is already registered in this website through google signup services. It is better to login through gmail or try another email address.");
    // }
    const match = await bcrypt.compare(password, curUser.password);
    if (match) {
        const token = jwt.sign({ id: curUser._id }, jwtSecret);
        console.log(token, 'this token is to set');
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60
        })
        console.log("token setted successfully");
        res.status(200).send("Login successful");
    } else {
        res.status(401).send("invalid email or password");
    }


})

app.post("/addtask", islogged, async (req, res) => {
    const newTask = await Task.create({
        userid: req.Userid,
        title: req.body.title,
        completed: req.body.completed,
        Important: req.body.important
    })
    res.send("Task is created")
})

app.get("/gettask", islogged, async (req, res) => {
    const tasks = await Task.find({ userid: req.user._id })
    res.send(tasks);
})

app.get("/completed", islogged, async (req, res) => {
    const tasks = await Task.find({ userid: req.Userid, completed: true })
    res.send(tasks);
})

app.get("/important", islogged, async (req, res) => {
    const tasks = await Task.find({ userid: req.Userid, Important: true })
    res.send(tasks);
})

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/")
})

app.get("/islogged", islogged, (req, res) => {
    res.status(200).send({ status: true });
})

app.post("/googleLogin", async (req, res) => {
    let res1 = await User.findOne({ email: req.body.email });
    if (res1 === null) {
        try {
            const newUser = await User.create({
                name: req.body.name,
                email: req.body.email,
                picture: req.body.picture,
            })
            return res.status(200).json({ message: "DONE" });
        } catch (error) {
            console.log(error);
        }
    }
    else if (res1.password) {
        return res.status(401).json({ message: "Your email is already registered in this website from email services. It is better to enter your password or try another email address." });
    } else if (!res1.password) {
        res.cookies('token',)
        return res.status(200).json({ message: "Done" });
    }

})

app.get("/getUserName", islogged, async (req, res) => {
    console.log(req.user, 'loggin from get user name');
    res.json(req.user.name);
})

app.post("/createtask", islogged, async (req, res) => {
    try {
        const newTask = await Task.create({
            userid: req.user._id,
            title: req.body.title,
            completed: req.body.completed,
            Important: req.body.important
        })
        res.send("Task is created")
    } catch (error) {
        console.error(error);
    }
})

app.post("/completed/:id", islogged, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        task.completed = !task.completed;
        await task.save();
        res.status(200).send("Done");
    } catch (error) {
        console.error(error);
    }
})

app.post("/delete/:id", islogged, async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        res.status(200).send("Done");
    } catch (error) {
        console.error(error);
    }
})


app.post("/important/:id", islogged, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        task.Important = !task.Important;
        await task.save();
        res.status(200).send("Done");
    } catch (error) {
        console.error(error);
    }
})
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});