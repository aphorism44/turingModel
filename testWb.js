const { WBInstruction, WBLanguage } = require('./wbModule.js');

//test to see Wang B-machine works (accept even palindrone)

let tape1 = ['0','1','1','0']; //accept
let tape2 = ['0','1','0']; //reject
let tape3 = ['0','0','1','1','0','0']; //accept
let tape4 = ['0','0','1','0','0']; //reject
let tape5 = ['0', '1', '0', '0']; //reject
let tape6 = ['0', '0', '0', '1', '0']; //reject

let wbRules = [];
let wbRuleMap = new Map();

//instruction list
//START
wbRules.push(new WBInstruction(0, 'IFGOTO', null, '0', 3));
wbRules.push(new WBInstruction(1, 'IFGOTO', null, '1', 10));
wbRules.push(new WBInstruction(2, 'ACCEPT'));
//M0
wbRules.push(new WBInstruction(3, 'WRITE', null, 'B'));
wbRules.push(new WBInstruction(4, 'MOVE', 'R'));
wbRules.push(new WBInstruction(5, 'IFGOTO', null, '0', 4));
wbRules.push(new WBInstruction(6, 'IFGOTO', null, '1', 4));
wbRules.push(new WBInstruction(7, 'MOVE', 'L'));
wbRules.push(new WBInstruction(8, 'IFGOTO', null, '0', 17));
wbRules.push(new WBInstruction(9, 'REJECT'));
//M1
wbRules.push(new WBInstruction(10, 'WRITE', null, 'B'));
wbRules.push(new WBInstruction(11, 'MOVE', 'R'));
wbRules.push(new WBInstruction(12, 'IFGOTO', null, '0', 11));
wbRules.push(new WBInstruction(13, 'IFGOTO', null, '1', 11));
wbRules.push(new WBInstruction(14, 'MOVE', 'L'));
wbRules.push(new WBInstruction(15, 'IFGOTO', null, '1', 17));
wbRules.push(new WBInstruction(16, 'REJECT'));
//NEXT
wbRules.push(new WBInstruction(17, 'WRITE', null, 'B'));
wbRules.push(new WBInstruction(18, 'MOVE', 'L'));
wbRules.push(new WBInstruction(19, 'IFGOTO', null, '0', 18));
wbRules.push(new WBInstruction(20, 'IFGOTO', null, '1', 18));
wbRules.push(new WBInstruction(21, 'MOVE', 'R'));
wbRules.push(new WBInstruction(22, 'GOTO', null, null, 0));

for (let rule of wbRules)
  wbRuleMap.set(rule.number, rule);

//console.log(wbRuleMap);

let wbPalin1 = new WBLanguage(tape1, 0, 0, wbRuleMap);
let wbPalin2 = new WBLanguage(tape2, 0, 0, wbRuleMap);
let wbPalin3 = new WBLanguage(tape3, 0, 0, wbRuleMap);
let wbPalin4 = new WBLanguage(tape4, 0, 0, wbRuleMap);
let wbPalin5 = new WBLanguage(tape5, 0, 0, wbRuleMap);
let wbPalin6 = new WBLanguage(tape6, 0, 0, wbRuleMap);

wbPalin1.run(); //accept
wbPalin2.run(); //reject
wbPalin3.run(); //accept
wbPalin4.run(); //reject
wbPalin5.run(); //reject
wbPalin6.run(); //reject
