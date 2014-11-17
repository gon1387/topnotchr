'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

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
		isActive: {
			type: Boolean,
			default: false
		}
	}],
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