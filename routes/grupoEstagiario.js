var express = require('express');
var router = express.Router();
const { Client } = require('pg');

router.get('/listarestagiario', function(req, res, next) {
    const client = new Client({
      connectionString: 'postgres://avzgogfkefojwd:98673260249a154f7aec7832ad4e843fe04bf1debc600e98f04b82c2da2c64ea@ec2-54-221-220-59.compute-1.amazonaws.com:5432/dcasactg6t0691',
      ssl: true,
    });
    client.connect();  
    client.query("SELECT idestagiario, nomeestagiario, 'false' AS checked from estagiario where idestagiario not in (select idestagiario FROM grupoestagiarios) ORDER BY nomeestagiario ASC;", (err, response) => {
      if (err) throw err;
      res.send(response.rows);
    });          
  });

  router.get('/listargrupo', function(req, res, next) {
    const client = new Client({
      connectionString: 'postgres://avzgogfkefojwd:98673260249a154f7aec7832ad4e843fe04bf1debc600e98f04b82c2da2c64ea@ec2-54-221-220-59.compute-1.amazonaws.com:5432/dcasactg6t0691',
      ssl: true,
    });
    client.connect();  
    client.query('SELECT * from grupo where idgrupo not in (select idgrupo from grupoestagiarios) order by descricaogrupo;', (err, response) => {
      if (err) throw err;
      res.send(response.rows);
    });          
  });

  router.post('/cadastrar', function(req, res){ 
    
    const client = new Client({
      connectionString: 'postgres://avzgogfkefojwd:98673260249a154f7aec7832ad4e843fe04bf1debc600e98f04b82c2da2c64ea@ec2-54-221-220-59.compute-1.amazonaws.com:5432/dcasactg6t0691',
      ssl: true,
    });
    
    const data = {grupo: req.body.grupo, codigos: req.body.codigos};
  
    client.connect((err, client, done) => {
      if(err){
        console.log(err);
        return res.status(500).json({success: false, data: err});
      }
      client.query("DELETE FROM grupoestagiarios WHERE idgrupo = $1", [data.grupo]);         
      for (i = 0; i <= data.codigos.length; i++){
        client.query("INSERT INTO grupoestagiarios(idestagiario, idgrupo) values($1, $2)", [data.codigos[i], data.grupo]);         
      }
      res.send({
        message: 'ok'
      });
    }); 
  });

  router.get('/listargrupoestagiario', function(req, res, next) {
    const client = new Client({
      connectionString: 'postgres://avzgogfkefojwd:98673260249a154f7aec7832ad4e843fe04bf1debc600e98f04b82c2da2c64ea@ec2-54-221-220-59.compute-1.amazonaws.com:5432/dcasactg6t0691',
      ssl: true,
    });
    client.connect();  
    client.query("SELECT G.idgrupo, G.descricaogrupo, string_agg(E.nomeestagiario, ', ') as nomes FROM grupoestagiarios GE INNER JOIN estagiario E ON E.idestagiario = GE.idestagiario INNER JOIN grupo G ON G.idgrupo = GE.idgrupo GROUP BY G.idgrupo", (err, response) => {
      if (err) throw err;
      res.send(response.rows);
    });          
  });

  router.post('/excluir', function(req, res){ 
    const client = new Client({
      connectionString: 'postgres://avzgogfkefojwd:98673260249a154f7aec7832ad4e843fe04bf1debc600e98f04b82c2da2c64ea@ec2-54-221-220-59.compute-1.amazonaws.com:5432/dcasactg6t0691',
      ssl: true,
    });
    const data = {idGrupo: req.body.idgrupo};
    client.connect((err, client, done) => {
      if(err){
        console.log(err);
        return res.status(500).json({success: false, data: err});
      }    
      client.query("DELETE FROM grupoestagiarios WHERE idgrupo = $1", [data.idGrupo]);         
      res.send({
        message: 'ok'
      });
    }); 
  });

  router.post('/listarestagiarioseditar', function(req, res){ 
    const client = new Client({
      connectionString: 'postgres://avzgogfkefojwd:98673260249a154f7aec7832ad4e843fe04bf1debc600e98f04b82c2da2c64ea@ec2-54-221-220-59.compute-1.amazonaws.com:5432/dcasactg6t0691',
      ssl: true,
    });
    console.log(req.body.idGrupo);
    const data = {idgrupo: req.body.idGrupo};
    client.connect();        
    client.query(" SELECT grupoestagiarios.idestagiario, nomeestagiario, 'true' AS checked" 
                + "    FROM grupoestagiarios"
                + "      INNER JOIN estagiario ON estagiario.idestagiario = grupoestagiarios.idestagiario "
                + "    WHERE grupoestagiarios.idgrupo = $1"
                + "  UNION "
                + "  SELECT idestagiario, nomeestagiario, 'false' AS checked "
                + "     FROM estagiario"
                + "     WHERE idestagiario not in (select idestagiario from grupoestagiarios)"
                + "  ORDER BY nomeestagiario", [data.idgrupo], (err, response) => {
      if (err) throw err;
      res.send(response.rows);
    });        
  });
  
  module.exports = router;
