const express = require("express");
const { newContact } = require("../controllers/contactController");
const router = express.Router();

router.route("/contact/new").post(newContact);

module.exports = router;
