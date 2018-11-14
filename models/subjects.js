var mongoose = require('mongoose');

const SubjectSchema = mongoose.Schema({
  subjectName : String,
  subjectCode : String,
  sem : Number,
  faculty : String,
  numOfChapters : Number
});

module.exports = mongoose.model('Subjects', SubjectSchema);
