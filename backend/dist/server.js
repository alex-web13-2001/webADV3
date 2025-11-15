"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = require("./utils/config");
const errorHandler_1 = require("./middleware/errorHandler");
const api_routes_1 = __importDefault(require("./routes/api.routes"));
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
// CORS
app.use((0, cors_1.default)({
    origin: config_1.config.frontendUrl,
    credentials: true,
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: config_1.config.rateLimit.windowMs,
    max: config_1.config.rateLimit.maxRequests,
    message: {
        success: false,
        code: 429,
        message: 'Too many requests, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
// Body parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'WB Ads Dashboard API is running',
        timestamp: new Date().toISOString(),
    });
});
// API routes
app.use('/api', api_routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        code: 404,
        message: 'Route not found',
    });
});
// Error handler (must be last)
app.use(errorHandler_1.errorHandler);
const PORT = config_1.config.port;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${config_1.config.nodeEnv}`);
    console.log(`🌐 Frontend URL: ${config_1.config.frontendUrl}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map