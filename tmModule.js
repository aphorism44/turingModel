
//standard Turing Machine build like this:
//alphabet = '1','0','B'
//B = blank
//when you hit end of tape, create a blank

class TMRule {
  constructor(currentState, inputSymbol, outputSymbol, direction, nextState
    , isAcceptState = false, isRejectState = false) {
    this.currentState = currentState; //string
    this.inputSymbol = inputSymbol; //null = any symbol
    this.outputSymbol = outputSymbol; //null = don't print
    this.direction = direction; //null = don't move
    this.nextState = nextState; //string
    this.isAcceptState = isAcceptState;
    this.isRejectState = isRejectState;
  }
  checkRuleApplies(tmState, tmSymbol) {
    if (tmState == this.currentState && (this.inputSymbol == null || tmSymbol == this.inputSymbol))
      return true;
    return false;
  }
}

class TuringMachine {
  constructor(transitionTable = [], startState = 0, startHeadPosition = 0
      , startTape = ['0'], maxSteps = 1000, blankSymbol = 'B') {
    this.transitionTable = transitionTable; //array of TMRules
    this.state = startState;
    this.tape = startTape;
    this.headPosition = startHeadPosition;
    this.halted = false;
    this.accepted = false;
    this.maxSteps = maxSteps;
    this.steps = 0;
    this.blankSymbol = blankSymbol;
    //always have one blank on a tape
    if (this.tape.length == 0)
      this.tape.push(this.blankSymbol);
  }
  get currentSymbol() {
    return this.tape[this.headPosition];
  }
  advanceStep() {
    this.steps++;
    let symbol = this.currentSymbol;
    let rule = null;
    for (let i = 0; i < this.transitionTable.length; i++) {
      if (this.transitionTable[i].checkRuleApplies(this.state, symbol)) {
        rule = this.transitionTable[i];
        break;
      }
    }

    if (rule == null) {
      console.log("ERROR - missing rule");
      this.halted = true;
    } else {
      //write symbols and change state
      if (rule.outputSymbol != null)
        this.tape[this.headPosition] = rule.outputSymbol;
      this.state = rule.nextState;
      //move head
      //account for array - inifinite tape, both ways
      if (rule.direction == 'R') {
        this.headPosition++;
        if (this.headPosition > this.tape.length - 1)
          this.tape.push(this.blankSymbol);
      } else if (rule.direction == 'L') {
        this.headPosition--;
        if (this.headPosition < 0) {
          this.tape.unshift(this.blankSymbol);
          this.headPosition  = 0;
        }
      }
      //check if we accept or reject
      if (rule.isAcceptState) {
        this.halted = true;
        this.accepted = true;
      } else if (rule.isRejectState) {
        this.halted = true;
      }

      if (this.steps >= this.maxSteps && !this.halted)
        this.halted = true;
    }
  }

  getOutput() {
    let output = "\n"
    for (let i = 0; i < this.tape.length; i++) {
      if (this.headPosition == i)
        output += ">"
      output += this.tape[i] + "  ";
    }
    output += "\nCurrent state: " + this.state;
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

  run(log = false) {
    console.log("\n*** Turing Machine Run ***");
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

module.exports = { TMRule, TuringMachine }
