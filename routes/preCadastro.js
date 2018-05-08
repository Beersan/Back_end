var express = require('express');
var router = express.Router();

const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgres://avzgogfkefojwd:98673260249a154f7aec7832ad4e843fe04bf1debc600e98f04b82c2da2c64ea@ec2-54-221-220-59.compute-1.amazonaws.com:5432/dcasactg6t0691',
  ssl: true,
});
//client.connect(); 

router.get('/listarEspecialidade', function(req, res, next) {   
  client.query('SELECT * FROM especialidade;', (err, response) => {
    if (err) throw err;
    res.send(response.rows);
  });
});

router.post('/gravar', function(req, res){ 
  const data = {
    nomePaciente: req.body.nomePaciente, 
    registroGeral: req.body.registroGeral,
    CPF: req.body.CPF, 
    dataNascimento: req.body.dataNascimento,
    rendaFamiliar: req.body.rendaFamiliar,
    endereco: req.body.endereco,
    numero: req.body.numero,
    bairro: req.body.bairro, 
    cidade: req.body.cidade,
    encaminhamento: req.body.encaminhamento,
    especialidade: req.body.especialidade,
    telefoneUm: req.body.telefoneUm,
    telefoneDois: req.body.telefoneDois,
    encmedpaciente: req.body.linkAnexo
  };
  
  client.query("INSERT INTO paciente (nomepaciente, rgpaciente, cpfpaciente, datanascpaciente, rendapaciente, " 
                                        + " enderecopaciente, numeropaciente, bairropaciente, cidadepaciente, "
                                        + "encmedicopaciente, codigoespecialidade, contato1paciente, contato2paciente, encmedpaciente ) "
                                        + " VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)", 
                                        [ data.nomePaciente,                                           
                                          data.registroGeral, 
                                          data.CPF, 
                                          data.dataNascimento, 
                                          data.rendaFamiliar, 
                                          data.endereco, 
                                          data.numero, 
                                          data.bairro, 
                                          data.cidade, 
                                          data.encaminhamento, 
                                          data.especialidade, 
                                          data.telefoneUm, 
                                          data.telefoneDois,
                                          data.encmedpaciente
                                        ], (err, response) => {
                                          res.send({message: 'ok'});
                                        });         
    
});

router.get('/listarPacientes', function(req, res, next) {
  client.query("SELECT P.bairropaciente, P.cidadepaciente, P.codigoespecialidade, P.contato1paciente, "
                + " CASE WHEN P.contato2paciente IS NULL THEN 'Não informado' ELSE P.contato2paciente END AS telefone2 , "
                + " P.cpfpaciente, P.datanascpaciente, P.encmedicopaciente, P.encmedpaciente, "
                + " P.enderecopaciente,	P.idpaciente,	P.nomepaciente,	P.numeropaciente, "
                + " P.observacoespaciente,	P.rendapaciente,	P.rgpaciente, E.descricaoespecialidade, "
                + " CASE WHEN encmedpaciente IS NULL THEN 'none' ELSE 'initial' END AS classeenc "
                + " FROM paciente P "
                + " INNER JOIN especialidade E ON E.codigoespecialidade = P.codigoespecialidade" 
                + " WHERE P.aprovado IS NULL " 
                + " ORDER BY  P.encmedicopaciente DESC, CAST(P.rendapaciente AS INT) ASC ", (err, response) => {
    if (err) throw err;
    res.send(response.rows);
  });          
});

router.post('/excluir', function(req, res){   
  const data = {idpaciente: req.body.idPaciente};       
  client.query("UPDATE paciente SET aprovado = 0 WHERE idpaciente = $1", [data.idpaciente], (err,response)=> {
    res.send({message: 'ok'});
  });           
});

router.post('/aprovarCadastro', function(req, res){   
  const data = {
    idpaciente: req.body.idpaciente,
    nomePaciente: req.body.nomePaciente, 
    registroGeral: req.body.registroGeral,
    CPF: req.body.CPF, 
    dataNascimento: req.body.dataNascimento,
    rendaFamiliar: req.body.rendaFamiliar,
    endereco: req.body.endereco,
    numero: req.body.numero,
    bairro: req.body.bairro, 
    cidade: req.body.cidade,
    telefoneUm: req.body.telefoneUm,
    telefoneDois: req.body.telefoneDois,
    especialidade: req.body.especialidade,
    observacao: req.body.observacao
  };     

  client.query("UPDATE paciente SET aprovado = 1, "
                  + " nomepaciente = $1, "
                  + " rgpaciente = $2, "
                  + " cpfpaciente = $3, "
                  + " datanascpaciente = $4, "
                  + " rendapaciente = $5, "
                  + " enderecopaciente = $6, "
                  + " numeropaciente = $7, "
                  + " bairropaciente = $8, "
                  + " cidadepaciente = $9, "
                  + " contato1paciente = $10, "
                  + " contato2paciente = $11, "
                  + " codigoespecialidade = $12, "
                  + " observacoespaciente = $13 "
                  + "WHERE idpaciente = $14", 
                  [data.nomePaciente,                                           
                    data.registroGeral, 
                    data.CPF, 
                    data.dataNascimento, 
                    data.rendaFamiliar, 
                    data.endereco, 
                    data.numero, 
                    data.bairro, 
                    data.cidade, 
                    data.telefoneUm, 
                    data.telefoneDois,
                    data.especialidade, 
                    data.observacao,
                    data.idpaciente], (err,response)=> {
    //console.log(err)
    res.send({message: 'ok'});
  });           
});
module.exports = router;