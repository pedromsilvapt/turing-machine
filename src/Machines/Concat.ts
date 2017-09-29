import { TuringMachine, TapeMovement } from "../TuringMachine";
import { TapeValue } from "../Tape";
import { EraseMachine } from "./Erase";

export class ConcatMachine extends TuringMachine {
    constructor ( domain : Iterable<TapeValue> ) {
        super();

        const stateInitial = this.addState( '0' );
        const state1 = this.addState( '1' );
        const stateErase = this.addState( 'erase', new EraseMachine( domain ) );
        const state2 = this.addState( '2' );
        const stateFinal = this.addState( 'final' );

        stateInitial.addTransition( state1, [ null, null, TapeMovement.Right ] );

        for ( let elem of domain ) {
            state1.addTransition( state1, [ elem, elem, TapeMovement.Right ] );
        }

        state1.addTransition( stateErase, [ null, null, TapeMovement.Center ] );

        for ( let elem of [ ...domain, null ] ) {
            stateErase.addTransition( state2, [ elem, elem, TapeMovement.Left ] );
        }

        for ( let elem of domain ) {
            state2.addTransition( state2, [ elem, elem, TapeMovement.Left ] );
        }

        state2.addTransition( stateFinal, [ null, null, TapeMovement.Center ] );

        this.setInitialState( stateInitial );
        this.setFinalState( stateFinal );
    }
}