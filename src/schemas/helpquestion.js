const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HelpQuestionSchema = new Schema({
        topic_id: Schema.Types.ObjectId,
        question_text: String,
        answer_text: String,
        read_more: {
            type: Boolean,
            default: false
        },
        number_views: {
          type: Number,
          default: 0
        }
    },
    {
        toObject: {virtuals: true},
    },
    {timestamps: true});

HelpQuestionSchema.virtual('helptopic', {
    ref: 'HelpTopic',
    localField: 'topic_id',
    foreignField: '_id'
});


module.exports = mongoose.model('HelpQuestion', HelpQuestionSchema);

