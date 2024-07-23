"use strict";

import { Router } from "express";

import BinnacleController from "../controllers/binnacle.controller.js";

import { isJanitorOrAdmin } from "../middlewares/authorization.middleware.js";

import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticationMiddleware);


router.post("/EntryVisitor", isJanitorOrAdmin,BinnacleController.createEntryVisitor);
router.post("/EntryBooking", isJanitorOrAdmin,BinnacleController.createEntryBooking);
router.post("/EntryDelivery", isJanitorOrAdmin,BinnacleController.createEntryDelivery);
router.get("/delivery", isJanitorOrAdmin,BinnacleController.getBinnacleDelivery);
router.get("/getAll", isJanitorOrAdmin, BinnacleController.getAllBinnacles);
router.get("/id/:name", isJanitorOrAdmin,BinnacleController.getBinnacleByJanitorName);
router.get("/visitor", isJanitorOrAdmin,BinnacleController.getBinnaclesVisitor);
router.get("/booking", isJanitorOrAdmin,BinnacleController.getBinnaclesBooking);
router.get("/date/:date", isJanitorOrAdmin,BinnacleController.getBinnacleByDate);
router.get("/excel", isJanitorOrAdmin,BinnacleController.exportToExcel);



export default router;
