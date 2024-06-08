import {HiHome, HiBriefcase, HiOutlineLogout} from 'react-icons/hi'
import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import './index.css'

const Header = props => {
  const logout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="headerComponent">
      <ul type="none" className="desktopHeader">
        <li>
          <Link to="/">
            <img
              className="desktopLogo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
        </li>
        <li>
          <ul className="menuUl" type="none">
            <Link to="/" className="navLink">
              <li className="menuItem">Home</li>
            </Link>
            <Link className="navLink" to="/jobs">
              <li className="menuItem">Jobs</li>
            </Link>
          </ul>
        </li>
        <li>
          <button type="button" className="logoutButton" onClick={logout}>
            Logout
          </button>
        </li>
      </ul>

      <ul type="none" className="mobileHeader">
        <li>
          <Link to="/">
            <img
              className="mobileLogo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
        </li>
        <li className="headerButtons">
          <ul className="iconsUl" type="none">
            <li>
              <Link to="/">
                <HiHome className="homeButtons" />
              </Link>
            </li>
            <li>
              <Link to="/jobs">
                <HiBriefcase className="homeButtons" />
              </Link>
            </li>
            <li>
              <HiOutlineLogout className="homeButtons" onClick={logout} />
            </li>
          </ul>
        </li>
      </ul>
    </div>
  )
}

export default withRouter(Header)
