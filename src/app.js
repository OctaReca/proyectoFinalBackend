import express from 'express';
import Handlebars from "handlebars";
import expressHandlebars from "express-handlebars";
import __dirname from './utils.js';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import CartRouter from './router/cart.routes.js';
import ProductRouter from './router/product.routes.js';
import viewsRouter from './router/views.routes.js';
import { messageModel } from './models/message.model.js';
import ProductManager from './dao/ProductManager.js';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access'
import sessionsRouter from './router/sessions.routes.js'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import ChatManager from './dao/ChatManager.js';
import cookieParser from 'cookie-parser';
import cors from "cors";
import { ENV_CONFIG } from './config/config.js';
import emailRouter from "./router/email.routes.js"
import smsRouter from "./mocking/mock.router.js"
import mockingRouter from './mocking/mock.router.js';
import { addLogger, devLogger } from './config/logger.js';
import loggerRouter from "./router/logger.routes.js"
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUIExpress from "swagger-ui-express"
import userRouter from "./router/users.routes.js"
import paymentsRouter from "./router/payments.routes.js"

const app = express();
const PORT = ENV_CONFIG.port || 8080;

const httpServer = app.listen(PORT, () => {
    devLogger.info("Servidor escuchando en el puerto " + PORT);
});

const mongoUrl = ENV_CONFIG.mongoUrl;
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 18000,
})
    .then(() => console.log("Conectado a MongoDB"))
    .catch(err => console.error("Error al conectar a MongoDB", err));

//socket
export const socketServer = new Server(httpServer);

app.set("socketServer", socketServer);

//Handlebars
app.engine("handlebars", expressHandlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})
);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname));
app.use(express.static(__dirname + "/public"));
app.use(
    cors({
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

//swagger 

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",

        info: {
            title: "Documentacion API Adoptme",

            description: "Documentacion del uso de las apis relacionadas.",
        },
    },

    apis: [`./src/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);

//logger
app.use(addLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SECRET_KEY_SESSION,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false
        },
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_CNX_STR,
            collectionName: "sessions",
        }),
    })
);
app.use(cookieParser());

//passport
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

//Rutas

app.use("/api/product/", ProductRouter);
app.use("/api/cart/", CartRouter);
app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("email", emailRouter);
app.use("/api/users", userRouter);
app.use("/mockingproducts", mockingRouter);
app.use("/sms", smsRouter);
app.use("loggerTest", loggerRouter);
app.use("/apidocs", swaggerUIExpress.serve, swaggerUIExpress.setup(specs));
app.use("/payment", paymentsRouter);

const PM = new ProductManager();

socketServer.on("connection", async (socket) => {
    console.log("Nueva Conexión!");
    socket.on("newMessage", async (data) => {
        await CM.createMessage(data);
        const messages = await CM.getMessages();
        socket.emit("messages", messages);
    });

    socket.on("message", (data) => {
        console.log(data);
        socket.emit("socket_individual", "Hola desde el cliente #1")
    });
});
