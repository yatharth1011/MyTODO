let currentUser = null;

const homeworkData = [
    {
        day: 1,
        tasks: [
            { id: "mathDay1", text: "Solve 49 questions (Math)" },
            { id: "physicsDay1", text: "Solve 35 questions (Physics)" },
            { id: "iocDay1", text: "Solve 11 questions (IOC)" },
            { id: "extraIocDay1", text: "Extra Bounty Questions" },
            { id: "ocDay1", text: "Solve 5 questions (OC)" },
            { id: "pcDay1", text: "Solve 20 questions (PC)" },
        ],
    },
    {
        day: 2,
        tasks: [
            { id: "mathDay2", text: "Solve 49 questions (Math)" },
            { id: "physicsDay2", text: "Solve 35 questions (Physics)" },
            { id: "iocDay2", text: "Solve 11 questions (IOC)" },
            { id: "extraIocDay2", text: "Extra Bounty Questions" },
            { id: "ocDay2", text: "Solve 5 questions (OC)" },
            { id: "pcDay2", text: "Solve 20 questions (PC)" },
        ],
    },
    {
        day: 3,
        tasks: [
            { id: "mathDay3", text: "Solve 49 questions (Math)" },
            { id: "physicsDay3", text: "Solve 35 questions (Physics)" },
            { id: "iocDay3", text: "Solve 11 questions (IOC)" },
            { id: "extraIocDay3", text: "Extra Bounty Questions" },
            { id: "ocDay3", text: "Solve 5 questions (OC)" },
            { id: "pcDay3", text: "Solve 20 questions (PC)" },
        ],
    },
    {
        day: 4,
        tasks: [
            { id: "mathDay4", text: "Solve 49 questions (Math)" },
            { id: "physicsDay4", text: "Solve 35 questions (Physics)" },
            { id: "iocDay4", text: "Solve 11 questions (IOC)" },
            { id: "extraIocDay4", text: "Extra Bounty Questions" },
            { id: "ocDay4", text: "Solve 5 questions (OC)" },
            { id: "pcDay4", text: "Solve 20 questions (PC)" },
        ],
    },
    {
        day: 5,
        tasks: [
            { id: "mathDay5", text: "Solve 49 questions (Math)" },
            { id: "physicsDay5", text: "Solve 35 questions (Physics)" },
            { id: "iocDay5", text: "Solve 11 questions (IOC)" },
            { id: "extraIocDay5", text: "Extra Bounty Questions" },
            { id: "ocDay5", text: "Solve 5 questions (OC)" },
            { id: "pcDay5", text: "Solve 20 questions (PC)" },
        ],
    },
    {
        day: 6,
        tasks: [
            { id: "mathDay6", text: "Solve 49 questions (Math)" },
            { id: "physicsDay6", text: "Solve 35 questions (Physics)" },
            { id: "iocDay6", text: "Solve 11 questions (IOC)" },
            { id: "extraIocDay6", text: "Extra Bounty Questions" },
            { id: "ocDay6", text: "Solve 5 questions (OC)" },
            { id: "pcDay6", text: "Solve 20 questions (PC)" },
        ],
    },
];

function createDayElement(day) {
    const dayElement = document.createElement("div");
    dayElement.className = "day";

    const dayTitle = document.createElement("h2");
    dayTitle.className = "day-title";
    dayTitle.textContent = `Day ${day.day}`;
    dayElement.appendChild(dayTitle);

    day.tasks.forEach((task) => {
        const checkboxContainer = document.createElement("div");
        checkboxContainer.className = "checkbox-container";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = task.id;

        const label = document.createElement("label");
        label.htmlFor = task.id;
        label.textContent = task.text;

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);

        if (task.text.includes("Extra Bounty Questions")) {
            const bountyInput = document.createElement("input");
            bountyInput.type = "number";
            bountyInput.min = "0";
            bountyInput.className = "bounty-input";
            bountyInput.id = `bounty-${task.id}`;
            checkboxContainer.appendChild(bountyInput);

            bountyInput.addEventListener("change", () => {
                saveProgress();
            });
        }

        dayElement.appendChild(checkboxContainer);

        checkbox.addEventListener("change", () => {
            saveProgress();
        });
    });

    return dayElement;
}

function initializeTracker() {
    const trackerContent = document.getElementById("tracker-content");
    trackerContent.innerHTML = "";
    homeworkData.forEach((day) => {
        const dayElement = createDayElement(day);
        trackerContent.appendChild(dayElement);
    });
    loadProgress();
}

function saveProgress() {
    if (!currentUser) return;

    const progress = {};
    homeworkData.forEach((day) => {
        day.tasks.forEach((task) => {
            const checkbox = document.getElementById(task.id);
            progress[task.id] = checkbox.checked;

            if (task.text.includes("Extra Bounty Questions")) {
                const bountyInput = document.getElementById(
                    `bounty-${task.id}`,
                );
                progress[`bounty-${task.id}`] = bountyInput.value;
            }
        });
    });

    fetch("/save-progress", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: currentUser, progress: progress }),
    });
}

function loadProgress() {
    if (!currentUser) return;

    fetch(`/load-progress?username=${currentUser}`)
        .then((response) => response.json())
        .then((progress) => {
            homeworkData.forEach((day) => {
                day.tasks.forEach((task) => {
                    const checkbox = document.getElementById(task.id);
                    checkbox.checked = progress[task.id] || false;

                    if (task.text.includes("Extra Bounty Questions")) {
                        const bountyInput = document.getElementById(
                            `bounty-${task.id}`,
                        );
                        bountyInput.value = progress[`bounty-${task.id}`] || "";
                    }
                });
            });
        });
}

function signUp() {
    const username = document.getElementById("sign-up-username").value;
    const password = document.getElementById("sign-up-password").value;

    fetch("/sign-up", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert("Sign up successful! Please sign in.");
            } else {
                alert("Sign up failed. Please try again.");
            }
        });
}

function signIn() {
    const username = document.getElementById("sign-in-username").value;
    const password = document.getElementById("sign-in-password").value;

    fetch("/sign-in", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                currentUser = username;
                document.getElementById("auth-container").style.display =
                    "none";
                document.getElementById("user-info").style.display = "block";
                document.getElementById("username-display").textContent =
                    username;
                document.getElementById("tracker-content").style.display =
                    "block";
                initializeTracker();
            } else {
                alert("Sign in failed. Please check your credentials.");
            }
        });
}

function signOut() {
    currentUser = null;
    document.getElementById("auth-container").style.display = "flex";
    document.getElementById("user-info").style.display = "none";
    document.getElementById("tracker-content").style.display = "none";
}

document.getElementById("sign-up-button").addEventListener("click", signUp);
document.getElementById("sign-in-button").addEventListener("click", signIn);
document.getElementById("sign-out-button").addEventListener("click", signOut);

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("auth-container").style.display = "flex";
});
