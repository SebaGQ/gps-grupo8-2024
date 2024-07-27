"use strict";
import mongoose from "mongoose";
import CATEGORIES from "../constants/binnaclecategories.constants.js";
import ORDER_STATUSES from "../constants/orderstatus.constants.js";

const binnacleSchema = new mongoose.Schema({
    janitorID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    activityType: {
        type: String,
        enum: CATEGORIES,
        required: true
    },
    // Si es Visita
    name: {
        type: String,
      //  required: function() { return this.activityType === 'Visita'; }
    },
    lastName: {
        type: String,
     //   required: function() { return this.activityType === 'Visita'; }
    },
    rut: {
        type: String,
       // required: function() { return this.activityType === 'Visita'; }
    },
    roles: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
       // default: function() { return this.activityType === 'Visita' ? 'visitor': null;},
      //  required: function() { return this.activityType === 'Visita'; },
    },
    departmentNumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
      //  required: function() { return this.activityType === 'Visita'; }
    },
    exitDate: {
        type: Date,
      //  required: function() { return this.activityType === 'Visita'; },
        default: new Date("9999-12-31")        
    },
    // Si es Delivery
    recipientFirstName: {
        type: String,
       // required: function() { return this.activityType === 'Delivery'; }
    },
    recipientLastName: {
        type: String,
      //  required: function() { return this.activityType === 'Delivery'; }
    },
    deliveryTime: {
        type: Date,
      //  required: function() { return this.activityType === 'Delivery'; }
    },
    withdrawnTime: {
        type: Date,
      //  required: function() { return this.activityType === 'Delivery'; }
    },
    withdrawnResidentId: {
        type: mongoose.Schema.Types.ObjectId,
      //  required: function() { return this.activityType === 'Delivery'; }
    },
    withdrawnPersonFirstName: {
        type: String,
       // required: function() { return this.activityType === 'Delivery'; }
    },
    withdrawnPersonLastName: {
        type: String,
       // required: function() { return this.activityType === 'Delivery'; }
    },
    expectedWithdrawnPersonFirstName: {
        type: String,
        //required: function() { return this.activityType === 'Delivery'; }
    },
    expectedWithdrawnPersonLastName: {
        type: String,
        //required: function() { return this.activityType === 'Delivery'; }
    },
    deliveryPersonName: {
        type: String,
        //required: function() { return this.activityType === 'Delivery'; }
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      //required: function() { return this.activityType === 'Delivery'; }
    },
  // Si es Espacio Comunitario
  spaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CommonSpace",
    required: function() { return this.activityType === 'Espacio Comunitario'; }
    },
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     required: function() { return this.activityType === 'Espacio Comunitario'; }
    // },
    startTime: {
        type: Date,
        //required: function() { return this.activityType === 'Espacio Comunitario'; }
    },
    endTime: {
        type: Date,
        //required: function() { return this.activityType === 'Espacio Comunitario'; }
    },
}, {
    timestamps: true,
    versionKey: false
});
// Si la actividad no es una visita, se eliminan los campos relacionados a la visita
binnacleSchema.pre('save', function(next) {
    if (this.activityType !== 'Visita') {
        this.roles = undefined;
        this.exitDate = undefined;
    }
    if(this.activityType !== 'Delivery') {
        this.departmentNumber = undefined;
        this.recipientFirstName = undefined;
        this.recipientLastName = undefined;
        this.deliveryTime = undefined;
        this.withdrawnTime = undefined;
        this.withdrawnResidentId = undefined;
        this.withdrawnPersonFirstName = undefined;
        this.withdrawnPersonLastName = undefined;
        this.expectedWithdrawnPersonFirstName = undefined;
        this.expectedWithdrawnPersonLastName = undefined;
        this.deliveryPersonName = undefined;
        this.status = undefined;
    }
    if(this.activityType !== 'Espacio Comunitario') {
        this.spaceId = undefined;
        this.startTime = undefined;
        this.endTime = undefined;
    }
    next();
});

const Binnacle = mongoose.model("Binnacle", binnacleSchema);

export default Binnacle;
