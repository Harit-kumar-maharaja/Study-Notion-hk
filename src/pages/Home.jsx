import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import HightlightText from '../components/core/HomePage/HightlightText'
import CTAButton from '../components/core/HomePage/Button'
import CodeBlocks from '../components/core/HomePage/CodeBlocks'
import Banner from '../assets/Images/banner.mp4'
import Footer from "../components/common/Footer"
import TimelineSection from "../components/core/HomePage/TimelineSection"
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection"
import InstructorSection from '../components/core/HomePage/InstructorSection'
import ExploreMore from "../components/core/HomePage/ExploreMore"

function Home() {
  return (
    <div>
      {/* Section 1 */}
      <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between'>
        <Link to={"/signup"}>

          <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-50 transition-all duration-200 hover:scale-95 w-fit'>

            <div className='group-hover:bg-richblack-900 flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200'>
              <p>Became an Instructor</p>
              <FaArrowRight />
            </div>

          </div>

        </Link>

        <div className='text-center text-4xl font-semibold mt-7'>
          Empower Your Future With
          <HightlightText text={"Coding Skills"} />
        </div>

        <div className='w-[90%] text-center text-lg font-bold text-richblack-300 mt-4'>
          With our online coding courses, you can learn at your own pace, from anywhere in the world , and get access to a wealth of resources , including hands on projects, quizzes, and personalized feedback for instructors.
        </div>

        <div className='flex flex-row gap-7 mt-8'>
          {/* //HW :- Add shadow and other properties to the text */}
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>
          <CTAButton active={false} linkto={"/login"}>
            Book A Demo
          </CTAButton>
        </div>

        <div className='shadow-blue-200 mx-3 my-12'>
          <video muted loop autoPlay>
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/* Code Section 1 */}
        <div>

          <CodeBlocks
            position={"lg:flex-row"}
            heading={
              <div className='text-4xl font-semibold'>
                Unlock Your
                <HightlightText text={"Coding Potential "} />
                  with our online courses.
              </div>
            }
            subheading={"Our Courses are designed and taught by industry experts who have years of experience in coding industry and are passionate about sharing their knowledge with you."}
            ctabtn1={
              {
                btnText: "Try it yourself",
                linkto: "/signup",
                active: true,
              }
            }
            ctabtn2={
              {
                btnText: "Learn More",
                linkto: "/login",
                active: false,
              }
            }
            codeblocks={`<!DOCTYPE html>
                         <html>
                         <head>
                              <title>Example HTML</title>
                         </head>
                         <body>
                              <h1>Hello, World!</h1>
                              <p>This is a paragraph.</p>
                         </body>
                         </html>
                         `}
            codeColor={"text-yellow-25"}
          />
          

        </div>

        {/* Code Section 2 */}
        <div>

          <CodeBlocks
            position={"lg:flex-row-reverse"}
            heading={
              <div className='text-4xl font-semibold'>
                Unlock Your
                <HightlightText text={"Coding Potential "} />
                with our online courses.
              </div>
            }
            subheading={"Our Courses are designed and taught by industry experts who have years of experience in coding industry and are passionate about sharing their knowledge with you."}
            ctabtn1={
              {
                btnText: "Try it yourself",
                linkto: "/signup",
                active: true,
              }
            }
            ctabtn2={
              {
                btnText: "Learn More",
                linkto: "/login",
                active: false,
              }
            }
            codeblocks={`<!DOCTYPE html>
                         <html>
                         <head>
                              <title>Example HTML</title>
                         </head>
                         <body>
                              <h1>Hello, World!</h1>
                              <p>This is a paragraph.</p>
                         </body>
                         </html>
                         `}
            codeColor={"text-yellow-25"}
          />
          

        </div>

        <ExploreMore/>

        </div>

        {/* Section 2 */}
        <div className='bg-pure-greys-5 text-richblack-700'>
          <div className='homepage_bg h-[340px]'> 

            <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto'>
              <div className='h-[100px]'></div>
              <div className='flex flex-row gap-7 text-white '>

                <CTAButton active={true} linkto={"/signup"}>
                <div className='flex flex-row gap-3 '>
                  Explore all catalog
                  <FaArrowRight/>
                </div>
                </CTAButton>
                <CTAButton active={false}>
                  <div>Learn More </div>
                </CTAButton>

              </div>
              
            </div>
          </div>

          <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7'>

              <div className='flex flex-row gap-12 mb-10 mt-[100px]'>

                <div className='text-4xl font-semibold w-[45%]'>
                  Get the skills you need for a 
                  <HightlightText text={"Job which are in demand "} />
                </div>

                <div className='flex flex-col gap-10 w-[40%] items-start'>
                <div className='text-[16px]'> 
                  The mordern Studynotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                </div>
                <CTAButton active={true} linkto={"/signup"}>
                  <div className=''>
                    Learn More
                  </div>
                </CTAButton>
              </div>
              </div>
              <TimelineSection/>

              <LearningLanguageSection/>
              </div>

              

        </div>

        {/* Section 3 */}
        <div className='w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white'>

              <InstructorSection/>

              <h2 className='text-center text-4xl font-semibold mt-10 '>
                Reviews From Other Learners
              </h2>
              
              {/* Review slider here */}
              {/* <ReviewSlider /> */}

        </div>


        {/* Footer */}
        <Footer />

    </div>
  )
}

export default Home
