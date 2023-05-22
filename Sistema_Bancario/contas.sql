CREATE TABLE Contas (
  id_conta INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  data_nascimento DATE NOT NULL,
  valor_conta DECIMAL(10, 2) NOT NULL
);
