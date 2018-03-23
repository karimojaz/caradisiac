const {getBrands} = require('node-car-api');
const {getModels} = require('node-car-api');
const fs = require('fs');

/*async function getModelsX(){
  const brands = await getBrands();
  for(var i = 0; i < brands.length; i++){
    var tmp = await getModels(brands[i]);
    var json = JSON.stringify(tmp)+",\n";
    if(json != "[],\n"){
      fs.appendFileSync(jsonFinal, json, 'utf8', err => {
        if (err) throw err;
      });
    }
  }
}*/

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

async function getArrayofM(){
  const brands = await getBrands();
  const models = await getArrayOfModels(brands);
  console.log(`models: ${JSON.stringify(models, null, 2)}`);
  var json = JSON.stringify(models);
  fs.writeFile('./models.json', json, 'utf8');
}

getArrayofM();
