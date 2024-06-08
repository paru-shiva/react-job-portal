import {FaMapMarkerAlt} from 'react-icons/fa'
import {BsBriefcaseFill} from 'react-icons/bs'
import {BsFillStarFill} from 'react-icons/bs'
import {Link} from 'react-router-dom'

import './index.css'

const JobItem = props => {
  const {data} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    id,
    title,
  } = data

  return (
    <li className="jobItem">
      <Link to={`/jobs/${id}`}>
        <div className="companyDetails">
          <img
            className="companyLogo"
            src={companyLogoUrl}
            alt="company logo"
          />
          <h1 className="companyNameHeading">{title}</h1>
          <p className="jobtypePara">{rating}</p>
          <BsFillStarFill />
        </div>
        <div className="jobDetails">
          <div className="jobType">
            <FaMapMarkerAlt />
            <p className="jobtypePara">{location}</p>
            <BsBriefcaseFill />
            <p className="jobtypePara">{employmentType}</p>
          </div>
          <p className="jobtypePara">{packagePerAnnum}</p>
        </div>
        <hr className="hRule" />
        <h1 className="desc">Description</h1>
        <p className="jobDescriptionPara">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobItem
