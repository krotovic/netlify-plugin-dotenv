const { onPreBuild } = require('./index.js');

describe('onPreBuild', () => {
    afterEach(() => {
        delete process.env.TEST_ENV;
    });

    it('resolves file with BRANCH resolution method', () => {
        process.env.BRANCH = 'branch-name';
        onPreBuild({
            inputs: {
                method: 'branch',
            },
            constants: {
                CONFIG_PATH: __filename,
            },
        });

        expect(process.env.TEST_ENV).toBe('true');
    });

    it('resolves file with CONTEXT resolution method', () => {
        process.env.CONTEXT = 'context-name';
        onPreBuild({
            inputs: {
                method: 'context',
            },
            constants: {
                CONFIG_PATH: __filename,
            },
        });

        expect(process.env.TEST_ENV).toBe('true');
    });

    it('resolves file with OTHER resolution method', () => {
        onPreBuild({
            inputs: {
                method: 'anything',
            },
            constants: {
                CONFIG_PATH: __filename,
            },
        });

        expect(process.env.TEST_ENV).toBe('true');
    });

    it('will not fail with non-existing file', () => {
        process.env.BRANCH = 'non-existing-branch-name';

        expect(() => {
            onPreBuild({
                inputs: {
                    method: 'branch',
                },
                constants: {
                    CONFIG_PATH: __filename,
                },
            });
        }).not.toThrow();

        expect(process.env.TEST_ENV).toBe(undefined);
    });

    it('will not overwrite existing variables', () => {
        process.env.BRANCH = 'branch-name';
        onPreBuild({
            inputs: {
                method: 'branch',
            },
            constants: {
                CONFIG_PATH: __filename,
            },
        });

        expect(process.env.BRANCH).toBe('branch-name');
    });
});
