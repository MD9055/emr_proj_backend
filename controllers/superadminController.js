const USER = require('../models/user');
const { sendEmail } = require('../utils/mailer');
const { generateJWTToken } = require('../utils/commonMethods');
process.env.NODE_ENV = process.env.NODE_ENV || "local"; //local
const config = require("../config.js").get(process.env.NODE_ENV);

async function adminList(req, res) {
  try {
    const currentUser = await req.user;
    const options = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    };
    const searchQuery = req.query.search ? req.query.search.trim() : '';
    const matchCondition = {
      role: 1,
      created_by: currentUser.userId,
      isDeleted: false,
    };

    if (searchQuery) {
      matchCondition.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    const myAggregate = USER.aggregate([
      { $match: matchCondition },
      { $sort: { createdAt: -1 } }
    ]);

    const results = await USER.aggregatePaginate(myAggregate, options);
    sendResponse(res, 200, "Admin Fetched", results);
    
  
  } catch (err) {
    console.error('Error fetching admin list:', err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
}


async function addUpdateAdmin(req, res){
  const { id, firstName, lastName, email, mobile, dob, addressStreet1, addressStreet2, zipCode, country, state, city, companyName, companyAddressStreet1, companyAddressStreet2, companyZipCode, companyMobile, companyFax } = req.body;

  try {
      const userData = {
          firstName,
          lastName,
          email,
          phone: mobile,
          dob: new Date(dob),
          address_street1: addressStreet1,
          address_street2: addressStreet2,
          zip_code: zipCode,
          country,
          state,
          city,
          company_country: country,
          company_state: state,
          company_city: city,
          companyName,
          companyAddressStreet1,
          companyAddressStreet2,
          companyZipCode,
          companyMobile,
          companyFax,
          role: 1,
          created_by:req.user.userId
      };

      let response;
      if (id) {
          response = await USER.findByIdAndUpdate(id, userData, { new: true });
          if (!response) {
              return res.status(404).json({
                  statusCode: 404,
                  message: 'Admin not found.'
              });
          }
          return res.status(200).json({
              statusCode: 200,
              message: 'Admin updated successfully.',
              data: response
          });
      } else {
          response = new USER(userData);
          await response.save();
          let payload = {
            _id:response._id,
            role:response.role
          }
          let generateToken = await generateJWTToken(payload, "2h")

          let setUpProfileLine = `${config.FRONTEND.HOST}:${config.FRONTEND.PORT}/setup-profile?token=${generateToken}`;

          const emailTemplate = `
          <p>Dear ${firstName},</p>
          <p>You have been added as an admin.</p>
          <p>Please click the button below to set up your profile:</p>
          <a href="${setUpProfileLine}" style="display: inline-block; 
             padding: 10px 20px; 
             font-size: 16px; 
             color: #ffffff; 
             background-color: #007bff; 
             text-decoration: none; 
             border-radius: 5px;">Set Up Profile</a>
          <p>Best regards,</p>
          <p>Your Team</p>
          `;
          

            await sendEmail(response.email, emailTemplate);

          return res.status(201).json({
              statusCode: 201,
              message: 'Admin added successfully.',
              data: response
          });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          statusCode: 500,
          message: 'An error occurred while processing your request.',
          error: error.message
      });
  }
}

function sendResponse(res, statusCode, message, data, error = null) {
  return res.status(statusCode).json({
      statusCode: statusCode,
      message: message,
      data: data,
      error: error
  });
}


module.exports = {
  adminList,
  addUpdateAdmin
};
