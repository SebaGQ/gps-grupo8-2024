"use strict";

import Order from "../models/order.model.js";
import Visitor from "../models/visitor.model.js";
import Booking from "../models/booking.model.js";
import Binnacle from "../models/binnacle.model.js";
import xlsx from "xlsx";
import path from "path";
import Users from "../models/user.model.js";
import CommonSpace from "../models/commonSpace.model.js";
import Department from "../models/department.model.js";
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

// Función para crear una entrada de visita en la bitácora
/**
 * Crea nueva bitacora de tipo visita en la base de datos
 * @param {Object} binnacleData Objeto de visitante
 * @returns {Promise} Promesa con el objeto de visitante creado
 */
async function createEntryVisitor(req) {
    try {
        let email = req.email;
        let binnacleData = req.body;
        let user = await Users.findOne({ email: email });
        if (!user){ 
            return [null, "No se reconoce al conserje que está haciendo la solicitud"];
        }
        const newBinnacleEntry = new Binnacle({
            janitorID: user._id,
            activityType: "Visita",
            name: binnacleData.name,
            lastName: binnacleData.lastName,
            rut: binnacleData.rut,
            roles: binnacleData.roles,
            departmentNumber: binnacleData.departmentNumber,
        });
        console.log("Binnacle: \n", newBinnacleEntry);
        await newBinnacleEntry.save();
        return [newBinnacleEntry, null];
    } catch (error) {
        handleError(error, "binnacle.service -> createEntry");
        return [null, error.message];
    }
}

// Función para crear una entrada de Delivery en la bitácora
/**
 * Crea nueva bitacora de tipo visita en la base de datos
 * @param {Object} binnacleData Objeto de visitante
 * @returns {Promise} Promesa con el objeto de visitante creado
 */
async function createEntryDelivery(req) {

}

// Función para crear una entrada de Espacios Comunitarios en la bitácora
/**
 * Crea nueva bitacora de tipo visita en la base de datos
 * @param {Object} binnacleData Objeto de visitante
 * @returns {Promise} Promesa con el objeto de visitante creado
 */
async function createEntryBooking(req) {
    try{
        const email = req.email;
        const { spaceId, startTime, endTime } = req.body;

        // Verificar si el email ya está registrado
        const userId = await Users.findOne({ email: email }).select("_id").exec();
        if (!userId) return [null, "El email no está registrado"];

        const newBinnacleEntry = new Binnacle({ 
            janitorID: userId, 
            activityType: "Espacio Comunitario", 
            spaceId: spaceId, 
            startTime: startTime, 
            endTime: endTime });
        await newBinnacleEntry.save();
        return [newBinnacleEntry, null];
    }catch(error){
        handleError(error, "binnacle.service -> createEntryBooking");
        return [null, error.message];
    }
        
}
/**
 * Obtener todas las entradas de la bitácora por activityType
 */
async function getBinnaclesVisitor() {
    try {
        // Paso 1: Obtener los registros de Binnacle con activityType "Visita"
        const binnacles = await Binnacle.find({ activityType: "Visita" })
            .select('janitorID activityType name lastName rut departmentNumber createdAt')
            .lean();
        
        // Paso 2: Extraer los janitorID
        const janitorIds = binnacles.map(binnacle => binnacle.janitorID);
        
        // Paso 3: Obtener los nombres de los conserjes
        const janitors = await Users.find({ _id: { $in: janitorIds } })
            .select('firstName lastName')
            .lean();
        
        // Crear un diccionario de conserjes para acceso rápido
        const janitorDict = {};
        janitors.forEach(janitor => {
            janitorDict[janitor._id] = `${janitor.firstName} ${janitor.lastName}`;
        });

        // Paso 4: Extraer los departmentNumbers únicos
        const departmentIds = [...new Set(binnacles.map(binnacle => binnacle.departmentNumber))];
        console.log("DEPARTMENTS IDS", departmentIds);

        // Paso 5: Obtener los detalles de los departamentos usando _id
        const departments = await Department.find({ _id: { $in: departmentIds } })
            .select('_id departmentNumber')
            .lean();
        console.log("DEPARTMENTS", departments);

        // Crear un diccionario de departamentos para acceso rápido
        const departmentDict = {};
        departments.forEach(department => {
            departmentDict[department._id] = department.departmentNumber;
        });
        console.log("DEPARTMENT DICT", departmentDict);

        // Paso 6: Combinar los resultados
        const formattedBinnacles = binnacles.map(entry => {
            return {
                janitorID: janitorDict[entry.janitorID],
                activityType: entry.activityType,
                name: entry.name,
                lastName: entry.lastName,
                rut: entry.rut,
                departmentNumber: departmentDict[entry.departmentNumber],
                createdAt: entry.createdAt
            };
        });

        return [formattedBinnacles, null];
    } catch (error) {
        return [null, error.message];
    }
}

