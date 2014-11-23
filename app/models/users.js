// Setup our requirements
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// Define a Schema Model for Users
var userSchema = mongoose.Schema({
    local: {
        email:    String,
        password: String
    }
});

// Gerenate a hash
userSchema.methods.gerenateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Check if password is valid
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
