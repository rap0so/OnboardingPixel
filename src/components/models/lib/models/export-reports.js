const mongoose = require('mongoose')
const Schema = mongoose.Schema
const paginate = require('mongoose-paginate')

const reportSchema = new Schema({
    master: {type: Schema.Types.ObjectId, ref: 'master', required: true},
    memberId: String,
    file: String,
    params: String,
    etag: String,
    isDeleted: {type: Boolean, default: false}
}, {
    timestamps: true
})

reportSchema.plugin(paginate)

module.exports = mongoose.model('export_reports', reportSchema)