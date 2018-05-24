# git-commit-msg

**git-commit-msg** is a commit-msg hook installer for `git` with configuration available in `package.json`

The idea of this library is to force using semantic-release rules in commit-message using [Angular Commit Message Conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)

Idea and some code for this package came from other package called pre-commit, credits for bash hook script and install/uninstall js scripts goes to guy who created [pre-commit](https://github.com/observing/pre-commit)

### Installation (NPM)

Run
```
npm install git-commit-msg --save-dev
```

### Installation (Yarn)

Run
```
yarn add git-commit-msg --dev
```

This will replace commit-msg in your .git/hooks folder with code, that will run checks on every git commit.

### Configuration

Configuration is simple and is done in `package.json`, you just need to add git-commit-msg object:

```js
"git-commit-hook": {
    "types": [
        "feat",
        "fix",
        "chore",
        "docs",
        "refactor",
        "style",
        "perf",
        "test",
        "revert"
    ],
    "lineLength": 72
}
```

git-commit-hook.types (array of strings) will add rules, so your git commit messages must start using those types like
```
feat: <message>
```

or

```
feat(scope/filename): <message>
```

git-commit-hook.lineLength (integer) will make sure that lines in your commit message are always less or equal to the number you set into this config

This package is WIP, so propose your ideas - open issue or create pull request.