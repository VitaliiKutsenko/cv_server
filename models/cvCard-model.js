const { ObjectId } = require('mongodb');
const { Schema, model, Mongoose } = require('mongoose');

const CvDataSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
        collections: [
            {
                name: { type: String, required: true },
                data: { type: Schema.Types.ObjectId, ref: 'CvModel' },
            },
        ],
    },
    { minimize: false, timestamp: true }
);
module.exports = model('CvData', CvDataSchema);
