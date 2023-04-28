const express = require("express");
const produce = require("../Middleware/ProducerMiddlewares");
const router = express.Router();

router.get('/', produce);

module.exports = router