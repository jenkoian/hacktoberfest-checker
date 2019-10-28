create database demo;
use demo;

CREATE TABLE Passenger (
    PersonID int not null auto_increment, 
    LastName varchar(255),
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255),
    Contact varchar(255),
    primary key(PersonID)
);

alter table Passenger 
add email varchar(255);
 
 alter table Passenger
 drop column Contact;
 
 select * from Passenger;
 
insert into passenger values(1, "Sharma", "Shikhar", "INDIA", "MBD",  
"8077715427", "s.shikharcse@gmail.com");
insert into passenger values(2, "Sharma", "Shubham", "INDIA", "Hamirpur", 
"8077715427", "s.shikharcse@gmail.com");
insert into passenger values(3, "Sharma", "Shikhar", "INDIA", "MBD", 
"8077715427", "s.shikharcse@gmail.com");
insert into passenger values(4,"Gupta", "Rishav", "INDIA", "MBD", 
"8077715427", "s.shikharcse@gmail.com");
insert into passenger values(5 ,"Bishnoi", "Rahul", "INDIA", "Jodhpur", 
"8077715427", "s.shikharcse@gmail.com");

select * from passenger;

truncate table passenger;

show databases;
use demo;

create table employee(
EmpId int,
FirstName varchar(20),
LastName varchar(20),
Department varchar(20),
DepId int,
Primary key (EmpId)
);

select * from employee;

create table department(
DepId int,
DepName varchar(20),
salary int,
Primary key (DepId)
);

insert into employee
values (1,"Shikhar", "Sharma", "Developer", "11" );
insert into employee
values (2,"Rishav", "Gupta", "Developer", "11" );
insert into employee
values (3,"Rahul", "Bishnoi", "Marketing", "22" );
insert into employee
values (4,"Ayush", "Aggarwal", "Tester", "33" );
insert into employee(EmpId, FirstName, LastName, Department)
values (5,"Divyansh", "Sharma", "Developer" );
insert into employee(EmpId, FirstName, LastName, Department)
values (6,"Deven", "Sharma", "R&D" );

select *from employee;

insert into department
values (11, "Developer",  800000);
insert into department
values (22, "Marketing",  200000);
insert into department
values (33, "Tester",  400000);
insert into department
values(44, "HR", 300000);
insert into department
values(55, "R&D", 2400000);

select * from employee;
select *from department;


select EmpId, FirstName, LastName, department.DepId, Salary
from employee
join department on employee.DepId = department.DepId;

select EmpId, FirstName, LastName, department.DepId, Salary
from employee
left join department on employee.DepId = department.DepId;

select EmpId, FirstName, LastName, department.DepId, Salary
from employee
right join department on employee.DepId = department.DepId;

# count no. of employees in each department
select count(employee.EmpId), DepName
from employee
left join department on employee.DepId = department.DepId
group by DepName;

select * from employee;

create table employeeAudit(
EmpId int,
FirstName varchar(20),
LastName varchar(20),
Department varchar(20),
DepId int,
changeDate varchar(20),
Action varchar(20),
Primary key (EmpId)
);

select * from employeeAudit;


								-- Before trigger for update
DELIMITER $$
CREATE TRIGGER before_employee_update 
    BEFORE UPDATE ON employee
    FOR EACH ROW 
BEGIN
    INSERT INTO employeeAudit
    SET action = 'update',
     EmpId = OLD.EmpId,
        LastName = OLD.LastName,
        FirstName = OLD.FirstName,
        Department = OLD.Department,
        DepId = OLD.DepId,
        changeDate = NOW(); 
END$$
DELIMITER ;

show triggers;
drop trigger before_employee_update;

truncate employeeAudit;
select * from employeeAudit;


select * from employee;
select * from department; 

update employee
set FirstName = "Deven", LastName = "Sharma" 
where EmpId = 6;

select *from employeeAudit;

DELIMITER //
CREATE PROCEDURE employeeProcedure
(IN con VARCHAR(20))
BEGIN
  SELECT FirstName, LastName FROM employee
  WHERE FirstName = con;
END //
DELIMITER ;

call employeeProcedure("Deven");

								-- create after trigger for update

DELIMITER $$
CREATE TRIGGER after_employee_update 
    AFTER UPDATE ON employee
    FOR EACH ROW 
BEGIN
    INSERT INTO employeeAudit
    SET action = 'update',
        EmpId = OLD.EmpId,
	    LastName = OLD.LastName,
        FirstName = OLD.FirstName,
        Department = OLD.Department,
        DepId = OLD.DepId,
        changeDate = NOW(); 
END$$
DELIMITER ;

select * from employee;

update employee
set FirstName = "Divyansh", LastName = "Sharma", Department = "Developer"
where EmpId = 5;

select * from employeeAudit;
select * from employee;

									-- create trigger for after insert

DELIMITER $$
CREATE TRIGGER after_employee_insert 
    After insert ON employee
    FOR EACH ROW 
BEGIN
    INSERT INTO employeeAudit
    SET action = 'update',
        EmpId = new.EmpId,
	    LastName = new.LastName,
        FirstName = new.FirstName,
        Department = new.Department,
        DepId = new.DepId,
        changeDate = NOW(); 
END$$
DELIMITER ;

insert into employee
values (7, "Deepanshu", "Goyal", "Tester", 33);

insert into employee
values(8,"Nitish", "Kumar", "HR", 44);

select * from employeeAudit;
select * from employee;
select * from department;

								-- create trigger before insert

drop table salaryAudit;
create table salaryAudit(
	changeDate varchar(20)
);

DELIMITER $$
CREATE TRIGGER before_department_insert 
    before insert ON department
    FOR EACH ROW 
BEGIN
    INSERT INTO salaryAudit
    values (changeDate = sysdate());
END$$
DELIMITER ;

show triggers;
drop trigger before_department_insert;
select * from department;
insert into department
values (77, "Admin", 6700000);

delete from department
where DepId = 77;

select * from salaryAudit;

							
                            -- crete trigger for before delete

DELIMITER $$
CREATE TRIGGER before_employee_delete 
    before delete ON employee
    FOR EACH ROW 
BEGIN
    INSERT INTO employeeAudit
    SET action = 'update',
        EmpId = old.EmpId,
	    LastName = old.LastName,
        FirstName = old.FirstName,
        Department = old.Department,
        DepId = old.DepId,
        changeDate = NOW(); 
END$$
DELIMITER ;

show triggers;
select * from employee;
select * from employeeAudit;

delete from employee
where EmpId = 3;

								-- create trigger after delete

DELIMITER $$
CREATE TRIGGER after_employee_delete 
    after delete ON employee
    FOR EACH ROW 
BEGIN
    INSERT INTO employeeAudit
    SET action = 'update',
        EmpId = old.EmpId,
	    LastName = old.LastName,
        FirstName = old.FirstName,
        Department = old.Department,
        DepId = old.DepId,
        changeDate = NOW(); 
END$$
DELIMITER ;

select * from employee;
select * from employeeAudit;

delete from employee
where EmpId = 2;

show databases;
use demo;
show triggers;