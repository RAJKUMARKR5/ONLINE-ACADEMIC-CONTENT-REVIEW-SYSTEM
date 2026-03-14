const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "secret", { expiresIn: "30d" });
};

router.post("/register", async (req, res) => {
    console.log("DEBUG: Registration request body:", req.body);
    try {
        let { name, email, password, role, expertise, googleToken } = req.body;
        
        // If googleToken is provided, extract email from it
        if (googleToken) {
            console.log("DEBUG: Processing Google Token...");
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            email = payload.email;
            console.log("DEBUG: Extracted email from Google:", email);
            // Set a random dummy password since manual password isn't provided via Google flow
            if (!password) {
                password = Math.random().toString(36).slice(-10) + Date.now();
                console.log("DEBUG: Generated dummy password");
            }
        }

        console.log("DEBUG: Final fields - Name:", name, "Email:", email, "Password:", password ? "[SET]" : "[MISSING]");

        if (!name || !email || !password) {
            console.log("DEBUG: Validation failed - one or more fields missing");
            return res.status(400).json({ message: "Please add all fields" });
        }
        
        let user = await User.findOne({ email });
        if (user) {
            if (user.status === "Approved") return res.status(400).json({ message: "Already registered with this email" });
            if (user.status === "Pending") return res.status(400).json({ message: "Registration already pending approval" });
        }

        const isFirst = (await User.countDocuments({})) === 0;
        const assignedRole = isFirst ? "Admin" : (role || "Author");
        const assignedStatus = isFirst ? "Approved" : "Pending";
        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

        if (user && user.status === "Declined") {
            user.name = name;
            user.password = hashedPassword;
            user.role = assignedRole;
            user.status = assignedStatus;
            user.expertise = expertise || [];
            await user.save();
        } else {
            user = await User.create({ name, email, password: hashedPassword, role: assignedRole, expertise: expertise || [], status: assignedStatus });
        }

        if (assignedStatus === "Approved") {
            res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id), message: "Admin created" });
        } else {
            res.status(201).json({ message: "Registration successful. Please wait for admin approval." });
        }
    } catch (err) {
        console.error("REG ERROR:", err);
        res.status(500).json({ message: "Server Error: " + err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Account not found. Please register first." });
        
        if (await bcrypt.compare(password, user.password)) {
            if (role && user.role !== role) return res.status(401).json({ message: `Access denied. Registered as a ${user.role}, not a ${role}.` });
            if (user.status !== "Approved") {
                const msg = user.status === "Pending" ? "Account pending approval. Please wait for an administrator." : "Account declined. Please contact admin.";
                return res.status(403).json({ message: msg });
            }
            res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
        } else {
            res.status(400).json({ message: "Invalid password. Please try again." });
        }
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ message: "Server Error: " + err.message });
    }
});

router.post("/google", async (req, res) => {
    try {
        const { token, role } = req.body;
        const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
        const { email } = ticket.getPayload();
        const user = await User.findOne({ email });
        if (user) {
            if (role && user.role !== role) return res.status(401).json({ message: `Access denied. Registered as a ${user.role}, not a ${role}.` });
            if (user.status !== "Approved") {
                const msg = user.status === "Pending" ? "Account pending approval." : "Account declined. Please contact admin.";
                return res.status(403).json({ message: msg });
            }
            res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
        } else {
            res.status(404).json({ message: "Account not found. Please register first." });
        }
    } catch (err) {
        res.status(500).json({ message: "Failed to authenticate with Google" });
    }
});

const { protect, authorize } = require("../middleware/authMiddleware");
router.get("/me", protect, async (req, res) => res.json(req.user));
router.get("/users", protect, authorize("Admin"), async (req, res) => {
    const users = await User.find(req.query.role ? { role: req.query.role } : {}).select("-password");
    res.json(users);
});
router.put("/:id/approve", protect, authorize("Admin"), async (req, res) => {
    try {
        if (req.user.email !== "kr48392425@gmail.com") return res.status(403).json({ message: "Only the primary admin can approve users." });
        const user = await User.findById(req.params.id);
        if (user) { user.isApproved = true; user.status = "Approved"; await user.save(); res.json(user); }
        else res.status(404).json({ message: "Not found" });
    } catch (err) { res.status(500).json({ message: "Server Error" }); }
});
router.put("/:id/decline", protect, authorize("Admin"), async (req, res) => {
    try {
        if (req.user.email !== "kr48392425@gmail.com") return res.status(403).json({ message: "Only the primary admin can decline users." });
        const user = await User.findById(req.params.id);
        if (user) { user.status = "Declined"; user.isApproved = false; await user.save(); res.json(user); }
        else res.status(404).json({ message: "Not found" });
    } catch (err) { res.status(500).json({ message: "Server Error" }); }
});
router.delete("/users/:id", protect, authorize("Admin"), async (req, res) => {
    try {
        console.log('DELETE REQUEST - Admin:', req.user.email, 'Target ID:', req.params.id);
        if (req.user.email.toLowerCase() !== "kr48392425@gmail.com") {
            console.log('Permission Denied: Not the primary admin');
            return res.status(403).json({ message: "Only the primary admin can delete users." });
        }
        const user = await User.findById(req.params.id);
        if (user) { 
            console.log('User found, deleting:', user.email);
            await user.deleteOne(); 
            res.json({ message: "Removed" }); 
        } else {
            console.log('User not found for ID:', req.params.id);
            res.status(404).json({ message: "Not found" });
        }
    } catch (err) { 
        console.error('DELETE ERROR:', err);
        res.status(500).json({ message: "Server Error" }); 
    }
});

module.exports = router;
