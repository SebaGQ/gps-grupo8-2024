"use strict";

import { Router } from "express";

import BinnacleController from "../controllers/binnacle.controller.js";

import { isJanitorOrAdmin } from "../middlewares/authorization.middleware.js";

import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticationMiddleware);


router.post("/", isJanitorOrAdmin,BinnacleController.generateDailyBinnacle);
router.get("/getAll", isJanitorOrAdmin,BinnacleController.getBinnacles);
router.get("/binnacles/:id", isJanitorOrAdmin,BinnacleController.getBinnacleById);
router.get("/excel", isJanitorOrAdmin,BinnacleController.exportToExcel);

export default router;
