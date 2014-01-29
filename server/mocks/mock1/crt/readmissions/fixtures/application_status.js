module.exports = {
  success: {
    result: true
  },
  sql_server_failure: {
    result: false,
    error_messages: ['SQL Server Failure']
  },
  data_load_falure: {
    result: false,
    error_messages: ['Data Load Failure']
  },
  critical_error_logged: {
    result: false,
    error_messages: ['Critical Error Logged: $error_message']
  }
};