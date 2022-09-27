import React, { Component } from "react";
import { useParams } from "react-router-dom";

class Account extends Component {
  constructor(props) {
    super(props);
    let { username } = this.props.params;
    this.state = {
      username: username,
      email: "",
      name: "",
      birthday: "",
      error: null,
      redirect: false,
    };
    this.getUserData = this.getUserData.bind(this);
  }

  componentDidMount() {
    this.getUserData();
  }

  getUserData() {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({
        username: this.state.username,
      }),
    };

    fetch("/api/accounts", requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.setState({ error: json.error });
        if (this.state.error == "OK") {
          this.setState({
            username: json.username,
            name: json.name,
            email: json.email,
            birthday: json.birthday,
          });
        }
      });
  }

  render() {
    const { name } = this.state;
    const { email } = this.state;
    const { username } = this.state;
    const { birthday } = this.state;

    return (
      <>
        {this.getUserData}
        <div>
          <ul>
            <li>{name}</li>
            <li> {username}</li>
            <li>{email}</li>
            <li>{birthday}</li>
          </ul>
          <a href={`/accounts/${username}/edit`}> Update </a>
        </div>
      </>
    );
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
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export default withParams(Account);