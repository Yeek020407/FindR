import "../../static/css/LoginSignup.css";
import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            redirect: false,
            error_message: "NULL",
            isAuth: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch("/api/v1/accounts/login")
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                if (json.error == "status_invalid_access") {
                    this.setState({
                        isAuth: true,
                        username: json.username,
                    });
                }
            });
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
            }),
        };

        fetch("/api/v1/accounts/login", requestOptions)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                if (json.error == "status_OK") {
                    this.setState({ redirect: true });
                } else {
                    this.setState({
                        error_message: json.error_message,
                    });
                }
            });
    }

    render() {
        const { redirect } = this.state;
        const { error_message } = this.state;
        const { isAuth } = this.state;
        const { username } = this.state;

        if (!redirect && !isAuth) {
            return (
                <>
                    <Navbar key={isAuth} />
                    <div className="login-container">
                        <div className="login-background">
                            {error_message != "NULL" && (
                                <p className="login-error">{error_message}</p>
                            )}
                            <div className="login-panel">
                                <div className="login-content">
                                    <h3 className="login-content-title">
                                        Login
                                    </h3>
                                    <form onSubmit={this.handleSubmit}>
                                        <div className="login-content-credential">
                                            <img
                                                src="./assets/icons/Username.png"
                                                alt="icon"
                                                className="login-content-credential-icon"
                                            ></img>
                                            <input
                                                className="login-content-credential-input"
                                                required
                                                type="text"
                                                name="username"
                                                placeholder="Username"
                                                onChange={this.handleChange}
                                            />
                                        </div>

                                        <div className="login-content-credential">
                                            <img
                                                src="./assets/icons/Password.png"
                                                alt="icon"
                                                className="login-content-credential-icon"
                                            ></img>
                                            <input
                                                className="login-content-credential-input"
                                                required
                                                type="password"
                                                name="password"
                                                id="password"
                                                placeholder="Password"
                                                onChange={this.handleChange}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="login-content-btn btn-positive"
                                        >
                                            Login
                                        </button>
                                    </form>
                                    <a
                                        href={`/forgetpassword`}
                                        className="login-content-forgetpass"
                                    >
                                        Forget Password?
                                    </a>
                                    <div className="line"> </div>
                                    <div className="login-content-signup">
                                        <p className="login-content-signup-text">
                                            Need an account?
                                        </p>
                                        <a
                                            href={`/signup`}
                                            className="login-content-signup-link"
                                        >
                                            Sign up
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else {
            return <Navigate to={`/home`} />;
        }
    }
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(
                    cookie.substring(name.length + 1)
                );
                break;
            }
        }
    }
    return cookieValue;
}
