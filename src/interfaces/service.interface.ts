import { RequestHandler, Router } from "express";

interface Service<T> {
    getAll(): Promise<T[]>;
    getById(id: any): Promise<T>;
    create(data: any): Promise<T>;
    update(id: any, data: any): Promise<T>;
    delete(id: any): Promise<T>;
}

export default Service;
