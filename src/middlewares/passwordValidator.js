const passwordValidatorMiddleware = (req, res, next) => {
    const { password } = req.body;
  
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password harus memiliki minimal 6 karakter, minimal 1 huruf besar, minimal 1 simbol, dan minimal 1 angka",
      });
    }
  
    next();
  };
  
  module.exports = passwordValidatorMiddleware;
  