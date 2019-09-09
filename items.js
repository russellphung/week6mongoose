var mongoose = require('mongoose');

let itemSchema = mongoose.Schema({
    name: String,
    quantity: Number,
    made:{
        type: Date,
        default: Date.now
    },
    
    warehouse:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'warehouse'
    }
});

let itemModel = mongoose.model('item', itemSchema, 'item');
module.exports = itemModel;