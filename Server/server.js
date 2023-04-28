const express = require("express");
const producerRoutes = require("./Routes/ProducerRoutes");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

app.use('/api/produce', producerRoutes);

const port = process.env.PORT || 6969;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`)
});