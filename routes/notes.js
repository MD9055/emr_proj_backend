var express = require('express');
var router = express.Router();

const {HistoryNoteID,HistoryNoteList,createHistoryNote,createNote,deleteNote,downloadNotePdf,editNote,notetList} = require('../controllers/notesController')

noteRoute.post("/add",createNote)
noteRoute.get("/",notetList)
noteRoute.put("/",editNote)
noteRoute.post("/history",createHistoryNote)
noteRoute.get("/history",HistoryNoteList),
noteRoute.get("/history/:id",HistoryNoteID)
noteRoute.get("/downloadpdf",downloadNotePdf)
noteRoute.delete("/note",deleteNote)


module.exports = router;
