const unirest = require('unirest');
const router = require('express').Router();

/* API CALL GET DRUG NAME */
router.post('/getDrug', (req, res) => {
  //console.log('req query is', req.body);
  let drug = Object.values(req.body);
  //console.log(test[0]);

  unirest
    .get(
      'https://iterar-mapi-us.p.rapidapi.com/api/autocomplete?query=' + drug[0]
    )
    .header(
      'X-RapidAPI-Key',
      '0xAyFD96WlmshBNnpLcUfgSrWzCvp15QZAnjsnwA8grd2AfWRB'
    )
    .end(function(results) {
      console.log(results.body.suggestions);
      // return array of drug names
      res.json(results.body.suggestions);
    });
}); // END GET DRUG NAME
// then(({ data: { results } }) => res.json(results))

module.exports = router;
