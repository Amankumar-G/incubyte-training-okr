import express, {type Request, type Response, Router} from "express";
import {OkrController} from "./okrController";

export function okrRouterHandler(okrController: OkrController): Router {
    const router = express.Router()
    router.get('/', (req: Request, res: Response) => okrController.getAll(req, res))
    router.post('/', (req: Request, res: Response) => okrController.create(req, res))
    router.delete('/:id', (req: Request, res: Response) => okrController.delete(req, res))
    router.put('/:id', (req: Request, res: Response) => okrController.edit(req, res))
    // router.patch('/:id', (req: Request, res: Response) => okrController.edit(req, res))
    return router
}