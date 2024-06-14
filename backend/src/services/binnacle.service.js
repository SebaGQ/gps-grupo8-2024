"use strict";

import Order from "../models/order.model.js";
import Visitor from "../models/visitor.model.js";
import Booking from "../models/booking.model.js";
import Binnacle from "../models/binnacle.model.js";
import xlsx from "xlsx";
import path from "path";
import Users from "../models/user.model.js";
import { handleError } from "../utils/errorHandler.js";

async function exportDataToExcel() {
    try {
        const orders = await Order.find().populate("janitorId").lean();
        const visitors = await Visitor.find().populate("departmentNumber").lean();
        const bookings = await Booking.find().populate("userId").populate("spaceId").lean();
        const binnacles = await Binnacle.find().lean();

        const data = [
            { sheetName: "Orders", data: orders },
            { sheetName: "Visitors", data: visitors },
            { sheetName: "Bookings", data: bookings },
            { sheetName: "Binnacles", data: binnacles }
        ];

        const wb = xlsx.utils.book_new();

        data.forEach(item => {
            const ws = xlsx.utils.json_to_sheet(item.data);
            xlsx.utils.book_append_sheet(wb, ws, item.sheetName);
        });

        const filePath = path.resolve("Bitacoras.xlsx");
        xlsx.writeFile(wb, filePath);

        return [filePath, null];
    } catch (error) {
        return [null, error.message];
    }
}

// Función para crear una entrada en la bitácora
async function createEntry(janitorID, activityType, description) {
    try {
        const janitor = await Users.findById(janitorID);
        if (!janitor) {
            return [null, "Conserje no encontrado"];
        }
        const janitorName = `${janitor.firstName}`;
        // Validar si la entrada ya existe
        const existingEntry = await Binnacle.findOne({ janitorID, activityType, description });
        if (existingEntry) {
            // Si ya existe, no crear una nueva
            return [existingEntry, null];
        }
        const binnacleEntry = new Binnacle({
            janitorID: janitorName,
            activityType,
            description
        });
        await binnacleEntry.save();
        return [binnacleEntry, null];
    } catch (error) {
        handleError(error, "binnacle.service -> createEntry");
        return [null, error.message];
    }
}

async function generateDailyBinnacle() {
    try {
        const orders = await Order.find().populate("janitorId");
        const visitors = await Visitor.find().populate("departmentNumber");
        const bookings = await Booking.find().populate("userId").populate("spaceId");

        for (const order of orders) {
            const description = `Order for ${order.recipientFirstName} ${order.recipientLastName}, delivered by ${order.deliveryPersonName}. Status: ${order.status}.`;
            const [result, error] = await createEntry(order.janitorId, "Delivery", description);
            if (error) {
                throw new Error(`Error creating binnacle entry for order: ${error}`);
            }
        }

        for (const visitor of visitors) {
            const description = `Visitor ${visitor.name} ${visitor.lastName} visited department ${visitor.departmentNumber}. Entry: ${visitor.entryDate}, Exit: ${visitor.exitDate}.`;
            const [result, error] = await createEntry(visitor.departmentNumber, "Visita", description);
            if (error) {
                throw new Error(`Error creating binnacle entry for visitor: ${error}`);
            }
        }

        for (const booking of bookings) {
            const description = `Booking for space ${booking.spaceId} by user ${booking.userId}. Start: ${booking.startTime}, End: ${booking.endTime}.`;
            const [result, error] = await createEntry(booking.userId, "Espacio Comunitario", description);
            if (error) {
                throw new Error(`Error creating binnacle entry for booking: ${error}`);
            }
        }

        return [null, null];
    } catch (error) {
        return [null, error.message];
    }
}

/**
 * Obtener todas las entradas de la bitácora
 */
async function getBinnacles() {
    try {
        const binnacle = await Binnacle.find();
        return [binnacle, null];
    } catch (error) {
        return [null, error.message];
    }
}

/**
 * Obtener todas las entradas de la bitácora por janitorID
 */
async function getBinnacleByJanitorID(janitorID) {
    try {
        const binnacle = await Binnacle.find({ janitorID });
        return [binnacle, null];
    } catch (error) {
        return [null, error.message];
    }
}

/**
 * Obtener todas las entradas de la bitácora por activityType
 */
async function getBinnacleByActivityType(activityType) {
    try {
        const binnacle = await Binnacle.find({ activityType });
        return [binnacle, null];
    } catch (error) {
        return [null, error.message];
    }
}

/**
 * Obtener todas las entradas de la bitácora por fecha
 */
async function getBinnacleByDate(date) {
    try {
        const binnacle = await Binnacle.find({ createdAt: date });
        return [binnacle, null];
    } catch (error) {
        return [null, error.message];
    }
}

export default {
    exportDataToExcel,
    createEntry,
    generateDailyBinnacle,
    getBinnacles,
    getBinnacleByJanitorID,
    getBinnacleByActivityType,
    getBinnacleByDate,
};
