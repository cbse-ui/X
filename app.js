// ======================================================
// CBSE CLASS X 2026–27 WEBSITE - MAIN JAVASCRIPT
// ======================================================

// CHANGE ONLY THIS LINE when the official CBSE date/time is released.
const EXAM_DATE = "2027-02-17T10:30:00+05:30";


// ======================================================
// COUNTDOWN
// ======================================================

function countdown() {
  const now = new Date();
  const target = new Date(EXAM_DATE);

  // Get today's date in IST
  const todayParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);

  const targetParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(target);

  function getPart(parts, type) {
    return parts.find(p => p.type === type).value;
  }

  const todayIST = new Date(
    `${getPart(todayParts, "year")}-${getPart(todayParts, "month")}-${getPart(todayParts, "day")}T00:00:00`
  );

  const targetIST = new Date(
    `${getPart(targetParts, "year")}-${getPart(targetParts, "month")}-${getPart(targetParts, "day")}T00:00:00`
  );

  // Calendar-day countdown
  const days = Math.max(
    0,
    Math.round((targetIST - todayIST) / 86400000)
  );

  // Exact remaining time
  const remaining = Math.max(
    0,
    target.getTime() - now.getTime()
  );

  // Hours only within the current day
  const hours = Math.floor(
    (remaining / 3600000) % 24
  );

  const minutes = Math.floor(
    (remaining / 60000) % 60
  );

  const seconds = Math.floor(
    (remaining / 1000) % 60
  );

  const d = document.getElementById("d");
  const h = document.getElementById("h");
  const m = document.getElementById("m");
  const s = document.getElementById("s");

  if (d) d.textContent = String(days).padStart(3, "0");
  if (h) h.textContent = String(hours).padStart(2, "0");
  if (m) m.textContent = String(minutes).padStart(2, "0");
  if (s) s.textContent = String(seconds).padStart(2, "0");

  const targetText = document.getElementById("target");

  if (targetText) {
    targetText.textContent =
      new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "Asia/Kolkata"
      }).format(target) + " IST";
  }
}

// Start countdown
countdown();
setInterval(countdown, 1000);


// ======================================================
// MOBILE MENU
// ======================================================

const menuButton = document.getElementById("menu");
const header = document.querySelector("header");

if (menuButton && header) {
  menuButton.addEventListener("click", () => {
    header.classList.toggle("open");
  });
}


// ======================================================
// HOMEPAGE TIMER SCROLL ANIMATION
// ======================================================

const countdownStage = document.getElementById("countdown");
const hero = document.querySelector(".hero");
const intro = document.querySelector(".intro");

if (countdownStage && hero) {

  const tiles = Array.from(
    countdownStage.querySelectorAll(".tile")
  );

  function updateHeroAnimation() {

    const progress = Math.min(
      1,
      Math.max(
        0,
        -hero.getBoundingClientRect().top /
        (window.innerHeight * 0.78)
      )
    );

    // Move timer slightly upward
    countdownStage.style.transform =
      `translateY(${-18 * progress}px) scale(${1 - 0.16 * progress})`;

    // Fade timer away
    countdownStage.style.opacity =
      Math.max(0, 1 - 1.15 * progress);

    // Split the four timer boxes
    tiles.forEach((tile, index) => {

      const direction = index < 2 ? -1 : 1;

      const amount =
        52 *
        progress *
        (index === 0 || index === 3 ? 1 : 0.55);

      tile.style.transform =
        `translateX(${direction * amount}vw)`;
    });

    // Fade intro text
    if (intro) {
      intro.style.opacity =
        Math.max(0, 1 - 1.7 * progress);
    }
  }

  window.addEventListener(
    "scroll",
    updateHeroAnimation,
    { passive: true }
  );

  updateHeroAnimation();
}


// ======================================================
// POMODORO TIMER
// ======================================================

const pomoTime = document.getElementById("pomoTime");

