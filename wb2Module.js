const { WBInstruction, WBLanguage } = require('./wbModule.js');
const { TMRule, TuringMachine } = require('./wbModule.js');

//this is the Wang-B2 language
//adds features to Wang-B language, namely:
// 1. move right until you hit symbol s
// 2. move left until you hit symbol s
