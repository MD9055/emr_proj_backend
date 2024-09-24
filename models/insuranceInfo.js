// user.js

import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const insuranceSchema = new mongoose.Schema({
  
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'user'
    },
    medicare:{
        type:Number,
        default:null
    },
    medicaid_number:{
           type:Number,
        default:null

    },
    insurance_number:{
           type:Number,
        default:null
    },

    insurance_policy_number:{
           type:Number,
        default:null
    },

    insurance_authorization_number:{
           type:Number,
        default:null
    }




  
},{
    timestamps:true, versionKey:false
});

insuranceSchema.plugin(aggregatePaginate);

// Create a model using the schema  
const Insurance = mongoose.model('insurance', insuranceSchema);

export default Insurance;
