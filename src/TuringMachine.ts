import { State } from "./State";
import { Tape } from "./Tape";

export { Tape, TapeMovement } from './Tape';

export class TuringMachine {
    debug : boolean = false;

    states : Map<string, State> = new Map();

    initialState : string = null;
    
    finalState : string = null;

    addState ( name : string, machine : TuringMachine = null ) : State {
        if ( this.states.has( name ) ) {
            throw new Error( `State named "${ name }" already defined.` );
        }

        const state = new State( name, machine );

        this.states.set( state.name, state );
        
        return state;
    }

    getState ( name : string ) : State {
        return this.states.get( name );
    }

    setFinalState ( state : string | State ) : this {
        if ( state instanceof State ) {
            state = state.name;
        }
        
        this.finalState = state;

        return this;
    }

    setInitialState ( state : string | State ) : this {
        if ( state instanceof State ) {
            state = state.name;
        }

        this.initialState = state;

        return this;
    }

    run ( tape : Tape ) : Tape;
    run ( initialState : string | State, tape : Tape ) : Tape;
    run ( initialState : string | State | Tape, tape ?: Tape ) : Tape {
        if ( initialState instanceof State ) {
            initialState = initialState.name;
        }

        if ( initialState instanceof Tape ) {
            tape = initialState;

            initialState = this.initialState;
        }
        
        let currentState : string = initialState;
        let currentTape : Tape = tape;

        const history : [ string, Tape ][] = [];

        while ( currentState != this.finalState ) {
            if ( this.debug ) {
                history.push( [ currentState, currentTape.clone() ] );
            }

            if ( !this.states.has( currentState ) ) {
                throw new Error( `State "${ currentState }" not found.` );
            }
            
            const state = this.states.get( currentState );
            
            [ currentState, currentTape ] = state.run( currentTape );

            if ( !currentState ) {
                break;
            }
        }

        if ( this.debug ) {
            console.log( history.map( ( [ state, tape ] ) => `(${ state }, ${ tape.toString() })` ).join( ' ' ) );
        }

        return currentTape;
    }
}