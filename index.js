const app = require("./app");
const configEnv = require("./utils/configEnv");

const PORT = configEnv.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