/**
 * Obtener todas las entradas de la bitácora por Espacios Comunitarios
 */
async function getBinnaclesBooking() {
    try {
        // Paso 1: Obtener los registros de Binnacle con activityType "Espacio Comunitario"
        const binnacles = await Binnacle.find({ activityType: "Espacio Comunitario" })
            .select('janitorID activityType spaceId startTime endTime createdAt')
            .lean();
        
        // Paso 2: Extraer los janitorID
        const janitorIds = binnacles.map(binnacle => binnacle.janitorID);
        
        // Paso 3: Obtener los nombres de los conserjes
        const janitors = await Users.find({ _id: { $in: janitorIds } })
            .select('firstName lastName')
            .lean();
        
        // Crear un diccionario de conserjes para acceso rápido
        const janitorDict = {};
        janitors.forEach(janitor => {
            janitorDict[janitor._id] = `${janitor.firstName} ${janitor.lastName}`;
        });

        // Paso 4: Extraer los spaceIds únicos
        const spaceIds = [...new Set(binnacles.map(binnacle => binnacle.spaceId))];
        console.log("SPACE IDS", spaceIds);

        // Paso 5: Obtener los detalles de los espacios comunitarios usando _id
        const spaces = await CommonSpace.find({ _id: { $in: spaceIds } })
            .select('type location')
            .lean();
        console.log("SPACES", spaces);

        // Crear un diccionario de espacios para acceso rápido
        const spaceDict = {};
        spaces.forEach(space => {
            spaceDict[space._id] = space.type + " - " + space.location;
        });
        console.log("SPACE DICT", spaceDict);

        // Paso 6: Combinar los resultados
        const formattedBinnacles = binnacles.map(entry => {
            return {
                janitorID: janitorDict[entry.janitorID],
                activityType: entry.activityType,
                spaceId: spaceDict[entry.spaceId],
                startTime: entry.startTime,
                endTime: entry.endTime,
                createdAt: entry.createdAt
            };
        });

        return [formattedBinnacles, null];
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
 * Obtener todas las entradas de la bitácora por fecha
 */
async function getBinnacleByDate(date) {
    try {
        // Convertir la fecha de string a Date
        const start = new Date(date);
        const end = new Date(date);
        
        // Ajustar las fechas para que abarque todo el día
        end.setUTCHours(23, 59, 59, 999);

        // Crear el rango de fechas
        const binnacle = await Binnacle.find({
            createdAt: {
                $gte: start,
                $lte: end
            }
        });
        // Para cada bitácora, obtener el nombre del conserje
        const janitorIds = binnacle.map(binnacle => binnacle.janitorID);
        console.log("IDS",janitorIds);
        const janitors = await Users.find({_id: {$in: janitorIds}})
            .select('firstName lastName')
            .lean();
        console.log("JANITORS",janitors);
        // Crear un mapa de conserje por ID para una búsqueda rápida
        const janitorMap = {};
        janitors.forEach(janitor => {
            janitorMap[janitor._id] = `${janitor.firstName} ${janitor.lastName}`;
        });

        console.log("MAP",janitorMap);

        // Añadir el nombre del conserje a cada bitácora
        const result = binnacle.map(binnacle => ({
            ...binnacle._doc,  // Para obtener los datos del documento
            janitorID: janitorMap[binnacle.janitorID] || 'Nombre no encontrado'
        }));

        // Enviamos la respuesta
        return [result, null];
        
    } catch (error) {
        return [null, error.message];
    }
}

export default {
    exportDataToExcel,
    createEntryVisitor,
    createEntryBooking,
    getBinnaclesBooking,
    getBinnaclesVisitor,
    getBinnacleByJanitorID,
    getBinnacleByDate,
};
