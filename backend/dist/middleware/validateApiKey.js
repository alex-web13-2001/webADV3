"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateApiKey = void 0;
const errorHandler_1 = require("./errorHandler");
const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        throw new errorHandler_1.AppError(401, 'API key is required');
    }
    // Store API key in request for later use
    req.apiKey = apiKey;
    next();
};
exports.validateApiKey = validateApiKey;
//# sourceMappingURL=validateApiKey.js.map