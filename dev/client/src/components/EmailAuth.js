import React, { Component } from "react";
import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";

class EmailAuth extends Component {
    constructor(props) {
        super(props);
        let { email } = this.props.params;
        this.state = {
            email: email,
            user: "",
            OTP: "",
            error: null,
            redirect: false,
            isAuth: true,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        fetch("/api/v1/accounts/signup/authenticate?email=" + this.state.email)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                if (json.error == "error_not_auth") {
                    this.setState({
                        isAuth: false,
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
                code: this.state.OTP,
            }),
        };

        fetch("/api/v1/accounts/signup/authenticate", requestOptions)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                this.setState({ error: json.error });
                if (this.state.error == "OK") {
                    this.setState({ redirect: true, user: json.user });
                } else if (this.state.error == "error_invalidOTP") {
                    this.setState({ error: "OTP is incorrect !!" });
                }
            });
    }

    render() {
        const { redirect } = this.state;
        const { user } = this.state;
        const { error } = this.state;
        const { isAuth } = this.state;

        if (isAuth) {
            if (!redirect) {
                return (
                    <>
                        <div>
                            <div>
                                <hr />
                            </div>
                            {error != "OK" && <p>{error}</p>}
                            <h3>Input OTP</h3>
                            <form onSubmit={this.handleSubmit}>
                                <div>
                                    <label>OTP </label>
                                    <input
                                        required
                                        type="password"
                                        name="OTP"
                                        id="OTP"
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <hr />
                                <button type="submit">Create an account</button>
                            </form>
                        </div>
                    </>
                );
            } else {
                return <Navigate to={`/accounts/${user}`} />;
            }
        } else {
            return <Navigate to={`/login`} />;
        }
    }
}

function withParams(Component) {
    return (props) => <Component {...props} params={useParams()} />;
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

export default withParams(EmailAuth);