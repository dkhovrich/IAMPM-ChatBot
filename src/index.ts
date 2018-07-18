import express, { Express } from 'express';
import cors from 'cors';
import passport from 'passport';

import './database/db';
import './middleware/passport';

import users from './routers/userRouter';
import glossaries from './routers/glossaryRouter';
import chatbotGlossaries from './routers/chatBotGlossaryRouter';
import auth from './routers/authRouter';
import errorHandler from './middleware/errorHandler';

const port = 3000;
const authOptions: passport.AuthenticateOptions = { session: false };
const app: Express = express();

app.use(passport.initialize());
app.use(express.json());
app.use(cors());

app.use('/auth', auth);
app.use('/users', passport.authenticate('jwt', authOptions), users);
app.use('/glossaries', passport.authenticate('jwt', authOptions), glossaries);
app.use('/chatbot/glossaries', chatbotGlossaries);

app.use(errorHandler());
app.listen(port, () => console.log(`Server is listening on port ${port}`));