import User from "../models/user.model.js";
import { Webhook } from "svix";
import { v4 as uuidv4 } from "uuid";

export const clerkWebhook = async (req, res) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("Webhook Secret Needed");
    }

    const payload = req.body;
    const headers = req.headers;

    const wh = new Webhook(WEBHOOK_SECRET);

    let evt;

    try {
        evt = wh.verify(payload, headers);
    } catch (err) {
        return res.status(400).json({ message: "Webhook verification failed" });
    }

    const eventType = evt.type;
    const eventData = evt.data;

    console.log("📩 Received event type:", eventType);
    console.log("📦 Event data:", eventData);

    const { id, username, email_addresses, image_url } = eventData;
    const email = email_addresses?.[0]?.email_address || "no-email";

    // Generate a safe and unique username
    const generateUniqueUsername = async (baseUsername) => {
        let finalUsername = baseUsername || email.split("@")[0] || "user";
        let existingUser = await User.findOne({ username: finalUsername });

        while (existingUser && existingUser.clerkUserId !== id) {
            finalUsername = `${baseUsername}_${uuidv4().slice(0, 5)}`;
            existingUser = await User.findOne({ username: finalUsername });
        }

        return finalUsername;
    };

    try {
        if (eventType === "user.created") {
            const uniqueUsername = await generateUniqueUsername(username);

            const newUser = new User({
                clerkUserId: id,
                username: uniqueUsername,
                email,
                img: image_url || "",
            });

            await newUser.save();
            console.log("✅ New user saved:", newUser);
        }

        if (eventType === "user.updated") {
            const updatedUser = await User.findOne({ clerkUserId: id });

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found for update" });
            }

            const uniqueUsername = await generateUniqueUsername(username);

            updatedUser.username = uniqueUsername;
            updatedUser.email = email;
            updatedUser.img = image_url || "";

            await updatedUser.save();
            console.log("🔄 User updated:", updatedUser);
        }

        if (eventType === "user.deleted") {
            const deletedUser = await User.findOneAndDelete({ clerkUserId: id });

            if (!deletedUser) {
                return res.status(404).json({ message: "User not found for deletion" });
            }

            console.log("🗑️ User deleted:", deletedUser);
        }

        return res.status(200).json({ message: "Webhook processed successfully" });

    } catch (err) {
        console.error("❌ Error in webhook processing:", err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
