// front-end api calls
import axios from 'axios';

export default {
  getDrugNames: function(query) {
    console.log('query for drug name', query);
    return axios.post('/api/getDrug', query);
  }
};
