const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRouter');
const port = 3000;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', userRouter);

app.listen(port, () => {
	console.log('Server started on port ' + port);
});