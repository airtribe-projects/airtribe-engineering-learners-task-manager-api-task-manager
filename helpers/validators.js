function validateEmail(email) {
  return typeof email === "string" && /.+@.+\..+/.test(email);
}

module.exports = {
  validateEmail,
};
