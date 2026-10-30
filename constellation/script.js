const isSymmetric = (symbols) => {
  for (let i = 0; i < Math.floor(symbols.length / 2); i++) {
    if (symbols[i] !== symbols[symbols.length - 1 - i]) {
      return false;
    }
  }
  return true;
};

const symbols = [2, 5, 7, 5, 2];

console.log(isSymmetric(symbols));

// --- интерфейс ---
if (typeof document !== "undefined") {
  const TESTS = [
    symbols,
    [4, 1, 3, 1, 4],
    [2, 5, 7, 4, 2],
    [9, 9, 9, 9],
    [1, 2],
    [6],
  ];
  const STEP = 600;

  const starsEl = document.getElementById("stars");
  const messageEl = document.getElementById("message");
  const statusEl = document.getElementById("status");
  const dropdownEl = document.getElementById("dropdown");
  const testsBtn = document.getElementById("tests-btn");
  const testsEl = document.getElementById("tests");
  const codeEl = document.getElementById("code");
  const calcBtn = document.getElementById("calc");

  let current = TESTS[0];
  let timers = [];

  const setOpen = (open) => {
    testsEl.hidden = !open;
    testsBtn.setAttribute("aria-expanded", open);
    dropdownEl.classList.toggle("dropdown--open", open);
  };

  TESTS.forEach((test) => {
    const item = document.createElement("li");
    item.className = "dropdown__item";
    item.setAttribute("role", "option");
    item.tabIndex = -1;
    item.textContent = test.join(" ");
    item.addEventListener("click", () => {
      current = test;
      codeEl.value = test.join(" ");
      render();
      setOpen(false);
      testsBtn.focus();
    });
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        item.click();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        (item.nextElementSibling || testsEl.firstElementChild).focus();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        (item.previousElementSibling || testsEl.lastElementChild).focus();
      }
    });
    testsEl.append(item);
  });

  // "2 5, 7;5 2" -> [2, 5, 7, 5, 2]; null, если ввод не из чисел
  const parseCode = (text) => {
    const parts = text.split(/[\s,;]+/).filter(Boolean);
    if (!parts.length || parts.length > 9) {
      return null;
    }
    const numbers = parts.map(Number);
    return numbers.every((n) => Number.isInteger(n)) ? numbers : null;
  };

  const render = () => {
    timers.forEach(clearTimeout);
    timers = [];
    starsEl.replaceChildren();
    current.forEach((value) => {
      const star = document.createElement("span");
      star.className = "star";
      star.textContent = value;
      starsEl.append(star);
    });
    messageEl.classList.remove("message--visible", "message--fail");
    messageEl.textContent = "";
    statusEl.textContent = "Готово к проверке";
    calcBtn.disabled = false;
  };

  const check = () => {
    const parsed = parseCode(codeEl.value);
    if (!parsed) {
      statusEl.textContent = "Введите от 1 до 9 целых чисел через пробел";
      codeEl.focus();
      return;
    }
    current = parsed;
    render();
    calcBtn.disabled = true;
    statusEl.textContent = "Сравниваю пары символов…";

    const stars = starsEl.children;
    const last = current.length - 1;
    const pairs = Math.floor(current.length / 2);

    for (let i = 0; i < pairs; i++) {
      const match = current[i] === current[last - i];
      timers.push(setTimeout(() => {
        for (const star of [stars[i], stars[last - i]]) {
          star.classList.add(match ? "star--ok" : "star--bad");
        }
      }, (i + 1) * STEP));
    }

    timers.push(setTimeout(() => {
      if (current.length % 2) {
        stars[pairs].classList.add("star--ok");
      }
      const result = isSymmetric(current);
      messageEl.textContent = result ? "Дверь открывается!" : "Созвездие нарушено";
      messageEl.classList.toggle("message--fail", !result);
      messageEl.classList.add("message--visible");
      statusEl.textContent = result
        ? "Узор симметричен"
        : "Узор нужно восстановить";
      calcBtn.disabled = false;
    }, (pairs + 1) * STEP));
  };

  testsBtn.addEventListener("click", () => {
    setOpen(testsEl.hidden);
  });
  document.addEventListener("click", (event) => {
    if (!dropdownEl.contains(event.target)) {
      setOpen(false);
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !testsEl.hidden) {
      setOpen(false);
      testsBtn.focus();
    }
  });
  codeEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      check();
    }
  });
  calcBtn.addEventListener("click", check);

  codeEl.value = current.join(" ");
  render();
}
