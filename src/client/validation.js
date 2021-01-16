function generateResponse(isValid, message) {
    return {
        "valid": isValid,
        "message": message || "No message was given"
    }
}

function validateConfig(config, expect) {
    if (!config) return generateResponse(false, "Invalid config");
    if (typeof config != "object") return generateResponse(false, "Invalid config");

    if (!expect) return generateResponse(false, "Invalid expect");
    if (typeof expect != "object") return generateResponse(false, "Invalid expect");

    const keys = Object.keys(expect);

    for (const i in keys) {
        const e = expect[keys[i]];

        if (!config[keys[i]])
            return generateResponse(false, `'${keys[i]}' is not defined`);

        if (typeof config[keys[i]] != e.type)
            return generateResponse(false, `Invalid type of '${keys[i]}'. Was '${typeof config[keys[i]]}', Expected '${e.type}'`);
    }

    return generateResponse(true);
}

module.exports = {
    generateResponse,
    validateConfig
};