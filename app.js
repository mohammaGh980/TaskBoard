const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDKlCH_ZS3sUL-znKGxmc1_qEabI7vSwMs",
    authDomain: "tracktime-app-4b4ce.firebaseapp.com",
    projectId: "tracktime-app-4b4ce",
    storageBucket: "tracktime-app-4b4ce.appspot.com",
    messagingSenderId: "67097844721",
    appId: "1:67097844721:web:4285b2b5fe813a2efdc250",
    measurementId: "G-TRPRFNXRQP"
});

const db = firebaseApp.firestore();

// Funksjon for å opprette et oppgaveelement
function createTaskElement(taskId, taskData) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.textContent = taskData.title;
    taskElement.draggable = true;
    taskElement.id = taskId;

    taskElement.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', taskId);
    });

    return taskElement;
}

// Last inn oppgaver fra Firebase
function loadTasks() {
    db.collection("tasks").onSnapshot((snapshot) => {
        document.getElementById("not-started-list").innerHTML = "";
        document.getElementById("in-progress-list").innerHTML = "";
        document.getElementById("blocked-list").innerHTML = "";
        document.getElementById("done-list").innerHTML = "";

        snapshot.forEach((doc) => {
            const taskData = doc.data();
            const taskElement = createTaskElement(doc.id, taskData);
            document.getElementById(`${taskData.status}-list`).appendChild(taskElement);
        });
    });
}

// Oppdater oppgavestatus i Firebase
function updateTaskStatus(taskId, newStatus) {
    db.collection("tasks").doc(taskId).update({
        status: newStatus
    });
}

// Legg til ny oppgave i Firebase
function addTask(title) {
    db.collection("tasks").add({
        title: title,
        status: "not-started"
    });
}
console.log( "hei");
// Vis og skjul skjema for ny oppgave
document.getElementById("add-task-btn").addEventListener("click", () => {
 
    document.getElementById("task-form-container").classList.remove("hidden");
});

document.getElementById("cancel-task-btn").addEventListener("click", () => {
    document.getElementById("task-form-container").classList.add("hidden");
    document.getElementById("task-title").value = ""; // Tømmer input-feltet
});

document.getElementById("save-task-btn").addEventListener("click", () => {
    const title = document.getElementById("task-title").value.trim();
    if (title) {
        addTask(title);
        document.getElementById("task-form-container").classList.add("hidden");
        document.getElementById("task-title").value = ""; // Tømmer input-feltet
    }
});

// Dra-og-slipp-hendelser for kolonner
['not-started', 'in-progress', 'blocked', 'done'].forEach((status) => {
    const column = document.getElementById(`${status}-list`);

    column.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    column.addEventListener('drop', (e) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
        updateTaskStatus(taskId, status);
    });
});

// Last inn oppgaver ved start
loadTasks();
