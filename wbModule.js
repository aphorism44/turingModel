const { TMRule, TuringMachine } = require('./tmModule.js');
//we call this the "Wang B-machine"
//each rule is numbered (starting at 0) for N
//B = blank

//this is the even palindrone program

//RULE NOTATION =
//1 - "MOVE" (L/R)
//2 - "WRITE" (S)
//3 - "GOTO" (N)
//4 - "IFGOTO" (S, N) (if you read S, then goto N)
//5 -  "ACCEPT"
//6 - "REJECT"

class WBInstruction {
  constructor(instructionNumber = 0, instructionType = 'Accept'
    , move = '', s = '', n = 0) {
      this.number = instructionNumber;
      this.command = instructionType;
      this.movement = move;
      this.s = s;
      this.n = n;
    }
}

class WBLanguage {
  constructor(startTape = ['0'], startHeadPosition = 0
    , startInstructionNumber = 0
    , instructions = new Map(), alphabet = new Set(), blankSymbol = 'B'
    , maxSteps = 1000) {
    this.tape = startTape;
    this.headPosition = startHeadPosition;
    this.instructionNumber = startInstructionNumber;
    this.instructions = instructions; //map of instructions, n -> instruction
    this.halted = false;
    this.accepted  = false;
    this.maxSteps = maxSteps;
    this.blankSymbol = blankSymbol;
    this.steps = 0;
    this.alphabet = alphabet; //only needed for TM converstion
    //always have one blank on a tape
    if (this.tape.length == 0)
      this.tape.push(this.blankSymbol);
  }

  advanceStep() {
    this.steps++;
    let instruction = this.instructions.get(this.instructionNumber);
    switch (instruction.command) {
      case 'MOVE':
        let move = instruction.movement;
        //account for array - infinite tape both ways
        if (move == 'R') {
          this.headPosition++;
          if (this.headPosition > this.tape.length - 1)
            this.tape.push(this.blankSymbol);
        } else if (move == 'L') {
          this.headPosition--;
          if (this.headPosition < 0) {
            this.tape.unshift(this.blankSymbol);
            this.headPosition  = 0;
          }
        }
        this.instructionNumber++;
        break;
      case 'WRITE':
        this.tape[this.headPosition] = instruction.s;
        this.instructionNumber++;
        break;
      case 'GOTO':
        this.instructionNumber = instruction.n;
        break;
      case 'IFGOTO':
        let s = this.tape[this.headPosition];
        if (s == instruction.s)
          this.instructionNumber = instruction.n;
        else
          this.instructionNumber++;
        break;
      case 'ACCEPT':
        this.accepted = true;
        this.halted = true;
        break;
      case 'REJECT':
        this.halted = true;
        break;
      default:
        this.halted = true;
    }

    if (this.steps >= this.maxSteps && !this.halted)
      this.halted = true;
  }

  getOutput() {
    let output = "\n"
    for (let i = 0; i < this.tape.length; i++) {
      if (this.headPosition == i)
        output += ">"
      output += this.tape[i] + "  ";
    }
    output += "\nCurrent instruction: " + this.instructionNumber;
    output += "\nStep: " + this.steps;
    if (this.halted) {
      output += "\nHalted - "
      if (this.steps >= this.maxSteps)
        output += "exceeded maximum runtime"
      else if (this.accepted)
        output += "accepted input"
      else
        output += "rejected input"
    }
    output += "\n";
    return output;
  }

  getTMRules() {
    let tmRuleList = []; //will be array of TM rules for input into TM
    for (let [key, value] of this.instructions) {
      let instruction = value;
      let n = key;
      switch (instruction.command) {
        case 'MOVE':
          tmRuleList.push(new TMRule(n.toString(), null, null, instruction.movement, (n + 1).toString()));
          break;
        case 'WRITE':
          tmRuleList.push(new TMRule(n.toString(), null, instruction.s, null, (n + 1).toString()));
          break;
        case 'GOTO':
          tmRuleList.push(new TMRule(n.toString(), null, null, null, instruction.n.toString()));
          break;
        case 'IFGOTO':
          tmRuleList.push(new TMRule(n.toString(), instruction.s, null, null, instruction.n.toString()));
          //we need to add rules for _all but_ the above read symbol
          let alpha = new Set(this.alphabet);
          alpha.delete(instruction.s);
          for (let s of alpha)
              tmRuleList.push(new TMRule(n.toString(), s, null, null, (n + 1).toString()));
          break;
        case 'ACCEPT':
          tmRuleList.push(new TMRule(n.toString(), null, null, null, n.toString(), true, false));
          break;
        case 'REJECT':
          tmRuleList.push(new TMRule(n.toString(), null, null, null, n.toString(), false, true));
          break;
      }
    }
    return tmRuleList;
  }

  getTM() {
    let tmRules = this.getTMRules();
    return new TuringMachine(tmRules, this.instructionNumber
      , this.headPosition, this.tape, this.maxSteps
      , this.blankSymbol);
  }

  run(log = false) {
    console.log("\n*** WB Machine Run ***");
    console.log("Initial Configuration:");
    console.log(this.getOutput());
    while (!this.halted) {
      this.advanceStep();
      if (log)
        console.log(this.getOutput());
    }
    console.log("\nFinal Configuration:");
    console.log(this.getOutput());
  }


}


module.exports = { WBInstruction, WBLanguage }
