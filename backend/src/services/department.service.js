"use strict";
// Importa los modelos necesarios
import Department from "../models/department.model.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Obtiene todos los departamentos de la base de datos
 * @returns {Promise} Promesa con el objeto de los departamentos
 */
async function getDepartments() {
  try {
    const departments = await Department.find().populate("residentId").sort({ departmentNumber: 1 }).exec();
    
    if (!departments) return [null, "No hay departamentos"];

    return [departments, null];
  } catch (error) {
    handleError(error, "department.service -> getDepartments");
  }
}

/**
 * Crea un nuevo departamento en la base de datos
 * @param {Object} department Objeto de departamento
 * @returns {Promise} Promesa con el objeto de departamento creado
 */
async function createDepartment(department) {
  try {
    const { departmentNumber, residentId } = department;

    const departmentFound = await Department.findOne({ departmentNumber });
    if (departmentFound) return [null, "El departamento ya existe"];

    const newDepartment = new Department({
      departmentNumber,
      residentId
    });
    await newDepartment.save();

    return [newDepartment, null];
  } catch (error) {
    handleError(error, "department.service -> createDepartment");
  }
}

/**
 * Obtiene un departamento por su id de la base de datos
 * @param {string} id Id del departamento
 * @returns {Promise} Promesa con el objeto de departamento
 */
async function getDepartmentById(id) {
  try {
    const department = await Department.findById({ _id: id }).exec();

    if (!department) return [null, "El departamento no existe"];

    return [department, null];
  } catch (error) {
    handleError(error, "department.service -> getDepartmentById");
  }
}

/**
 * Actualiza un departamento por su id en la base de datos
 * @param {string} id Id del departamento
 * @param {Object} department Objeto de departamento
 * @returns {Promise} Promesa con el objeto de departamento actualizado
 */
async function updateDepartment(id, department) {
  try {
    const departmentFound = await Department.findById(id);
    if (!departmentFound) return [null, "El departamento no existe"];

    // Filtrar solo los campos que están presentes en el objeto department
    const updateFields = {};
    if (department.departmentNumber) updateFields.departmentNumber = department.departmentNumber;
    if (department.residentId) updateFields.residentId = department.residentId;

    const departmentUpdated = await Department.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    return [departmentUpdated, null];
  } catch (error) {
    handleError(error, "department.service -> updateDepartment");
  }
}

/**
 * Elimina un departamento por su id de la base de datos
 * @param {string} id Id del departamento
 * @returns {Promise} Promesa con el objeto de departamento eliminado
 */
async function deleteDepartment(id) {
  try {
    return await Department.findByIdAndDelete(id);
  } catch (error) {
    handleError(error, "department.service -> deleteDepartment");
  }
}

export default {
  getDepartments,
  createDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
