import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', loginStatusMessage: ''}

  onUsernameInput = event => {
    this.setState({username: event.target.value})
  }

  onPasswordInput = event => {
    this.setState({password: event.target.value})
  }

  onFormSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const creds = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(creds),
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      Cookies.set('jwt_token', (await response.json()).jwt_token)
      const {history} = this.props
      history.replace('/')
    } else {
      const errorMsg = `*${(await response.json()).error_msg}`
      this.setState({loginStatusMessage: errorMsg})
    }
  }

  render() {
    const token = Cookies.get('jwt_token')
    const {username, password, loginStatusMessage} = this.state

    if (token === undefined) {
      return (
        <div className="loginComponent">
          <div className="jobbyLoginCard">
            <img
              className="logoImage"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
            <form className="loginForm" onSubmit={this.onFormSubmit}>
              <label className="inputLabel" htmlFor="userName">
                USERNAME
              </label>
              <input
                className="loginInput"
                type="text"
                id="userName"
                placeholder="Username"
                onChange={this.onUsernameInput}
                value={username}
              />

              <label className="inputLabel" htmlFor="password">
                PASSWORD
              </label>
              <input
                className="loginInput"
                type="password"
                id="password"
                placeholder="Password"
                onChange={this.onPasswordInput}
                value={password}
              />

              <button className="submitButton" type="submit">
                Login
              </button>
            </form>
            <p className="loginErrorPara">{loginStatusMessage}</p>
          </div>
        </div>
      )
    }
    return <Redirect to="/" />
  }
}

export default Login
