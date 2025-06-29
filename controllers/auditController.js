// controllers/auditController.js
const { AuditLog } = require("../models");

exports.getAuditLogs = async (req, res) => {
  try {
    const { page = 1, pageSize = 50, table, recordId } = req.query;
    const offset = (page - 1) * pageSize;

    const where = {};
    if (table) where.table_name = table;
    if (recordId) where.record_id = recordId;

    const { count, rows } = await AuditLog.findAndCountAll({
      where,
      order: [["created_at", "DESC"]],
      offset,
      limit: parseInt(pageSize),
    });

    res.json({
      total: count,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      logs: rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRequestTrace = async (req, res) => {
  try {
    const { requestId } = req.params;

    const logs = await AuditLog.findAll({
      where: { request_id: requestId },
      order: [["created_at", "ASC"]],
    });

    if (!logs.length) {
      return res.status(404).json({ error: "Request trace not found" });
    }

    res.json({
      requestId,
      trace: logs.map((log) => ({
        action: log.action,
        table: log.table_name,
        record: log.record_id,
        timestamp: log.created_at,
        user: `${log.user_type}:${log.user_id}`,
        ip: log.ip_address,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
