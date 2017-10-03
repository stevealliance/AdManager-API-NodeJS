// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// Schema for Publication Collection
var classifiedRatesSchema = new mongoose.Schema({
    IsDeleted: Boolean,
    Name: String,
    Type: String,
    Language: String,
    CommissionRateForAdvertisments: Number,
    CommisionRateForClassifieds: Number,
});

// Return model
module.exports = restful.model('ClassifiedRates',classifiedRatesSchema);