const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IssueSchema = new Schema({
        issue_id: Schema.Types.ObjectId,
        user_id: Schema.Types.ObjectId,
        message: String,
        status: String,
    },
    {timestamps: true});

module.exports = mongoose.model('Issue', IssueSchema);

