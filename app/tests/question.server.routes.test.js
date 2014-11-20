'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Category = mongoose.model('Category'),
	Question = mongoose.model('Question'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, category, question;

/**
 * Question routes tests
 */
describe('Question CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Question
		user.save(function() {
			category = new Category({
				name: 'Category one'
			});

			category.save(function(){
				question = {
					categories:[category._id],
					sentence: 'Question Sentence',
					answers: [{
						answer: 'true',
						isRight: true
					},{
						answer: 'false',
						isRight: false
					}],
					type: 'boolean',
					user: user._id
				};

				done();
			});
		});
	});

	it('should be able to save Question instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Question
				agent.post('/questions')
					.send(question)
					.expect(200)
					.end(function(questionSaveErr, questionSaveRes) {
						// Handle Question save error
						if (questionSaveErr) done(questionSaveErr);

						// Get a list of Questions
						agent.get('/questions')
							.end(function(questionsGetErr, questionsGetRes) {
								// Handle Question save error
								if (questionsGetErr) done(questionsGetErr);

								// Get Questions list
								var questions = questionsGetRes.body;

								// Set assertions
								(questions[0].user._id).should.equal(userId);
								(questions[0].sentence).should.match('Question Sentence');
								(questions[0].answers[0].answer).should.match('true');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Question instance if not logged in', function(done) {
		agent.post('/questions')
			.send(question)
			.expect(401)
			.end(function(questionSaveErr, questionSaveRes) {
				// Call the assertion callback
				done(questionSaveErr);
			});
	});

	it('should not be able to save Question instance if no sentence is provided', function(done) {
		// Invalidate sentence field
		question.sentence = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Question
				agent.post('/questions')
					.send(question)
					.expect(400)
					.end(function(questionSaveErr, questionSaveRes) {
						// Set message assertion
						(questionSaveRes.body.message).should.match('Please fill Question\'s sentence.');
						
						// Handle Question save error
						done(questionSaveErr);
					});
			});
	});

	it('should be able to update Question instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Question
				agent.post('/questions')
					.send(question)
					.expect(200)
					.end(function(questionSaveErr, questionSaveRes) {
						// Handle Question save error
						if (questionSaveErr) done(questionSaveErr);

						// Update Question sentence
						question.sentence = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Question
						agent.put('/questions/' + questionSaveRes.body._id)
							.send(question)
							.expect(200)
							.end(function(questionUpdateErr, questionUpdateRes) {
								// Handle Question update error
								if (questionUpdateErr) done(questionUpdateErr);

								// Set assertions
								(questionUpdateRes.body._id).should.equal(questionSaveRes.body._id);
								(questionUpdateRes.body.sentence).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Questions if not signed in', function(done) {
		// Create new Question model instance
		var questionObj = new Question(question);

		// Save the Question
		questionObj.save(function() {
			// Request Questions
			request(app).get('/questions')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Question if not signed in', function(done) {
		// Create new Question model instance
		var questionObj = new Question(question);

		// Save the Question
		questionObj.save(function() {
			request(app).get('/questions/' + questionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('sentence', question.sentence);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Question instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Question
				agent.post('/questions')
					.send(question)
					.expect(200)
					.end(function(questionSaveErr, questionSaveRes) {
						// Handle Question save error
						if (questionSaveErr) done(questionSaveErr);

						// Delete existing Question
						agent.delete('/questions/' + questionSaveRes.body._id)
							.send(question)
							.expect(200)
							.end(function(questionDeleteErr, questionDeleteRes) {
								// Handle Question error error
								if (questionDeleteErr) done(questionDeleteErr);

								// Set assertions
								(questionDeleteRes.body._id).should.equal(questionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Question instance if not signed in', function(done) {
		// Set Question user 
		question.user = user;

		// Create new Question model instance
		var questionObj = new Question(question);

		// Save the Question
		questionObj.save(function() {
			// Try deleting Question
			request(app).delete('/questions/' + questionObj._id)
			.expect(401)
			.end(function(questionDeleteErr, questionDeleteRes) {
				// Set message assertion
				(questionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Question error error
				done(questionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Question.remove().exec();
		done();
	});
});