const startButton = document.getElementById("startButton");
const gameArea = document.getElementById("gameArea");
const scoreElement = document.getElementById("score");
const timeElement = document.getElementById("time");
const gameMessage = document.getElementById("gameMessage");

let score = 0;
let timeLeft = 30;
let timer = null;
let targetTimer = null;
let isPlaying = false;

function randomPosition(target) {
  const maxX = gameArea.clientWidth - target.offsetWidth;
  const maxY = gameArea.clientHeight - target.offsetHeight;

  const x = Math.max(0, Math.random() * maxX);
  const y = Math.max(0, Math.random() * maxY);

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
}

function removeTarget() {
  const currentTarget = gameArea.querySelector(".target");

  if (currentTarget) {
    currentTarget.remove();
  }
}

function createTarget() {
  if (!isPlaying) {
    return;
  }

  removeTarget();

  const target = document.createElement("button");
  target.className = "target";

  const isCat = Math.random() < 0.15;

  target.textContent = isCat ? "🐱" : "🐛";
  target.setAttribute(
    "aria-label",
    isCat ? "Cat" : "Bug"
  );

  target.addEventListener("click", () => {
    if (!isPlaying) {
      return;
    }

    if (isCat) {
      gameMessage.textContent =
        "That's not a bug. Leave the cat alone. 😾";

      gameMessage.style.pointerEvents = "none";

      setTimeout(() => {
        if (isPlaying) {
          gameMessage.textContent = "";
        }
      }, 900);
    } else {
      score += 1;
      scoreElement.textContent = score;
    }

    createTarget();
  });

  gameArea.appendChild(target);

  requestAnimationFrame(() => {
    randomPosition(target);
  });
}
const displayTime = isCat ? 4000 : 1200;

targetTimer = setTimeout(() => {
  if (isPlaying && target.isConnected) {
    createTarget();
  }
}, displayTime);

function endGame() {
  isPlaying = false;

  clearInterval(timer);
  clearTimeout(targetTimer);

  removeTarget();

  startButton.disabled = false;
  startButton.textContent = "Play again";

  let message = `You fixed ${score} bugs.`;

  if (score >= 20) {
    message += " Impressive. Maybe I should hire you to finish the website. 😄";
  } else if (score >= 10) {
    message += " Nice work! 🐛";
  } else {
    message += " The bugs won this round.";
  }

  gameMessage.textContent = message;
}

function startGame() {
  score = 0;
  timeLeft = 30;
  isPlaying = true;

  scoreElement.textContent = score;
  timeElement.textContent = timeLeft;
  gameMessage.textContent = "";

  startButton.disabled = true;
  startButton.textContent = "Game running...";

  createTarget();

  timer = setInterval(() => {
    timeLeft -= 1;
    timeElement.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

startButton.addEventListener("click", startGame);