const NOTES = require("../models/notesModal");
const HistoryNote = require("../models/historyNote");
const recentcptCode = require("../models/recentCptcode");
const { sendResponse } = require("../common/factoryFunctions");
const constant = require("../assets/constant");
const mongoose = require('mongoose');
const pdf = require('html-pdf');
const fs = require("fs");
const path = require("path");


 const createNote = async (req, res) => {
    try {
      let { user_id, data_id, name, description } = req.body;
  
      let notesModal = await new NOTES({
        userId: user_id,
        data_id: data_id,
        name: name,
        description: description,
      });
      let savePatient = await notesModal.save();
      console.log(`notestModal`, savePatient);
      if (savePatient && savePatient._id)
        return sendResponse(
          res,
          constant.SUCCESS_CODE,
          constant.SUCCESS_STATUS,
          constant.ADD_SUCCESS,
          "Notes created successfully.",
          savePatient
        );
      else
        return sendResponse(
          res,
          constant.SUCCESS_CODE,
          constant.FAILED_STATUS,
          constant.ADD_FAILED
        );
    } catch (err) {
      console.log(err);
      return sendResponse(
        res,
        constant.ERROR_CODE,
        constant.FAILED_STATUS,
        constant.ADD_FAILED
      );
    }
  };
  
   const notetList = async (req, res) => {
    try {
      const { data_id, user_id } = req.query;
      console.log(`req,query`, req.query);
      const patients = await NOTES.find({ data_id: data_id, userId: user_id });
  
      res.status(200).json({
        status: "success",
        message: "Fetched",
        data: patients,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  };
  
   const editNote = async (req, res) => {
    try {
      let data = {};
      if (req.body.name !== "" && req.body.name) data.name = req.body.name;
      if (req.body.description !== "" && req.body.description)
        data.description = req.body.description;
  
      // Example of findOneAndUpdate
      NOTES.findByIdAndUpdate(
        req.query.id,
        { $set: data },
        { new: true } 
      )
        .then((updatedDocument) => {
          if (updatedDocument) { 
            return sendResponse(
              res,
              constant.SUCCESS_CODE,
              constant.SUCCESS_STATUS,
              constant.ADD_SUCCESS,
              "Notes updated successfully.",
              updatedDocument
            );
          } else {
            return sendResponse(
              res,
              constant.SUCCESS_CODE,
              constant.FAILED_STATUS,
              constant.ADD_FAILED
            );
          }
        })
        .catch((err) => {
          console.error(`Error updating document: ${err}`);
          return sendResponse(
            res,
            constant.ERROR_CODE,
            constant.FAILED_STATUS,
            constant.ADD_FAILED
          );
        });
    } catch (err) {
      console.error(`Error in editNote function: ${err}`);
      return sendResponse(
        res,
        constant.ERROR_CODE,
        constant.FAILED_STATUS,
        constant.ADD_FAILED
      );
    }
  };
  
   const createHistoryNote = async (req, res) => {
    try {
      let { user_id, doctor_id, chief_complaint, history_illness,ros,social_history,allergies,medication,physical_exam,physical_details,
        diagnosis,plan,cptCode
       } = req.body;
  
      let notesModal = await new HistoryNote({
        userId: user_id,
        doctor_id: doctor_id,
        chief_complaint: chief_complaint,
        history_illness: history_illness,
        ros:ros,
        social_history:social_history,
        allergies:allergies,
        medication:medication,
        physical_exam:physical_exam,
        physical_details:physical_details,
        diagnosis:diagnosis,
        plan:plan,
        cptCode:cptCode
      });
      let savePatient = await notesModal.save();
      if (savePatient && savePatient._id){
        if (Array.isArray(cptCode)) {
          for (let code of cptCode) {
            let cptEntry = new recentcptCode({
              code_id: code,
              doctor_id: doctor_id // Assuming description needs to be added, adjust as needed
            });
            await cptEntry.save();
          }
          let cptCount = await recentcptCode.countDocuments({ doctor_id: doctor_id });
          if (cptCount > 10) {
            let excessCount = cptCount - 10;
            // await recentcptCode.deleteMany({ doctor_id: doctor_id })
            //   .sort({ createdAt: 1 })
            //   .limit(excessCount);
            let excessDocuments = await recentcptCode.find({ doctor_id: doctor_id })
            .sort({ createdAt: 1 })
            .limit(excessCount)
            .select('_id');  // Select only the _id field
        
          // Extract the _id values
          let excessIds = excessDocuments.map(doc => doc._id);
        
          // Delete the excess documents
          await recentcptCode.deleteMany({ _id: { $in: excessIds } });
          }
        }
        return sendResponse(
          res,
          constant.SUCCESS_CODE,
          constant.SUCCESS_STATUS,
          constant.ADD_SUCCESS,
          "Notes saved successfully.",
          savePatient
        );
      }      
      else
        return sendResponse(
          res,
          constant.SUCCESS_CODE,
          constant.FAILED_STATUS,
          constant.ADD_FAILED
        );
    } catch (err) {
      console.log(err);
      return sendResponse(
        res,
        constant.ERROR_CODE,
        constant.FAILED_STATUS,
        constant.ADD_FAILED
      );
    }
  };
  
   const HistoryNoteList = async (req, res) => {
    try {
      const { doctor_id, user_id } = req.query;
      const patients = await HistoryNote.find({ userId: user_id })
      .populate('userId', 'firstName lastName')   // populate user details
      .populate('doctor_id', 'firstName lastName'); // populate doctor details;
  
      res.status(200).json({
        status: "success",
        message: "Fetched",
        data: patients,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  };
  
   const HistoryNoteID = async (req, res) => {
    try {
      const historyNoteId = new mongoose.Types.ObjectId(req.params.id);
  
      const historyNote = await HistoryNote.aggregate([
        { $match: { _id: historyNoteId } },
        {
          $lookup: {
            from: 'cptcodes', // The collection name in your database
            localField: 'cptCode',
            foreignField: '_id',
            as: 'cptCodeDetails'
          }
        }
      ]);
  
      if (!historyNote.length) {
        return res.status(404).json({
          status: "fail",
          message: "HistoryNote not found",
        });
      }
  
      res.status(200).json({
        status: "success",
        message: "Fetched",
        data: historyNote[0],
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  };
  
  function formatTimestamp(timestamp) {
    // Create a new Date object from the timestamp
    const date = new Date(timestamp);
  
    // Define options for formatting the date and time
    const options = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
  
    // Format the date using toLocaleString
    return date.toLocaleString('en-US', options);
  }
  
  function formatDate(timestamp) {
    // Create a new Date object from the timestamp
    const date = new Date(timestamp);
  
    // Get the day, month, and year from the date object
    const month = date.getUTCMonth() + 1; // getUTCMonth() returns month from 0-11, so add 1
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
  
    // Return the formatted date string in MM/DD/YYYY format
    return `${month}/${day}/${year}`;
  }
  
   const downloadNotePdf = async (req, res) => {
    try {
      const historyNoteId = req.query.id; // Assuming the ID is passed as a URL parameter
      const historyNote = await HistoryNote.findById(historyNoteId).populate("userId","firstName lastName dob").exec();
      if (!historyNote) {
        return res.status(404).send('History note not found');
      }
      let name = historyNote.userId.firstName+" "+historyNote.userId.lastName;
      let dob = formatDate(historyNote.userId.dob);
      let current_date = formatTimestamp(historyNote.createdAt)
      let chief_complaint = historyNote.chief_complaint
      let HPI = historyNote.history_illness
      let ROS = historyNote.ros
      let PMH = historyNote.diagnosis.map(d => d.desc).join('</br>')
      let social_history = historyNote.social_history
      let family_history = historyNote.social_history
      let Allergies = historyNote.allergies
      let medication = ""
      let physical_exam = historyNote.physical_details
      let a_p = historyNote.plan
  
      // // Path to the HTML template
      const htmlTemplatePath = path.join(__dirname, '../views/notepdf.html');
      
      // Read the HTML template and replace placeholders
      const htmlTemplate = fs.readFileSync(htmlTemplatePath, 'utf8');
      const html = htmlTemplate
          .replace('{{name}}', name)
          .replace('{{dob}}', dob)
          .replace('{{name1}}', name)
          .replace('{{dob1}}', dob)
          .replace('{{current_date}}', current_date)
          .replace('{{chief_complaint}}',chief_complaint)
          .replace('{{HPI}}', HPI)
          .replace('{{ROS}}', ROS)
          .replace('{{PMH}}', PMH)
          .replace('{{social_history}}',social_history)
          .replace('{{family_history}}', family_history)
          .replace('{{Allergies}}', Allergies)
          .replace('{{medication}}', medication)
          .replace('{{bp}}', 'Test Data')
          .replace('{{pulse}}', 'Test Data')
          .replace('{{RR}}', 'Test Data')
          .replace('{{physical_exam}}', physical_exam)
          .replace('{{a_p}}', a_p)
          
      // Create PDF from the HTML content
      pdf.create(html, { format: 'A4' }).toBuffer((err, buffer) => {
        if (err) {
          console.error('Error generating PDF:', err);
          return res.status(500).send('Error generating PDF');
        }
  
        // Send the PDF as a response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
        res.send(buffer);
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Error generating PDF');
    }
  }
  
   const deleteNote = async (req, res) => {
    try {
      const { id } = req.query; // Assuming you're passing the note id as a URL param
      console.log(`req.params`, req.params);
      
      // Find and delete the note by _id
      const deletedNote = await NOTES.findByIdAndDelete(id);
  
      if (!deletedNote) {
        return res.status(404).json({
          status: "error",
          message: "Note not found",
        });
      }
  
      res.status(200).json({
        status: "success",
        message: "Note deleted successfully",
        data: deletedNote,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  };


  module.exports={
    createNote,
    notetList,
    editNote,
    createHistoryNote,
    deleteNote,
    HistoryNoteList,
    HistoryNoteID,
    downloadNotePdf,
  }