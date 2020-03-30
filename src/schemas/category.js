const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
        category_id: String,
        parent_id: String,
        child_ids: {type: [String], default: []},
        name: String,
        description: String
    },
    {timestamps: true}
);


module.exports = mongoose.model('Category', CategorySchema);
