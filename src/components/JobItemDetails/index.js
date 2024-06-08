import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'
import {BsFillStarFill} from 'react-icons/bs'
import {FaMapMarkerAlt} from 'react-icons/fa'
import {FaExternalLinkAlt} from 'react-icons/fa'

import {BsBriefcaseFill} from 'react-icons/bs'

class JobItemDetails extends Component {
  state = {fetchStatus: 'initial', jobDetails: {}, similarJobs: []}

  componentDidMount = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const token = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    this.setState({fetchStatus: 'fetching'})

    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      this.setState({fetchStatus: 'fetched'})

      const jobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        jobDescription: data.job_details.job_description,
        lifeAtCompany: data.job_details.life_at_company,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        skills: data.job_details.skills,
        title: data.job_details.title,
      }

      const similarJobs = data.similar_jobs.map(eachItem => ({
        title: eachItem.title,
        location: eachItem.location,
        rating: eachItem.rating,
        jobDescription: eachItem.job_description,
        employmentType: eachItem.employment_type,
        companyLogoUrl: eachItem.company_logo_url,
      }))

      this.setState({jobDetails, similarJobs})
    } else {
      this.setState({fetchStatus: 'failed'})
    }
  }

  renderSkillsDiv = () => {
    const {jobDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      title,
      skills,
    } = jobDetails

    if (skills !== undefined) {
      return skills.map(eachItem => (
        <div key={eachItem.name} className='skillItem'>
          <img
            alt={eachItem.name}
            className='skillImage'
            src={eachItem.image_url}
          />
          <p>{eachItem.name}</p>
        </div>
      ))
    }
  }

  renderSimilarJobs = () => {
    const {similarJobs} = this.state
    if (similarJobs !== undefined) {
      return (
        <ul className='similarJobsUl'>
          {similarJobs.map(eachItem => (
            <div key={eachItem.jobDescription} className='similarJob'>
              <div className='similarjobTitle'>
                <div className='companyDetails'>
                  <img
                    alt='similar job company logo'
                    className='companyLogo'
                    src={eachItem.companyLogoUrl}
                  />
                  <h3 className='companyNameHeading'>{eachItem.title}</h3>
                  <p className='jobtypePara'>{eachItem.rating}</p>
                  <BsFillStarFill />
                </div>
              </div>
              <h3>Description</h3>
              <p>{eachItem.jobDescription}</p>
              <div className='jobType'>
                <FaMapMarkerAlt />
                <p className='jobtypePara'>{eachItem.location}</p>
                <BsBriefcaseFill />
                <p className='jobtypePara'>{eachItem.employmentType}</p>
              </div>
            </div>
          ))}
        </ul>
      )
    }
    return null
  }

  render() {
    const {jobDetails, similarJobs, fetchStatus} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      title,
      skills,
    } = jobDetails

    switch (fetchStatus) {
      case 'fetched':
        return (
          <div className='jobItemDetailsComponent'>
            <Header />
            <div className='jobItemDetails'>
              <div className='jobItem'>
                <div className='companyDetails'>
                  <img
                    alt='job details company logo'
                    className='companyLogo'
                    src={companyLogoUrl}
                  />
                  <h1 className='companyNameHeading'>{title}</h1>
                  <p className='jobtypePara'>{rating}</p>
                  <BsFillStarFill />
                </div>
                <div className='jobDetails'>
                  <div className='jobType'>
                    <FaMapMarkerAlt />
                    <p className='jobtypePara'>{location}</p>
                    <BsBriefcaseFill />
                    <p className='jobtypePara'>{employmentType}</p>
                  </div>
                  <p className='jobtypePara'>{packagePerAnnum}</p>
                </div>
                <hr className='hRule' />
                <div className='websiteUrl'>
                  <h1>Description</h1>
                  <div>
                    <a className='webLink' href={companyWebsiteUrl}>
                      <p>Visit</p>
                      <FaExternalLinkAlt />
                    </a>
                  </div>
                </div>
                <p className='jobDescriptionPara'>{jobDescription}</p>
                <h3>Skills</h3>
                <div className='skillsDiv'>{this.renderSkillsDiv()}</div>
                <h3>Life at Company</h3>
                <div>
                  {lifeAtCompany !== undefined ? (
                    <div className='lifeAtCompany'>
                      <p>{lifeAtCompany.description}</p>{' '}
                      <img
                        alt='life at company'
                        src={lifeAtCompany.image_url}
                      />
                    </div>
                  ) : null}
                </div>
                <div>
                  <h1>Similar Jobs</h1>
                  {this.renderSimilarJobs()}
                </div>
              </div>
            </div>
          </div>
        )
      case 'fetching':
        return (
          <div className='seeLoader'>
            <Header />
            <div className='loader-container' data-testid='loader'>
              <Loader type='ThreeDots' color='#ffffff' height='50' width='50' />
            </div>
          </div>
        )

      case 'failed':
        return (
          <div className='fetchFailedDiv'>
            <Header />
            <div>
              <img
                src='https://assets.ccbp.in/frontend/react-js/failure-img.png'
                alt='failure view'
              />
            </div>
            <h1>Oops! Something Went Wrong</h1>
            <p>We cannot seem to find the page you are looking for</p>
            <button type='button' onClick={this.componentDidMount}>
              Retry
            </button>
          </div>
        )

      default:
        return null
    }
  }
}

export default JobItemDetails
