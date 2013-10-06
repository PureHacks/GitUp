-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	5.5.9


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


--
-- Create schema gitup
--

CREATE DATABASE IF NOT EXISTS gitup;
USE gitup;

--
-- Definition of table `activity`
--

DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity` (
  `activity_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_sitting` tinyint(1) NOT NULL DEFAULT '0',
  `last_sitting_duration` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`activity_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `activity`
--

/*!40000 ALTER TABLE `activity` DISABLE KEYS */;
INSERT INTO `activity` (`activity_id`,`user_id`,`timestamp`,`is_sitting`,`last_sitting_duration`) VALUES 
 (1,1,'2013-10-04 15:47:26',1,NULL),
 (2,1,'2013-10-04 15:47:42',1,NULL),
 (3,1,'2013-10-04 15:48:14',1,NULL),
 (4,1,'2013-10-04 15:48:47',1,NULL),
 (5,1,'2013-10-04 15:49:55',0,NULL),
 (6,1,'2013-10-04 15:51:30',0,NULL),
 (7,1,'2013-10-04 16:19:15',0,NULL);
/*!40000 ALTER TABLE `activity` ENABLE KEYS */;


--
-- Definition of table `chairs`
--

DROP TABLE IF EXISTS `chairs`;
CREATE TABLE `chairs` (
  `chair_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `chair_name` varchar(45) NOT NULL,
  PRIMARY KEY (`chair_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `chairs`
--

/*!40000 ALTER TABLE `chairs` DISABLE KEYS */;
INSERT INTO `chairs` (`chair_id`,`chair_name`) VALUES 
 (1,'Alpha'),
 (2,'Beta'),
 (3,'Gamma'),
 (4,'Delta');
/*!40000 ALTER TABLE `chairs` ENABLE KEYS */;


--
-- Definition of table `messages`
--

DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `msg_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `msg_body` varchar(100) NOT NULL,
  PRIMARY KEY (`msg_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `messages`
--

/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;


--
-- Definition of table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `firstname` varchar(45) NOT NULL,
  `lastname` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `chair_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`user_id`,`email`,`firstname`,`lastname`,`password`,`chair_id`) VALUES 
 (1,'ken.king@nurun.com','Ken','King','password',1),
 (2,'jenny.yuan@nurun.com','Jenny','Yuan','password',2),
 (3,'khoa.nguyen@nurun.com','Khoa','Nguyen','password',3),
 (4,'test1@test.com','testfname','testlname','password',4),
 (5,'test2@test.com','test2fname','test2lname','password',5),
 (6,'test3%40test.com','test3fname','test3lname','password',6);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;




/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
