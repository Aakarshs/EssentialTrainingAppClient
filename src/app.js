//module imports
import React, { Component } from 'react';
import Login from './secondary_components/login';
import Quizzes from './secondary_components/quizzes';
import Quiz_taker from './secondary_components/quiz_taker';
import { BrowserRouter, Route } from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  //Main render function.
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route component={(props) => <Login {...props} />} exact={true} path='/login' />
          <Route component={(props) => <Quizzes {...props} />} exact={true} path='/quizzes' />
          <Route component={(props) => <Quiz_taker {...props} />} exact={true} path='/quiz_taker' />
        </div>
      </BrowserRouter>
    );
  }
}
export default App;