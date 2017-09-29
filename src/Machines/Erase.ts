import { TuringMachine, TapeMovement } from "../TuringMachine";
import { TapeValue } from "../Tape";

export class EraseMachine extends TuringMachine {
    constructor ( domain : Iterable<TapeValue> ) {
        super();

        const stateInitial = this.addState( '0' );
        const state1 = this.addState( '1' );
        const state2 = this.addState( '2' );
        const stateFinal = this.addState( 'final' );

        for ( let elem of [ ...domain, null ] ) {
            stateInitial.addTransition( state1, [ elem, null, TapeMovement.Right ] );
        }

        for ( let elem of domain ) {
            state1.addTransition( state1, [ elem, elem, TapeMovement.Right ] );
        }

        state1.addTransition( state2, [ null, null, TapeMovement.Left ] );

        for ( let [ index, elem ] of Array.from( domain ).entries() ) {
            const customState = this.addState( 'mem' + index );

            state2.addTransition( customState, [ elem, null, TapeMovement.Left ] );

            customState.addTransition( customState, [ elem, elem, TapeMovement.Left ] );

            customState.addTransition( stateFinal, [ null, elem, TapeMovement.Center ] );
        }

        for ( let [ index, elem ] of Array.from( domain ).entries() ) {
            for ( let [ index2, elem2 ] of Array.from( domain ).entries() ) {
                if ( index2 === index ) {
                    continue;
                }

                this.getState( 'mem' + index ).addTransition( 'mem' + index2, [ elem2, elem, TapeMovement.Left ] );
            }
        }

        this.setInitialState( stateInitial );
        this.setFinalState( stateFinal );
    }
}