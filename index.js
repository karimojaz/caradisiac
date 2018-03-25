const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');
const elasticsearch = require('elasticsearch');
const express = require('express');
const app = express();
const fs = require('fs');
const port = 9292;


app.listen(port, () => {
  console.log('We are live on ' + port);
});


async function getArrayOfModels(brands){
  var result = [];

  for (var brand of brands) {
    console.log(`brand: ${brand}`);
    try {
      var tmp = await getModels(brand);
      result = result.concat(tmp);
    } catch (err) {
      console.error(err);
    }
  }
  return result;
}

async function writeJSON(){
  const brands = await getBrands();
  const models = await getArrayOfModels(brands);
  console.log(`models: ${JSON.stringify(models, null, 2)}`);
  var json = JSON.stringify(models);
  fs.writeFile('./models.json', json, 'utf8');
}

app.get('/populate',function(req,res){

  var caradisiac = jsonfile.readFileSync("./models.json");

  var client = new elasticsearch.Client({
      host: 'localhost:9200',
      log: 'trace'
  });

  var body = [];
  for (var i = 0; i < caradisiac.length; i++ ) {
      var config = { index:  { _index: 'caradisiac', _type: 'suv', _id: i } };
      body.push(config);
      body.push(caradisiac[i]);
  }

  client.bulk({
      body: body
  }, function (error, response) {
      if (error) {
          console.error(error);
          return;
      }
      else {
          console.log(response);
      }
  });
  res.send("Data well saved in elasticsearch");
})


app.get('/suv', function(req,res){
  var caradisiac = jsonfile.readFileSync("./models.json");

  var client = new elasticsearch.Client({
      host: 'localhost:9200',
      log: 'trace'
  });

  client.search({
    index: 'caradisiac',
    type: 'suv',
    body:{
      "size":100,
      "sort":[
        {"volume.keyword" :{"order":"desc"}}
      ]
    }
  },function (error, response,status) {
    if (error){
      console.log("search error: "+error)
    }
    else {
      console.log("--- Response ---");
      console.log(response);
      console.log("--- Hits ---");
      res.send(response.hits.hits);
    }
  });
})
