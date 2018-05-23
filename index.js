'use strict';

class gitCommitMsg {
    constructor() {
        this.fs = require('fs');
        this.path = require('path');
        this.root = this.path.resolve(__dirname, '..', '..');
        this.package = require(this.path.join(this.root, 'package.json'));
        this.message = this.fs.readFileSync(this.path.join(this.root, '.git/COMMIT_EDITMSG'), 'utf8');
        this.config = {
            types: [
                'feat',
                'fix',
                'chore',
                'docs',
                'refactor',
                'style',
                'perf',
                'test',
                'revert'
            ]
        }

        this.init();
    }

    init() {
        // Check if config exists and if we need to use the default one
        if (this.package['git-commit-hook']) {
            const config = this.package['git-commit-hook'];

            if (config.types && !Array.isArray(config.types)) {
                console.error('git-commit-hook: config.types is suppose to be array');
                process.exit(1);
            } else if (config.types) {
                this.config.types = config.types;
            }
        }

        // Breaking the message by line
        this.message = this.message.split('\n');

        // Check if heading is in the message
        if (!this.checkTypeSubject()) {
            this.stop();
        }
        console.log('error');
        this.stop();

        process.exit(0);
    }

    checkTypeSubject() {
        const types = this.config.types.join('|');
        let regStr = `(${types})(\(.*\))?\\:`;
        const regExpType = new RegExp(regStr);

        if (this.message[0].search(regExpType) === -1) {
            console.error(`git-commit-hook: Type should follow the rules "${types}(scope/filename): Subject"`);
            return false;
        }

        regStr += ' .*';
        const regExpSubject = new RegExp(regStr);

        if (this.message[0].search(regExpSubject) === -1) {
            console.error('git-commit-hook: Subject is not set or there is no space after semicolon');
            return false;
        }

        return true;
    }

    stop() {
        process.exit(1);
    }
}

module.exports = gitCommitMsg;

if (module !== require.main) {
    return;
}

new gitCommitMsg();