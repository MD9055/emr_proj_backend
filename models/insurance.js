// user.js

import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const insuranceSchema = new mongoose.Schema({

    insurance_name:{
        type:String
    },
    insuranceId:{
        type:String
    },
    medicare_number:{
        type:String
    },
    medicaid_number:{
        type:String

    },
    insurance_policy_number:{
        type:String
    },
    social_security_number:{
        type:String 

    },
    private_insurance:{
        type:String 
    }

     


  
},{
    timestamps:true, versionKey:false
});

insuranceSchema.plugin(aggregatePaginate);

// Create a model using the schema  
const State = mongoose.model('insurance', insuranceSchema);

export default State;
