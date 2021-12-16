const bcrypt = require("bcryptjs");

function hashValue(plainValue) {
  return bcrypt.hashSync(plainValue, 10);
}

function verifyHash(hashedPass, hash) {
  if (bcrypt.compareSync(hashedPass, hash)) {
    return true;
  }
  // return bcrypt.compareSync(hashedPass, hash)
}

module.exports = {
  hashValue,
  verifyHash,
};
