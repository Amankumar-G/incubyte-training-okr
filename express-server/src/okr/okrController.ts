import type {Request, Response} from "express";
import {OkrService} from "./okrService";
import {OkrType} from "../types/okr.types";

export class OkrController {
    private readonly okrService: OkrService;

    constructor(okrService: OkrService) {
        this.okrService = okrService;
    }

    getAll(req: Request, res: Response) {
        const okrs = this.okrService.getAll();
        res.status(200).json(okrs);
    }

    create(req: Request, res: Response) {
        const okr: OkrType = req.body;
        const newOKR = this.okrService.create(okr);
        res.status(201).json(newOKR);
    }

    delete(req: Request, res: Response) {
        if(req.params.id === undefined){
            res.status(400).send("ID parameter is missing.");
            return;
        }

        const id: string  = req.params.id.toString();
        const success: boolean = this.okrService.delete(id);
        if (success) {
            res.status(200).send(`OKR with id ${id} deleted successfully.`);
        } else {
            res.status(404).send(`OKR with id ${id} not found.`);
        }
    }

    edit(req: Request, res: Response) {
        if(req.params.id === undefined){
            res.status(400).send("ID parameter is missing.");
            return;
        }

        const id: string  = req.params.id.toString();
        const okr: OkrType = req.body;
        const updatedOkr = this.okrService.edit(id, okr);
        if (updatedOkr) {
            res.status(200).json(updatedOkr);
        } else {
            res.status(404).send(`OKR with id ${id} not found.`);
        }
    }
}