const { WBInstruction, WBLanguage } = require('./wbModule.js');
const { WB2Instruction, WB2Language } = require('./wb2Module.js');

//first, try even palindrimes
let tape1 = ['0','1','1','0']; //accept
let tape2 = ['0','1','0']; //reject
let tape3 = ['0','0','1','1','0','0']; //accept
let tape4 = ['0','0','1','0','0']; //reject
let tape5 = ['0', '1', '0', '0']; //reject
let tape6 = ['0', '0', '0', '1', '0']; //reject

let wb2Rules = [];
let wb2RuleMap = new Map();
let stopSymbolSet = new Set(['B']);

//instruction list
//START
wb2Rules.push(new WB2Instruction(0, 'IFGOTO', null, '0', 3));
wb2Rules.push(new WB2Instruction(1, 'IFGOTO', null, '1', 9));
wb2Rules.push(new WB2Instruction(2, 'ACCEPT'));
//M0
wb2Rules.push(new WB2Instruction(3, 'WRITE', null, 'B'));
wb2Rules.push(new WB2Instruction(4, 'MOVE', 'R'));
wb2Rules.push(new WB2Instruction(5, 'MOVERIGHTTO', null, 'B', null, stopSymbolSet));
wb2Rules.push(new WB2Instruction(6, 'MOVE', 'L'));
wb2Rules.push(new WB2Instruction(7, 'IFGOTO', null, '0', 15));
wb2Rules.push(new WB2Instruction(8, 'REJECT'));
//M1
wb2Rules.push(new WB2Instruction(9, 'WRITE', null, 'B'));
wb2Rules.push(new WB2Instruction(10, 'MOVE', 'R'));
wb2Rules.push(new WB2Instruction(11, 'MOVERIGHTTO', null, 'B', null, stopSymbolSet));
wb2Rules.push(new WB2Instruction(12, 'MOVE', 'L'));
wb2Rules.push(new WB2Instruction(13, 'IFGOTO', null, '1', 15));
wb2Rules.push(new WB2Instruction(14, 'REJECT'));
//NEXT
wb2Rules.push(new WB2Instruction(15, 'WRITE', null, 'B'));
wb2Rules.push(new WB2Instruction(16, 'MOVE', 'L'));
wb2Rules.push(new WB2Instruction(17, 'MOVELEFTTO', null, 'B', null, stopSymbolSet));
wb2Rules.push(new WB2Instruction(18, 'MOVE', 'R'));
wb2Rules.push(new WB2Instruction(19, 'GOTO', null, null, 0));

for (let rule of wb2Rules)
  wb2RuleMap.set(rule.number, rule);

let WB2Alpha = new Set([ '0', '1', 'B' ]);

let wb2Palin1 = new WB2Language(tape1, 0, 0, wb2RuleMap, WB2Alpha);
let wb2Palin2 = new WB2Language(tape2, 0, 0, wb2RuleMap, WB2Alpha);
let wb2Palin3 = new WB2Language(tape3, 0, 0, wb2RuleMap, WB2Alpha);
let wb2Palin4 = new WB2Language(tape4, 0, 0, wb2RuleMap, WB2Alpha);
let wb2Palin5 = new WB2Language(tape5, 0, 0, wb2RuleMap, WB2Alpha);
let wb2Palin6 = new WB2Language(tape6, 0, 0, wb2RuleMap, WB2Alpha);

//now get the equivalent WB rule set
let wbPalin1 = wb2Palin1.getWB();
//let wbPalin2 = wb2Palin2.getWB();
//let wbPalin3 = wb2Palin3.getWB();
//let wbPalin4 = wb2Palin4.getWB();
//let wbPalin5 = wb2Palin5.getWB();
//let wbPalin6 = wb2Palin6.getWB();

console.log(wbPalin1);

//test WB
//wbPalin1.run(true); //accept
/*
wbPalin2.run(); //reject
wbPalin3.run(); //accept
wbPalin4.run(); //reject
wbPalin5.run(); //reject
wbPalin6.run(); //reject

//now get tm
let tmPalin1 = wbPalin1.getTM();
let tmPalin2 = wbPalin2.getTM();
let tmPalin3 = wbPalin3.getTM();
let tmPalin4 = wbPalin4.getTM();
let tmPalin5 = wbPalin5.getTM();
let tmPalin6 = wbPalin6.getTM();

//test TMs
tmPalin1.run(); //accept
tmPalin2.run(); //reject
tmPalin3.run(); //accept
tmPalin4.run(); //reject
tmPalin5.run(); //reject
tmPalin6.run(); //reject
*/
