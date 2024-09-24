// user.js

const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,

    },
    lastName: {
        type: String,

    },
    email: {
        type: String,
    },
    password: {
        type: String,

    },
    address_street1: {
        type: String,
    },

    address_street2: {
        type: String,
    },
    city: {
        type: mongoose.Types.ObjectId,
        ref: "city"
    },
    state: {
        type: mongoose.Types.ObjectId,
        ref: "state"
    },
    country: {
        type: mongoose.Types.ObjectId,
        ref: "country"
    },
    zip_code: {
        type: Number,
    },

    phone: {
        type: Number,

    },

    adminId:{
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    physicianId:{
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    role: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5, 6],
        /* 
          0: Super Admin
          1: Admin (Nursing Home)
          2: Physician
          3: Physician Assistant
          4: Nurse Practitioner
          5: Patient
          6: Biller
        */
    },
    loginOTP: {
        type: Number,
    },
    token: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        default: false

    },
    status: {
        type: Number,
        enum: [0, 1],
        /* 
          0: InActive
          1: Active
          
        */
        default: 0
    },
    image: {
        type: String
    },

    medical_licence_number: {
        type: Number,

    },
    medical_licence_date: {
        type: Date
    },

    dea_numnber: {
        type: Number,
    },
    dea_expiry_date: {
        type: Date
    },
    cds_numnber: {
        type: Number,
    },
    cds_expiry_date: {
        type: Date
    },

    npi_number: {
        type: Number
    },
    patientId: {
        type: Number
    },
    doctorId: {
        type: Number
    },
    dob: {
        type: Date
    },

    addmission_location: {
        type: String
    },

    
    company_city: {
        type: mongoose.Types.ObjectId,
        ref: "city"
    },
    company_state: {
        type: mongoose.Types.ObjectId,
        ref: "state"
    },
    company_country: {
        type: mongoose.Types.ObjectId,
        ref: "country"
    },
   admission_location:{
    type:String
   },
   insurance_details:{
    type:mongoose.Types.ObjectId,
    ref:"insurance"
   },
   
   kin_information:{
    type:mongoose.Types.ObjectId,
    ref:'kin'
   },
   created_by:{
    type:mongoose.Types.ObjectId,
    ref:'user'
   }



}, {
    timestamps: true,
    versionKey: false
});

userSchema.plugin(aggregatePaginate);
const User = mongoose.model('user', userSchema);
module.exports = User


