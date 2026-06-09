CREATE DATABASE IF NOT EXISTS repo_ifpa
    DEFAULT CHARACTER SET = 'utf8mb4';

USE repo_ifpa;

SET FOREIGN_KEY_CHECKS=0;

-- Tabela de usuários (referenciando matrículas de alunos e professores)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    nome_usuario VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    ativo BOOLEAN NOT NULL -- Indica se o usuário está ativo ou não
);

-- Tabela de áreas acadêmicas
CREATE TABLE IF NOT EXISTS areas_academicas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    codigo_area INT NOT NULL,
    descricao_area TEXT NOT NULL,
    nome_area VARCHAR(255) NOT NULL
);

-- Table of allowed professor matricula codes (must exist before professors table)
CREATE TABLE IF NOT EXISTS codigo_matricula_pro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    codigo VARCHAR(32) UNIQUE NOT NULL,
    matricula_valida TINYINT(1) DEFAULT 1
);

-- Inserções iniciais sugeridas
-- Inserir uma área acadêmica de exemplo
INSERT INTO areas_academicas (codigo_area, descricao_area, nome_area)
VALUES (1, 'Área Acadêmica de Exemplo', 'Exatas');


-- Inserir código de matrícula válido para professores (conforme solicitado)
INSERT INTO codigo_matricula_pro (codigo, matricula_valida)
VALUES ('202010101122', 1);


CREATE TABLE IF NOT EXISTS professores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    nome_professor VARCHAR(255) NOT NULL,
    matricula_professor VARCHAR(15) UNIQUE NOT NULL, -- store as string up to 15 chars
    codigo_matricula VARCHAR(32) NOT NULL,
    id_area INT NOT NULL, -- Relacionado a `areas_academicas`
    usuario_id INT,
    telefone VARCHAR(20) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (id_area) REFERENCES areas_academicas(id),
    FOREIGN KEY (codigo_matricula) REFERENCES codigo_matricula_pro(codigo)
);


-- Tabela de cursos
CREATE TABLE IF NOT EXISTS cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    coordenador VARCHAR(255) NOT NULL,
    duracao INT NOT NULL,
    descricao_curso TEXT NOT NULL,
    nome_curso VARCHAR(255) NOT NULL
);

-- Tabela de turmas (relacionadas a cursos)
CREATE TABLE IF NOT EXISTS turmas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    cod_turma VARCHAR(50) UNIQUE NOT NULL, -- Código único
    turno VARCHAR(50) NOT NULL,
    quantidade_alunos INT NOT NULL,
    id_curso INT NOT NULL, -- Relacionamento obrigatório com cursos
    FOREIGN KEY (id_curso) REFERENCES cursos(id)
);


-- Tabela de alunos ()
CREATE TABLE IF NOT EXISTS alunos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    nome_aluno VARCHAR(255) NOT NULL,
    matricula_aluno VARCHAR(11) NOT NULL UNIQUE, -- store as string (exactly 11 digits expected)
    id_curso INT NOT NULL, -- Relacionado a `cursos`
    usuario_id INT,
    telefone VARCHAR(20) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (id_curso) REFERENCES cursos(id)
);

-- Tabela de projetos (agora referência para custos)
CREATE TABLE IF NOT EXISTS projetos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    nome_projeto VARCHAR(255) NOT NULL,
    orientador INT NOT NULL,
    coorientador VARCHAR(255) NOT NULL,
    matricula_alunos VARCHAR(255) NOT NULL,
    nome_autores TEXT DEFAULT NULL,
    tipo_projeto VARCHAR(100) DEFAULT 'Integrador',
    published BOOLEAN NOT NULL DEFAULT FALSE,
    published_at DATETIME DEFAULT NULL,
    destaque TINYINT(1) DEFAULT 0,
    FOREIGN KEY (orientador) REFERENCES professores(id)
);

-- Tabela de custos (agora vinculada à tabela `projetos`)
CREATE TABLE IF NOT EXISTS custos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id_projeto INT NOT NULL, -- Agora vinculado a `projetos`
    equipamento VARCHAR(255) NOT NULL,
    custos_equipamento DOUBLE NOT NULL,
    insumos VARCHAR(255) NOT NULL,
    custos_insumos DOUBLE NOT NULL,
    FOREIGN KEY (id_projeto) REFERENCES projetos(id) -- Alteração da referência
);

