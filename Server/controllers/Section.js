const Section = require("../models/Section")
const Course = require("../models/Course")

exports.createSection = async (req , res) => {
    try {

        //data fetch
        const {sectionName , courseId} =req.body;
        
        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:'Missing properties',
            });
        }

        ///create section
        const newSection = await Section.create({sectionName});

        //update course with section Objectid
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                                             courseId,
                                                             {
                                                                $push:{
                                                                    courseContent:newSection._id,
                                                                }
                                                             },
                                                             {new:true},
        )

        //return response
        return res.status(200).json({
            successs:true,
            message:'Section created successsfully',
            updatedCourseDetails,
        })
        
    } catch (error) {
        return res.status(500).json({
            successs:false,
            message:'Unable to create Section , please try again',
            error:error.message,
        })
    }
}


exports.updateSection = async (req , res) => {
    try {

        //data input
        const {sectionName , sectionId} = req.body;

        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:'Missing properties',
            });
        }

        //update data
        const section = await Section.findByIdAndUpdate(sectionId , {sectionName} , {new:true});

        //return res
        return res.status(200).json({
            success:true,
            message:'Section Updated Successfully',
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Unable to update section , please try again',
            error:error.message,
        })
    }
}


exports.deleteSection = async (req , res) => {
    try {

        //get id
        const {sectionId} = req.params;

        //use findbyidanddelete
        await Section.findByIdAndDelete(sectionId);

        // return res
        return res.status(200).json({
            success:true,
            message:'Section deleted successfully',
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Unable to delete section , please try again',
            error:error.message,
        })
    }
}