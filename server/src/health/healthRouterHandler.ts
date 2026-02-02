import express, {Router , Response , Request} from "express";
import {HealthController} from "./healthController";


export function healthRouterHandler(healthController :HealthController ) :Router {
    const router = express.Router()
    router.get('/', (req :Request, res :Response) => healthController.handle(req , res))
    return router
}