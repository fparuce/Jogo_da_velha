let x = document.querySelector(".x");
let o = document.querySelector(".o");
let boxes = document.querySelectorAll(".box");
let buttons = document.querySelectorAll("#buttons-container button");
let messageContainer = document.querySelector("#message");
let messageText = document.querySelector("#message p");
let secondPlayer;

//Contador de jogadas
let player1 = 0;
let player2 = 0;

//Adicionando o evento de click nos boxes
for (let i = 0; i < boxes.length; i++) {
  //Quando algúem clica na caixa
  boxes[i].addEventListener("click", function () {
    let el = checkEl(player1, player2);

    //Verifica se box já foi marcada
    if (this.childNodes.length == 0) {
      let cloneEl = el.cloneNode(true);
      this.appendChild(cloneEl);

      //Computar jogada;
      if (player1 == player2) {
        player1++;
        if (secondPlayer == "ai-player") {
          //função para incrementar jogada
          computerPlay();
          player2++;
        }
      } else {
        player2++;
      }

      //Checa quem vencer
      const result = checkWinCondition();
      if (result.winner) {
        console.log(`${result.winner} venceu o jogo!`);
        declareWinner(result.winner);
      } else if (result.draw) {
        console.log("Deu velha! Empate.");
        declareWinner(result.draw);
      } else {
        console.log("Nenhum vencedor ainda.");
      }
    }
  });
}

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    secondPlayer = this.getAttribute("id");
    for (let j = 0; j < buttons.length; j++) {
      buttons[j].style.display = "none";
    }
    setTimeout(function () {
      let container = document.querySelector("#container");
      container.classList.remove("hide");
    }, 500);
  });
}

function checkEl(player1, player2) {
  if (player1 == player2) {
    //x
    return x;
  } else {
    //o
    return o;
  }
}

function checkWinCondition() {
  // Obter todos os blocos em um array
  const blocks = Array.from({ length: 9 }, (_, i) =>
    document.getElementById(`block-${i + 1}`)
  );

  // Definir todas as combinações vencedoras possíveis
  const winCombinations = [
    [0, 1, 2], // Linha 1
    [3, 4, 5], // Linha 2
    [6, 7, 8], // Linha 3
    [0, 3, 6], // Coluna 1
    [1, 4, 7], // Coluna 2
    [2, 5, 8], // Coluna 3
    [0, 4, 8], // Diagonal principal
    [2, 4, 6], // Diagonal secundária
  ];

  for (const [a, b, c] of winCombinations) {
    // Verificar se os blocos não estão vazios e possuem o mesmo valor
    if (
      blocks[a].childNodes.length > 0 &&
      blocks[b].childNodes.length > 0 &&
      blocks[c].childNodes.length > 0
    ) {
      const valueA = blocks[a].childNodes[0].className;
      const valueB = blocks[b].childNodes[0].className;
      const valueC = blocks[c].childNodes[0].className;

      if (valueA === valueB && valueB === valueC) {
        // Alguém venceu! Retornar o vencedor ('x' ou 'o')
        return { winner: valueA };
      }
    }
  }

  // Verificar se todos os blocos estão preenchidos (empate)
  const allFilled = blocks.every((block) => block.childNodes.length > 0);
  if (allFilled) {
    return { winner: null, draw: true };
  }

  // Nenhum vencedor e o jogo ainda não terminou
  return { winner: null, draw: false };
}

//Limpa o jogo, declara vencedor e atualiza placar
function declareWinner(winner) {
  let scoreBoardX = document.querySelector("#scoreboard-1");
  let scoreBoardO = document.querySelector("#scoreboard-2");
  let msg = "";

  if (winner == "x") {
    scoreBoardX.textContent = parseInt(scoreBoardX.textContent) + 1;
    msg = "O jogador 1 venceu!";
  } else if (winner == "o") {
    scoreBoardO.textContent = parseInt(scoreBoardO.textContent) + 1;
    msg = "O jogador 2 venceu!";
  } else {
    msg = "Deu Velha!";
  }

  //exibe mensagem
  messageText.innerHTML = msg;
  messageContainer.classList.remove("hide");

  //esconde mensagem
  setTimeout(function () {
    messageContainer.classList.add("hide");
  }, 3000);

  //zerar as jogadas
  player1 = 0;
  player2 = 0;

  //limpar tabuleiro
  document.querySelectorAll(".box div").forEach((box) => box.remove());
}

//Lógica da jogada da CPU
function computerPlay() {
  const cloneO = o.cloneNode(true);
  const emptyBoxes = Array.from(boxes).filter((box) => !box.hasChildNodes());

  // Função para verificar uma linha para vitória ou bloqueio
  function findBestMove(player) {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Linhas
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Colunas
      [0, 4, 8],
      [2, 4, 6], // Diagonais
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      const values = [boxes[a], boxes[b], boxes[c]].map(
        (box) => box.firstChild?.className
      );

      // Tentar vencer
      if (
        values.filter((v) => v === player).length === 2 &&
        values.includes(undefined)
      ) {
        const emptyIndex = pattern[values.indexOf(undefined)];
        return boxes[emptyIndex];
      }
    }
    return null;
  }

  // 1. Verificar se a CPU pode vencer
  let bestMove = findBestMove("o");

  // 2. Se não puder vencer, bloquear o jogador
  if (!bestMove) {
    bestMove = findBestMove("x");
  }

  // 3. Se não houver jogadas de vitória ou bloqueio, escolher um bloco aleatório
  if (!bestMove) {
    const randomIndex = Math.floor(Math.random() * emptyBoxes.length);
    bestMove = emptyBoxes[randomIndex];
  }

  // Fazer a jogada
  if (bestMove) {
    bestMove.appendChild(cloneO);
  }
}
