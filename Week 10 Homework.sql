use sakila;
-- 1a
select first_name, last_name from actor;
-- 1b
select upper(concat(first_name,' ',last_name)) as "Actor Name" from actor;
-- 2a
select actor_id, first_name, last_name from actor where first_name = "Joe";
-- 2b
select last_name from actor where last_name like "%GEN%";
-- 2c
select first_name, last_name from actor where last_name like "%LI%" order by last_name, first_name;
-- 2d
select country_id, country from country where country in ("Afghanistan", "Bangladesh", "China");
-- 3a
alter table actor add description blob;
-- 3b
alter table actor drop column description;
-- 4a
select last_name, count(last_name) from actor group by last_name;
-- 4b
select last_name, count(last_name) from actor group by last_name having count(last_name) > 1;
-- 4c
update actor set first_name = "HARPO" where first_name = "GROUCHO" and last_name = "WILLIAMS";
-- 4d
set sql_safe_updates = 0;
update actor set first_name = "GROUCHO" where first_name = "HARPO";
set sql_safe_updates = 1;
-- 5a
show create table address;
-- Why isn't describe better than show create table?
describe address;
-- 6a
select staff.first_name, staff.last_name, address.address from staff inner join address on staff.address_id = address.address_id;
-- 6b
select concat(staff.first_name, " ", staff.last_name), sum(payment.amount) from staff inner join payment on staff.staff_id = payment.staff_id where payment.payment_date >= "2005-08-01" and payment.payment_date < "2005-09-01" group by staff.first_name, staff.last_name;
-- 6c
select film.title, count(film_actor.actor_id) from film inner join film_actor on film.film_id = film_actor.film_id group by film.title;
-- 6d
select film.title, count(inventory.inventory_id) from film inner join inventory on film.film_id = inventory.film_id where film.title = "Hunchback Impossible";
-- 6e
select customer.first_name, customer.last_name, sum(payment.amount) as "Total Amount Paid" from customer inner join payment on customer.customer_id = payment.customer_id group by first_name, last_name order by customer.last_name;
-- 7a
select title from film where language_id = 1 and (title like "K%" or title like "Q%");
-- 7b
select first_name, last_name from actor where actor_id in (select actor_id from film_actor where film_id in (select film_id from film where title = "Alone Trip"));
-- 7c
select first_name, last_name, email from customer inner join address on customer.address_id = address.address_id inner join city on city.city_id = address.city_id inner join country on country.country_id = city.country_id where country = "Canada";
-- 7d
select title from film where film_id in (select film_id from film_category where category_id in (select category_id from category where name = "Family"));
-- 7e
select film.title, count(rental_id) from rental inner join inventory on inventory.inventory_id = rental.inventory_id inner join film on film.film_id = inventory.film_id group by film.title order by count(rental_id) desc;
-- 7f
select store.store_id, sum(payment.amount) from store inner join customer on customer.store_id = store.store_id inner join payment on customer.customer_id = payment.customer_id group by store.store_id;
-- 7g
select store.store_id, city.city, country.country from store inner join address on store.address_id = address.address_id inner join city on city.city_id = address.city_id inner join country on country.country_id = city.country_id;
-- 7h
select name, sum(payment.amount) from category inner join film_category on film_category.category_id = category.category_id inner join inventory on inventory.film_id = film_category.film_id inner join rental on rental.inventory_id = inventory.inventory_id inner join payment on payment.rental_id = rental.rental_id group by category.name order by sum(amount) desc limit 5;
-- 8a
create view top_five_genres as select name, sum(payment.amount) from category inner join film_category on film_category.category_id = category.category_id inner join inventory on inventory.film_id = film_category.film_id inner join rental on rental.inventory_id = inventory.inventory_id inner join payment on payment.rental_id = rental.rental_id group by category.name order by sum(amount) desc limit 5;
-- 8b
select * from top_five_genres;
-- 8c
drop view top_five_genres;