// routes/audit.js
const express = require("express");
const router = express.Router();
const auditController = require("../controllers/auditController");
const { authenticate, isAdmin } = require("../middlewares/auth");

router.use(authenticate);
router.use(isAdmin);

router.get("/logs", auditController.getAuditLogs);
router.get("/trace/:requestId", auditController.getRequestTrace);

module.exports = router;
