import React from 'react';
import './GameOfLife.css';

/**
 * Game Of Life By John Conway
 * https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
 *
 * 1. Render grid
 * 2. Spawn life on click
 * 3. Implement game logic
 */
export default class GameOfLife extends React.Component {

    static field = {
        columnsAmount: 61,
        rowsAmount: 41,
    };
    static cellState = {
        ALIVE: true,
        DEAD: false,
    };

    // region Initialization

    constructor(props) {
        super(props);

        this.state = {
            cells: this.initializeCells(),
            isGameRunning: false,
        };

        setInterval(() => this.live(), 200)
    }

    initializeCells() {
        let cells = [];

        for (let columnIndex = 0; columnIndex < GameOfLife.field.columnsAmount; columnIndex++) {
            cells[columnIndex] = [];
            for (let rowIndex = 0; rowIndex < GameOfLife.field.rowsAmount; rowIndex++) {
                cells[columnIndex][rowIndex] = GameOfLife.cellState.DEAD;
            }
        }

        return cells;
    }

    // endregion

    // region Game update logic

    live() {
        if (!this.state.isGameRunning) {
            return;
        }

        const newCells = [];

        for (let columnIndex = 0; columnIndex < GameOfLife.field.columnsAmount; columnIndex++) {
            newCells[columnIndex] = [];
            for (let rowIndex = 0; rowIndex < GameOfLife.field.rowsAmount; rowIndex++) {
                newCells[columnIndex][rowIndex] = this.computeNewCellState(columnIndex, rowIndex)
            }
        }

        this.setState({cells: newCells})
    }

    computeNewCellState(columnIndex, rowIndex) {
        const aliveNeighboursAmount = this.computeAliveNeighboursAmount(columnIndex, rowIndex);
        const currentCellState = this.state.cells[columnIndex][rowIndex];

        if (currentCellState === GameOfLife.cellState.ALIVE) {
            if (aliveNeighboursAmount === 2 || aliveNeighboursAmount === 3) {
                return GameOfLife.cellState.ALIVE
            } else {
                return GameOfLife.cellState.DEAD
            }
        } else {
            if (aliveNeighboursAmount === 3) {
                return GameOfLife.cellState.ALIVE;
            }
        }

        return GameOfLife.cellState.DEAD;
    }

    computeAliveNeighboursAmount(columnIndex, rowIndex) {
        let aliveNeighboursAmount = 0;

        const neighbourOffsets = [];

        // Calculating the relative coordinates of neighbours
        for (let horizontalOffset = -1; horizontalOffset <= 1; horizontalOffset++) {
            for (let verticalOffset = -1; verticalOffset <= 1; verticalOffset++) {
                if (horizontalOffset === 0 && verticalOffset === 0) continue; // [0, 0] is given point (not a neighbour)
                neighbourOffsets.push([horizontalOffset, verticalOffset]);
            }
        }

        console.log(neighbourOffsets);

        for (const neighbourOffsetKey in neighbourOffsets) {
            const [xOffset, yOffset] = neighbourOffsets[neighbourOffsetKey];

            let newColumnOffset = columnIndex + xOffset;
            let newRowOffset = rowIndex + yOffset;

            // Check boundaries
            if (newColumnOffset < 0 || newColumnOffset > GameOfLife.field.columnsAmount - 1) {
                continue;
            }
            if (newRowOffset < 0 || newRowOffset > GameOfLife.field.rowsAmount - 1) {
                continue;
            }

            const neighbourState = this.state.cells[newColumnOffset][newRowOffset];
            if (neighbourState === GameOfLife.cellState.ALIVE) {
                aliveNeighboursAmount++;
            }
        }

        return aliveNeighboursAmount;
    }

    // endregion

    // region User Interactions

    toggleCellState(columnIndex, rowIndex) {
        const newCellsState = this.state.cells;

        newCellsState[columnIndex][rowIndex] = !newCellsState[columnIndex][rowIndex];

        this.setState({state: newCellsState})
    }

    toggleIsGameRunning() {
        this.setState({isGameRunning: !this.state.isGameRunning})
    }

    // endregion

    // region Rendering

    renderCells() {
        return (
            <div className="GameOfLife__cells">
                {this.state.cells.map((rows, columnIndex) => {
                    return this.renderColumn(rows, columnIndex)
                })}
            </div>
        );
    }

    mouseOverHandler() {
        console.log("hello!");
    }

    renderColumn(rows, columnIndex) {
        return (
            <div className="GameOfLife__column" key={`column_${columnIndex}`}>
                {rows.map((cellState, rowIndex) => {
                    const cellModifier = cellState === GameOfLife.cellState.DEAD ? 'dead' : 'alive';
                    return <div
                        className={`GameOfLife__cell GameOfLife__cell--${cellModifier}`}
                        key={`cell_${columnIndex}_${rowIndex}`}
                        onMouseOverCapture={() => this.toggleCellState(columnIndex, rowIndex)}
                    />
                })}
            </div>
        )
    }

    renderStartGameButton() {
        const buttonLabel = this.state.isGameRunning ? 'Stop' : 'Start';

        return (
            <button
                className="GameOfLife__startGameButton"
                onClick={() => this.toggleIsGameRunning()}
            >
                {buttonLabel}
            </button>
        )
    }

    render() {
        return (
            <div className="GameOfLife">
                {this.renderStartGameButton()}
                {this.renderCells()}
            </div>
        );
    };

    // endregion

}