import React, { useState } from 'react'
import {HomePageExplore} from "../../../data/homepage-explore"
import HightlightText from './HightlightText'

const tabsName=  [
    "Free",
    "New to Coding",
    "Most Popular",
    "Skills Paths",
    "Carrer",
]

const ExploreMore = () => {

    const [currentTab , setCurrentTab] = useState(tabsName[0]);
    const [courses , setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard , setCurrentCard] = useState(HomePageExplore[0].courses[0].heading)

    const setMyCards = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((courses) => courses.tag === value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }

  return (
    <div>
      <div className='text-4xl font-semibold text-center'>
        Unlock the 
        <HightlightText text={"Power of Code"} />
      </div>

      <p className='text text-richblack-300 text-ssm font-semibold mt-3 text-center'>
        Learn to build anything you can imagine
      </p>

      <div>
        {
            tabsName.map( (element , index) => {
                return(
                    <div className={`text-[16px] flex flex-row items-center gap-2 ${currentTab===element ? "bg-richblack-900 text-richblack-5 font-medium " : "text-richblack-200"} rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-7 py-7`}
                    key={index}>
                        {element}
                    </div>
                )
            })
        }
      </div>

    </div>
  )
}

export default ExploreMore
