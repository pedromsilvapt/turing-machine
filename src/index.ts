import { TuringMachine, TapeMovement, Tape } from './TuringMachine'
import { EraseMachine } from './Machines/Erase';
import { ConcatMachine } from './Machines/Concat';

// const machine = new TuringMachine();

// const state0 = machine.addState( "0" );

// const state1 = machine.addState( "1" );

// const state2 = machine.addState( "2" );

// const state3 = machine.addState( "3" );

// state0.addTransition( '1', [ null, null, TapeMovement.Right ] );

// state1.addTransition( '1', [ 'a', '1', TapeMovement.Right ] );
// state1.addTransition( '2', [ 'b', 'b', TapeMovement.Right ] );

// state2.addTransition( '2', [ 'b', 'b', TapeMovement.Right ] );
// state2.addTransition( '3', [ 'c', '3', TapeMovement.Right ] );

// machine.setFinalState( state3 );

// console.log( 'Result ' + machine.run( state0, Tape.fromString( 'aaabbc' ) ) );

// const eraseMachine = new EraseMachine( [ 'a', 'b' ] );

// machine.debug = true;

// console.log( 'Result from ' + Tape.fromString( 'aabaa', 2 ) + ' to ' + eraseMachine.run( Tape.fromString( 'aabaa', 2 ) ) );

const concatMachine = new ConcatMachine( [ 'a', 'b' ] );

concatMachine.debug = true;

console.log( 'Result from ' + Tape.fromString( 'aa▲aa', 2 ) + ' to ' + concatMachine.run( Tape.fromString( 'aa▲aa' ) ) );