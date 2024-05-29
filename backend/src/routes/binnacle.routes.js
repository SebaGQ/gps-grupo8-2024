"use strict";

import { Router } from "express";

import binnacleController from "../controllers/binnacle.controller.js";

import { isJanitorOrAdmin } from "../middlewares/authorization.middleware.js";

import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticationMiddleware);

router.get("/", isJanitorOrAdmin, binnacleController.getAllBinnacles);

export default router;