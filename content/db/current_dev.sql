-- MySQL dump 10.13  Distrib 5.6.24, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: website_dev
-- ------------------------------------------------------
-- Server version	5.6.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `example`
--

DROP TABLE IF EXISTS `example`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `example` (
  `eid` int(11) NOT NULL AUTO_INCREMENT,
  `ename` varchar(100) NOT NULL,
  `order` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  PRIMARY KEY (`eid`),
  UNIQUE KEY `eid_UNIQUE` (`eid`),
  KEY `section_id_idx` (`section_id`),
  CONSTRAINT `section_id` FOREIGN KEY (`section_id`) REFERENCES `section` (`section_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=539 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `example`
--

LOCK TABLES `example` WRITE;
/*!40000 ALTER TABLE `example` DISABLE KEYS */;
INSERT INTO `example` VALUES (84,'Example_1',1,80),(85,'Example_2',2,80),(86,'Example_3',3,80),(87,'Example_4',4,80),(88,'Example_5',5,80),(89,'Example_6',6,80),(90,'Example_7',7,80),(91,'Example_8',8,80),(92,'Example_9',9,80),(93,'Example_10',10,80),(94,'Example_1',1,81),(95,'Example_2',2,81),(96,'Example_3',3,81),(97,'Example_4',4,81),(98,'Example_5',5,81),(99,'Example_6',6,81),(100,'Example_7',7,81),(101,'Example_8',8,81),(102,'Example_9',9,81),(103,'Example_10',10,81),(104,'Example_1',1,82),(105,'Example_2',2,82),(106,'Example_3',3,82),(107,'Example_4',4,82),(108,'Example_5',5,82),(109,'Example_6',6,82),(110,'Example_7',7,82),(111,'Example_8',8,82),(112,'Example_9',9,82),(113,'Example_10',10,82),(114,'Example_1',1,83),(115,'Example_2',2,83),(116,'Example_3',3,83),(117,'Example_4',4,83),(118,'Example_5',5,83),(119,'Example_6',6,83),(120,'Example_7',7,83),(121,'Example_8',8,83),(122,'Example_9',9,83),(123,'Example_10',10,83),(124,'Example_1',1,84),(125,'Example_2',2,84),(126,'Example_3',3,84),(127,'Example_4',4,84),(128,'Example_5',5,84),(129,'Example_6',6,84),(130,'Example_7',7,84),(131,'Example_8',8,84),(132,'Example_9',9,84),(133,'Example_10',10,84),(134,'Example_1',1,85),(135,'Example_2',2,85),(136,'Example_3',3,85),(137,'Example_4',4,85),(138,'Example_5',5,85),(139,'Example_6',6,85),(140,'Example_7',7,85),(141,'Example_8',8,85),(142,'Example_9',9,85),(143,'Example_10',10,85),(144,'Example_1',1,86),(145,'Example_2',2,86),(146,'Example_3',3,86),(147,'Example_4',4,86),(148,'Example_5',5,86),(149,'Example_6',6,86),(150,'Example_7',7,86),(151,'Example_8',8,86),(152,'Example_9',9,86),(153,'Example_10',10,86),(154,'Example_1',1,87),(155,'Example_2',2,87),(156,'Example_3',3,87),(157,'Example_4',4,87),(158,'Example_5',5,87),(159,'Example_6',6,87),(160,'Example_7',7,87),(161,'Example_8',8,87),(162,'Example_9',9,87),(163,'Example_10',10,87),(164,'Example_1',1,88),(165,'Example_2',2,88),(166,'Example_3',3,88),(167,'Example_4',4,88),(168,'Example_5',5,88),(169,'Example_6',6,88),(170,'Example_7',7,88),(171,'Example_8',8,88),(172,'Example_9',9,88),(173,'Example_10',10,88),(174,'Example_1',1,90),(175,'Example_2',2,90),(176,'Example_3',3,90),(177,'Example_4',4,90),(178,'Example_5',5,90),(179,'Example_6',6,90),(180,'Example_7',7,90),(181,'Example_8',8,90),(182,'Example_9',9,90),(183,'Example_10',10,90),(184,'Example_1',1,91),(185,'Example_2',2,91),(186,'Example_3',3,91),(187,'Example_4',4,91),(188,'Example_5',5,91),(189,'Example_6',6,91),(190,'Example_7',7,91),(191,'Example_8',8,91),(192,'Example_9',9,91),(193,'Example_10',10,91),(194,'Example_1',1,93),(195,'Example_2',2,93),(196,'Example_3',3,93),(197,'Example_4',4,93),(198,'Example_5',5,93),(199,'Example_6',6,93),(200,'Example_7',7,93),(201,'Example_8',8,93),(202,'Example_9',9,93),(203,'Example_10',10,93),(204,'Example_1',1,94),(205,'Example_2',2,94),(206,'Example_3',3,94),(207,'Example_4',4,94),(208,'Example_5',5,94),(209,'Example_6',6,94),(210,'Example_7',7,94),(211,'Example_8',8,94),(212,'Example_9',9,94),(213,'Example_10',10,94),(214,'Example_1',1,95),(215,'Example_2',2,95),(216,'Example_3',3,95),(217,'Example_4',4,95),(218,'Example_5',5,95),(219,'Example_6',6,95),(220,'Example_7',7,95),(221,'Example_8',8,95),(222,'Example_9',9,95),(223,'Example_10',10,95),(224,'Example_1',1,96),(225,'Example_2',2,96),(226,'Example_3',3,96),(227,'Example_4',4,96),(228,'Example_5',5,96),(229,'Example_6',6,96),(230,'Example_7',7,96),(231,'Example_8',8,96),(232,'Example_9',9,96),(233,'Example_10',10,96),(234,'Example_1',1,92),(235,'Example_2',2,92),(236,'Example_3',3,92),(237,'Example_4',4,92),(238,'Example_5',5,92),(239,'Example_6',6,92),(240,'Example_7',7,92),(241,'Example_8',8,92),(242,'Example_9',9,92),(243,'Example_10',10,92),(244,'Example_1',1,97),(245,'Example_2',2,97),(246,'Example_3',3,97),(247,'Example_4',4,97),(248,'Example_5',5,97),(249,'Example_6',6,97),(250,'Example_7',7,97),(251,'Example_8',8,97),(252,'Example_9',9,97),(253,'Example_10',10,97),(254,'Example_1',1,98),(255,'Example_2',2,98),(256,'Example_3',3,98),(257,'Example_4',4,98),(258,'Example_5',5,98),(259,'Example_6',6,98),(260,'Example_7',7,98),(261,'Example_8',8,98),(262,'Example_9',9,98),(263,'Example_10',10,98),(264,'Example_1',1,99),(265,'Example_2',2,99),(266,'Example_3',3,99),(267,'Example_4',4,99),(268,'Example_5',5,99),(269,'Example_6',6,99),(270,'Example_7',7,99),(271,'Example_8',8,99),(272,'Example_9',9,99),(273,'Example_10',10,99),(274,'Example_1',1,100),(275,'Example_2',2,100),(276,'Example_3',3,100),(277,'Example_4',4,100),(278,'Example_5',5,100),(279,'Example_6',6,100),(280,'Example_7',7,100),(281,'Example_8',8,100),(282,'Example_9',9,100),(283,'Example_10',10,100),(284,'Example_1',1,101),(285,'Example_2',2,101),(286,'Example_3',3,101),(287,'Example_4',4,101),(288,'Example_5',5,101),(289,'Example_6',6,101),(290,'Example_7',7,101),(291,'Example_8',8,101),(292,'Example_9',9,101),(293,'Example_10',10,101),(294,'Example_1',1,102),(295,'Example_2',2,102),(296,'Example_3',3,102),(297,'Example_4',4,102),(298,'Example_5',5,102),(299,'Example_6',6,102),(300,'Example_7',7,102),(301,'Example_8',8,102),(302,'Example_9',9,102),(303,'Example_10',10,102),(304,'Example_1',1,103),(305,'Example_2',2,103),(306,'Example_3',3,103),(307,'Example_4',4,103),(308,'Example_5',5,103),(309,'Example_6',6,103),(310,'Example_7',7,103),(311,'Example_8',8,103),(312,'Example_9',9,103),(313,'Example_10',10,103),(314,'Example_1',1,104),(315,'Example_2',2,104),(316,'Example_3',3,104),(317,'Example_4',4,104),(318,'Example_5',5,104),(319,'Example_6',6,104),(320,'Example_7',7,104),(321,'Example_8',8,104),(322,'Example_9',9,104),(323,'Example_10',10,104),(324,'Example_1',1,108),(325,'Example_2',2,108),(326,'Example_3',3,108),(327,'Example_4',4,108),(328,'Example_5',5,108),(329,'Example_6',6,108),(330,'Example_7',7,108),(331,'Example_8',8,108),(332,'Example_9',9,108),(333,'Example_10',10,108),(334,'Example_1',1,109),(335,'Example_2',2,109),(336,'Example_3',3,109),(337,'Example_4',4,109),(338,'Example_5',5,109),(339,'Example_6',6,109),(340,'Example_7',7,109),(341,'Example_8',8,109),(342,'Example_9',9,109),(343,'Example_10',10,109),(344,'Example_1',1,110),(345,'Example_2',2,110),(346,'Example_3',3,110),(347,'Example_4',4,110),(348,'Example_5',5,110),(349,'Example_6',6,110),(350,'Example_7',7,110),(351,'Example_8',8,110),(352,'Example_9',9,110),(353,'Example_10',10,110),(354,'Example_1',1,111),(355,'Example_2',2,111),(356,'Example_3',3,111),(357,'Example_4',4,111),(358,'Example_5',5,111),(359,'Example_6',6,111),(360,'Example_7',7,111),(361,'Example_8',8,111),(362,'Example_9',9,111),(363,'Example_10',10,111),(364,'Example_1',1,112),(365,'Example_2',2,112),(366,'Example_3',3,112),(367,'Example_4',4,112),(368,'Example_5',5,112),(369,'Example_6',6,112),(370,'Example_7',7,112),(371,'Example_8',8,112),(372,'Example_9',9,112),(373,'Example_10',10,112),(374,'Example_1',1,113),(375,'Example_2',2,113),(376,'Example_3',3,113),(377,'Example_4',4,113),(378,'Example_5',5,113),(379,'Example_6',6,113),(380,'Example_7',7,113),(381,'Example_8',8,113),(382,'Example_9',9,113),(383,'Example_10',10,113),(384,'Example_1',1,105),(385,'Example_2',2,105),(386,'Example_3',3,105),(387,'Example_4',4,105),(388,'Example_5',5,105),(389,'Example_6',6,105),(390,'Example_7',7,105),(391,'Example_8',8,105),(392,'Example_9',9,105),(393,'Example_10',10,105),(394,'Example_1',1,106),(395,'Example_2',2,106),(396,'Example_3',3,106),(397,'Example_4',4,106),(398,'Example_5',5,106),(399,'Example_6',6,106),(400,'Example_7',7,106),(401,'Example_8',8,106),(402,'Example_9',9,106),(403,'Example_10',10,106),(404,'Example_1',1,107),(405,'Example_2',2,107),(406,'Example_3',3,107),(407,'Example_4',4,107),(408,'Example_5',5,107),(409,'Example_6',6,107),(410,'Example_7',7,107),(411,'Example_8',8,107),(412,'Example_9',9,107),(413,'Example_10',10,107),(414,'Example_1',1,114),(415,'Example_2',2,114),(416,'Example_3',3,114),(417,'Example_4',4,114),(418,'Example_5',5,114),(419,'Example_6',6,114),(420,'Example_7',7,114),(421,'Example_8',8,114),(422,'Example_9',9,114),(423,'Example_10',10,114),(424,'Example_1',1,115),(425,'Example_2',2,115),(426,'Example_3',3,115),(427,'Example_4',4,115),(428,'Example_5',5,115),(429,'Example_6',6,115),(430,'Example_7',7,115),(431,'Example_8',8,115),(432,'Example_9',9,115),(433,'Example_10',10,115),(434,'Example_1',1,116),(435,'Example_2',2,116),(436,'Example_3',3,116),(437,'Example_4',4,116),(438,'Example_5',5,116),(439,'Example_6',6,116),(440,'Example_7',7,116),(441,'Example_8',8,116),(442,'Example_9',9,116),(443,'Example_10',10,116),(444,'Example_1',1,117),(445,'Example_2',2,117),(446,'Example_3',3,117),(447,'Example_4',4,117),(448,'Example_5',5,117),(449,'Example_6',6,117),(450,'Example_7',7,117),(451,'Example_8',8,117),(452,'Example_9',9,117),(453,'Example_10',10,117),(454,'Example_1',1,118),(455,'Example_2',2,118),(456,'Example_3',3,118),(457,'Example_4',4,118),(458,'Example_5',5,118),(459,'Example_6',6,118),(460,'Example_7',7,118),(461,'Example_8',8,118),(462,'Example_9',9,118),(463,'Example_10',10,118),(464,'Example_1',1,119),(465,'Example_2',2,119),(466,'Example_3',3,119),(467,'Example_4',4,119),(468,'Example_5',5,119),(469,'Example_6',6,119),(470,'Example_7',7,119),(471,'Example_8',8,119),(472,'Example_9',9,119),(473,'Example_10',10,119),(474,'Example_1',1,120),(475,'Example_2',2,120),(476,'Example_3',3,120),(477,'Example_4',4,120),(478,'Example_5',5,120),(479,'Example_6',6,120),(480,'Example_7',7,120),(481,'Example_8',8,120),(482,'Example_9',9,120),(483,'Example_10',10,120),(484,'Example_1',1,121),(485,'Example_2',2,121),(486,'Example_3',3,121),(487,'Example_4',4,121),(488,'Example_5',5,121),(489,'Example_6',6,121),(490,'Example_7',7,121),(491,'Example_8',8,121),(492,'Example_9',9,121),(493,'Example_10',10,121),(494,'Example_1',1,122),(495,'Example_2',2,122),(496,'Example_3',3,122),(497,'Example_4',4,122),(498,'Example_5',5,122),(499,'Example_6',6,122),(500,'Example_7',7,122),(501,'Example_8',8,122),(502,'Example_9',9,122),(503,'Example_10',10,122),(504,'Example_1',1,123),(505,'Example_2',2,123),(506,'Example_3',3,123),(507,'Example_4',4,123),(508,'Example_5',5,123),(509,'Example_6',6,123),(510,'Example_7',7,123),(511,'Example_8',8,123),(512,'Example_9',9,123),(513,'Example_10',10,123),(514,'Example_11',11,113),(515,'Example_12',12,113),(516,'Example_13',13,113),(517,'Example_14',14,113),(518,'Example_15',15,113),(519,'Example_1',1,124),(520,'Example_2',2,124),(521,'Example_3',3,124),(522,'Example_4',4,124),(523,'Example_5',5,124),(524,'Example_6',6,124),(525,'Example_7',7,124),(526,'Example_8',8,124),(527,'Example_9',9,124),(528,'Example_10',10,124),(529,'Example_1',1,125),(530,'Example_2',2,125),(531,'Example_3',3,125),(532,'Example_4',4,125),(533,'Example_5',5,125),(534,'Example_6',6,125),(535,'Example_7',7,125),(536,'Example_8',8,125),(537,'Example_9',9,125),(538,'Example_10',10,125);
/*!40000 ALTER TABLE `example` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `section`
--

DROP TABLE IF EXISTS `section`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `section` (
  `section_id` int(11) NOT NULL AUTO_INCREMENT,
  `section_name` varchar(100) NOT NULL,
  `order` int(11) NOT NULL,
  `tid` int(11) NOT NULL,
  PRIMARY KEY (`section_id`),
  UNIQUE KEY `section_id_UNIQUE` (`section_id`),
  KEY `tid_idx` (`tid`),
  CONSTRAINT `tid` FOREIGN KEY (`tid`) REFERENCES `topic` (`tid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=126 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `section`
--

LOCK TABLES `section` WRITE;
/*!40000 ALTER TABLE `section` DISABLE KEYS */;
INSERT INTO `section` VALUES (80,'Terminology',1,21),(81,'Autonomous_Systems',1,22),(82,'Slope_Fields_and_Solution_Curves',3,21),(83,'Separable',2,22),(84,'Linear',3,22),(85,'Bernoulli',4,22),(86,'Exact',5,22),(87,'Homogeneous_Substitution',6,22),(88,'EulerAPOSTROPHEs_Method',8,22),(90,'Linear_Substitution',7,22),(91,'The_Principle_of_Superposition',2,23),(92,'Constant_Coefficient_and_Linear',4,23),(93,'Linear_Independence',1,23),(94,'Reduction_of_Order',3,23),(95,'Method_of_Undetermined_Coefficients',5,23),(96,'Annihilator_Method',6,23),(97,'CauchyANDEuler',8,23),(98,'Variation_of_Parameters',9,23),(99,'Power_Series_Solutions',7,23),(100,'Laplace_Transforms',10,23),(101,'Power_Rule',3,24),(102,'Product_Rule',4,24),(103,'Quotient_Rule',5,24),(104,'Chain_Rule',6,24),(105,'Introduction',1,24),(106,'Implicit_Differentiation',7,24),(107,'Logarithmic_Differentiation',8,24),(108,'Introduction',1,25),(109,'OneANDSided_Limits',2,25),(110,'Limit_Properties',3,25),(111,'Limits_with_Infinity',4,25),(112,'Continuity',5,25),(113,'Formal_Definitions',6,25),(114,'Common_Derivatives_and_Properties',2,24),(115,'Implications_of_the_First_Derivative',2,26),(116,'Implications_of_the_Second_Derivative',3,26),(117,'Absolute_Extremas',4,26),(118,'Optimization',6,26),(119,'Linear_Approximation',7,26),(120,'LAPOSTROPHEHospitalAPOSTROPHEs_Rule',8,26),(121,'The_Mean_Value_Theorem',1,26),(122,'NewtonAPOSTROPHEs_Method',9,26),(123,'Related_Rates',5,26),(124,'Secant_Method',10,26),(125,'HalleyAPOSTROPHEs_Method',11,26);
/*!40000 ALTER TABLE `section` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subject`
--

DROP TABLE IF EXISTS `subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subject` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `sname` varchar(100) NOT NULL,
  `order` int(11) NOT NULL,
  PRIMARY KEY (`sid`),
  UNIQUE KEY `sid_UNIQUE` (`sid`),
  UNIQUE KEY `sname_UNIQUE` (`sname`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject`
--

LOCK TABLES `subject` WRITE;
/*!40000 ALTER TABLE `subject` DISABLE KEYS */;
INSERT INTO `subject` VALUES (5,'Ordinary_Differential_Equations',5),(6,'Differential_Calculus',1);
/*!40000 ALTER TABLE `subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `topic`
--

DROP TABLE IF EXISTS `topic`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `topic` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `tname` varchar(100) NOT NULL,
  `order` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  PRIMARY KEY (`tid`),
  UNIQUE KEY `tid_UNIQUE` (`tid`),
  KEY `sid_idx` (`sid`),
  CONSTRAINT `sid` FOREIGN KEY (`sid`) REFERENCES `subject` (`sid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topic`
--

LOCK TABLES `topic` WRITE;
/*!40000 ALTER TABLE `topic` DISABLE KEYS */;
INSERT INTO `topic` VALUES (21,'Introduction',1,5),(22,'First_Order',2,5),(23,'Second_Order',3,5),(24,'The_Derivative',2,6),(25,'Limits',1,6),(26,'Applications_of_the_Derivative',3,6);
/*!40000 ALTER TABLE `topic` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-02-27  2:46:26
