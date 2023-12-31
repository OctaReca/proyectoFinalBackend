import UserManager from "../dao/UserManager.js";
import { ENV_CONFIG } from "../config/config.js";
import CartManager from "../dao/CartManager.js";

class UserService {
    constructor() {
        this.userManager = new UserManager();
        this.CartManager = new CartManager();
    }

    async registerUser({
        first_name,
        last_name,
        email,
        age,
        password,
        role,
        last_connection,
    }) {
        try {
            const cartResponse = await this.CartManager.newCart();
            console.log("Cart response:", cartResponse);
            if (cartResponse.status !== "ok") {
                return { status: "error", message: "Error creating cart" };
            }

            const role =
                email === "adminCoder@coder.com" && password === "adminCod3r123"
                    ? "admin"
                    : email === "premium@premium.com" && password === "premiumCod3r123"
                        ? "premium"
                        : "user";

            const cartId = cartResponse.id;

            const user = await this.userManager.addUser({
                first_name,
                last_name,
                email,
                age,
                password,
                role,
                cart: cartId,
                last_connection,
            });

            if (user) {
                return { status: "success", user, redirect: "/login" };
            } else {
                return { status: "error", message: "User already exists" };
            }
        } catch (error) {
            return { status: "error", message: "Internal Server Error" };
        }
    }

    async restorePassword(user, hashedPassword) {
        return await this.userManager.restorePassword(user, hashedPassword);
    }
}

export default UserService;