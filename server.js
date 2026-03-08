require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");
connectDB();
const port = 5000;


app.get('/', (req, res) => {
  res.send('hello and welcome');
})

app.listen(port, () => {
  console.log(`my server is running on: ${port}`)
})