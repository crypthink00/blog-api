// src/middleware/validate.js
export const validate = (schema) => (req, res, next) => {
  try {
    // parse() will throw an error if data doesn't match schema
    schema.parse(req.body);
    next();
  } catch (error) {
    // Return a clean error message back to the user
    return res.status(400).json({
      status: "error",
      errors: error.errors.map((err) => ({
        field: err.path[0],
        message: err.message,
      })),
    });
  }
};
