# `jest --watch --coverage` has a few bugs

## Steps to reproduce

0. Clone/reset this repo 
1. Dirty the file `alpha.js` ( `echo " " >> alpha.js` )
2. Run `jest --watch --coverage --watchAll`
3. Observe that coverage is reported for all files
4. Press `o`
5. Observe that coverage is only reported for changed files (only `alpha.js`)
6. Press `a`
7. Expect a coverage report for all files.
8. Observe that coverage is still only reported for changed files. 

## Expected behaviour

- Jest produces a consistent coverage report in watch mode.
- Jest produces a intuitive coverage report in watch mode.
- It is documented how watch works.

## Actual behaviour

### Does never collect coverage for any unchanged files

To try this out use the following command:

```bash
jest --watch --coverage
## Now press a to run all tests. You wont get coverage for any file.
```

<details>
  <summary>Output:</summary>

```
 PASS  ./main.test.js
  ✓ coverage test alpha (1 ms)
  ✓ coverage test beta

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |       0 |        0 |       0 |       0 |
----------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.152 s, estimated 1 s
Ran all test suites.

Watch Usage: Press w to show more.
```

</details>

This behaviour on its own is probably acceptable and could be expected.

### Does always collect coverage on all changed files

watch collects (wrong 0%) coverage for changed files if they were not involved in the executed tests

```bash
echo " " >> ./alpha.js
jest --watch --coverage
## Now press t to set the test regex to beta.
## You will get a report with 0% coverage for alpha and no coverage data for beta
```

<details>
  <summary>Output:</summary>
  
```
 PASS  ./main.test.js
  ✓ coverage test beta (1 ms)
  ○ skipped coverage test alpha

----------|---------|----------|---------|---------|-------------------
File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files | 25 | 0 | 0 | 33.33 |
alpha.js | 25 | 0 | 0 | 33.33 | 2-3
----------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests: 1 skipped, 1 passed, 2 total
Snapshots: 0 total
Time: 0.077 s, estimated 1 s
Ran all test suites with tests matching "beta".

Active Filters: test name /beta/

````

</details>

This also could be expected, but it is not very intuitive.

The biggest problem is that this behaviour is not documented anywhere.

### Inconsistencies between interactive and cli behaviour

Setting the test regex to beta via cli argument does produce a different result than setting it via interactive mode.

```bash
echo " " >> ./alpha.js
jest --watch --coverage -t beta
````

<details>
  <summary>Output:</summary>
  
```
 PASS  ./main.test.js
  ✓ coverage test beta (1 ms)
  ○ skipped coverage test alpha

----------|---------|----------|---------|---------|-------------------
File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files | 50 | 25 | 50 | 50 |
alpha.js | 25 | 0 | 0 | 33.33 | 2-3
beta.js | 75 | 50 | 100 | 66.66 | 3
----------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests: 1 skipped, 1 passed, 2 total
Snapshots: 0 total
Time: 0.214 s, estimated 1 s
Ran all test suites with tests matching "beta".

Active Filters: test name /beta/

```

</details>

This is better then the behaviour of the interactive mode.
```
