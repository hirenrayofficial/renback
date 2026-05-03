import mongoose from "mongoose";

const blogSchema = mongoose.Schema({
    uuid:{
        type: String,
        require:true,
    },
    blog_name: {
        type:String,
        require:true,
    },
    blog_slug:{
        type:String,
    },
    blog_content:{
        type: Array,
    },
    blog_type:{
        type:String,

    },
    blog_author:{
        type:String,
    },
},{
    timestamps:true,
})
const blog =  mongoose.model('blog',blogSchema)
export default blog