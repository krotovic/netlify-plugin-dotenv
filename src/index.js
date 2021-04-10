const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

function log(message) {
    console.log(`[netlify dotenv] ${message}`);
}

function loadFile(filename) {
    const envFile = path.resolve(process.cwd(), filename);
    if (!fs.existsSync(envFile)) {
        log(`File '${filename}' not found.`);
        return;
    }
    const result = dotenv.config({ path: envFile });
    if (result.error) {
        throw new Error(`Failed to parse ${filename} file. Details: ${result.error.message}`);
    }
}

module.exports = {
    onPreBuild({ inputs, utils }) {
        try {
            if (inputs.variable && process.env[inputs.variable]) {
                loadFile(`.env.${process.env[inputs.variable]}`);
            }
            loadFile('.env');
        } catch (error) {
            utils.build.failBuild(error.message);
        }
    }
};
