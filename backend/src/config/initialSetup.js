"use strict";
// Importa el modelo de datos 'Role'
import Role from "../models/role.model.js";
import User from "../models/user.model.js";
import Department from "../models/department.model.js";

/**
 * Crea los roles por defecto en la base de datos.
 * @async
 * @function createRoles
 * @returns {Promise<void>}
 */
async function createRoles() {
  try {
    // Busca todos los roles en la base de datos
    const count = await Role.estimatedDocumentCount();
    // Si no hay roles en la base de datos los crea
    if (count > 0) return;

    await Promise.all([
      new Role({ name: "user" }).save(),
      new Role({ name: "admin" }).save(),
      new Role({ name: "janitor" }).save(),
    ]);
    console.log("* => Roles creados exitosamente");
  } catch (error) {
    console.error(error);
  }
}

/**
 * Crea los usuarios por defecto en la base de datos.
 * @async
 * @function createUsers
 * @returns {Promise<void>}
 */
async function createUsers() {
  try {
    const count = await User.estimatedDocumentCount();
    if (count > 0) return;

    const admin = await Role.findOne({ name: "admin" });
    const user = await Role.findOne({ name: "user" });
    const janitor = await Role.findOne({ name: "janitor" });

    await Promise.all([
      new User({
        firstName: "user",
        lastName: "user",
        email: "user@email.com",
        rut: "12345678-9",
        password: await User.encryptPassword("user123"),
        roles: user._id,
      }).save(),
      new User({
        firstName: "admin",
        lastName: "admin",
        email: "admin@email.com",
        rut: "12345678-0",
        password: await User.encryptPassword("admin123"),
        roles: admin._id,
      }).save(),
      
      new User({
        firstName: "janitor",
        lastName: "janitor",
        email: "janitor@email.com",
        rut: "12345678-8",
        password: await User.encryptPassword("janitor123"),
        roles: janitor._id,
      }).save()
    ]);
    console.log("* => Users creados exitosamente");
  } catch (error) {
    console.error(error);
  }
}

/**
 * Crea un departamento por defecto en la base de datos.
 */
async function createDepartments() {
  try {
    const count = await Department.countDocuments();
    if (count > 0) return;

    await new Department({
      departmentNumber: 101,
      residentId: []  // Sin residentes inicialmente
    }).save();
    console.log("* => Departamento creado exitosamente");
  } catch (error) {
    console.error(error);
  }
}

export { createRoles, createUsers, createDepartments };
