const { WBInstruction, WBLanguage } = require('./wbModule.js');

//this is the Wang-B2 language
//adds features to Wang-B language, namely:
// 7 - "MOVERIGHTTO" move right until you hit symbol s
// 8 -  "MOVELEFTTO" move left until you hit symbol s

//NOTE - every instriction must compile to WB, not TM
//NOTE - from now on, we'll just compile down, not make
// the extra languages directly runnable

//WARNING - the re-numbering of instuction.n during Wang-B conversion
//is not complete - keep finding edge cases; so far it works on input,
//but a provable solution has yet to be written (the lecture simple said
//to "renumber accordingly", as if it were that simple!!!)

class WB2Instruction {
  constructor(instructionNumber = 0, instructionType = 'ACCEPT'
    , move = '', s = '', n = 0, moveto = new Set()) {
      this.number = instructionNumber;
      this.command = instructionType;
      this.movement = move;
      this.s = s;
      this.n = n;
      this.moveto = moveto; //set, only used in 2 instructions
    }
}

class WB2Language {
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
    //always have one blank on a tape
    if (this.tape.length == 0)
      this.tape.push(this.blankSymbol);
    //needed for converstion to WB
    this.alphabet = alphabet;
    this.startTape = Array.from(startTape);
    this.startHeadPosition = startHeadPosition;
    this.startInstructionNumber = startInstructionNumber;
    this.added = 0; //we need to account for additional instructions at a given point
    this.addMap = new Map(); //original instruction value -> new instruction values
  }

  getOutput() {
    let output = "\n";
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

  getWBInstructions() {
    let wbInstructionMap = new Map(); //will be a map of WB rules
    for (let [key, value] of this.instructions) {
      let instruction = value;
      let n = key;
      switch (instruction.command) {
        case 'MOVE':
          wbInstructionMap.set(n + this.added, new WBInstruction(n + this.added, 'MOVE', instruction.movement));
          this.addMap.set(n, n + this.added);
          break;
        case 'WRITE':
          wbInstructionMap.set(n + this.added, new WBInstruction(n + this.added, 'WRITE', null, instruction.s));
          this.addMap.set(n, n + this.added);
          break;
        case 'GOTO':
          wbInstructionMap.set(n + this.added, new WBInstruction(n + this.added, 'GOTO', null, null, instruction.n));
          this.addMap.set(n, n + this.added);
          break;
        case 'IFGOTO':
          wbInstructionMap.set(n + this.added, new WBInstruction(n + this.added, 'IFGOTO', null, instruction.s, instruction.n));
          this.addMap.set(n, n + this.added);
          break;
        case 'ACCEPT':
          wbInstructionMap.set(n + this.added, new WBInstruction(n + this.added, 'ACCEPT'));
          this.addMap.set(n, n + this.added);
          break;
        case 'REJECT':
          wbInstructionMap.set(n + this.added, new WBInstruction(n + this.added, 'REJECT'));
          this.addMap.set(n, n + this.added);
          break;
        case 'MOVELEFTTO': case 'MOVERIGHTTO':
          let movement = 'L';
          if (instruction.command == 'MOVERIGHTTO')
            movement = 'R';
          let stopSet = instruction.moveto;
          let startN = n + this.added;
          for (let s of stopSet) {
            wbInstructionMap.set(n + this.added, new WBInstruction(n + this.added, "IFGOTO", null, s, n + this.added + stopSet.size + 2));
            this.added++;
          }
          wbInstructionMap.set(n + this.added, new WBInstruction(n + this.added, "MOVE", movement));
          this.added++;
          wbInstructionMap.set(n + this.added, new WBInstruction(n + this.added, "GOTO", null, null, startN));
          break;
      }

    }
    //GOTO and IFGOTO must have their n-value adjusted with the instMap
    //but not those already added by MOVELEFTTO and MOVERIGHTTO
    for (let [key, value] of this.addMap) {
      let inst = wbInstructionMap.get(value);
      let oldGotoN = inst.n;
      let newGotoN = this.addMap.get(oldGotoN) || 0;
      inst.n = newGotoN;
      wbInstructionMap.set(inst.number, inst);
    }

    return wbInstructionMap;
  }

  getWB() {
    let wbInstructions= this.getWBInstructions();
    return new WBLanguage(this.startTape, this.startHeadPosition
      , this.startInstructionNumber, wbInstructions
      , this.alphabet, this.blankSymbol, this.maxSteps);
  }

}


module.exports = { WB2Instruction, WB2Language }
