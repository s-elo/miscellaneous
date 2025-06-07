# Leet-Code Repo

This is a place to put some leet code problems with corresponding solutions and explanations.

## leet-code plugin

you can use [vscode leet-code plugin](https://github.com/LeetCode-OpenSource/vscode-leetcode/tree/master) to

- generate a problem, default as typescript language
- test and submit your solution

you can set your leet-code problem stored path as `/miscellaneous/leet-code/src`.

## debug

Firstly make sure you have you vscode enable the [auto attach](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_auto-attach).

Then add the breakpoint in the file you want to debug and run:

```bash
$ pnpm dev <file path>
# e.g. pnpm dev ./src/88.merge-sorted-array.ts
```
