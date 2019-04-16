

/* get all drug records for all users */
select drugname1, drugname2, age, sex, firstname, lastname from user inner join drug on drug.email = user.email;

/* sequelized

    User.hasMany(Drug,{foreignKey: 'email'});

    var _q = User;
    _q.findAll({
    include: [{model: Drug,  required: true,}, ],
    attributes: [['drugname1', 'drugname1'],['drugname2', 'drugname2'],['age', 'age'],['sex', 'sex'],['firstname', 'firstname'],['lastname', 'lastname']],
    });

*/

/* get drugs for a single user by first name last name*/
SELECT drugname1, drugname2 FROM drug INNER JOIN user on drug.email = user.email WHERE user.firstname = 'han' AND user.lastname = 'solo';

/* sequelized

    Drug.hasMany(User,{foreignKey: 'email'});

    var _q = Drug;
    _q.findAll({
    include: [{model: User,  required: true,}, ],
    attributes: [['drugname1', 'drugname1'],['drugname2', 'drugname2']],
    where: {[Op.and]: [{'$user.firstname$': {[Op.eq]: 'han'}}, {'$user.lastname$': {[Op.eq]: 'solo'}}]},
    });

*/

/* insert user (POST) */
insert into user (email, firstname, lastname, age, sex) values ('luke@tatooine.com','luke','skywalker',25,'M');

/* sequelized

    User.create({email: 'luke@tatooine.com', firstname: 'luke', lastname: 'skywalker', age: 25, sex: 'M'});

*/

/* insert drugs (POST) with foreign key*/
insert into drug (drugname1, drugname2, email) values ('zoloft','ibuprofen',(select email from user where email='solo@falcon.com'));


/* sequelized


*/

/* sql for user pull down */
select email from user;

/* sequelized

    var _q = User;
    _q.findAll({
    attributes: [['email', 'email']],
    });
  
*/

/* sql to get drugs by user pulled down */
select drugname1, drugname2 from drug INNER JOIN user on drug.email = user.email WHERE user.email='solo@falcon.com';

/* sequelized

var _q = Drug;
    _q.findAll({
    include: [{model: User,  required: true,}, ],
    attributes: [['drugname1', 'drugname1'],['drugname2', 'drugname2']],
    where: {[Op.and]: [{'$user.firstname$': {[Op.eq]: 'han'}}, {'$user.lastname$': {[Op.eq]: 'solo'}}]},
    });
  

*/

/* 
    Select drug pair..
    Get data for interaction api search,
    will need age, sex, drugname1, drugname2.
    Drugname1 and drugname2 is passed to api,
    age and sex will be used as conditionals
    to display retured data from api.
*/
select drugname1, drugname2, age, sex from drug INNER JOIN user on drug.email = user.email where email='solo@falcon.com';

/* sequelized

    const Op = Sequelize.Op;
    http://docs.sequelizejs.com/manual/tutorial/querying.html

    // Requiring our Todo model
    var db = require("../models");

    db.Drug.findAll({
    include: [{model: User,  required: true,}, ],
    attributes: ['drugname1', 'drugname2', 'age', 'sex'],
    where: {email: 'solo@falcon.com'},
    });
  

*/

/* we need to sequelize these statements */
/* http://docs.sequelizejs.com/manual/tutorial/querying.html */
    
 



