const crypto = require('crypto');

exports.hashPassword = (password)=> {
    // const s = email + ':' + password;
    return crypto.createHash('sha256').update(password).digest('hex');
}