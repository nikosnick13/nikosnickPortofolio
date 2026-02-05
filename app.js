import { help, whoami, socialMedia, whois, errorMessage, projects } from "./commands.js";


const terminal = document.querySelector(".terminal_output_area");

async function commander(cmd) {
  switch (cmd.toLowerCase()) {
    
    case "help":
      await loopLines(help, "color2 margin", 80, createPrompt);
      break;
    case "whoami":
      await loopLines(whoami, "color2 margin", 90, createPrompt);
      break;
    case "whois":
      await loopLines(whois, "color2 margin", 90, createPrompt);
      break;
    case "social":
      await loopLines(socialMedia, "color2 margin", 80, createPrompt);
      break;
    case "projects":
      await loopLines(projects, "color2 margin", 80, createPrompt);
      break;
    case "clear":
      terminal.innerHTML = "";
      await createPrompt();
      break;
    default:
      await typeLine(errorMessage[0], "color2 margin", 7, createPrompt);
      break;
  }
}




function loopLines(lines, className, delay, callback) {
  lines.forEach((line, i) => {
    const delayTime = lines.length === 1 ? delay : i * delay;

    setTimeout(() => {
      console.log(`Displaying line: ${line}`);
      const div = document.createElement("div");
      div.className = className;
      div.innerHTML = line;
      terminal.appendChild(div);

      if (i === lines.length - 1 && typeof callback === "function") {
        callback();
      }
    }, delayTime);
  });
}

function typeLine(line, className, charDelay, callback) {
  const div = document.createElement("div");
  div.className = className;
  terminal.appendChild(div);

  let i = 0;
  const interval = setInterval(() => {
    div.innerHTML += line.charAt(i);
    i++;
    if (i >= line.length) {
      clearInterval(interval);
      if (typeof callback === "function") callback();
    }
  }, charDelay);
}

let history = [];
let historyIndex = -1;

function createPrompt() {

  document.querySelectorAll(".input-area").forEach(el => {
    el.classList.remove("blinking-cursor");
  });
  const wrapper = document.createElement("div");
  wrapper.className = "terminal_promnt flex gap-1 px-2 py-1 text-[#00ff00]";

  // Δημιουργούμε input τύπου contenteditable div
  const inputDiv = document.createElement("div");
  inputDiv.contentEditable = true;
  inputDiv.className = "input-area ";
  inputDiv.classList.add("blinking-cursor");
  wrapper.innerHTML = `   
    <span>visitor@CyberPirate:</span>
    <span>~</span>
    <span>$</span>
  `;

  wrapper.appendChild(inputDiv);
  terminal.appendChild(wrapper);

  inputDiv.focus();

  inputDiv.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // να μην κάνει newline
      const command = inputDiv.innerText.trim();
      if (command) {
        history.push(command);
        historyIndex = history.length;
        inputDiv.contentEditable = false;
        const echo = document.createElement("div");
        terminal.appendChild(echo);
        commander(command);
      }

    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        inputDiv.innerText = history[historyIndex];
        placeCaretAtEnd(inputDiv);
      }
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        inputDiv.innerText = history[historyIndex];
      } else {
        historyIndex = history.length;
        inputDiv.innerText = "";
      }
      placeCaretAtEnd(inputDiv);
    }
    //Fix: Καθάρισε εσωτερικά τα <br> όταν το input είναι άδειο
    setTimeout(() => {
      if (inputDiv.innerText.trim() === "") {
        inputDiv.innerHTML = "";
      }
    }, 0);
  });
}
function placeCaretAtEnd(el) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
  el.focus();
}
createPrompt();
