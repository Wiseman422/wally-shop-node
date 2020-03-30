const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HelpTopicSchema = new Schema({
        name: String
    },
    {timestamps: true});

module.exports = mongoose.model('HelpTopic', HelpTopicSchema);

