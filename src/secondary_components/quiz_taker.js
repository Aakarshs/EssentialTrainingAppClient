//module imports
import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Quizzes from "./quizzes";
//import { get_quizzes } from "./api_functions/http_api";
import "../styles/quiz_taker.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from 'react-modal';
import CircularProgressbar from 'react-circular-progressbar';


class Quiz_taker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student_hash: "",
            quiz_details: "",
            refresh: false,
            index: 0,
            question_id: [],
            questions_correct: [],
            question_stack: '',
            solution_input: '',
            solution: [],
            solution_index: 0,
            no_of_questions_asked: '',
            no_incorrect: '',
            modalIsOpen: false,
            quesionts_correct_circles: '',
            quiz_log: {},
            start_time: 0,
            intro_modal_open: true
        }

    }

    //Function to catch any errors caused by the api calls.
    componentDidCatch(error, info) {
        if (window.performance) {
            if (performance.navigation.type == 1) {
                this.props.history.push('/login');
            }
        }
    }


    //React lifecycle method.
    async componentWillMount() {
        try {
            await axios.get("https://essential-training-app-api.herokuapp.com/api/quizzes/" + this.props.location.quiz_id + "/?format=json")
                .then(response => {
                    this.setState({ quiz_details: (response.data) }, () => { this.setState({ refresh: !this.state.refresh }); });
                })
                .catch(function (error) {
                    console.log(error);
                })

            if (this.state.quiz_details.questions != null || this.state.quiz_details != undefined) {
                await this.setState({
                    question_id: (this.state.quiz_details.questions.map((item) => { return (item.template_id) })),
                    questions_correct: (this.state.quiz_details.questions.map((item) => { return (item.amount) })),
                    quesionts_correct_circles: (this.state.quiz_details.questions.map((item) => { return (item.amount) })),
                    student_hash: this.props.location.student_hash,
                })
            }

            if (this.state.question_id != undefined) {
                var temp_quiz_log = []
                for (var i = 0; i < this.state.question_id.length; i++) {
                    temp_quiz_log.push([this.state.question_id[i], 0, 0, 0])
                }
                this.setState({ quiz_log: temp_quiz_log });
            }

            var start_time_obj = new Date();
            this.setState({ start_time: start_time_obj.getTime() });

        }
        catch (error) {
            if (window.performance) {
                if (performance.navigation.type == 1) {
                    this.props.history.push('/login');
                }
            }
        }

    }


    //Function to generate a new question.
    get_new_question(template_id) {
        if (template_id !== undefined) {
            axios.get("https://essential-training-app-api.herokuapp.com/api/question/new/" + template_id.toString() + "/?format=json")
                .then(response => {
                    this.setState({ question_stack: response.data.text, solution: response.data.solution_list })
                    return response.data.text
                })
                .catch(function (error) {
                })
        }
    }


    //Update the student log  for number of questions asked..
    update_log_asked(template_id_index) {
        var temp_arr = this.state.quiz_log;
        temp_arr[template_id_index][1] = temp_arr[template_id_index][1] + 1
        this.setState({ quiz_log: temp_arr })
    }


    //Update the student log for incorrect answers.
    update_log_incorrect(template_id_index) {
        var temp_arr = this.state.quiz_log;
        temp_arr[template_id_index][2] = temp_arr[template_id_index][2] + 1
        this.setState({ quiz_log: temp_arr })
    }


    //Update student log once quiz is done.
    update_log_done(template_id_index) {
        var temp_arr = this.state.quiz_log;
        temp_arr[template_id_index][3] = temp_arr[template_id_index][3] + 1
        this.setState({ quiz_log: temp_arr })
    }


    //Render the question.
    render_question() {
        if (this.state.questions_correct[this.state.solution_index] !== 0 && this.state.question_id !== undefined) {
            return (this.get_new_question(this.state.question_id[this.state.solution_index]))
        }
        else {
            this.update_log_done(this.state.solution_index)
            this.setState({ solution_index: this.state.solution_index + 1, refresh: !this.state.refresh }, () => {
                this.get_new_question(this.state.question_id[this.state.solution_index])
            })
        }
    }


    //Mark answer correct.
    set_correct() {
        var temp = this.state.questions_correct;
        temp[this.state.solution_index] = temp[this.state.solution_index] - 1
        this.setState({ questions_correct: temp })
    }


    //Craete json of an the results to send to the backend.
    create_results_json() {
        var results_json = {}
        for (var i = 0; i < this.state.quiz_log.length; i++) {
            results_json[this.state.quiz_log[i][0]] = { "no_of_questions_asked": this.state.quiz_log[i][1], "no_incorrect": this.state.quiz_log[i][2], "done": this.state.quiz_log[i][3] }
        }
        return (JSON.stringify(results_json))
    }


    //Count the total number of questions.
    total_questions() {
        var total_questions = 0;
        for (var i = 0; i < this.state.quiz_log.length; i++) {
            total_questions = total_questions + this.state.quiz_log[i][1];
        }
        return (total_questions)
    }


    //Count the total number of incorrect questions.
    total_incorrect_questions() {
        var total_incorrect_questions = 0;
        for (var i = 0; i < this.state.quiz_log.length; i++) {
            total_incorrect_questions = total_incorrect_questions + this.state.quiz_log[i][2];
        }
        return (total_incorrect_questions)
    }


    //Create the quiz log.
    create_quiz_log = () => {
        var quiz_log_json = {
            "student_hash": this.state.student_hash,
            "quiz_id": this.props.location.quiz_id,
            "results_json": this.create_results_json(),
            "num_questions": this.total_questions(),
            "num_incorrect": this.total_incorrect_questions(),
            "completed": true,
            "passed": true,
            "start_time": "2019-04-14T22:16:55.906695Z",
            "end_time": "2019-04-14T22:16:55.906695Z"
        }
        return axios.post("https://essential-training-app-api.herokuapp.com/api/" + "create/quiz_log/",

            JSON.stringify(quiz_log_json)
            , {
                headers: {
                    'Content-Type': "application/json"
                } //Let backend know that the data is JSON object.
            })
            .then(response => {
                return (response) //Return data if the function call was successful.
            })
            .catch(error => {
                console.log(error.response) //Log the error on the console if there was an error.
            });
    }


    //Litening for the quiz to end.
    quiz_finish_listner() {
        var arr_zero = Array(this.state.questions_correct.length).fill(0);
        if (JSON.stringify(this.state.questions_correct) === JSON.stringify(arr_zero)) {
            this.setState({ modalIsOpen: true })
            this.create_quiz_log()
        }
    }


    //Render modal once the quiz is finished.
    render_modal() {
        return (
            <Modal isOpen={this.state.modalIsOpen}>
                <div id="modal_intro">
                    <div id="modal_intro_text"> Quiz Finished! </div>
                    <div id="start_button" onClick={() => { this.quit() }}>
                        Done
                </div>
                </div>
            </Modal>)
    }


    //Renders the start quiz modal.
    render_intro_modal() {
        return (
            <Modal isOpen={this.state.intro_modal_open} >
                <div id="modal_intro">
                    <div id="modal_intro_text"> Start the quiz now! </div>
                    <div id="start_button" onClick={() => { this.render_question(); this.setState({ intro_modal_open: false }) }}>
                        Start
                </div>
                </div>
            </Modal>)
    }


    //Controls to quit quiz button.
    quit() {
        let { history } = this.props;
        history.push({
            pathname: '/quizzes',
            hash: this.state.student_hash,
        });
    }


    //Function to see if the answer is within a given tolerance range.
    range_correct(num, ans, round_range) {
        var diff = Math.abs(num - ans);
        if (diff / num < round_range) {
            return true
        }
        else {
            return false
        }
    }


    //Initialize the quiz.
    initialize_quiz() {
        if (this.range_correct(parseFloat(this.state.solution_input), parseFloat(this.state.solution[this.state.solution_index]), 0.01)) {
            alert("Correct Answer");
            this.setState({ solution_input: '' });
            this.set_correct();
            this.render_question();
        }
        else {
            alert("Incorrect-the real solution is " + this.state.solution[this.state.solution_index])
            this.setState({ solution_input: '' });
            this.render_question();
            this.update_log_incorrect(this.state.solution_index);
        }
        this.quiz_finish_listner();
        this.update_log_asked(this.state.solution_index);
    }


    //Renders the correct answer.
    render_correct_answers() {
        return (
            this.state.questions_correct.map((item, index) => {
                return (
                    <div style={{ width: 100, height: 100, alignSelf: 'center' }}>
                        <CircularProgressbar
                            percentage={100 - ((item / this.state.quesionts_correct_circles[index]) * 100)}
                            text={`${item.toString() + "/" + this.state.quesionts_correct_circles[index]}`}
                            styles={{

                                background: {
                                    fill: "white"
                                },
                                text: {
                                    fill: "#455CAA",
                                },
                                path: {
                                    stroke: "#455CAA"
                                },
                                trail: { stroke: "silver" }
                            }}
                        />
                    </div>
                )
            })
        )
    }


    //main render function.
    render() {
        return (
            <div id="main_container">
                <div>

                </div>
                <div id="left_bar">
                    {this.render_correct_answers()} </div>
                {this.render_intro_modal()}
                {this.render_modal()}
                <div id="right_bar">
                    <div id="next_button" onClick={() => { this.render_question() }}>Next</div>
                    <div id="quit_button" onClick={() => { this.quit() }}>Quit</div>
                </div>
                <div id="question_container">
                    <div id="question_answer">
                        <div id="question_text">  {this.state.question_stack} </div>
                        <input id="input" placeholder={"Insert Answer Here"} value={this.state.solution_input} onChange={(e) => { this.setState({ solution_input: e.target.value }) }} />
                        <div id="submit_button" onClick={() => { this.initialize_quiz() }}>Submit</div>
                    </div>
                </div>


                The solution is
             <div style={{ position: 'absolute', zIndex: 9999, }}>   {this.state.solution[this.state.solution_index]} </div>
            </div>
        );
    }
}

export default Quiz_taker;
