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
            ],
            lineLength: 72,
            scope: {
                mandatory: false,
                rules: ""
            }
        }

        this.init();
    }

    init() {
        // Check if config exists and if we need to use the default one
        if (this.package['git-commit-hook']) {
            this.populateConfig();
        }

        // Breaking the message by line
        this.message = this.message.split('\n');

        // Check if heading is in the message
        if (!this.checkTypeSubject()) {
            this.stop();
        }

        if (!this.checkScope()) {
            this.stop();
        } 

        // Check if lines length is fine, check only if lineLength is integer and not boolean false
        if (this.config.lineLength !== 0 && !this.checkLength()) {
            this.stop();
        }

        process.exit(0);
    }

    // Replace default config with config from package.json
    populateConfig() {
        const config = this.package['git-commit-hook'];

        // In case there is config.types available in package.json, check if it's array and if set, if set, replace default one
        if (config.types && !Array.isArray(config.types)) {
            console.error('git-commit-hook: config.types is suppose to be array');
            this.stop();
        } else if (config.types) {
            this.config.types = config.types;
        }

        // In case there is config.lineLength available in package.json, check if it's number and if set, if set, replace default one
        if (config.lineLength && typeof config.lineLength !== 'number') {
            console.error('git-commit-hook: config.lineLength is suppose to be number, remove the rule or set to 0 if you don\'t want to force it');
            this.stop();
        } else if (config.lineLength) {
            this.config.lineLength = config.lineLength;
        }

        // In case there is config.scope, replace default one
        if (config.scope) {
            this.config.scope = config.scope;
        }
    }

    // Check length of every line of commit message and validate that there are no long lines in it
    checkLength() {
        // Start line with number one, to make it less confusing
        let line = 1;

        for (const message of this.message) {
            // If line is longer than allowed, show error message and exit the process
            if (message.length > this.config.lineLength) {
                console.error(`git-commit-hook: Commit message in line ${line} have more characters than allowed in a single line, please break it down, maximum is ${this.config.lineLength}`);
                return false;
            }

            line++;
        }

        return true;
    }

    // Check first line of commit message, if there is [Type]([optional scope]): [Subject]
    // Semicolon with space is always mandatory after the Type
    checkTypeSubject() {
        const types = this.config.types.join('|');
        let regStr = `(${types})(\(.*\))?\\:`;
        const regExpType = new RegExp(regStr);

        // Check type and semicolon
        if (this.message[0].search(regExpType) === -1) {
            console.error(`git-commit-hook: Type should follow the rules "${types}(scope/filename): Subject"`);
            return false;
        }

        regStr += ' .*';
        const regExpSubject = new RegExp(regStr);

        // Check if there is subject after semicolon
        if (this.message[0].search(regExpSubject) === -1) {
            console.error('git-commit-hook: Subject is not set or there is no space after semicolon');
            return false;
        }

        return true;
    }

    // Check if scope after type is mandatory
    checkScope() {
        // Check first if config for scope is set up
        // If not, return true as default or old rules are set
        if (!this.config.scope) {
            return true;
        }

        // Check if rule for mandatory scope is set
        // If not, return true
        if (!this.config.scope.mandatory) {
            return true;
        }

        let rules = this.config.scope.rules;

        // Check if rules already have brackets
        // If yes, strip them
        if (rules.substr(0, 1) === '(' && rules.substr(-1) === ')') {
            rules = rules.slice(1, -1);
        }

        // Add proper regex round brackets
        // Add additional backslashes for string to work properly with regex
        const regStr = '\\(' +  rules + '\\)';

        // Check if we have scope in round brackets
        const regExpType = new RegExp(regStr);

        // Check type and semicolon
        if (this.message[0].search(regExpType) === -1) {
            console.error(`git-commit-hook: Scope is not following the regex rules "${regStr}"`);
            console.error(`git-commit-hook: Don't forget to put 2 backslashes instead of one`);
            return false;
        }

        return true;
    }

    // Killing the process
    stop() {
        process.exit(1);
    }
}

module.exports = gitCommitMsg;

if (module !== require.main) {
    return;
}

new gitCommitMsg();