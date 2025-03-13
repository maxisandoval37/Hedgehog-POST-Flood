let intervalId = null;
const glitchToggle = document.getElementById("glitchToggle");

const audio = new Audio("resources/loop.mp3");

function redirectToHTTPS() {
    let urlHTTP = "http://";
    let urlCurrent = location.href;
    if (urlCurrent.includes(urlHTTP) && !(isLocalHost(urlCurrent))) {
        location.href = urlCurrent.replace("http", "https");
    }
}

function isLocalHost(str){
    return ((/\d/.test(str)) || (str.includes("local")));
}

function closeModal() {
    document.getElementById("warningModal").style.display = "none";
}

function addField() {
    const fieldsDiv = document.getElementById("fields");
    const div = document.createElement("div");
    div.classList.add("flex", "space-x-2");

    const inputName = document.createElement("input");
    inputName.type = "text";
    inputName.placeholder = "Field name";
    inputName.required = true;
    inputName.classList.add("w-1/2", "p-2", "border", "border-gray-300", "rounded-md", "text-black");

    const inputValue = document.createElement("input");
    inputValue.type = "text";
    inputValue.placeholder = "Value";
    inputValue.required = true;
    inputValue.classList.add("w-1/2", "p-2", "border", "border-gray-300", "rounded-md", "text-black");

    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
    removeBtn.type = "button";
    removeBtn.classList.add("bg-red-500", "text-white", "px-3", "rounded-md", "hover:bg-red-600", "transition");
    removeBtn.onclick = () => div.remove();

    div.appendChild(inputName);
    div.appendChild(inputValue);
    div.appendChild(removeBtn);
    fieldsDiv.appendChild(div);
}

async function sendRequest() {
    const url = document.getElementById("url").value.trim();
    if (!url) {
        logMessage("⚠️ Please enter a valid URL.");
        stopLoop();
        return;
    }

    const formData = new FormData();
    document.querySelectorAll("#fields div").forEach(div => {
        const inputs = div.getElementsByTagName("input");
        if (inputs[0].value && inputs[1].value) {
            formData.append(inputs[0].value, inputs[1].value);
        }
    });

    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData
        });

        const result = await response.text();
        logMessage(`✅ Response (${new Date().toLocaleTimeString()}): ${result}`);
    } catch (error) {
        logMessage(`❌ Error (${new Date().toLocaleTimeString()}): ${error.message}`);
    }
}

function logMessage(message) {
    const logArea = document.getElementById("log");
    logArea.value += message + "\n";
    logArea.scrollTop = logArea.scrollHeight;
}

function playLoopMusic() {
    audio.addEventListener("timeupdate", () => {
        if (audio.currentTime >= 16) {
            audio.currentTime = 14.5135;
        }
    });

    audio.play();
}

function startLoop() {
    stopLoop();

    const interval = parseInt(document.getElementById("interval").value, 10) || 1000;
    intervalId = setInterval(sendRequest, interval);
    logMessage("🔄 Looping request started...");

    glitchToggle.disabled = true;
    
    if (glitchToggle.checked) {
        document.body.classList.add("glitch-effect");
        
        playLoopMusic();
    }
}

function stopLoop() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        logMessage("🛑 Request stopped.");

        document.body.classList.remove("glitch-effect");
        glitchToggle.disabled = false;
        audio.pause();
    }
}