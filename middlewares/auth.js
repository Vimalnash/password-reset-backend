import { getUserById } from "../controllers/user";
import { verifyToken } from "../helpers/auth";
import { authError } from "../helpers/util";

// Middleware to check whether authenticated user only accessing.
// Used when applicable
export async function isUserAuthenticated(req, res, next) {
    if (req.headers["x-auth-token"]) {
        try {
            const token = await req.headers["x-auth-token"];
            const userId = verifyToken(token);
            if (!userId) {
                return authError(res, "Invalid Token");
            }
            req.user = await getUserById(userId);
            next();
        } catch (error) {
            return authError(res, "Invalid Authorization")
        }

    } else {
        return authError(res, "Invalid Authorization")
    }
};

