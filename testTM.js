const { TMRule, TuringMachine } = require('./tmModule.js');

//test to make sure TM works (using simple examples)


//Turing's first example - Busy Beaver(010101 with blanks between)
let tape1 = [];
let tmRules1 = [];

tmRules1.push(new TMRule('0', 'B', '0', 'R', '1'));
tmRules1.push(new TMRule('1', 'B', 'B', 'R', '2'));
tmRules1.push(new TMRule('2', 'B', '1', 'R', '3'));
tmRules1.push(new TMRule('3', 'B', 'B', 'R', '0'));

let tm1 = new TuringMachine(tmRules1, 0, 0, tape1, 15);
tm1.run();

let tape2 = [];
let tmRules2 = [];
//now turn the above into Peterson's version (3 states, but 6 instructions)
tmRules2.push(new TMRule('A', '0', '1', 'R', 'B'));
tmRules2.push(new TMRule('A', '1', '1', 'L', 'C'));
tmRules2.push(new TMRule('B', '0', '1', 'L', 'A'));
tmRules2.push(new TMRule('B', '1', '1', 'R', 'B'));
tmRules2.push(new TMRule('C', '0', '1', 'L', 'B'));
tmRules2.push(new TMRule('C', '1', '1', null, 'halt'));
tmRules2.push(new TMRule('halt', null, null, null, 'halt', true, false));

let tm2 = new TuringMachine(tmRules2, 'A', 0, tape2, 20, '0');
tm2.run(); //should print 6 "1s" after 14 steps
