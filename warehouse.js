var mongoose = require('mongoose');

let warehouseSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    capacity:{
        type: Number,
        min: 1,
        max: 10000
    },
    address: {
        type: String
    }
});

let warehouseModel = mongoose.model('warehouse', warehouseSchema, 'warehouseCustomName');
module.exports = warehouseModel;