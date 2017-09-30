import { State } from "./State";
import { Tape, TapeMovement } from "./Tape";
import * as chalk from 'chalk';
import * as itt from 'itt';
import * as fs from 'mz/fs';

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

    run ( tape : string | Tape ) : Tape;
    run ( initialState : string | State, tape : string | Tape ) : Tape;
    run ( initialState : string | State | Tape, tape ?: string | Tape ) : Tape {
        if ( initialState instanceof State ) {
            initialState = initialState.name;
        }

        if ( initialState instanceof Tape || !tape && typeof initialState === 'string' ) {
            tape = initialState;

            initialState = this.initialState;
        }

        if ( typeof tape === 'string' ) {
            tape = Tape.fromString( tape );
        }
        
        let currentState : string = initialState as string;
        let currentTape : Tape = tape;

        const history : [ string, Tape ][] = [];

        while ( currentState != this.finalState ) {
            if ( this.debug ) {
                history.push( [ currentState, currentTape.clone().trim() ] );
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

        if ( currentState ) {
            history.push( [ currentState, currentTape.clone().trim() ] );
        }

        if ( this.debug ) {
            console.log( history.map( ( [ state, tape ] ) => `(${ state == this.finalState ? chalk.green( state ) : state }, ${ tape.toString() })` ).join( ' ' ) );
        }

        return currentTape;
    }

    diagnose ( tape : string, cursor ?: number );
    diagnose ( tape : Tape );
    diagnose ( tape : string | Tape, cursor : number = -1 ) {
        if ( typeof tape === 'string' ) {
            tape = Tape.fromString( tape, cursor );
        }

        const wasDebugging = this.debug;

        this.debug = true;

        console.log( 'From', Tape.toString( tape ), 'to', Tape.toString( this.run( tape ) ) );
        
        this.debug = wasDebugging;
    }

    toDot () {
        const lines : string[] = [];

        lines.push( `digraph ${ this.constructor.name } {` );

        for ( let state of this.states.values() ) {
            if ( state.machine ) {
                lines.push( `\t${ state.name } [label=${state.machine.constructor.name} shape=plaintext]` )
            }

            for ( let [ target, transitions ] of itt( state.transitions ).groupBy( t => t.target ) ) {
                const transitionsString = transitions.map( transition => {
                    const input = transition.input === null
                        ? '▲'
                        : ( transition.input === true ? '*' : transition.input );

                    const output = transition.output === null
                        ? '▲'
                        : ( transition.output === true ? '*' : transition.output );

                    const movement = transition.movement === TapeMovement.Left
                        ? 'L'
                        : ( transition.movement === TapeMovement.Right ? 'R' : 'C' );

                    return `${ input }/${ output },${ movement }`;
                } );

                lines.push ( `\t${ state.name } -> ${ target } [label="${ transitionsString.join( '\n' ) }"]` );
            }
        }

        lines.push( '}' );

        return lines.join( '\n' );
    }

    async toDotFile ( file : string ) : Promise<void> {
        await fs.writeFile( file, this.toDot(), { encoding: 'utf8' } );
    }
}