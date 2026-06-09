-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: repo_ifpa
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alunos`
--

DROP TABLE IF EXISTS `alunos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alunos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `nome_aluno` varchar(255) NOT NULL,
  `matricula_aluno` varchar(11) NOT NULL,
  `id_curso` int NOT NULL,
  `usuario_id` int DEFAULT NULL,
  `telefone` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `matricula_aluno` (`matricula_aluno`),
  KEY `usuario_id` (`usuario_id`),
  KEY `id_curso` (`id_curso`),
  CONSTRAINT `alunos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `alunos_ibfk_2` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alunos`
--

LOCK TABLES `alunos` WRITE;
/*!40000 ALTER TABLE `alunos` DISABLE KEYS */;
/*!40000 ALTER TABLE `alunos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `areas_academicas`
--

DROP TABLE IF EXISTS `areas_academicas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `areas_academicas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `codigo_area` int NOT NULL,
  `descricao_area` text NOT NULL,
  `nome_area` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `areas_academicas`
--

LOCK TABLES `areas_academicas` WRITE;
/*!40000 ALTER TABLE `areas_academicas` DISABLE KEYS */;
INSERT INTO `areas_academicas` VALUES (1,'2026-05-29 01:08:21',1,'Área Acadêmica de Exemplo','Exatas');
/*!40000 ALTER TABLE `areas_academicas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `arquivos`
--

DROP TABLE IF EXISTS `arquivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `arquivos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_meuprojeto` int DEFAULT NULL,
  `resumo` text NOT NULL,
  `justificativa` text NOT NULL,
  `objetivo` text NOT NULL,
  `sumario` text NOT NULL,
  `introducao` text NOT NULL,
  `bibliografia` text NOT NULL,
  `nome_arquivo` varchar(255) DEFAULT NULL,
  `caminho_arquivo` varchar(500) DEFAULT NULL,
  `tipo_arquivo` varchar(100) DEFAULT NULL,
  `tamanho_arquivo` int DEFAULT NULL,
  `projeto_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_meuprojeto` (`id_meuprojeto`),
  KEY `projeto_id` (`projeto_id`),
  CONSTRAINT `arquivos_ibfk_1` FOREIGN KEY (`id_meuprojeto`) REFERENCES `meusprojetos` (`id`),
  CONSTRAINT `arquivos_ibfk_2` FOREIGN KEY (`projeto_id`) REFERENCES `projetos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arquivos`
--

LOCK TABLES `arquivos` WRITE;
/*!40000 ALTER TABLE `arquivos` DISABLE KEYS */;
/*!40000 ALTER TABLE `arquivos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `codigo_matricula_pro`
--

DROP TABLE IF EXISTS `codigo_matricula_pro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `codigo_matricula_pro` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `codigo` varchar(32) NOT NULL,
  `matricula_valida` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `codigo_matricula_pro`
--

LOCK TABLES `codigo_matricula_pro` WRITE;
/*!40000 ALTER TABLE `codigo_matricula_pro` DISABLE KEYS */;
INSERT INTO `codigo_matricula_pro` VALUES (1,'2026-05-29 01:08:21','202010101122',1);
/*!40000 ALTER TABLE `codigo_matricula_pro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cursos`
--

DROP TABLE IF EXISTS `cursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cursos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `coordenador` varchar(255) NOT NULL,
  `duracao` int NOT NULL,
  `descricao_curso` text NOT NULL,
  `nome_curso` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cursos`
--

LOCK TABLES `cursos` WRITE;
/*!40000 ALTER TABLE `cursos` DISABLE KEYS */;
/*!40000 ALTER TABLE `cursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `custos`
--

DROP TABLE IF EXISTS `custos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `custos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_projeto` int NOT NULL,
  `equipamento` varchar(255) NOT NULL,
  `custos_equipamento` double NOT NULL,
  `insumos` varchar(255) NOT NULL,
  `custos_insumos` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_projeto` (`id_projeto`),
  CONSTRAINT `custos_ibfk_1` FOREIGN KEY (`id_projeto`) REFERENCES `projetos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `custos`
--

LOCK TABLES `custos` WRITE;
/*!40000 ALTER TABLE `custos` DISABLE KEYS */;
/*!40000 ALTER TABLE `custos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meusprojetos`
--

DROP TABLE IF EXISTS `meusprojetos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meusprojetos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `nome_projeto` varchar(255) NOT NULL,
  `usuarios` int NOT NULL,
  `data_publicacao` date NOT NULL,
  `area_de_pesquisa` varchar(255) NOT NULL,
  `coordenador` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `usuarios` (`usuarios`),
  CONSTRAINT `meusprojetos_ibfk_1` FOREIGN KEY (`usuarios`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meusprojetos`
--

LOCK TABLES `meusprojetos` WRITE;
/*!40000 ALTER TABLE `meusprojetos` DISABLE KEYS */;
/*!40000 ALTER TABLE `meusprojetos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_attempts`
--

DROP TABLE IF EXISTS `otp_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_attempts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `ip` varchar(100) DEFAULT NULL,
  `action` varchar(50) DEFAULT NULL,
  `success` tinyint(1) DEFAULT NULL,
  `details` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_attempts`
--

LOCK TABLES `otp_attempts` WRITE;
/*!40000 ALTER TABLE `otp_attempts` DISABLE KEYS */;
INSERT INTO `otp_attempts` VALUES (1,'thiagofcf1@gmail.com','172.18.0.1','verify',1,'purpose=login','2026-05-29 02:38:57'),(2,'thiagofcf1@gmail.com','172.18.0.1','send',1,'sent_purpose=password_reset','2026-05-29 02:39:52'),(3,'thiagofcf1@gmail.com','172.18.0.1','verify',1,'purpose=password_reset','2026-05-29 02:40:57'),(4,'thiagofcf1@gmail.com','172.18.0.1','verify',1,'purpose=login','2026-05-29 02:41:31'),(5,'thiagofcf1@gmail.com','172.18.0.1','verify',1,'purpose=login','2026-05-29 02:47:56'),(6,'thiagofcf1@gmail.com','172.18.0.1','verify',1,'purpose=login','2026-05-29 02:54:39');
/*!40000 ALTER TABLE `otp_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otps`
--

DROP TABLE IF EXISTS `otps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `code` varchar(128) NOT NULL,
  `purpose` varchar(50) DEFAULT 'generic',
  `ip` varchar(100) DEFAULT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otps`
--

LOCK TABLES `otps` WRITE;
/*!40000 ALTER TABLE `otps` DISABLE KEYS */;
INSERT INTO `otps` VALUES (1,'thiagofcf1@gmail.com','2ccedd967eb0c1cfa55d951314b1b68205e7430ca87e1d3963adb2faf95f6f31','login',NULL,'2026-05-29 02:48:28',1,'2026-05-29 02:38:28'),(2,'thiagofcf1@gmail.com','55d4a1798f31d444ed0523260b26d39efa42f2c65f2f5ed3dc2b967797a4db70','password_reset','172.18.0.1','2026-05-29 02:49:53',1,'2026-05-29 02:39:52'),(3,'thiagofcf1@gmail.com','909585e4d12998d783d5882c01b68f3d0535c89b9c628f8e4bd7cfb1c4f66481','login',NULL,'2026-05-29 02:51:05',1,'2026-05-29 02:41:04'),(4,'thiagofcf1@gmail.com','fc4293044aa94a00d8b31c5269e9592da82b4cd8492004fb04fb7d7345f8a580','login',NULL,'2026-05-29 02:57:25',1,'2026-05-29 02:47:24'),(5,'thiagofcf1@gmail.com','f1cc49c2e9f1322c73727915044897b70b29426ea657f451a83d0047ab9ee42c','login',NULL,'2026-05-29 03:04:19',1,'2026-05-29 02:54:19');
/*!40000 ALTER TABLE `otps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professores`
--

DROP TABLE IF EXISTS `professores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `nome_professor` varchar(255) NOT NULL,
  `matricula_professor` varchar(15) NOT NULL,
  `codigo_matricula` varchar(32) NOT NULL,
  `id_area` int NOT NULL,
  `usuario_id` int DEFAULT NULL,
  `telefone` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `matricula_professor` (`matricula_professor`),
  KEY `usuario_id` (`usuario_id`),
  KEY `id_area` (`id_area`),
  KEY `codigo_matricula` (`codigo_matricula`),
  CONSTRAINT `professores_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `professores_ibfk_2` FOREIGN KEY (`id_area`) REFERENCES `areas_academicas` (`id`),
  CONSTRAINT `professores_ibfk_3` FOREIGN KEY (`codigo_matricula`) REFERENCES `codigo_matricula_pro` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professores`
--

LOCK TABLES `professores` WRITE;
/*!40000 ALTER TABLE `professores` DISABLE KEYS */;
/*!40000 ALTER TABLE `professores` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=``@``*/ /*!50003 TRIGGER `trg_professores_before_insert` BEFORE INSERT ON `professores` FOR EACH ROW BEGIN
    DECLARE valid_flag INT DEFAULT 0;
    SELECT matricula_valida INTO valid_flag FROM codigo_matricula_pro WHERE codigo = NEW.codigo_matricula LIMIT 1;
    IF valid_flag IS NULL OR valid_flag = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Código de matrícula inválido ou não autorizado';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=``@``*/ /*!50003 TRIGGER `trg_professores_before_update` BEFORE UPDATE ON `professores` FOR EACH ROW BEGIN
    DECLARE valid_flag_up INT DEFAULT 0;
    IF NEW.codigo_matricula <> OLD.codigo_matricula THEN
        SELECT matricula_valida INTO valid_flag_up FROM codigo_matricula_pro WHERE codigo = NEW.codigo_matricula LIMIT 1;
        IF valid_flag_up IS NULL OR valid_flag_up = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Código de matrícula inválido ou não autorizado (update)';
        END IF;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `projetos`
--

DROP TABLE IF EXISTS `projetos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projetos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `nome_projeto` varchar(255) NOT NULL,
  `orientador` int NOT NULL,
  `coorientador` varchar(255) NOT NULL,
  `matricula_alunos` varchar(255) NOT NULL,
  `nome_autores` text,
  `tipo_projeto` varchar(100) DEFAULT 'Integrador',
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `published_at` datetime DEFAULT NULL,
  `destaque` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `orientador` (`orientador`),
  CONSTRAINT `projetos_ibfk_1` FOREIGN KEY (`orientador`) REFERENCES `professores` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projetos`
--

LOCK TABLES `projetos` WRITE;
/*!40000 ALTER TABLE `projetos` DISABLE KEYS */;
/*!40000 ALTER TABLE `projetos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registros`
--

DROP TABLE IF EXISTS `registros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registros` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_projeto` int NOT NULL,
  `data_reuniao` date NOT NULL,
  `lista_participantes` text NOT NULL,
  `duracao_reuniao` time NOT NULL,
  `titulo_reuniao` varchar(255) NOT NULL,
  `relatorio` text,
  `relatorio_edit_deadline` datetime DEFAULT NULL,
  `relatorio_edit_allowed` text,
  PRIMARY KEY (`id`),
  KEY `id_projeto` (`id_projeto`),
  CONSTRAINT `registros_ibfk_1` FOREIGN KEY (`id_projeto`) REFERENCES `projetos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registros`
--

LOCK TABLES `registros` WRITE;
/*!40000 ALTER TABLE `registros` DISABLE KEYS */;
/*!40000 ALTER TABLE `registros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turmas`
--

DROP TABLE IF EXISTS `turmas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turmas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cod_turma` varchar(50) NOT NULL,
  `turno` varchar(50) NOT NULL,
  `quantidade_alunos` int NOT NULL,
  `id_curso` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cod_turma` (`cod_turma`),
  KEY `id_curso` (`id_curso`),
  CONSTRAINT `turmas_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turmas`
--

LOCK TABLES `turmas` WRITE;
/*!40000 ALTER TABLE `turmas` DISABLE KEYS */;
/*!40000 ALTER TABLE `turmas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_projeto`
--

DROP TABLE IF EXISTS `usuario_projeto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_projeto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `projeto_id` int NOT NULL,
  `funcao` varchar(100) DEFAULT 'colaborador',
  `data_associacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_usuario_projeto` (`usuario_id`,`projeto_id`),
  KEY `projeto_id` (`projeto_id`),
  CONSTRAINT `usuario_projeto_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `usuario_projeto_ibfk_2` FOREIGN KEY (`projeto_id`) REFERENCES `projetos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_projeto`
--

LOCK TABLES `usuario_projeto` WRITE;
/*!40000 ALTER TABLE `usuario_projeto` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario_projeto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `nome_usuario` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `ativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'2026-05-29 02:38:28','thg felipe 2','thiagofcf1@gmail.com','$2b$10$Xcf.qYmUpbvpnZ7H5ibAMOdFB8F/K5kgc0RY8N/xLcjwjY5Y4XJji',1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-29  3:10:38
