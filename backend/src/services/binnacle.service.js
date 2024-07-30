"use strict";
import Binnacle from "../models/binnacle.model.js";
import xlsx from "xlsx";
import path from "path";
import Users from "../models/user.model.js";
import CommonSpace from "../models/commonSpace.model.js";
import Department from "../models/department.model.js";
import { handleError } from "../utils/errorHandler.js";
import ORDER_STATUSES from "../constants/orderstatus.constants.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


async function exportBinnacleToExcel() {
    try {
        // Paso 1: Obtener los registros de Binnacle con activityType "Delivery"
        const binnacles = await Binnacle.find({ activityType: "Delivery" })
            .select('janitorID activityType departmentNumber recipientFirstName recipientLastName deliveryTime withdrawnTime deliveryPersonName status createdAt')
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

        // Paso 5: Obtener los detalles de los departamentos usando _id
        const departments = await Department.find({ _id: { $in: departmentIds } })
            .select('_id departmentNumber')
            .lean();

        // Crear un diccionario de departamentos para acceso rápido
        const departmentDict = {};
        departments.forEach(department => {
            departmentDict[department._id] = department.departmentNumber;
        });

        // Paso 6: Combinar los resultados
        const formattedBinnaclesDelivery = binnacles.map(entry => {
            return {
                janitorID: janitorDict[entry.janitorID],
                activityType: entry.activityType,
                departNumber: departmentDict[entry.departmentNumber],
                recipientFirstName: entry.recipientFirstName,
                recipientLastName: entry.recipientLastName,
                deliveryTime: entry.deliveryTime,
                withdrawnTime: entry.withdrawnTime,
                deliveryPersonName: entry.deliveryPersonName,
                status: entry.status,
                createdAt: entry.createdAt
            };
        });

        // Paso 1: Obtener los registros de Binnacle con activityType "Espacio Comunitario"
        const binnaclesB = await Binnacle.find({ activityType: "Espacio Comunitario" })
            .select('janitorID activityType spaceId startTime endTime userId createdAt')
            .lean();
        
        // Paso 2: Extraer los janitorID
        const janitorIdsb = binnaclesB.map(binnacle => binnacle.janitorID);
        
        // Paso 3: Obtener los nombres de los conserjes
        const janitorsb = await Users.find({ _id: { $in: janitorIdsb } })
            .select('firstName lastName')
            .lean();
        
        // Crear un diccionario de conserjes para acceso rápido
        const janitorDictb = {};
        janitorsb.forEach(janitor => {
            janitorDictb[janitor._id] = `${janitor.firstName} ${janitor.lastName}`;
        });

        // Paso 4: Extraer los spaceIds únicos
        const spaceIdsb = [...new Set(binnaclesB.map(binnacle => binnacle.spaceId))];

        // Paso 5: Obtener los detalles de los espacios comunitarios usando _id
        const spacesb = await CommonSpace.find({ _id: { $in: spaceIdsb } })
            .select('type location')
            .lean();

        // Crear un diccionario de espacios para acceso rápido
        const spaceDictb = {};
        spacesb.forEach(space => {
            spaceDictb[space._id] = space.type + " - " + space.location;
        });


        //paso 6: Extraer los userId únicos

        const userIdsb = [...new Set(binnaclesB.map(binnacle => binnacle.userId))];
        // Paso 7: Obtener los detalles de los usuarios usando _id
        const usersb = await Users.find({ _id: { $in: userIdsb } })
            .select('firstName lastName')
            .lean();


        // Crear un diccionario de usuarios para acceso rápido
        const userDictb = {};
        usersb.forEach(user => {
            userDictb[user._id] = `${user.firstName} ${user.lastName}`;
        });
        
        // Paso 8: Combinar los resultados
        const formattedBinnaclesb = binnaclesB.map(entry => {
            const now = new Date();
            if (new Date(binnaclesB.startTime) < now) return [null, "No se puede reservar en una fecha anterior a la actual"];
            if (new Date(binnaclesB.endTime) <= new Date(binnaclesB.startTime)) return [null, "La fecha de finalización debe ser posterior a la fecha de inicio"];
            return {
                janitorID: janitorDictb[entry.janitorID],
                // formatear entry._id a string
                _id: entry._id.toString(),
                activityType: entry.activityType,
                spaceId: spaceDictb[entry.spaceId],
                startTime: entry.startTime,
                endTime: entry.endTime,
                userId: userDictb[entry.userId],
                createdAt: entry.createdAt
            };
        });

        // Paso 1: Obtener los registros de Binnacle con activityType "Visita"
        const binnaclesv = await Binnacle.find({ activityType: "Visita" })
            .select('janitorID _id activityType name lastName rut departmentNumber createdAt')
            .lean();
        
        // Paso 2: Extraer los janitorID
        const janitorIdsv = binnaclesv.map(binnacle => binnacle.janitorID);
        
        // Paso 3: Obtener los nombres de los conserjes
        const janitorsv = await Users.find({ _id: { $in: janitorIdsv } })
            .select('firstName lastName')
            .lean();
        
        // Crear un diccionario de conserjes para acceso rápido
        const janitorDictv = {};
        janitorsv.forEach(janitor => {
            janitorDictv[janitor._id] = `${janitor.firstName} ${janitor.lastName}`;
        });

        // Paso 4: Extraer los departmentNumbers únicos
        const departmentIdsv = [...new Set(binnaclesv.map(binnacle => binnacle.departmentNumber))];

        // Paso 5: Obtener los detalles de los departamentos usando _id
        const departmentsv = await Department.find({ _id: { $in: departmentIdsv } })
            .select('_id departmentNumber')
            .lean();

        // Crear un diccionario de departamentos para acceso rápido
        const departmentDictv = {};
        departmentsv.forEach(department => {
            departmentDictv[department._id] = department.departmentNumber;
        });

        // Paso 6: Combinar los resultados
        const formattedBinnaclesv = binnaclesv.map(entry => {
            return {
                janitorID: janitorDict[entry.janitorID],
                _id: entry._id.toString(),
                activityType: entry.activityType,
                name: entry.name,
                lastName: entry.lastName,
                rut: entry.rut,
                departmentNumber: departmentDict[entry.departmentNumber],
                createdAt: entry.createdAt
            };
        });

        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);
  
        const binnaclesd = await Binnacle.find({
            createdAt: {
                $gte: start,
                $lte: end
            }
      }).lean();

      //formatear star DD/MM/YYYY
        const formattedDate = `${start.getDate()}-${start.getMonth() + 1}-${start.getFullYear()}`;
      
        // Crear un libro de trabajo de Excel
        const workbook = xlsx.utils.book_new();

        // Función para añadir una hoja al libro de trabajo
        const addSheet = (data, sheetName) => {
            const worksheet = xlsx.utils.json_to_sheet(data);
            xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
        };

        // Añadir las hojas al libro de trabajo
        addSheet(formattedBinnaclesDelivery, 'Deliveries');
        addSheet(formattedBinnaclesv, 'Visitas');
        addSheet(formattedBinnaclesb, 'Espacios Comunitarios');
        addSheet(binnaclesd, `${formattedDate}`);


       // Definir una ruta fija para guardar el archivo
       const outputDirectory = path.join(__dirname, 'output');
       const fullPath = path.join(outputDirectory, 'bitacoras.xlsx');
       
       // Asegúrate de que el directorio de salida existe
       if (!fs.existsSync(outputDirectory)) {
           fs.mkdirSync(outputDirectory);
       }
       
       // Escribir el archivo en la ruta especificada
       xlsx.writeFile(workbook, fullPath);
    } catch (error) {
        handleError(error, "binnacle.service -> exportBinnacleToExcel");
        return [null, "Error en el servidor"];
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

        let department = await Department.findById(binnacleData.departmentNumber);
        if (!department) return [null, "El número de departamento no es válido."];
        const newBinnacleEntry = new Binnacle({
            janitorID: user._id,
            activityType: "Visita",
            name: binnacleData.name,
            lastName: binnacleData.lastName,
            rut: binnacleData.rut,
            roles: binnacleData.roles,
            entryDate: binnacleData.entryDate,
            exitDate: binnacleData.exitDate || new Date("9999-12-31"),
            departmentNumber: department._id,
        });
        console.log("Binnacle: \n", newBinnacleEntry);
        await newBinnacleEntry.save();
        return [newBinnacleEntry, null];
    } catch (error) {
        handleError(error, "binnacle.service -> createEntry");
        return [null, "Error en el servidor"];
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
        const department = await Department.findById(binnacleData.departmentNumber);
        console.log("department ", department);
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
        return [null, "Error en el servidor"];
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
            endTime: endTime,
            userId: userId
         });
        await newBinnacleEntry.save();
        return [newBinnacleEntry, null];
    }catch(error){
        handleError(error, "binnacle.service -> createEntryBooking");
        return [null, "Error en el servidor"];
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

        // Paso 5: Obtener los detalles de los departamentos usando _id
        const departments = await Department.find({ _id: { $in: departmentIds } })
            .select('_id departmentNumber')
            .lean();

        // Crear un diccionario de departamentos para acceso rápido
        const departmentDict = {};
        departments.forEach(department => {
            departmentDict[department._id] = department.departmentNumber;
        });

        // Paso 6: Combinar los resultados
        const formattedBinnacles = binnacles.map(entry => {
            return {
                janitorID: janitorDict[entry.janitorID],
                _id: entry._id,
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
        handleError(error, "binnacle.service -> getBinnaclesVisitor");
    }
}

/**
 * Obtener todas las entradas de la bitácora por Espacios Comunitarios
 */
async function getBinnaclesBooking() {
    try {
        // Paso 1: Obtener los registros de Binnacle con activityType "Espacio Comunitario"
        const binnacles = await Binnacle.find({ activityType: "Espacio Comunitario" })
            .select('janitorID activityType spaceId startTime endTime userId createdAt')
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

        // Paso 5: Obtener los detalles de los espacios comunitarios usando _id
        const spaces = await CommonSpace.find({ _id: { $in: spaceIds } })
            .select('type location')
            .lean();

        // Crear un diccionario de espacios para acceso rápido
        const spaceDict = {};
        spaces.forEach(space => {
            spaceDict[space._id] = space.type + " - " + space.location;
        });


        //paso 6: Extraer los userId únicos

        const userIds = [...new Set(binnacles.map(binnacle => binnacle.userId))];
        // Paso 7: Obtener los detalles de los usuarios usando _id
        const users = await Users.find({ _id: { $in: userIds } })
            .select('firstName lastName')
            .lean();


        // Crear un diccionario de usuarios para acceso rápido
        const userDict = {};
        users.forEach(user => {
            userDict[user._id] = `${user.firstName} ${user.lastName}`;
        });
        const now = new Date();
        if (new Date(binnacles.startTime) < now) return [null, "No se puede reservar en una fecha anterior a la actual"];
        if (new Date(binnacles.endTime) <= new Date(binnacles.startTime)) return [null, "La fecha de finalización debe ser posterior a la fecha de inicio"];
        // Paso 8: Combinar los resultados
        const formattedBinnacles = binnacles.map(entry => {
            return {
                janitorID: janitorDict[entry.janitorID],
                _id: entry._id,
                activityType: entry.activityType,
                spaceId: spaceDict[entry.spaceId],
                startTime: entry.startTime,
                endTime: entry.endTime,
                userId: userDict[entry.userId],
                createdAt: entry.createdAt
            };
        });

        return [formattedBinnacles, null];
    } catch (error) {
        handleError(error, "binnacle.service -> getBinnaclesBooking");
    }
}

/**
 * Obtener todas las entradas de la bitácora por Delivery
 */
async function getBinnaclesDelivery() {
    try {
        // Paso 1: Obtener los registros de Binnacle con activityType "Delivery"
        const binnacles = await Binnacle.find({ activityType: "Delivery" })
            .select('janitorID activityType departmentNumber recipientFirstName recipientLastName deliveryTime withdrawnTime deliveryPersonName status createdAt')
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

        // Paso 5: Obtener los detalles de los departamentos usando _id
        const departments = await Department.find({ _id: { $in: departmentIds } })
            .select('_id departmentNumber')
            .lean();

        // Crear un diccionario de departamentos para acceso rápido
        const departmentDict = {};
        departments.forEach(department => {
            departmentDict[department._id] = department.departmentNumber;
        });

        // Paso 6: Combinar los resultados
        const formattedBinnacles = binnacles.map(entry => {
            return {
                janitorID: janitorDict[entry.janitorID],
                activityType: entry.activityType,
                departNumber: departmentDict[entry.departmentNumber],
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
        handleError(error, "binnacle.service -> getBinnaclesDelivery");
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

        // Paso 4: Obtener los IDs de los departamentos de las entradas de la bitácora
        const departmentIds = [...new Set(binnacles.map(binnacle => binnacle.departmentNumber))];
        console.log("DEPARTMENTS IDS", departmentIds);

        // Paso 5: Obtener los detalles de los departamentos usando _id
        const departments = await Department.find({ _id: { $in: departmentIds } })
            .select('_id departmentNumber')
            .lean();
        console.log("DEPARTMENTS", departments);

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

        // Crear un diccionario de departamentos para acceso rápido
        const departmentDict = {};
        departments.forEach(department => {
            departmentDict[department._id] = department.departmentNumber;
        });

        // Crear un diccionario para mapear janitorID a nombres completos
        const janitorDict = {};
        janitors.forEach(janitor => {
            janitorDict[janitor._id] = `${janitor.firstName} ${janitor.lastName}`;
        });

        // Reemplazar janitorID por nombres completos y departmentID por números de departamento en las entradas de la bitácora
        const formattedBinnacles = binnacles.map(entry => {
            return {
                ...entry,
                janitorID: janitorDict[entry.janitorID] || 'Nombre no encontrado',
                departmentNumber: departmentDict[entry.departmentNumber],
                spaceId: spaceDict[entry.spaceId],
            };
        });

        return [formattedBinnacles, null];
    } catch (error) {
        handleError(error, "binnacle.service -> getBinnacleByJanitorName");
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
        handleError(error, "binnacle.service -> getBinnacleByDate");
    }
}

/**
 * Obtener la entrada de la bitacora por ID
 */
async function getBinnacleById(id) {
    try {
        const binnacle = await Binnacle.findById(id).lean();
        if (!binnacle) {
            return [null, "No se encontró la bitácora"];
        }

        // Obtener el ID del conserje de la bitácora
        const janitorId = binnacle.janitorID;

        // Obtener el nombre del conserje
        const janitor = await Users.findById(janitorId).select('firstName lastName').lean();
        if (!janitor) {
            return [null, "No se encontró el conserje"];
        }

        // Formatear el janitorID para que incluya el nombre completo del conserje
        const janitorFullName = `${janitor.firstName} ${janitor.lastName}`;
        binnacle.janitorID = janitorFullName;

        return [binnacle, null];
    } catch (error) {
        handleError(error, "binnacle.service -> getBinnacleById");
        return [null, "Error en el servidor"];
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
        handleError(error, "binnacle.service -> getBinnacles");
    }
}

/**
 * Funcion para eliminar una entrada por su ID
 */
async function deleteBinnacleId(id) {
    try {
        return await Binnacle.findByIdAndDelete(id);
    } catch (error) {
       handleError(error, "binnacle.service -> deleteBinnacleId");
    }
}

/**
 * Actualiza una entrada en la bitácora.
 * @param {String} id - ID de la entrada a actualizar.
 * @param {Object} updateData - Datos a actualizar.
 * @returns {Promise} Promesa con la entrada de bitácora actualizada.
 */
async function updateBinnacle(id, updateData) {
    try {
        const binnacle = await Binnacle.findById(id);
        if (!binnacle) return [null, "No se encontró la bitácora"];

        // Verificar y convertir janitorID a ObjectId si es necesario
        if (typeof updateData.janitorID === 'string') {
            const janitor = await Users.findOne({ $or: [{ firstName: updateData.janitorID.split(' ')[0] }, { lastName: updateData.janitorID.split(' ')[1] }] }).lean();
            if (janitor) {
                updateData.janitorID = janitor._id;
            } else {
                return [null, "No se encontró el conserje con ese nombre"];
            }
        }

        // Actualizar campos comunes
        Object.assign(binnacle, updateData);

        // Limpiar campos no necesarios según el tipo de actividad
        if (binnacle.activityType !== 'Visita') {
            binnacle.roles = undefined;
            binnacle.exitDate = undefined;
        }
        if (binnacle.activityType !== 'Delivery') {
            binnacle.departNumber = undefined;
            binnacle.recipientFirstName = undefined;
            binnacle.recipientLastName = undefined;
            binnacle.deliveryTime = undefined;
            binnacle.withdrawnTime = undefined;
            binnacle.withdrawnResidentId = undefined;
            binnacle.withdrawnPersonFirstName = undefined;
            binnacle.withdrawnPersonLastName = undefined;
            binnacle.expectedWithdrawnPersonFirstName = undefined;
            binnacle.expectedWithdrawnPersonLastName = undefined;
            binnacle.deliveryPersonName = undefined;
            binnacle.status = undefined;
        }
        if (binnacle.activityType !== 'Espacio Comunitario') {
            binnacle.spaceId = undefined;
            binnacle.startTime = undefined;
            binnacle.endTime = undefined;
        }

        await binnacle.save();
        return [binnacle, null];
    } catch (error) {
        handleError(error, "binnacle.service -> updateBinnacle");
        return [null, "Error en el servidor"];
    }

}
async function generateDailyReport() {
    try {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
  
      const binnacles = await Binnacle.find({
        createdAt: {
          $gte: start,
          $lte: end
        }
      }).lean();
  
      return binnacles;
    } catch (error) {
      console.error('Error al generar el reporte diario:', error);
      throw error;
    }
  }



export default {
    exportBinnacleToExcel,
    createEntryVisitor,
    createEntryBooking,
    createEntryDelivery,
    getBinnaclesBooking,
    getBinnaclesVisitor,
    getBinnaclesDelivery,
    getBinnacleByJanitorName,
    getBinnacleByDate,
    getBinnacles,
    getBinnacleById,
    deleteBinnacleId,
    updateBinnacle,
    generateDailyReport,
};
