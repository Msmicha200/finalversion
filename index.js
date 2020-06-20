const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');
const operatorRouter = require('./routes/operatorRouter');
const teacherRouter = require('./routes/teacherRouter');
const studentRouter = require('./routes/studentRouter');
const session = require('express-session');
const redisStorage = require('connect-redis')(session);
const redis = require('redis');
const StudentController = require('./controllers/studentController');
const client = redis.createClient();
const port = 3000;

app.use(express.static('templates'));

app.get('/', (req, res) => {
    res.redirect('/user');
});

app.set('twig options', {
    allow_async: true
});

app.set('view engine', 'twig');


app.use(session({
    store: new redisStorage({
        host: '127.0.0.1',
        port: '6379',
        client: client
    }),
    secret: 'rediskin',
    resave: false,
    saveUninitialized: false,
    unset: 'destroy'
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/user', userRouter);

app.use('/admin', adminRouter)

app.use('/operator', operatorRouter);

app.use('/teacher', teacherRouter);

app.use('/student', studentRouter);

app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
    console.log('Redis connected...');
});
