import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import JobItem from '../JobItem'

import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    fetchProfileStatus: 'initial',
    profileDetails: {},
    radiovalue: '',
    checkboxValues: [],
    searchInput: '',
    jobsFetchStatus: 'initial',
    jobsData: [],
  }

  componentDidMount = () => {
    this.fetchProfile()
    this.searchJobs()
  }

  fetchProfile = async () => {
    const url = 'https://apis.ccbp.in/profile'
    const token = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    this.setState({fetchProfileStatus: 'fetching'})
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = (await response.json()).profile_details
      const modifiedProfileData = {
        name: data.name,
        profileImageUrl: data.profile_image_url,
        shortBio: data.short_bio,
      }
      this.setState({
        profileDetails: {...modifiedProfileData},
        fetchProfileStatus: 'fetched',
      })
    } else {
      this.setState({fetchProfileStatus: 'failed'})
    }
  }

  searchJobs = async () => {
    const {searchInput, checkboxValues, radiovalue} = this.state
    const checkboxValuesString = checkboxValues.join(',')
    const token = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${checkboxValuesString}&minimum_package=${radiovalue}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    this.setState({jobsFetchStatus: 'fetching'})
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = (await response.json()).jobs
      const modifiedData = data.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      this.setState({jobsData: modifiedData, jobsFetchStatus: 'fetched'})
    } else {
      this.setState({jobsFetchStatus: 'failed'})
    }
  }

  renderProfile = () => {
    const {fetchProfileStatus, profileDetails} = this.state
    const {profileImageUrl, shortBio, name} = profileDetails

    switch (fetchProfileStatus) {
      case 'fetching':
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
      case 'failed':
        return (
          <button type="button" className="retryButton">
            Retry
          </button>
        )
      case 'fetched':
        return (
          <div className="profileCard">
            <img className="profileIcon" alt="profile" src={profileImageUrl} />
            <h1 className="profileName">{name}</h1>
            <p className="bio">{shortBio}</p>
          </div>
        )
      default:
        return null
    }
  }

  renderFilters = () => {
    return (
      <div>
        <hr className="hRule" />
        <h3 className="subHeading">Type of Employement</h3>
        <ul className="filterUl" type="none">
          {employmentTypesList.map(eachType => (
            <li key={eachType.employmentTypeId}>
              <input
                onClick={this.onCheckboxClick}
                className="checkbox"
                type="checkbox"
                value={eachType.employmentTypeId}
                id={eachType.employmentTypeId}
              />
              <label
                className="checkboxLabel"
                htmlFor={eachType.employmentTypeId}
              >
                {eachType.label}
              </label>
            </li>
          ))}
        </ul>
        <hr className="hRule" />
        <h3 className="subHeading">Salary Range</h3>
        <ul className="filterUl" type="none">
          {salaryRangesList.map(eachItem => (
            <li key={eachItem.salaryRangeId}>
              <input
                className="radio"
                type="radio"
                id={eachItem.label}
                name="salaryRange"
                value={eachItem.salaryRangeId}
                onClick={this.onRadioClick}
              />
              <label className="radioLabel" htmlFor={eachItem.label}>
                {eachItem.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderSearchElement = () => {
    const {searchInput} = this.state
    return (
      <div>
        <form onSubmit={this.onSearchClick} className="searchDiv">
          <input
            value={searchInput}
            onChange={this.onSearchInput}
            className="searchEl"
            type="search"
            placeholder="Search"
          />
          <button
            className="searchIcon"
            type="button"
            data-testid="searchButton"
          >
            <BsSearch className="search-icon" />
          </button>
        </form>
      </div>
    )
  }

  onSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onCheckboxClick = event => {
    const {checkboxValues} = this.state
    if (
      event.target.checked === true &&
      !checkboxValues.includes(event.target.value)
    ) {
      this.setState(
        {checkboxValues: [...checkboxValues, event.target.value]},
        this.searchJobs,
      )
    } else if (event.target.checked === false) {
      const updatedCheckboxValues = checkboxValues.filter(
        eachItem => eachItem !== event.target.value,
      )
      this.setState({checkboxValues: updatedCheckboxValues}, this.searchJobs)
    }
  }

  onRadioClick = event => {
    this.setState({radiovalue: event.target.value}, this.searchJobs)
  }

  onSearchClick = event => {
    event.preventDefault()
    this.searchJobs()
  }

  renderSearchResults = () => {
    const {jobsData, jobsFetchStatus} = this.state

    switch (jobsFetchStatus) {
      case 'fetching':
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
      case 'fetched':
        if (jobsData.length !== 0) {
          return (
            <ul className="jobsUl" type="none">
              {jobsData.map(eachItem => (
                <JobItem key={eachItem.id} data={eachItem} />
              ))}
            </ul>
          )
        } else {
          return (
            <div className="noJobsDiv">
              <img
                src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                alt="no jobs"
              />
              <h1>No Jobs Found</h1>
              <p>We could not find any jobs. Try other filters.</p>
            </div>
          )
        }
      case 'failed':
        return (
          <div className="fetchFailedDiv">
            <Header />
            <div>
              <img
                src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
                alt="failure view"
              />
            </div>
            <h1>Oops! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking for</p>
            <button type="button" onClick={this.searchJobs}>
              Retry
            </button>
          </div>
        )
      default:
        return null
    }
  }

  render() {
    return (
      <div className="jobsComponent">
        <Header />
        <div className="jobsSection">
          <div className="profileAndFilters">
            <div className="profileDiv">{this.renderProfile()}</div>
            {this.renderFilters()}
          </div>
          <div className="searchAndResultsDiv">
            {this.renderSearchElement()}
            {this.renderSearchResults()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
