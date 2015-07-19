var models = require('../models/models.js');

//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function (quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else {
        next(new Error('No existe quizId=' + quizId));
      }
    }
  ).catch(function(error) {next(error);});
};

// GET /quizes
exports.index = function(req, res) {
  var search = req.query.search;
  search = '%' + search + '%';
  buscar = {
    where: ["pregunta like ?", search]
  };
  models.Quiz.findAll(buscar).then(
    function(quizes) {
      res.render('quizes/index.ejs', { quizes: quizes });
    }
  ).catch(function(error) {next(error);})
};


// GET /quizes/:id
exports.show = function(req, res) {
  // models.Quiz.find(req.params.quizId).then(function(quiz) {
    res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  // models.Quiz.find(req.params.quizId).then(function(quiz) {
  // if (req.query.respuesta === quiz.respuesta) {
  //     res.render('quizes/answer',
  // 	{quiz: quiz, respuesta: 'Correcto' });
  //   } else {
  //     res.render('quizes/answer',
  // 	{quiz: quiz, respuesta: 'Incorrecto'});
  //   }
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};


// GET /author
exports.author = function(req, res) {
  res.render('author', {nombre: 'Raul'});
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build( // crea objeto quiz
    {pregunta: "Pregunta", respuesta: "Respuesta"}
  );
  res.render('quizes/new', {quiz: quiz});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build(req.body.quiz);
  //guarda en DB los campos pregunta y respuetsa del quiz
  quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
    res.redirect('/quizes');
  }) // Redireción HTTP (URL relativo) lista de preguntas
};

// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;

  req.quiz
  .save( {fields: ["pregunta", "respuesta"]})
  .then( function(){ res.redirect('/quizes');});
};


// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz; // autoload de instancia de quiz
  res.render('quizes/edit', {quiz: quiz});
};


// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes')
  })
};


