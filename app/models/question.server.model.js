'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var QuestionTypes = 'multiple-choice boolean single-blank enumeration'.split(' ');

/**
 * Question Schema
 */
var QuestionSchema = new Schema({
	sentence: {
		type: String,
		required: 'Please fill Question\'s sentence.',
		trim: true
	},
	answers: [{
		answer: {
			type: String,
			required: 'Please fill the Question\'s answer',
			trim: true
		},
		isRight: {
			type: Boolean,
			default: false
		}
	}],
	type: {
		type: String,
		enum: QuestionTypes
	},
	created: {
		type: Date,
		default: Date.now
	},
	creator: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Question', QuestionSchema); 