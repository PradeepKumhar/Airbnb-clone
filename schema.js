const Joi = require("joi");

module.exports.listingSchema = Joi.object(
    {
        listing:Joi.object({
            title:Joi.string().required(),
            description:Joi.string().required(),
            location:Joi.string().required(),
            country: Joi.string().required(),
            price:Joi.number().positive().integer().required(),
            image:{
                filename: Joi.string().allow("",null),
                url:Joi.string().default("https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D").allow("",null),
            },
        }).required(),
    });

module.exports.reviewSchema=Joi.object({
    review: Joi.object({
     rating: Joi.number().required().min(1).max(5),
     comment: Joi.string().required(),
    }).required(),
    
});