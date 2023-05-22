const mysql = require('mysql2');
const readline = require('readline');

// Configurações da conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'username',
  password: 'password',
  database: 'database_name',
});

// Interface readline para ler entradas do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Função para criar uma nova conta
function criarNovaConta() {
  rl.question('Digite o nome: ', (nome) => {
    rl.question('Digite a data de nascimento (AAAA-MM-DD): ', (dataNascimento) => {
      rl.question('Digite o valor inicial: ', (valorInicial) => {
        const query = `INSERT INTO Contas (nome, data_nascimento, valor_conta) VALUES (?, ?, ?)`;
        const values = [nome, dataNascimento, valorInicial];

        connection.query(query, values, (error, results) => {
          if (error) {
            console.error('Erro ao criar nova conta:', error);
          } else {
            console.log('Nova conta criada com sucesso!');
          }

          exibirMenu(); // Chama o menu novamente após a conclusão da tarefa
        });
      });
    });
  });
}

// Função para depositar em uma conta
function depositar() {
  rl.question('Digite o nome da conta: ', (nome) => {
    rl.question('Digite o valor a ser depositado: ', (valor) => {
      const query = `UPDATE Contas SET valor_conta = valor_conta + ? WHERE nome = ?`;
      const values = [valor, nome];

      connection.query(query, values, (error, results) => {
        if (error) {
          console.error('Erro ao depositar:', error);
        } else {
          console.log('Depósito realizado com sucesso!');
        }

        exibirMenu(); // Chama o menu novamente após a conclusão da tarefa
      });
    });
  });
}

// Função para sacar de uma conta
function sacar() {
  rl.question('Digite o nome da conta: ', (nome) => {
    rl.question('Digite o valor a ser sacado: ', (valor) => {
      const query = `UPDATE Contas SET valor_conta = valor_conta - ? WHERE nome = ? AND valor_conta >= ?`;
      const values = [valor, nome, valor];

      connection.query(query, values, (error, results) => {
        if (error) {
          console.error('Erro ao sacar:', error);
        } else if (results.affectedRows === 0) {
          console.log('Saldo insuficiente para realizar o saque.');
        } else {
          console.log('Saque realizado com sucesso!');
        }

        exibirMenu(); // Chama o menu novamente após a conclusão da tarefa
      });
    });
  });
}

// Função para transferir entre contas
function transferir() {
  rl.question('Digite o nome da conta de origem: ', (origem) => {
    rl.question('Digite o nome da conta de destino: ', (destino) => {
      rl.question('Digite o valor a ser transferido: ', (valor) => {
        const query = `UPDATE Contas SET valor_conta = valor_conta - ? WHERE nome = ? AND valor_conta >= ?`;
        const values = [valor, origem, valor];

        connection.query(query, values, (error, results) => {
          if (error) {
            console.error('Erro ao transferir:', error);
            return;
          }

          if (results.affectedRows === 0) {
            console.log('Saldo insuficiente para realizar a transferência.');
            exibirMenu(); // Chama o menu novamente após a conclusão da tarefa
            return;
          }

          const queryDestino = `UPDATE Contas SET valor_conta = valor_conta + ? WHERE nome = ?`;
          const valuesDestino = [valor, destino];

          connection.query(queryDestino, valuesDestino, (error, results) => {
            if (error) {
              console.error('Erro ao transferir:', error);
            } else {
              console.log('Transferência realizada com sucesso!');
            }

            exibirMenu(); // Chama o menu novamente após a conclusão da tarefa
          });
        });
      });
    });
  });
}

// Função para ver o extrato de uma conta
function verExtrato() {
  rl.question('Digite o nome da conta: ', (nome) => {
    const query = `SELECT * FROM Contas WHERE nome = ?`;
    const values = [nome];

    connection.query(query, values, (error, results) => {
      if (error) {
        console.error('Erro ao obter o extrato:', error);
      } else if (results.length === 0) {
        console.log('Conta não encontrada.');
      } else {
        console.log('Extrato:');
        console.log(results[0]);
      }

      exibirMenu(); // Chama o menu novamente após a conclusão da tarefa
    });
  });
}

// Função para exibir o menu
function exibirMenu() {
  console.log('======= Sistema Bancário =======');
  console.log('1. Criar nova conta');
  console.log('2. Depositar');
  console.log('3. Sacar');
  console.log('4. Transferir');
  console.log('5. Ver extrato');
  console.log('6. Sair');

  rl.question('Digite o número da opção desejada: ', (opcao) => {
    switch (opcao) {
      case '1':
        criarNovaConta();
        break;
      case '2':
        depositar();
        break;
      case '3':
        sacar();
        break;
      case '4':
        transferir();
        break;
      case '5':
        verExtrato();
        break;
      case '6':
        console.log('Saindo do sistema...');
        rl.close();
        break;
      default:
        console.log('Opção inválida. Tente novamente.');
        exibirMenu();
        break;
    }
  });
}

// Conectar-se ao banco de dados
connection.connect((error) => {
  if (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    return;
  }

  console.log('Conexão com o banco de dados estabelecida.');

  // Exibir o menu principal
  exibirMenu();
});
