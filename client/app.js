// Fetch
async function fetchData(endpoint) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/${endpoint}`);
        if (!response.ok) throw new Error(`Ошибка: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        alert("Не удалось загрузить данные. Попробуйте позже.");
        return null;
    }
}

document.getElementById("loadData").addEventListener("click", async () => {
    const dataType = document.getElementById("dataType").value;
    const output = document.getElementById("output");

    const data = await fetchData(dataType);
    if (data) {
        output.innerHTML = `<pre>${JSON.stringify(data.slice(0, 10), null, 2)}</pre>`;
    }
});

// WebSocket Chat Section
const socket = io('http://localhost:4000');

document.getElementById("sendMessage").addEventListener("click", () => {
    const message = document.getElementById("message").value.trim();
    if (message) {
        socket.emit("chat message", message);
        document.getElementById("message").value = "";
    }
});

socket.on("chat message", (msg) => {
    const messages = document.getElementById("messages");
    const messageElement = document.createElement("li");
    messageElement.textContent = msg;
    messages.appendChild(messageElement);
});

// SSE Section
const eventSource = new EventSource('http://localhost:4000/events');

eventSource.onmessage = (event) => {
    const updates = document.getElementById("updates");
    const updateElement = document.createElement("p");
    updateElement.textContent = event.data;
    updates.appendChild(updateElement);
};

eventSource.onerror = () => {
    console.error("SSE соединение прервано.");
    const updates = document.getElementById("updates");
    updates.innerHTML += "<p>Ошибка SSE соединения.</p>";
};
