const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const METHOD_BRANCH = 'branch';
const METHOD_CONTEXT = 'context';

const resolveFile = (method) => {
    switch (method) {
        case METHOD_BRANCH:
            return `.env.${process.env.BRANCH}`;
        case METHOD_CONTEXT:
            return `.env.${process.env.CONTEXT}`;
        default:
            return '.env';
    }
};

module.exports = {
    onPreBuild({ inputs, constants }) {
        const fileName = resolveFile(inputs.method);
        const filePath = path.resolve(path.dirname(constants.CONFIG_PATH), fileName);
        if (!fs.existsSync(filePath)) {
            console.log(`[netlify dotenv] Warning: Could not find ENV file '${filePath}'`);
            return;
        }
        dotenv.config({
            path: filePath,
            encoding: 'utf8',
        });
    }
};
