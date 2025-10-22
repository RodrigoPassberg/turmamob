const express = require('express');

const router = express.Router();

const Professor = require('./controllers/professor');
const Turma = require('./controllers/turma');
const Atividade = require('./controllers/atividade');

router.get('/Api Funcionando', (req, res) => {});

router.post('/login', Professor.login);
router.post('/professor', Professor.create);
router.get('/professor', Professor.read);
router.get('/professor/:id', Professor.read);
router.patch('/professor', Professor.update);
router.delete('/professor/:id', Professor.del);

router.post('/turma', Turma.create);
router.get('/turma', Turma.read);
router.get('/turma/:id', Turma.read);
router.put('/turma/:id', Turma.update);
router.delete('/turma/:id', Turma.del);

router.post('/atividade', Atividade.create);
router.get('/atividade', Atividade.read);
router.get('/atividade/:id', Atividade.read);
router.put('/atividade/:id', Atividade.update);
router.delete('/atividade/:id', Atividade.del);


module.exports = router;