-- Tabela de registros (relacionada à tabela projetos)
CREATE TABLE IF NOT EXISTS registros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_projeto INT NOT NULL, -- Relacionado à tabela projetos
    data_reuniao DATE NOT NULL,
    lista_participantes TEXT NOT NULL, -- Pode ser uma lista de nomes ou IDs
    duracao_reuniao TIME NOT NULL, -- Armazena a duração no formato HH:MM:SS
    titulo_reuniao VARCHAR(255) NOT NULL,
    relatorio TEXT DEFAULT NULL,
    relatorio_edit_deadline DATETIME DEFAULT NULL,
    relatorio_edit_allowed TEXT DEFAULT NULL,
    FOREIGN KEY (id_projeto) REFERENCES projetos(id)
);

-- Tabela de meus projetos (relacionada à tabela `matricula_alunos`)
CREATE TABLE IF NOT EXISTS meusprojetos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    nome_projeto VARCHAR(255) NOT NULL,
    usuarios INT NOT NULL, -- Relacionado à tabela `matricula_alunos`
    data_publicacao DATE NOT NULL,
    area_de_pesquisa VARCHAR(255) NOT NULL,
    coordenador VARCHAR(255) NOT NULL,
    Foreign Key (usuarios) REFERENCES usuarios (id) -- Relacionamento com a tabela alunos
);

-- Tabela de arquivos (relacionada a meusprojetos e projetos)
CREATE TABLE IF NOT EXISTS arquivos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id_meuprojeto INT DEFAULT NULL,
    resumo TEXT NOT NULL,
    justificativa TEXT NOT NULL,
    objetivo TEXT NOT NULL,
    sumario TEXT NOT NULL,
    introducao TEXT NOT NULL,
    bibliografia TEXT NOT NULL,
    nome_arquivo VARCHAR(255),
    caminho_arquivo VARCHAR(500),
    tipo_arquivo VARCHAR(100),
    tamanho_arquivo INT,
    projeto_id INT DEFAULT NULL,
    FOREIGN KEY (id_meuprojeto) REFERENCES meusprojetos(id),
    FOREIGN KEY (projeto_id) REFERENCES projetos(id)
);

-- Tabela de junção: usuários e projetos (N:N)
-- Permite que um projeto tenha múltiplos usuários com diferentes papéis
CREATE TABLE IF NOT EXISTS usuario_projeto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    projeto_id INT NOT NULL,
    funcao VARCHAR(100) DEFAULT 'colaborador', -- papel do usuário no projeto (ex: proprietario, colaborador)
    data_associacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_usuario_projeto (usuario_id, projeto_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS otps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(128) NOT NULL,
  purpose VARCHAR(50) DEFAULT 'generic',
  ip VARCHAR(100),
  expires_at DATETIME NOT NULL,
  used TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS otp_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  ip VARCHAR(100),
  action VARCHAR(50),
  success TINYINT(1),
  details TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table of allowed professor matricula codes (created earlier and used by professors table)

-- Ensure triggers are recreated safely
DROP TRIGGER IF EXISTS trg_professores_before_insert;
DROP TRIGGER IF EXISTS trg_professores_before_update;

DELIMITER $$
CREATE TRIGGER trg_professores_before_insert
BEFORE INSERT ON professores
FOR EACH ROW
BEGIN
    DECLARE valid_flag INT DEFAULT 0;
    SELECT matricula_valida INTO valid_flag FROM codigo_matricula_pro WHERE codigo = NEW.codigo_matricula LIMIT 1;
    IF valid_flag IS NULL OR valid_flag = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Código de matrícula inválido ou não autorizado';
    END IF;
END$$

CREATE TRIGGER trg_professores_before_update
BEFORE UPDATE ON professores
FOR EACH ROW
BEGIN
    DECLARE valid_flag_up INT DEFAULT 0;
    IF NEW.codigo_matricula <> OLD.codigo_matricula THEN
        SELECT matricula_valida INTO valid_flag_up FROM codigo_matricula_pro WHERE codigo = NEW.codigo_matricula LIMIT 1;
        IF valid_flag_up IS NULL OR valid_flag_up = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Código de matrícula inválido ou não autorizado (update)';
        END IF;
    END IF;
END$$
DELIMITER ;

SET FOREIGN_KEY_CHECKS=1;
 
