//module imports
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Quizzes from "./quizzes";
import "../styles/login.css";
import { withRouter } from 'react-router-dom';

import axios from "axios";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student_hash: "",
            quizzes: "",
            input_value: ""
        }
    }


    //Function that gets the quiz details.
    async get_quiz_details() {
        await axios.get("https://essential-training-app-api.herokuapp.com/api/quizzes/student/" + this.state.input_value + "/?format=json")
            .then(response => {
                this.setState({ quizzes: (response.data) });
            })
            .catch(function (error) {
                console.log(error);
            })
    }


    //Function to authenticate the entered hash.
    async authenticate() {
        await this.get_quiz_details()

        if (this.state.quizzes !== "") {
            let { history } = this.props;
            history.push({
                pathname: '/quizzes',
                hash: this.state.input_value,
            });
        }

        else {
            alert("Wrong Hash")
        }


    }


    //Main render function.
    render() {
        return (
            <div id="main_login_container">
                <div id="login_form_container">
                    <div id="login_form_inner_container">
                        <div id="left_box_container">
                            <div id="login_text">
                                <div id="login_title">ESSENTIAL <br /> TRAINING <br /> APP</div>
                                <div id="login_description">Lorem ipsum dolor sit amet,
                                    consectetuer adipiscing elit,
                                    sed diam nonummy nibh euismod
                                    tincidunt ut laoreet dolore magna
                                    aliquam erat volutpat. Ut wisi enim
                                    ad minim veniam, quis nostrud exerci
                                    tation ullamcorper suscipit lobortis
                                    nisl ut aliquip ex ea </div>
                            </div>
                        </div>
                        <div id="right_box_container">
                            <div id="sign_in_text"> Sign in </div>
                            <div> <input placeholder="Enter Student Hash" id="login_input" value={this.state.input_value} onChange={(e) => this.setState({ input_value: e.target.value })} />
                            </div>

                            <div onClick={() => { this.authenticate() }} id="login_button">Login</div>
                        </div>
                        <div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Login);

