
/* must be inserted in this order due to foreign key constraint */

USE drugrx_db;
/*
insert into users (email, firstname, lastname, age, sex) values ('luke@tatooine.com','luke','skywalker',25,'M');
insert into users (email, firstname, lastname, age, sex) values ('admiralAckbar@istatrap.com','admiral','ackbar',100,'F');
insert into users (email, firstname, lastname, age, sex) values ('solo@falcon.com','han','solo',35,'M');
insert into users (email, firstname, lastname, age, sex) values ('mthatcher@theboss.uk','margaret','thatcher',70,'F');
insert into users (email, firstname, lastname, age, sex) values ('mrt@pittythefoo.com','clebber','lang',30,'M');

select * from users;
*/

/* inserts with email foreign key constraint on users table */
insert into drugs (drugname1, drugname2, UserEmail) values ('zoloft','ibuprofen',(select email from users where email='solo@falcon.com'));
insert into drugs (drugname1, drugname2, UserEmail) values ('zoloft','ibuprofen',(select email from users where email='luke@tatooine.com'));
insert into drugs (drugname1, drugname2, UserEmail) values ('warfarin','acetaminophen',(select email from users where email='luke@tatooine.com'));
insert into drugs (drugname1, drugname2, UserEmail) values ('simvastatin','gemfibrozil',(select email from users where email='solo@falcon.com'));
insert into drugs (drugname1, drugname2, UserEmail) values ('Clarithromycin','nifedipine',(select email from users where email='admiralAckbar@istatrap.com'));
insert into drugs (drugname1, drugname2, UserEmail) values ('zoloft','ibuprofen',(select email from users where email='admiralAckbar@istatrap.com'));
insert into drugs (drugname1, drugname2, UserEmail) values ('levothyroxine','omeprazole',(select email from users where email='mthatcher@theboss.uk'));
insert into drugs (drugname1, drugname2, UserEmail) values ('warfarin','acetaminophen',(select email from users where email='mrt@pittythefoo.com'));

select * from drugs;