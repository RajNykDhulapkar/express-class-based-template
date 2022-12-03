import { Console } from "console";
import * as clc from "cli-color";

class Logger extends Console {
    public name: string;
    constructor(private _name: string) {
        super(process.stdout, process.stderr);
        this.name = _name;
    }
    public log(message: string, ...optionalParams: any[]): void {
        const timestamp = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");
        super.log(
            `${clc.cyan("[" + timestamp + "]")} - ${clc.yellow(this.name)}  ${message}`,
            ...optionalParams
        );
    }

    public warn(...data: any[]): void;
    public warn(message?: any, ...optionalParams: any[]): void;
    public warn(message?: unknown, ...optionalParams: unknown[]): void {
        const timestamp = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");

        super.warn(
            `${clc.cyan("[" + timestamp + "]")} - ${clc.red(this.name)}  ${message}`,
            ...optionalParams
        );
    }

    public error(...data: any[]): void;
    public error(message?: any, ...optionalParams: any[]): void;
    public error(message?: unknown, ...optionalParams: unknown[]): void {
        super.error();
        const timestamp = new Date().toISOString().replace(/T/, " ").replace(/\..+/, "");

        super.error(clc.red(`[${timestamp}] - ${this.name}  ${message}`), ...optionalParams);
    }
}

export default Logger;
