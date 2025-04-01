create database advancedRealEstate_db;
drop database advancedRealEstate_db;
create database identity_service;
drop database identity_service;
SHOW CREATE TABLE room_chats;

create table users(
	id varchar(255) primary key,
    fullname varchar(255),
    email varchar(255),
    password varchar(255),
    gender varchar(255),
    phone varchar(255),
    address varchar(255),
    birthday varchar(255),
    isVerify varchar(255),
    referral_Code varchar(255),
    avatar longblob
);

create table buildings(
	id varchar(255) primary key,
	name varchar(255),
	structure varchar(255),
	level varchar(255),
	area varchar(255),
    type varchar(255),
    description text,
	number_of_basement int,
	image longblob
);

create table maps(
	id varchar(255) primary key,
    map_name varchar(255),
	latitude decimal,
    longitude decimal,
	address varchar(255),
    ward varchar(255),
    district varchar(255),
	direction varchar(255)
);

create table expenses(
	id varchar(255) primary key,
    brokerage_fee decimal,
    service_fee decimal,
    electricity_fee decimal,
    water_fee decimal,
    parking_fee decimal
);

create table rent_buildings(
	id varchar(255) primary key,
    number_month int,
    rent_fee decimal,
	note text
);

create table buy_buildings(
	id varchar(255) primary key,
	price decimal,
	note text
);

create table service(

	id varchar(255) primary key,
	name varchar(255),
    price decimal
);

create table buy_building_details(
	id varchar(255) primary key,
    manager_phone varchar(255),
    manager_name varchar(255),
    service_id varchar(255),
    building_id varchar(255),
    buy_building_id varchar(255),
    expense_id varchar(255),
    map_id varchar(255),
    note text
);

create table rent_building_details(
	id varchar(255) primary key,
    manager_phone varchar(255),
    manager_name varchar(255),
    service_id varchar(255),
    building_id varchar(255),
    rent_building_id varchar(255),
    expense_id varchar(255),
    map_id varchar(255),
    created_by varchar(255),
    modified_date varchar(255),
    note text,
    
	CONSTRAINT fk_service FOREIGN KEY (service_id) REFERENCES service(id),
    CONSTRAINT fk_building FOREIGN KEY (building_id) REFERENCES buildings(id),
    CONSTRAINT fk_rent_building FOREIGN KEY (rent_building_id) REFERENCES rent_buildings(id),
    CONSTRAINT fk_expense FOREIGN KEY (expense_id) REFERENCES expenses(id),
    CONSTRAINT fk_map FOREIGN KEY (map_id) REFERENCES maps(id),
	CONSTRAINT fk_user FOREIGN KEY (created_by) REFERENCES users(id)
);

INSERT INTO user (id, first_name, last_name, fullname, password, username, dob, status)
VALUES
('308a0d83-1edf-4d06-92a5-a09ef0b01a92', 'John', 'Doe', 'John Doe', '$2a$10$V8.RTi2gaEkkQF7encmuW.iOgxC2bKOWQgh45zurm152L5EeNfleO', 'johnDoe', '1995-05-10', 1),
('489f6f32-1b45-4f97-82c8-01e74496cee9', 'John', 'Doe', 'John Doe', '$2a$10$xAD3DUcgEvLiZ8Y7Fu6..ujz9Y7yiKKf2qmxQz5kIm.srPz7AZBFi', 'Khanh', '1995-05-10', 1),
('800f27c5-4ded-9d7a-5cf1d06f155d', 'John', 'Doe', 'John Doe', '$2a$10$0..A.t2czfiPL.x67ubHAOYeGflPtR2TJhE95fmG5ocWWo9yrIzRS', 'Khanh10', '1995-05-10', 1),
('846af644-e9a8-4832-959b-70b0ae2ed565', 'John', 'Doe', 'John Doe', '$2a$10$dkL89flQlIH9qzFcDer7W.DyIj/cXzDBa8TdES5f.VCay1tRuLT.K', 'Khanh1', '1995-05-10', 1),
('9e7adceb-2f9c-49db-8b6d-9c5b6e5f6a1d', 'John', 'Doe', 'John Doe', '$2a$10$PFQeQPB82HCl9R59ObUNzuypAKH0Lye1K3Qe6oMhLXsRLWlQ7ZShu', 'Khanh11', '1995-05-10', 1),
('d501f36a-1310-4b23-896b-45fcd537b971', 'khanh', 'ngoc', 'khanh ngoc', '$2a$10$yQWkBfLujSOe.8/IVlc4HewqqWi6J3J6qzOhRCm4QZRLJC73oWVoG', 'admin1', '1995-05-10', 1),
('dcc60403-f55c-46cb-b3a1-3f53b66da28d', 'John', 'Doe', 'John Doe', '$2a$10$NnYU2rUlAba.yGLh52JjHeZKdf31hQuv7i.A7ewpJA8kTe3bk03UO', 'johnDoea', '1995-05-10', 1);

