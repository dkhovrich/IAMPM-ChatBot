const express = require('express');
const passport = require('passport');

require('./database/db');
require('./middleware/passport');

const users = require('./routers/userRouter');
const glossaries = require('./routers/glossaryRouter');
const auth = require('./routers/authRouter');
const errorHandler = require('./middleware/errorHandler');

const port = 3000;
const app = express();

app.use(passport.initialize());
app.use(express.json());

app.use('/auth', auth);
app.use('/users', users);
app.use('/glossaries', passport.authenticate('jwt', { session: false }), glossaries);

app.use(errorHandler());
app.listen(port, () => console.log(`Server is listening on port ${port}`));