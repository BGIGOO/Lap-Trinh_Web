const slugify = require("slugify");

const slugifyConfig = {
    lower: true,
    strict: true,
    locale: "vi",
    remove: /[*+~.()'"!:@]/g,
};

const createSlug = (text) => {
    return slugify(text, slugifyConfig);
};

module.exports = {
    createSlug,
};
