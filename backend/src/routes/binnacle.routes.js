"use strict";

import { Router } from "express";

import BinnacleController from "../controllers/binnacle.controller.js";

import { isJanitorOrAdmin } from "../middlewares/authorization.middleware.js";

import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticationMiddleware);


router.post("/EntryVisitor", isJanitorOrAdmin,BinnacleController.createEntryVisitor);
router.get("/getAll", isJanitorOrAdmin, BinnacleController.getBinnacles);
router.get("/id/:id", isJanitorOrAdmin,BinnacleController.getBinnacleByJanitorID);
router.get("/visitor", isJanitorOrAdmin,BinnacleController.getBinnaclesVisitor);
router.get("/booking", isJanitorOrAdmin,BinnacleController.getBinnaclesBooking);
router.get("/date/:date", isJanitorOrAdmin,BinnacleController.getBinnacleByDate);
router.get("/excel", isJanitorOrAdmin,BinnacleController.exportToExcel);



export default router;
