const { onPreBuild } = require('./index.js');

const failBuild = jest.fn();
const run = (variable) => onPreBuild({ inputs: { variable }, utils: { build: { failBuild } } });

describe('onPreBuild', () => {
    afterEach(() => {
        delete process.env.TEST_ENV;
        delete process.env.BRANCH;
        delete process.env.BRANCH_TEST_ENV;
        delete process.env.CONTEXT;
        delete process.env.CONTEXT_TEST_ENV;
    });

    it('resolves file', () => {
        run();

        expect(process.env.TEST_ENV).toBe('true');
    });

    it('resolves file with BRANCH', () => {
        process.env.BRANCH = 'branch-name';
        run('BRANCH');

        expect(process.env.TEST_ENV).toBe('true');
        expect(process.env.BRANCH_TEST_ENV).toBe('true');
    });

    it('resolves file with CONTEXT', () => {
        process.env.CONTEXT = 'context-name';
        run('CONTEXT');

        expect(process.env.TEST_ENV).toBe('true');
        expect(process.env.CONTEXT_TEST_ENV).toBe('true');
    });

    it('will not fail with non-existing file', () => {
        process.env.BRANCH = 'non-existing-branch-name';
        
        expect(() => { run('BRANCH'); }).not.toThrow();
        expect(failBuild).not.toBeCalled();
        expect(process.env.TEST_ENV).toBe('true');
        expect(process.env.BRANCH_TEST_ENV).toBe(undefined);
    });

    it('will not overwrite existing variables', () => {
        process.env.BRANCH = 'branch-name';
        process.env.BRANCH_TEST_ENV = 'false';
        run('BRANCH');

        expect(process.env.BRANCH_TEST_ENV).toBe('false');
    });
});
