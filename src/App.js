import React, { Component } from 'react';
import Modal from './Modal';
import './App.css';

let INITIAL_STATE = {
  cells: ['', '', '', '', '', '', '', '', ''],
  emptyCells: [],
  winner: null,
  draw: false,
  startsAt: new Date(),
  duration: null,
  show: false,
  turn: 1
};

class App extends Component {

  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
    this.stat = {
      X: 0,
      O: 0
    };
    this.domRefs = [];
  }

  reset() {
    this.setState({ ...INITIAL_STATE, startsAt: new Date() });
  }

  calculate(index, who) {
    let cells = this.state.cells.slice();
    cells[index] = who;
    let winner = this.checkForWinner(cells, who);
    let emptyCells = this.checkEmptyCells(cells);
    let draw = emptyCells.length === 0 ? true : false;
    let duration = ((new Date() - this.state.startsAt) / 1000).toFixed(1);
    let show = (winner || draw) ? true : false;
    let turn = 1 - this.state.turn;

    let elem = this.domRefs[index];
    elem.classList.add(who);

    return {cells, winner, emptyCells, draw, duration, show, turn};
  }


  handleClick(index) {

    if(this.state.cells[index] === '' && !this.state.winner && !this.state.draw) {
      let {cells, winner, emptyCells, draw, duration, show, turn} = this.calculate(index, 'X');

      this.setState({ cells, winner, draw, emptyCells, duration, show, turn }, () => {       
        if (!this.state.winner && !this.state.draw) {
          let r = Math.floor(Math.random() * Math.floor(this.state.emptyCells.length));
          let {cells, winner, emptyCells, draw, duration, show, turn} = this.calculate(this.state.emptyCells[r], 'O');

          setTimeout(() => this.setState({ cells, winner, draw, emptyCells, duration, show, turn }), 300);        
        }
        
      });
    }
  }

  checkEmptyCells(cells) {
    let emptyCells = [];
    cells.forEach((cell, i) => {
      if (cells[i] === '') {
        emptyCells.push(i);
      }  
    });
    return emptyCells;
  }

  checkForWinner(cells, currentTurn) {
    let combinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
    let win = combinations.find((combination) => {
      return (cells[combination[0]] !== '' && cells[combination[1]] !== ''  && cells[combination[2]] !== ''  && cells[combination[0]] === cells[combination[1]] && cells[combination[1]] === cells[combination[2]]);
    });

    if (win) {
      this.stat[currentTurn] = this.stat[currentTurn] + 1;
      return currentTurn;
    }
    return null;
  }

  toggleModal() {
    this.setState({
      show: !this.state.show
    }, () => {
      this.reset();
    });
  }

  render() {
    return (
      <div>
        <h1>Current Turn: {this.state.turn ? "You ('X')" : "Computer ('O)" }</h1>
        <div className="main">
          <div className="cells">
            {this.state.cells.map((cell, index) => {
              return <div ref={(ref) => this.domRefs.push(ref)} key={index} onClick={() => this.handleClick(index)} className="cell">{cell}</div>;
            })}
          </div>
          <div className="board">
            <h2> Game Statistics: </h2>
            <ol>
              <li> You ('X') won {this.stat['X']} times.</li>
              <li> Computer('O') won {this.stat['O']} times.</li>
            </ol>
          </div>
        </div>
        <Modal show={this.state.show} onClose={()=> this.toggleModal()} text='Start over'>
          {
            this.state.winner ? 
              <div className="container">
                <h2 className="winner">{`${this.state.winner} player won in ${this.state.duration}s!`}</h2>
              </div> :
            null
          }

          {
            this.state.draw ?
                <div className="container"> 
                  <h2 className="draw">{`We have a draw in ${this.state.duration}s!`}</h2>
                </div> :
             null
          }
        </Modal>
     
      </div>
    )
  }
}

export default App;