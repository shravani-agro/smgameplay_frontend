export function parseApiError(error: any, defaultMessage: string = "An unexpected error occurred"): string {
  // If it's just a string, return it directly
  if (typeof error === "string") return error;

  let msgStr = defaultMessage;

  // Try to parse typical Axios error structures
  if (error?.response?.data) {
    const data = error.response.data;
    if (typeof data.detail === "string") {
      msgStr = data.detail;
    } else if (Array.isArray(data.detail) && data.detail.length > 0) {
      const first = data.detail[0];
      if (first.msg) msgStr = first.msg;
    } else if (typeof data.message === "string") {
      msgStr = data.message;
    }
  } else if (error?.message) {
    msgStr = error.message;
  }

  // Clean technical jargon
  if (msgStr.includes("UNIQUE constraint failed") || msgStr.includes("UniqueViolation")) {
    return "This record already exists. Please use different details.";
  }
  if (msgStr.includes("psycopg2") || msgStr.includes("sqlalchemy") || msgStr.includes("sqlite3")) {
    return "A database conflict occurred. Please try again or use different details.";
  }
  if (msgStr.toLowerCase().includes("network error")) {
    return "Network connection issue. Please check your internet and try again.";
  }
  if (msgStr.toLowerCase().includes("internal server error")) {
    return "Something went wrong on the server. Please try again later.";
  }
  if (msgStr.includes("Unexpected token")) {
    return "Server returned invalid data. Please try again later.";
  }

  // Replace ugly Python exceptions
  if (msgStr.startsWith("Exception:") || msgStr.startsWith("Error:")) {
    msgStr = msgStr.replace(/^(Exception|Error):\s*/i, "");
  }

  return msgStr;
}
