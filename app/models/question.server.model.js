'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('lodash');

var AnswersSchema = new Schema({
		answer: {
			type: String,
			required: 'Please fill-in an answer.',
			trim: true
		},
		isRight: {
			type: Boolean,
			default: false
		}
	}, {id: false});

var QuestionTypes = 'multiple-choice boolean single-blank enumeration'.split(' ');

/**
 * Question Schema
 */
var QuestionSchema = new Schema({
	categories: [{
		type: Schema.ObjectId,
		ref: 'Category'
	}],
	sentence: {	
		type: String,
		required: 'Please fill Question\'s sentence.',
		trim: true
	},
	answers: [AnswersSchema],
	type: {
		type: String,
		enum: QuestionTypes,
		default: 'single-blank'
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

/***************************
	STATIC
***************************/
QuestionSchema.statics.QUESTION_TYPES = QuestionTypes;

/***************************
	VALIDATORS
***************************/
var arrayEmptyValidator = function(answers) {
	if(!answers) return false;
	if(answers.length == 0) return false;
	return true;
};

var hasCorrectAnswerValidator = function(answers){
	if(!answers) return false;

	var hasNoRight = false;

	_.each(answers, function(answer){
		if(answer.isRight) hasNoRight = true;
	});

	return hasNoRight;
};

QuestionSchema.path('answers').validate(arrayEmptyValidator, 'Please add atleast one answer');
QuestionSchema.path('answers').validate(hasCorrectAnswerValidator, 'Please add atleast one right answer');

//mongoose.model('Answer', AnswersSchema); 
mongoose.model('Question', QuestionSchema); 