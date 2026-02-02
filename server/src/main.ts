import type {Request, Response} from "express";
import express from 'express'
import cors from 'cors'
import {HealthController} from "./health/healthController";
import {HealthService} from "./health/healthService";
import {healthRouterHandler} from "./health/healthRouterHandler";
import {okrRouterHandler} from "./okr/okrRouterHandler";
import {OkrController} from "./okr/okrController";
import {OkrService} from "./okr/okrService";

const app = express()
app.use(express.json())

app.use(cors())


app.get('/', (req : Request, res : Response) => {
  res.send('Hello, World!')
})


const okrService = new OkrService();
const okrController = new OkrController(okrService)
app.use('/okrs', okrRouterHandler(okrController))


const healthService = new HealthService();
const healthController = new HealthController(healthService);

app.use('/health', healthRouterHandler(healthController))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})