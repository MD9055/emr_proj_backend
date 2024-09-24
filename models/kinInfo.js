// user.js

import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const kinSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Types.ObjectId,
        ref:'user'
    },

  firstName: {
    type: String,
    
  
  },
  lastName: {
    type: String,
    
    
  },

  kin_address_street1:{
    type: String,
    
  },

  kin_address_street2:{
    type: String,
    
  },
  city :{
    type: mongoose.Types.ObjectId,
    ref: "city"
    
  },
  state:{
    type: mongoose.Types.ObjectId,
    ref: "state"

  },

  country:{
    type: mongoose.Types.ObjectId,
    ref: "country"
    
  },
  zip_code:{
    type: Number,
    
  },
  cell_number:{
    type:Number
  },
  landline_number:{
    type:Number

  }
  

  
},{
    timestamps:true, versionKey:false
});

kinSchema.plugin(aggregatePaginate);

// Create a model using the schema  
const Kin = mongoose.model('kin', kinSchema);

export default Kin;