if (pomoTime) {

  const startButton = document.getElementById("start");
  const pauseButton = document.getElementById("pause");
  const resetButton = document.getElementById("reset");
  const modeButtons = document.querySelectorAll(".mode");

  let secondsRemaining = 25 * 60;
  let timerRunning = false;
  let timerInterval = null;

  let selectedMode = "25";


  // Display timer
  function updatePomodoroDisplay() {

    const minutes = Math.floor(
      secondsRemaining / 60
    );

    const seconds = secondsRemaining % 60;

    pomoTime.textContent =
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0");
  }


  // Set timer
  function setPomodoroTime(minutes) {

    secondsRemaining = minutes * 60;

    updatePomodoroDisplay();
  }


  // Stop timer
  function stopPomodoro() {

    clearInterval(timerInterval);

    timerInterval = null;
    timerRunning = false;
  }


  // Start
  if (startButton) {

    startButton.addEventListener("click", () => {

      if (timerRunning) return;

      timerRunning = true;

      timerInterval = setInterval(() => {

        if (secondsRemaining <= 0) {

          stopPomodoro();

          alert("Focus session complete!");

          return;
        }

        secondsRemaining--;

        updatePomodoroDisplay();

      }, 1000);
    });
  }


  // Pause
  if (pauseButton) {

    pauseButton.addEventListener("click", () => {

      stopPomodoro();

    });
  }


  // Reset
  if (resetButton) {

    resetButton.addEventListener("click", () => {

      stopPomodoro();

      selectedMode = "25";

      setPomodoroTime(25);

      modeButtons.forEach(button => {
        button.classList.remove("activeMode");
      });

      const defaultMode =
        document.querySelector('.mode[data-m="25"]');

      if (defaultMode) {
        defaultMode.classList.add("activeMode");
      }
    });
  }


  // Mode buttons
  modeButtons.forEach(button => {

    button.addEventListener("click", () => {

      stopPomodoro();

      modeButtons.forEach(b => {
        b.classList.remove("activeMode");
      });

      button.classList.add("activeMode");

      selectedMode = button.dataset.m;

      if (selectedMode === "25") {

        setPomodoroTime(25);

      } else if (selectedMode === "50") {

        setPomodoroTime(50);

      } else if (selectedMode === "custom") {

        const customMinutes = prompt(
          "Enter focus time in minutes:",
          "35"
        );

        const minutes = Number(customMinutes);

        if (
          Number.isFinite(minutes) &&
          minutes > 0 &&
          minutes <= 180
        ) {

          setPomodoroTime(minutes);

        } else {

          // If cancelled/invalid, return to 25 minutes
          selectedMode = "25";

          setPomodoroTime(25);

          modeButtons.forEach(b => {
            b.classList.remove("activeMode");
          });

          const defaultMode =
            document.querySelector('.mode[data-m="25"]');

          if (defaultMode) {
            defaultMode.classList.add("activeMode");
          }
        }
      }
    });
  });


  // Initial display
  updatePomodoroDisplay();
}


// ======================================================
// STUDY PLANNER
// ======================================================

const tasksContainer = document.getElementById("tasks");

if (tasksContainer) {

  const subjectSelect =
    document.getElementById("sub");

  const taskInput =
    document.getElementById("txt");

  const addButton =
    document.getElementById("add");

  const progressText =
    document.getElementById("progress");

  const progressBar =
    document.getElementById("bar");


  // Load saved tasks
  let tasks = [];

  try {

    tasks = JSON.parse(
      localStorage.getItem("cbse_tasks") || "[]"
    );

    if (!Array.isArray(tasks)) {
      tasks = [];
    }

  } catch (error) {

    tasks = [];

  }


  // Save
  function saveTasks() {

    localStorage.setItem(
      "cbse_tasks",
      JSON.stringify(tasks)
    );

    renderTasks();
  }


  // Render
  function renderTasks() {

    tasksContainer.innerHTML = "";

    tasks.forEach((task, index) => {

      const row = document.createElement("div");

      row.className = "task";


      // Checkbox
      const checkbox =
        document.createElement("input");

      checkbox.type = "checkbox";
      checkbox.checked = task.done;


      // Text
      const text =
        document.createElement("span");

      text.textContent =
        `${task.sub} — ${task.txt}`;


      // Delete button
      const deleteButton =
        document.createElement("button");

      deleteButton.textContent = "Delete";


      // Checkbox event
      checkbox.addEventListener(
        "change",
        () => {

          tasks[index].done =
            checkbox.checked;

          saveTasks();
        }
      );


      // Delete event
      deleteButton.addEventListener(
        "click",
        () => {

          tasks.splice(index, 1);

          saveTasks();
        }
      );


      row.appendChild(checkbox);
      row.appendChild(text);
      row.appendChild(deleteButton);

      tasksContainer.appendChild(row);
    });


    // Progress
    const completed =
      tasks.filter(task => task.done).length;

    const total =
      tasks.length;


    if (progressText) {

      progressText.textContent =
        `${completed}/${total} completed`;
    }


    if (progressBar) {

      const percentage =
        total === 0
          ? 0
          : (completed / total) * 100;

      progressBar.style.width =
        percentage + "%";
    }
  }


  // Add task
  function addTask() {

    if (!taskInput) return;

    const text =
      taskInput.value.trim();

    if (!text) {

      taskInput.focus();

      return;
    }


    const subject =
      subjectSelect
        ? subjectSelect.value
        : "General";


    tasks.push({
      sub: subject,
      txt: text,
      done: false
    });


    taskInput.value = "";

    saveTasks();

    taskInput.focus();
  }


  // Add button
  if (addButton) {

    addButton.addEventListener(
      "click",
      addTask
    );
  }


  // Enter key
  if (taskInput) {

    taskInput.addEventListener(
      "keydown",
      event => {

        if (event.key === "Enter") {

          event.preventDefault();

          addTask();
        }
      }
    );
  }


  // Initial render
  renderTasks();
}