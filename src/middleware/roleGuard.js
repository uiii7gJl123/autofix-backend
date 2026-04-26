import jwt from "jsonwebtoken";

// ─── التحقق من الـ Token ──────────────────────────────────
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "لا يوجد توكن — الرجاء تسجيل الدخول" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ error: "توكن غير صالح أو منتهي الصلاحية" });
  }
};

// ─── التحقق من الدور ─────────────────────────────────────
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "غير مصرح — الرجاء تسجيل الدخول" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `غير مسموح — هذه الصفحة للـ ${roles.join(" أو ")} فقط`
      });
    }

    next();
  };
};

// ─── اختصارات جاهزة لكل دور ──────────────────────────────
export const onlyUser         = allowRoles("user");
export const onlyWorkshop     = allowRoles("workshop");
export const onlyDistributor  = allowRoles("distributor");
export const onlyDriver       = allowRoles("driver");

// ─── صلاحيات مشتركة بين أكثر من دور ─────────────────────
export const workshopOrDriver      = allowRoles("workshop", "driver");
export const workshopOrDistributor = allowRoles("workshop", "distributor");
export const anyRole               = allowRoles("user", "workshop", "distributor", "driver");