INSERT INTO role (id, code, name, description)
VALUES
(1, 'ROLE_ADMIN', 'Admin', 'Administrator role'),
(2, 'ROLE_USER', 'User', 'Standard user role');

INSERT INTO user_roles (user_id, roles_name)
VALUES
('308a0d83-1edf-4d06-92a5-a09ef0b01a92', 'Admin'),
('489f6f32-1b45-4f97-82c8-01e74496cee9', 'User');


select * from user;
select * from user;
select * from user_roles;
select * from role_permissions;
select * from role, user_roles, role_permissions
where role.name = user_roles.roles_name;
select * from role, user_roles, role_permissions
where role.name = user_roles.roles_name AND
role.role_name = role_permissions.role_name;
select * from room_chats;
select * from buildings;

ALTER TABLE user MODIFY fullname VARCHAR(255) NULL;
ALTER TABLE user MODIFY status INT DEFAULT 1;
ALTER TABLE room_chats MODIFY image LONGBLOB;
ALTER TABLE room_chats MODIFY image MEDIUMBLOB;
ALTER TABLE buildings MODIFY description text;
ALTER TABLE room_chats MODIFY description text;
ALTER TABLE auctions MODIFY description text;
ALTER TABLE auction_details MODIFY note text;
SHOW COLUMNS FROM room_chats;
ALTER TABLE maps DROP COLUMN direction;
ALTER TABLE auctions DROP COLUMN user_created_by;
ALTER TABLE auctions DROP FOREIGN KEY FK9pn743f5qmm5ua1ixoi0o7efn;
ALTER TABLE auction_details DROP COLUMN note;
SHOW INDEX FROM auctions;

select * from user;
delete from user where id = '0fe2a31b-5b23-41f8-80ed-37ec58e2aa1c';
delete from user where id = '0fe2a31b-5b23-41f8-80ed-37ec58e2aa1c';

INSERT INTO role_permissions (role_id, permission_id) VALUES
('89b6b956-8e41-4d22-944b-d49da6515b84', 1),
('89b6b956-8e41-4d22-944b-d49da6515b84', 2),
('89b6b956-8e41-4d22-944b-d49da6515b84', 3),
('89b6b956-8e41-4d22-944b-d49da6515b84', 4),
('89b6b956-8e41-4d22-944b-d49da6515b84', 5),
('89b6b956-8e41-4d22-944b-d49da6515b84', 6),
('89b6b956-8e41-4d22-944b-d49da6515b84', 7),
('89b6b956-8e41-4d22-944b-d49da6515b84', 8),
('89b6b956-8e41-4d22-944b-d49da6515b84', 9),
('89b6b956-8e41-4d22-944b-d49da6515b84', 10),
('89b6b956-8e41-4d22-944b-d49da6515b84', 11),
('89b6b956-8e41-4d22-944b-d49da6515b84', 12);

SELECT * FROM auction_histories WHERE identity_key = 'Aid0845109470' ORDER BY bid_amount DESC LIMIT 1;
ALTER TABLE messages MODIFY COLUMN message_index INT AUTO_INCREMENT UNIQUE NOT NULL;

SELECT * FROM auction_histories WHERE identity_key  = 'Aid0582578814';

SELECT COUNT(*) FROM auction_histories 
WHERE identity_key  = 'Aid0582578814' AND 
1022000999 <= (SELECT max(bid_amount) FROM auction_histories WHERE identity_key  = 'Aid0582578814');








