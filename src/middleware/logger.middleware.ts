import { NextFunction, Request, Response } from "express";
import * as clc from "cli-color";
import Logger from "../utils/logger";

function createLoggerMiddleware() {
    const logger = new Logger("HTTP");
    return function (request: Request, response: Response, next: NextFunction) {
        response.on("finish", function () {
            logger.log(
                `${clc.cyan("[" + request.method + "]")} ${decodeURI(request.url)} ${clc.yellow(
                    response.statusCode
                )} ${response.statusMessage} ${response.get("Content-Length") || 0} - ${clc.green(
                    response.get("x-Response-Time")
                )}`
            );
        });
        next();
    };
}

export default createLoggerMiddleware();
