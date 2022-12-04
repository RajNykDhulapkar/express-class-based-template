import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as mongoose from "mongoose";
import * as http from "http";
import * as swaggerUi from "swagger-ui-express";
import * as swaggerJsdoc from "swagger-jsdoc";
import Controller from "./interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";
import { Server } from "socket.io";
import * as cors from "cors";
import loggerMiddleware from "./middleware/logger.middleware";
import * as responseTime from "response-time";
import Logger from "./utils/logger";
import RequestWithIO from "./interfaces/requestWithIO.interface";
import swaggerJsdocConfig from "./config/swaggerJsdoc.config";
class App {
    public app: express.Application;
    public server: http.Server;
    public io: Server;
    private port: string | number;

    private readonly logger = new Logger(App.name);

    constructor(controllers: Controller[]) {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new Server(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                allowedHeaders: ["my-custom-header"],
                credentials: true,
            },
        });
        this.port = process.env.PORT || 3000;

        this.connectToTheDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    public listen() {
        this.server.listen(this.port, () => {
            this.logger.log(`Express app listening on the port ${this.port}`);
        });
        this.io.on("connect", (socket: any) => {
            this.logger.log("Connected client on port %s.", this.port);
            socket.on("test_message", (m: any) => {
                this.logger.log("[server](message): %s", JSON.stringify(m));
                this.io.emit("message", m);
            });
            socket.on("disconnect", () => {
                this.logger.log("Client disconnected");
            });
        });
    }

    public getServer(): http.Server {
        return this.server;
    }

    public getApp(): express.Application {
        return this.app;
    }

    private initializeMiddlewares() {
        this.app.use(responseTime());
        this.app.use(
            cors({
                origin: "*",
                credentials: true,
                methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
                allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
                optionsSuccessStatus: 200,
            }),
        );
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(loggerMiddleware);

        // attach socket.io to express
        this.app.use((req: RequestWithIO, res: express.Response, next: express.NextFunction) => {
            req.io = this.io;
            next();
        });

        this.app.use(
            "/docs",
            swaggerUi.serve,
            swaggerUi.setup(swaggerJsdoc(swaggerJsdocConfig), {
                explorer: true,
            }),
        );
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    private initializeControllers(controllers: Controller[]) {
        this.app.get("/", (req: express.Request, res: express.Response) => {
            // res.sendFile(__dirname + "/templates/index.html");
            return res.send({
                message: "Hello World",
                timastamp: new Date().getTime(),
            });
        });

        controllers.forEach((controller) => {
            this.app.use("/", controller.router);
        });
    }

    private connectToTheDatabase() {
        try {
            const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH, DATABASE_URI } = process.env;
            mongoose.connect(DATABASE_URI);
            this.logger.log("Connected to database");
        } catch (error) {
            this.logger.error(error);
        }
    }
}

export default App;
