const app = require("./app");

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

module.exports = app;