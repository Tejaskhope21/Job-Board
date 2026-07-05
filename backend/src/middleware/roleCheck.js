export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions' });
    }
    
    next();
  };
};

export const isAdmin = checkRole(['admin']);
export const isEmployer = checkRole(['admin', 'employer']);
export const isCandidate = checkRole(['admin', 'candidate']);