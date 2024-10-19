const express = require('express')
const morgan = require('morgan')
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const dotenv = require('dotenv');
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');

const smsRoute = require('./routes/smsRoute')
const userRouter = require('./routes/userRoutes')
const adminRouter = require('./routes/adminRoutes')
// const resourcesRouter = require('./routes/resourcesRoute')
// const adminRouter = require('./routes/adminRoutes')
const AppError = require('./utils/appError')

dotenv.config({ path: './config.env' });    //use it in this order read path first
console.log(process.env.NODE_ENV);
// app.enable('trust proxy');
const app = express();
// 1) GLOBAL MIDDLEWARES
// Implement CORS
// app.use(cors());
app.use(cors({
    origin: process.env.FRONTEND_URL, // Ensure this is the correct frontend URL
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));

// console.log(process.env.FRONTEND_URL);

app.use(express.json()); // To parse JSON data from POST requests
app.use(cookieParser()); // To parse cookies

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));     //=>   //GET /api/v1/tours/ 200 12.099 ms - 8895
}

app.use(express.json())

app.use((req, res, next) => {
    console.log("HI i am middleware 😀");
    next()
})

// Limit requests from same API
const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));


app.use('/api/v1/sms', smsRoute);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/admin', adminRouter);
// app.use('/api/v1/resource', resourcesRouter);

app.get('/', (request, response) => {
    response.json({
        message: "server running fine"
    });
});
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const PORT = process.env.PORT || 8000;
mongoose
    .connect(process.env.MONGO_URL, {

    })
    .then(() => {
        console.log("connection success👌");

    })
    .catch((error) => console.log(`${error} ${process.env.PORT} did not connect`));



app.listen(PORT, () => {
    console.log(`Server Port: ${PORT}`)
})

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});


