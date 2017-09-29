import { BaseTransition, Transition } from './Transition';
import { TapeMovement, Tape, TapeValue } from './Tape';
import { TuringMachine } from './TuringMachine';

export type BaseTransitionDefinition = [ TapeValue, TapeValue, TapeMovement ];

export class State {
    name : string;

    transitions : Transition[] = [];

    machine : TuringMachine = null;

    constructor ( name : string, machine : TuringMachine = null ) {
        this.name = name;
        this.machine = machine;
    }

    addTransition ( target : string | State, [ input, output, movement ] : BaseTransitionDefinition ) : this {
        if ( target instanceof State ) {
            target = target.name;
        }

        this.transitions.push( new BaseTransition( target, input, output, movement ) );

        return this;
    }

    run ( tape : Tape ) : [ string, Tape ] {
        let target : string = null;
        let targetTape : Tape = null;

        if ( this.machine ) {
            tape = this.machine.run( tape );

            if ( !tape ) {
                return [ null, null ];
            }
        }

        for ( let transition of this.transitions ) {
            [ target, targetTape ] = transition.run( tape );

            if ( target ) {
                return [ target, targetTape ];
            }
        }

        return [ null, null ];
    }
}