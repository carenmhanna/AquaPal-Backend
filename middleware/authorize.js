// ...new file...
export const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const role = req.user.role || "user";
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (roles.length > 0 && !roles.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

// ownership check helper: getOwnerIdFn may be async and should return owner id for the resource
export const requireOwnership = (getOwnerIdFn) => {
  return async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const ownerId = await getOwnerIdFn(req);
      if (!ownerId || String(ownerId) !== String(req.user.id)) {
        return res.status(403).json({ message: "Forbidden: not resource owner" });
      }
      next();
    } catch (err) {
      console.error("requireOwnership error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  };
};