"use strict";
// Importa los modelos necesarios
import Visitor from "../models/visitor.model.js";
import Department from "../models/department.model.js";
import Role from "../models/role.model.js";
import { handleError } from "../utils/errorHandler.js";

import BinnacleService from "./binnacle.service.js";
/**
 * Obtiene todos los visitantes de la base de datos
 * @returns {Promise} Promesa con el objeto de los visitantes
 */
async function getVisitors() {
  try {
    const visitors = await Visitor.find().populate("departmentNumber").populate("roles").exec();
    if (!visitors) return [null, "No hay visitantes"];

    return [visitors, null];
  } catch (error) {
    handleError(error, "visitor.service -> getVisitors");
  }
}

/**
 * Gets all visitors who have not exited yet
 * @returns {Promise} Promise with the found visitors
 */
async function getActiveVisitors() {
  try {
    const activeVisitors = await Visitor.find({ exitDate: new Date('9999-12-31') }).populate("departmentNumber").populate("roles").exec();;

    if (!activeVisitors || activeVisitors.length === 0) {
      return [null, "No active visitors found"];
    }

    return [activeVisitors, null];
  } catch (error) {
    handleError(error, "visitor.service -> getActiveVisitors");
    return [null, error.message];
  }
}

/**
 * Obtiene todos los visitantes de la base de datos
 * @returns {Promise} Promesa con el objeto de los visitantes
 */
async function getFrequentVisitors() {
  try {
    const frequentVisitors = await Visitor.aggregate([
      { $match: { frequent: true } },
      { $sort: { visitDate: -1 } },
      {
        $group: {
          _id: "$rut",
          latestVisit: { $first: "$$ROOT" }
        }
      },
      {
        $replaceRoot: { newRoot: "$latestVisit" }
      },
      { $sort: { visitDate: -1 } } 
    ]);

    if (!frequentVisitors || frequentVisitors.length === 0) {
      return [null, "No se encontraron visitantes frecuentes"];
    }

    return [frequentVisitors, null];
  } catch (error) {
    handleError(error, "visitor.service -> getFrequentVisitors");
    return [null, error.message];
  }
}

/**
 * Crea un nuevo visitante en la base de datos
 * @param {Object} visitor Objeto de visitante
 * @returns {Promise} Promesa con el objeto de visitante creado
 */
// visitor.service.js
async function createVisitor(req) {
  try {
    let email = req.email;
    let visitor = req.body;
    const now = new Date();
    
    const existingVisitor = await Visitor.findOne({ rut: visitor.rut }).sort({ exitDate: -1 });

    // Verifica si el departamento existe
    const department = await Department.findById(visitor.departmentNumber);
    if (!department) return [null, "El número de departamento no es válido."];

    let rolesFound = [];
    const defaultRole = await Role.findOne({ name: "visitor" });
    if (!defaultRole) return [null, "El rol predeterminado no existe"];
    rolesFound = [defaultRole];
    const myRole = rolesFound.map((role) => role._id);
    
    const newVisitor = new Visitor({
      name: visitor.name,
      lastName: visitor.lastName,
      rut: visitor.rut,
      roles: myRole,  // Actualizamos esto para asegurarnos de que los roles se asignen correctamente
      departmentNumber: visitor.departmentNumber,
      entryDate: new Date(), // Fecha de ingreso actual
      exitDate: new Date("9999-12-31"), // Fecha de salida indefinida
    });

    // Verificar si el visitante ya está registrado y si la fecha de salida es menor a la hora actual
    if (existingVisitor && existingVisitor.exitDate && new Date(existingVisitor.exitDate) > now) {
      return [null, "El visitante con este RUT ya está registrado y aún no ha salido."];
    }

    //await BinnacleService.createEntryVisitor(req);
    await newVisitor.save();

    // Verificar si es frecuente
    const visitas = await Visitor.countDocuments({ rut: visitor.rut });
    if (visitas > 3) {
      await Visitor.updateMany({ rut: visitor.rut }, { frequent: true });
    }

    return [newVisitor, null];
  } catch (error) {
    handleError(error, "visitor.service -> createVisitor");
    return [null, "Error interno del servidor"];
  }
}


/**
 * Obtiene un visitante por su id de la base de datos
 * @param {string} id Id del visitante
 * @returns {Promise} Promesa con el objeto de visitante
 */
async function getVisitorById(id) {
  try {
    const visitor = await Visitor.findById({ _id: id })
      .populate("departmentNumber")
      .populate("roles")
      .exec();

    if (!visitor) return [null, "El visitante no existe"];

    return [visitor, null];
  } catch (error) {
    handleError(error, "visitor.service -> getVisitorById");
  }
}

/**
 * Actualiza un visitante por su id en la base de datos
 * @param {string} id Id del visitante
 * @param {Object} visitor Objeto de visitante
 * @returns {Promise} Promesa con el objeto de visitante actualizado
 */
async function updateVisitor(id, visitor) {
  try {
    const visitorFound = await Visitor.findById(id);
    if (!visitorFound) return [null, "El visitante no existe"];

    const { name, lastName, rut, departmentNumber } = visitor;

    // Verifica si el departamento existe
    const department = await Department.findById(departmentNumber);
    if (!department) return [null, "El número de departamento no es válido."];
    

    const visitorUpdated = await Visitor.findByIdAndUpdate(
      id,
      {
        name,
        lastName,
        rut,
        departmentNumber,
      },
      { new: true },
    );

    return [visitorUpdated, null];
  } catch (error) {
    handleError(error, "visitor.service -> updateVisitor");
  }
}

/**
 * Actualiza la fecha de salida de un visitante por su id en la base de datos
 * @param {string} id Id del visitante
 * @param {Date} exitDate Fecha de salida
 * @returns {Promise} Promesa con el objeto de visitante actualizado
 */
async function updateVisitorExitDate(id, exitDate) {
  try {
    const visitorFound = await Visitor.findById(id);
    if (!visitorFound) return [null, "El visitante no existe"];

    const visitorUpdated = await Visitor.findByIdAndUpdate(
      id,
      {
        exitDate,
      },
      { new: true },
    );

    return [visitorUpdated, null];
  } catch (error) {
    handleError(error, "visitor.service -> updateVisitorExitDate");
  }
}

/**
 * Elimina un visitante por su id de la base de datos
 * @param {string} id Id del visitante
 * @returns {Promise} Promesa con el objeto de visitante eliminado
 */
async function deleteVisitor(id) {
  try {
    return await Visitor.findByIdAndDelete(id);
  } catch (error) {
    handleError(error, "visitor.service -> deleteVisitor");
  }
}

export default {
  getVisitors,
  getActiveVisitors,
  createVisitor,
  getVisitorById,
  getFrequentVisitors,
  updateVisitor,
  updateVisitorExitDate,
  deleteVisitor,
};
