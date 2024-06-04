"use strict";
// Importa los modelos necesarios
import Visitor from "../models/visitor.model.js";
import Department from "../models/department.model.js";
import Role from "../models/role.model.js";
import { handleError } from "../utils/errorHandler.js";

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
 * Crea un nuevo visitante en la base de datos
 * @param {Object} visitor Objeto de visitante
 * @returns {Promise} Promesa con el objeto de visitante creado
 */
async function createVisitor(visitor) {
  try {
    const { name, lastName, rut, roles, departmentNumber } = visitor;

    // Verifica si el departamento existe
    const department = await Department.findById(departmentNumber);
    if (!department) return [null, "El número de departamento no es válido."];

    let rolesFound = [];
    const defaultRole = await Role.findOne({ name: "visitor" });
    if (!defaultRole) return [null, "El rol predeterminado no existe"];
    rolesFound = [defaultRole];
    const myRole = rolesFound.map((role) => role._id);

    const newVisitor = new Visitor({
      name,
      lastName,
      rut,
      roles: myRole,
      departmentNumber,
      entryDate: new Date(), // Fecha de ingreso actual
      exitDate: new Date("9999-12-31"), // Fecha de salida indefinida
    });
    await newVisitor.save();

    return [newVisitor, null];
  } catch (error) {
    handleError(error, "visitor.service -> createVisitor");
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

    const { name, lastName, rut, roles, departmentNumber, exitDate } = visitor;

    // Verifica si el departamento existe
    const department = await Department.findById(departmentNumber);
    if (!department) return [null, "El número de departamento no es válido."];
    
    let rolesFound = [];
    const defaultRole = await Role.findOne({ name: "visitor" });
    if (!defaultRole) return [null, "El rol predeterminado no existe"];
    rolesFound = [defaultRole];
    const myRole = rolesFound.map((role) => role._id);

    const visitorUpdated = await Visitor.findByIdAndUpdate(
      id,
      {
        name,
        lastName,
        rut,
        roles: myRole,
        departmentNumber,
        exitDate, // Fecha de salida proporcionada
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
  createVisitor,
  getVisitorById,
  updateVisitor,
  updateVisitorExitDate,
  deleteVisitor,
};
