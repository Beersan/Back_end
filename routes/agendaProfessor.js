var express = require('express');
var router = express.Router();
var client = require('./dbConnection');

router.get('/listarProfessor', function (req, res){
    client.query("select idprofessor, nomeprofessor from professor, especialidade where professor.codigoespecialidade = especialidade.codigoespecialidade and ativo = 1 order by nomeprofessor"  , (err, response) => {if (err) throw err;
        res.send(response.rows);
    });          
});

router.get('/listarDiaSemana', function(req, res){
    client.query("select * from diasemana", (err, response) => {if (err) throw err;
        res.send(response.rows);
    });          
});

router.get('/listarHoraInicio', function(req, res){
    client.query("select * from horainicio", (err, response) => {if (err) throw err;
        res.send(response.rows);
    });          
});

router.get('/listarHoraFim', function (req, res){
    client.query('select * from horafim', (err, response) => {if (err) throw err;
        res.send(response.rows);
    });          
});

router.post('/inserirAgenda', function (req, res){
    const data = {
        nomeProfessor : req.body.idprofessor,
        descricaoDiaSemana : req.body.diaSemana,
        descricaoHoraInicio : req.body.horaInicio,
        descricaoHoraFim : req.body.horaFim
    };
    console.log("valores " + data.nomeProfessor, data.descricaoDiaSemana, data.descricaoHoraInicio, data.descricaoHoraFim)
    for (i = 0; i <= data.descricaoDiaSemana.length; i++){    
        client.query("insert into agendaprofessor (idprofessor, iddiasemana, idhorainicio, idhorafim) values (" + 
            "(select idprofessor from professor where nomeprofessor = ($1) and ativo = 1), " +
            "(select iddiasemana from diasemana where descricaosemana = $2)," +
            "(select idhorainicio from horainicio where descricaohorainicio = ($3)), " +
            "(select idhorafim from horafim where descricaohorafim = ($4)))"
            , [data.nomeProfessor, data.descricaoDiaSemana, data.descricaoHoraInicio, data.descricaoHoraFim]);       
    }
    res.send({
        message: 'ok'
    });
});
module.exports = router;