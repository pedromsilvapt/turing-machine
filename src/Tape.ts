import * as chalk from 'chalk';

export enum TapeMovement {
    Left = 0,
    Center = 1,
    Right = 2
}

export type TapeValue = string | Symbol;

export class Tape {
    static fromString ( input : string, cursor : number = -1 ) : Tape {
        const memory : TapeValue[] = [ null ].concat( input.split( '' ) )
            .map( a => a === '▲' ? null : a );
        
        return new Tape( memory, cursor + 1 );
    }

    memory : TapeValue[];

    cursor : number = 0;

    constructor ( memory : TapeValue[] = [ null ], cursor : number = 0 ) {
        this.memory = memory;
        this.cursor = cursor;
    }

    moveRight () {
        this.cursor++;

        while ( this.memory.length <= this.cursor ) {
            this.memory.push( null );
        }
    }

    moveLeft () {
        if ( this.cursor === 0 ) {
            throw new Error( `Cursor going out of bounds.` );
        }

        this.cursor--;
    }

    move ( movement : TapeMovement ) {
        switch ( movement ) {
            case ( TapeMovement.Left ):
                this.moveLeft();
                break;
            case ( TapeMovement.Right ):
                this.moveRight();
                break;
        }
    }

    read () : TapeValue {
        return this.memory[ this.cursor ];
    }

    store ( value : TapeValue ) {
        this.memory[ this.cursor ] = value;
    }

    clone () : Tape {
        return new Tape( Array.from( this.memory ), this.cursor );
    }

    toString () : string {
        return this.memory.map( c => c === null ? '▲' : c )
            .map( ( a, i ) => i == this.cursor ? chalk.red( a ) : a )
            .join( '' );
    }
}