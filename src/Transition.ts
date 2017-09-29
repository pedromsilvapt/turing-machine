import { Tape, TapeMovement, TapeValue } from './Tape';

export interface Transition {
    run ( tape : Tape ) : [ string, Tape ];
}

export class BaseTransition implements Transition {
    input : TapeValue;

    output : TapeValue;

    movement : TapeMovement;
    
    target : string;

    constructor ( target : string, input : TapeValue, output : TapeValue, movement : TapeMovement = TapeMovement.Center ) {
        this.input = input;
        this.output = output;
        this.movement = movement;
        this.target = target;
    }

    run ( tape : Tape ) : [ string, Tape ] {
        if ( this.input !== true ) {
            if ( tape.read() !== this.input ) {
                return [ null, null ];
            }
        }

        if ( this.output !== true ) {
            tape.store( this.output );
        }

        tape.move( this.movement );

        return [ this.target, tape ];
    }
}