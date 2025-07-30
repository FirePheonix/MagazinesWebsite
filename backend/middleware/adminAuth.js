import User from "../models/user.model.js";

export const requireAdmin = async (req, res, next) => {
    try {
        const clerkUserId = req.auth?.userId;

        if (!clerkUserId) {
            return res.status(401).json({ error: "Not authenticated!" });
        }

        const user = await User.findOne({ clerkUserId });

        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }

        // Check if user is admin based on Clerk publicMetadata
        const isAdmin = req.auth?.publicMetadata?.role === "admin" || false;

        if (!isAdmin) {
            return res.status(403).json({ error: "Admin access required!" });
        }

        // Add user info to request for use in controllers
        req.user = user;
        req.isAdmin = isAdmin;
        
        next();
    } catch (error) {
        console.error("Admin auth error:", error);
        res.status(500).json({ error: "Authentication failed" });
    }
}; 