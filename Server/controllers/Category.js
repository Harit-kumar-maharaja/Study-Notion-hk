const Category = require("../models/Category");

//create category ka handler function

exports.createCategory = async (req , res) => {
    try {

        //fetch data
        const {name , description} = req.body;
        //validation
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }
        //create entry in db
        const categoryDetails =  await Category.create({
            name:name,
            description:description,
        });
        console.log(categoryDetails);

        //return response
        return res.status(200).json({
            success:true,
            message:'Category created succesfully',
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//getallCategory

exports.showAllCategory = async (req , res) => {
    try {

        const allCategory = await Category.find({} , {name:true , description:true});
        return res.status(200).json({
            success:true,
            message:'All Category returned',
            allCategory,
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//category page details
exports.categoryPageDetails = async (req , res) => {
    try {

        //get category id
        const {categoryId} = req.body;

        // get course for specified categoryid
        const selectedCategory = await Category.findById(categoryId)
                                               .populate("courses")
                                               .exec();

        //validation
        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:'Dta not found',
            });
        }

        // get course for different categories
        const differentCategories = await Category.find({
                                                  _id:{$ne:categoryId},
        }).populate("courses").exec();

        //get top selling courses --------> hw

        // return response
        return res.status(200).json({
            success:true,
            data:{
                selectedCategory , differentCategories,
            },
        });
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:message.error,
        });
    }
}