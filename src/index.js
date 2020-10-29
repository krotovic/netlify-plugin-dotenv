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

function log(message) {
    if (!process.env.DEBUG) return;
    console.debug(`[netlify dotenv] ${message}`);
}

module.exports = {
    onPreBuild({ inputs, utils }) {
        const fileName = resolveFile(inputs.method);
        const filePath = path.resolve(process.cwd(), fileName);
        if (!fs.existsSync(filePath)) {
            log(`Warning: Could not find ENV file '${filePath}'`);
            return;
        }
        log(`Log: Loading ENV file '${filePath}'`);
        let output = {};
        try {
            output = dotenv.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (error) {
            utils.build.failBuild(`Failed to parse .env file. Details: ${error.message}`);
            return;
        }
        for (const [key, value] of Object.entries(output)) {
            if (inputs.skipDefined === 'true' && process.env[key] !== undefined) {
                log(`Log: Skipping setting ${key} as it is already defined as '${process.env[key]}'`);
                continue;
            }
            log(`Log: Setting ${key} as ${value}`);
            process.env[key] = value;
        }
    }
};
