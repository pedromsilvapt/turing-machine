# Turing Machine
A simplistic simulation of turing machines written in TypeScript. Tested on NodeJS v8, although eralier versions should word as well.

## Installation
The module is available through npm as:
```shell
npm install --save turing-machine
```

## Usage
We can use pre-built machines.
```typescript
import { EraseMachine } from 'turing-machine/pre-built';

// In this case, the erase machine requires the domain of our language
const eraseMachine = new EraseMachine( [ 'a', 'b' ] );

const eraseTape = Tape.fromString( 'aaabb', 2 );

eraseMachine.diagnose( eraseTape );
```

Or we can create our own custom machines.
```typescript
import { TuringMachine, Tape, TapeMovement } from 'turing-machine';

// Let's create a machine that accepts a's and b's and removes all the a's.
const machine = new TuringMachine();

const stateInitial = machine.addState( '0' );

const stateConsume = machine.addState( '1' );

// We can even compose machines!
const stateErase = machine.addState( '2', new EraseMachine( [ 'a', 'b' ] ) );

const stateRollback = machine.addState( '3' );

const stateFinal = machine.addState( '4' );

// After we have defined the states, we can add transitions between them
stateInitial.addTransition( stateConsume, [ null, null, TapeMovement.Right ] );
stateConsume.addTransition( stateErase, [ 'a', 'a', TapeMovement.Center ] );
stateConsume.addTransition( stateConsume, [ 'b', 'b', TapeMovement.Right ] );
stateConsume.addTransition( stateRollback, [ null, null, TapeMovement.Left ] );
stateErase.addTransition( stateConsume );
stateRollback.addTransition( stateRollback, [ 'b', 'b', TapeMovement.Left ] );
stateRollback.addTransition( stateFinal, [ null, null, TapeMovement.Center ] );

machine.setInitialState( stateInitial );

machine.setFinalState( stateFinal );

// Automatically enables debug mode and prints the productions used and the result
machine.diagnose( 'bbaabab' );
// Otherwise, just call the method run and get the final Tape state
machine.run( 'bbaabab' );
```