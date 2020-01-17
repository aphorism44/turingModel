const { WBInstruction, WBLanguage } = require('./wbModule.js');

//this is the Wang-B2 language
//adds features to Wang-B language, namely:
// 7 - "RIGHTTO" move right until you hit symbol s
// 8 -  "LEFTTO" move left until you hit symbol s

//NOTE - every instriction must compile to WB, not TM
//NOTE - from now on, we'll just compile down, not make
// the extra languages directly runnable

class WB2Instruction {
  constructor(instructionNumber = 0, instructionType = 'ACCEPT'
    , move = '', s = '', n = 0, moveto = new Set(), looped=false) {
      this.number = instructionNumber;
      this.command = instructionType;
      this.movement = move;
      this.s = s;
      this.n = n;
      this.moveto = moveto; //set, only used in 2 instructions
      this.looped = looped; //ditto
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
    this.instMap = new Map(); //value of added is different at different instructions
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
          break;
        case 'WRITE':
          wbInstructionMap.set(n + this.added, new WBInstruction(n + this.added, 'WRITE', null, instruction.s));
          break;
        case 'GOTO':
          wbInstructionMap.set(n + this.added, new WBInstruction(n + this.added, 'GOTO', null, null, instruction.n));
          break;
        case 'IFGOTO':
          wbInstructionMap.set(n + this.added, new WBInstruction(n + this.added, 'IFGOTO', null, instruction.s, instruction.n));
          break;
        case 'ACCEPT':
          wbInstructionMap.set(n + this.added, new WBInstruction(n + this.added, 'ACCEPT'));
          break;
        case 'REJECT':
          wbInstructionMap.set(n + this.added, new WBInstruction(n + this.added, 'REJECT'));
          break;
        case 'MOVELEFTTO': case 'MOVERIGHTTO':
          let movement = 'L';
          if (instruction.command == 'MOVERIGHTTO')
            movement = 'R';
          let currentInstNum = n + this.added;
          let stopSet = instruction.moveto;
          let moveInst = currentInstNum + stopSet.size + 2;
          for (let s of stopSet) {
            wbInstructionMap.set(n + this.added, new WBInstruction(n + this.added, "IFGOTO", null, s, moveInst, null, true));
            this.added++;
          }
          wbInstructionMap.set(n + this.added, new WBInstruction(n + this.added, "MOVE", movement));
          this.added++;
          wbInstructionMap.set(n + this.added, new WBInstruction(n + this.added, "GOTO", null, null, currentInstNum, null, true));
          break;
      }
      //need to map added value at every given point
      this.instMap.set(n + this.added, n);
    }
    //GOTO and IFGOTO must have their n-value adjusted with the instMap
    console.log(this.instMap);
    for (let [key, value] of wbInstructionMap) {
      if (!value.looped && (value.command == 'GOTO' || value.command == 'IFGOTO')) {
        console.log(value.n);
        let newMap = this.instMap.get(value.n);
        console.log(newMap);
        if (!value.looped)
          value.n = newMap;
      }
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
