const { ObjectId } = require('mongodb');
const { Schema, model } = require('mongoose');

const CvSchema = new Schema(
    {
        collectionId: { type: String },
        collectionName: { type: String },
        image: { data: Buffer, contentType: String },
        data: {
            type: Object,
            default: {},
        },
    },
    { timestamps: true, minimize: false }
);

module.exports = model('CvModel', CvSchema);
