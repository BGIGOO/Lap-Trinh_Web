const slugify = require("slugify");
const crypto = require("crypto");

const slugifyConfig = {
    lower: true,
    strict: true,
    locale: "vi",
    remove: /[*+~.()'"!:@]/g,
};

const createSlug = (text) => {
    return slugify(text, slugifyConfig);
};

const hashAddons = (addons) => {
    if (!addons || addons.length === 0) return null;
    const normalized = JSON.stringify(
        addons.sort((a, b) => a.option.localeCompare(b.option))
    );
    return crypto.createHash("md5").update(normalized).digest("hex");
};

module.exports = {
    createSlug,
    hashAddons,
};
