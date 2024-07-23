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
import ORDER_STATUSES from "../constants/orderstatus.constants.js";

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
 * Crea nueva bitacora de tipo Deilveri en la base de datos
 * @param {Object} binnacleData Objeto de Delivery
 * @returns {Promise} Promesa con el objeto de Delivery creado
 */
async function createEntryDelivery(req) {
    try {
        let email = req.email;
        let binnacleData = req.body;
        // Validamos el usuario
        let user = await Users.findOne({ email: email });
        if (!user){ 
            return [null, "No se reconoce al conserje que está haciendo la solicitud"];
        }
        // Se valida el departamento
        let department = await Department.findOne({ departmentNumber: binnacleData.departNumber });
        if (!department) {
          return [null, "No se encontró el departamento indicado"];
        }
        let newBinnacleEntry = new Binnacle({ ...binnacleData});
        newBinnacleEntry.janitorID = user._id;
        newBinnacleEntry.status = ORDER_STATUSES[0];
        console.log("BinnacleDelivery: \n", newBinnacleEntry);
        await newBinnacleEntry.save();
        return [newBinnacleEntry, null];
    } catch (error) {
        handleError(error, "binnacle.service -> createEntryDelivery");
        return [null, error.message];
    }

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
 * Obtener todas las entradas de la bitácora por Delivery
 */
async function getBinnaclesDelivery() {
    try {
        // Paso 1: Obtener los registros de Binnacle con activityType "Delivery"
        const binnacles = await Binnacle.find({ activityType: "Delivery" })
            .select('janitorID activityType departNumber recipientFirstName recipientLastName deliveryTime withdrawnTime deliveryPersonName status createdAt')
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

        // Paso 6: Combinar los resultados
        const formattedBinnacles = binnacles.map(entry => {
            return {
                janitorID: janitorDict[entry.janitorID],
                activityType: entry.activityType,
                departNumber: entry.departNumber,
                recipientFirstName: entry.recipientFirstName,
                recipientLastName: entry.recipientLastName,
                deliveryTime: entry.deliveryTime,
                withdrawnTime: entry.withdrawnTime,
                deliveryPersonName: entry.deliveryPersonName,
                status: entry.status,
                createdAt: entry.createdAt
            };
        });

        return [formattedBinnacles, null];
    } catch (error) {
        return [null, error.message];
    }
}

/**
 * Obtener todas las entradas de la bitácora por janitorName
 */
async function getBinnacleByJanitorName(name) {
    try {
        console.log("FIRST NAME", name);
        // Paso 1: Buscar conserjes cuyo nombre coincida con el proporcionado
        const janitors = await Users.find({
            $or: [
                { firstName: new RegExp(name, "i") },
                { lastName: new RegExp(name, "i") }
            ]
        }).select('_id firstName lastName').lean();
        
        if (janitors.length === 0) {
            return [null, "No se encontraron conserjes con ese nombre"];
        }

        // Paso 2: Obtener los IDs de los conserjes encontrados
        const janitorIds = janitors.map(janitor => janitor._id);

        // Paso 3: Buscar las entradas de la bitácora con los IDs de los conserjes encontrados
        const binnacles = await Binnacle.find({ janitorID: { $in: janitorIds } })
            .populate('janitorID', 'firstName lastName') // Popula los nombres de los conserjes
            .lean();

        if (binnacles.length === 0) {
            return [null, "No se encontraron entradas de bitácora para los conserjes con ese nombre"];
        }

        // Crear un diccionario para mapear janitorID a nombres completos
        const janitorDict = {};
        janitors.forEach(janitor => {
            janitorDict[janitor._id] = `${janitor.firstName} ${janitor.lastName}`;
        });

        // Reemplazar janitorID por nombres completos en las entradas de la bitácora
        const formattedBinnacles = binnacles.map(entry => {
            return {
                ...entry,
                janitorID: janitorDict[entry.janitorID] || 'Nombre no encontrado'
            };
        });

        return [formattedBinnacles, null];
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
        const binnacles = await Binnacle.find({
            createdAt: {
                $gte: start,
                $lte: end
            }
        }).lean();
        
        // Obtener los IDs únicos de spaceId y departmentNumber
        const spaceIds = [...new Set(binnacles.map(binnacle => binnacle.spaceId).filter(id => id))];
        const departmentIds = [...new Set(binnacles.map(binnacle => binnacle.departmentNumber).filter(id => id))];

        // Obtener los detalles de los espacios comunitarios y departamentos
        const spaces = await CommonSpace.find({ _id: { $in: spaceIds } }).select('_id type').lean();
        const departments = await Department.find({ _id: { $in: departmentIds } }).select('_id departmentNumber').lean();

        // Crear diccionarios para acceso rápido
        // reduce es una función de array que permite reducir un array a un solo valor.
        const spaceDict = spaces.reduce((acc, space) => {
            acc[space._id] = space.type;
            return acc;
        }, {});

        const departmentDict = departments.reduce((acc, department) => {
            acc[department._id] = department.departmentNumber;
            return acc;
        }, {});

        // Obtener los IDs de los conserjes
        const janitorIds = binnacles.map(binnacle => binnacle.janitorID);

        // Obtener los nombres de los conserjes
        const janitors = await Users.find({ _id: { $in: janitorIds } })
            .select('firstName lastName')
            .lean();

        // Crear un diccionario de conserjes para acceso rápido
        const janitorDict = {};
        janitors.forEach(janitor => {
            janitorDict[janitor._id] = `${janitor.firstName} ${janitor.lastName}`;
        });

        // Añadir el nombre del conserje y reemplazar spaceId y departmentNumber en cada bitácora
        const result = binnacles.map(binnacle => ({
            ...binnacle,
            janitorID: janitorDict[binnacle.janitorID] || 'Nombre no encontrado',
            spaceId: binnacle.spaceId ? spaceDict[binnacle.spaceId] || 'Tipo no encontrado' : null,
            departmentNumber: binnacle.departmentNumber ? departmentDict[binnacle.departmentNumber] || 'Número no encontrado' : null,
        }));

        // Enviamos la respuesta
        return [result, null];
    } catch (error) {
        return [null, error.message];
    }
}

/**
 * Obtener todas las entradas de la bitácora
 */
async function getBinnacles() {
    try {
        const binnacles = await Binnacle.find().lean();
        
        // Obtener los IDs únicos de spaceId y departmentNumber
        const spaceIds = [...new Set(binnacles.map(binnacle => binnacle.spaceId).filter(id => id))];
        const departmentIds = [...new Set(binnacles.map(binnacle => binnacle.departmentNumber).filter(id => id))];

        // Obtener los detalles de los espacios comunitarios y departamentos
        const spaces = await CommonSpace.find({ _id: { $in: spaceIds } }).select('_id type').lean();
        const departments = await Department.find({ _id: { $in: departmentIds } }).select('_id departmentNumber').lean();

        // Crear diccionarios para acceso rápido
        const spaceDict = spaces.reduce((acc, space) => {
            acc[space._id] = space.type;
            return acc;
        }, {});

        const departmentDict = departments.reduce((acc, department) => {
            acc[department._id] = department.departmentNumber;
            return acc;
        }, {});

        // Obtener los IDs de los conserjes
        const janitorIds = binnacles.map(binnacle => binnacle.janitorID);

        // Obtener los nombres de los conserjes
        const janitors = await Users.find({ _id: { $in: janitorIds } })
            .select('firstName lastName')
            .lean();

        // Crear un diccionario de conserjes para acceso rápido
        const janitorDict = {};
        janitors.forEach(janitor => {
            janitorDict[janitor._id] = `${janitor.firstName} ${janitor.lastName}`;
        });

        // Añadir el nombre del conserje y reemplazar spaceId y departmentNumber en cada bitácora
        const result = binnacles.map(binnacle => ({
            ...binnacle,
            janitorID: janitorDict[binnacle.janitorID] || 'Nombre no encontrado',
            spaceId: binnacle.spaceId ? spaceDict[binnacle.spaceId] || 'Tipo no encontrado' : null,
            departmentNumber: binnacle.departmentNumber ? departmentDict[binnacle.departmentNumber] || 'Número no encontrado' : null,
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
    createEntryDelivery,
    getBinnaclesBooking,
    getBinnaclesVisitor,
    getBinnaclesDelivery,
    getBinnacleByJanitorName,
    getBinnacleByDate,
    getBinnacles
};
