'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Question = mongoose.model('Question');

/**
 * Globals
 */
var user, question;

/**
 * Unit tests
 */
describe('Question Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			question = new Question({
				sentence: 'Question Sentence',
				answers: [{
					answer: 'true',
					isRight: true
				},{
					answer: 'false',
					isRight: false
				}],
				type: 'boolean',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return question.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without sentence', function(done) { 
			question.sentence = '';

			return question.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when trying to save without answer', function(done) {
			question.answers = [];

			return question.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when no answer\'s right', function(done){
			question.answers[0].isRight = false;

			return question.save(function(err){
				should.exist(err);
				done();
			});
		});

		it('should be able to show an error when an answer is empty', function(done){
			question.answers[1].answer = ' ';

			return question.save(function(err){
				should.exist(err);
				done();
			});
		});
	});

	describe('Method update', function(){
		it('should be able to update without problem');
		it('should be able to show an error when trying to update without a sentence');
		it('should be able to show an error when trying to update without answer');
	});

	afterEach(function(done) { 
		Question.remove().exec();
		User.remove().exec();

		done();
	});
});