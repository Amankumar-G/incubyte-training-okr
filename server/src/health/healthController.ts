import {HealthService} from "./healthService";
import type {Request, Response} from "express";

export class HealthController {
    private readonly healthService: HealthService;

    constructor(healthService : HealthService) {
        this.healthService = healthService
    }

    handle(req : Request, res : Response) {
        res.status(200).send(this.healthService.getHealthStatus())
    }
}