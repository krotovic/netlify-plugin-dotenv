const { onPreBuild } = require('./index.js');

const buildFail = jest.fn();

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
            utils: {
                build: {
                    failBuild: buildFail,
                },
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
            utils: {
                build: {
                    failBuild: buildFail,
                },
            },
        });

        expect(process.env.TEST_ENV).toBe('true');
    });

    it('resolves file with OTHER resolution method', () => {
        onPreBuild({
            inputs: {
                method: 'anything',
            },
            utils: {
                build: {
                    failBuild: buildFail,
                },
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
                utils: {
                    build: {
                        failBuild: buildFail,
                    },
                },
            });
        }).not.toThrow();

        expect(buildFail).not.toBeCalled();

        expect(process.env.TEST_ENV).toBe(undefined);
    });

    it('will not overwrite existing variables', () => {
        process.env.BRANCH = 'branch-name';
        onPreBuild({
            inputs: {
                method: 'branch',
            },
            utils: {
                build: {
                    failBuild: buildFail,
                },
            },
        });

        expect(process.env.BRANCH).toBe('branch-name');
    });

    it('will not overwrite variables with already defined values', () => {
        process.env.BRANCH = 'branch-name';
        process.env.TEST_ENV = 'abc';
        onPreBuild({
            inputs: {
                method: 'branch',
                skipDefined: 'true',
            },
            utils: {
                build: {
                    failBuild: buildFail,
                },
            },
        });

        expect(process.env.TEST_ENV).toBe('abc');
    });
});
