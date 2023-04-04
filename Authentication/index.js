const app = require("./app");
const { API_PORT } = process.env; //Same as process.env.port

app.listen(API_PORT, () => {
  console.log(`Server is running at port ${API_PORT}...`);
});
