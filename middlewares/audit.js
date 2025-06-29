const { AuditLog } = require("../models");
const { v4: uuidv4 } = require("uuid");

module.exports = () => {
  return async (req, res, next) => {
    const requestId = uuidv4();
    req.requestId = requestId;

    try {
      // Catat request masuk (handle null values)
      await AuditLog.create({
        action: "REQUEST_START",
        table_name: req.path,
        record_id: null, // Explicit null
        user_id: req.user?.id || null,
        user_type: req.user?.role || "anonymous",
        ip_address: req.ip,
        request_id: requestId,
        new_data: {
          method: req.method,
          url: req.originalUrl,
          headers: req.headers,
          body: req.body,
        },
      });
    } catch (error) {
      console.error("REQUEST_START audit error:", error);
    }

    const originalSend = res.send;
    res.send = function (body) {
      // Catat response (handle null values)
      try {
        AuditLog.create({
          action: "REQUEST_END",
          table_name: req.path,
          record_id: null, // Explicit null
          user_id: req.user?.id || null,
          user_type: req.user?.role || "anonymous",
          ip_address: req.ip,
          request_id: requestId,
          new_data: {
            status: res.statusCode,
            response: body,
          },
        }).catch(console.error);
      } catch (error) {
        console.error("REQUEST_END audit error:", error);
      }

      return originalSend.call(this, body);
    };

    next();
  };
};

// Fungsi untuk mencatat perubahan data
module.exports.logDataChange = async (
  action,
  tableName,
  recordId,
  user,
  ip,
  oldData,
  newData
) => {
  try {
    await AuditLog.create({
      action,
      table_name: tableName,
      record_id: recordId,
      user_id: user?.id || null, // Handle potential null user
      user_type: user?.role || "system",
      ip_address: ip,
      old_data: oldData,
      new_data: newData,
    });
  } catch (error) {
    console.error("Data change audit error:", error);
  }
};
