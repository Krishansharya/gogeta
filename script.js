async function checkMessage() {
    const message = document.getElementById('messageInput').value;
    const result = document.getElementById('result');
    const allMessagesDiv = document.getElementById('allMessages');
    const spamMessagesDiv = document.getElementById('spamMessages');
    const combinedMessagesDiv = document.getElementById('combinedMessages');

    try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });

        if (!response.ok) {
            throw new Error('Failed to classify message');
        }

        const data = await response.json();
        const isSpam = data.isSpam;

        const messageElement = createMessageElement(message, isSpam);

        if (isSpam) {
            result.textContent = "Spam detected!";
            result.style.color = "red";
            spamMessagesDiv.appendChild(messageElement);
            combinedMessagesDiv.appendChild(messageElement.cloneNode(true));
        } else {
            result.textContent = "No spam detected.";
            result.style.color = "green";
            allMessagesDiv.appendChild(messageElement);
            combinedMessagesDiv.appendChild(messageElement.cloneNode(true));
        }

        document.getElementById('messageInput').value = '';
    } catch (error) {
        console.error('Error:', error.message);
        result.textContent = "Error classifying message";
        result.style.color = "orange";
    }
}

function createMessageElement(message, isSpam) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.classList.add('message');

    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('message-buttons');

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteMessage(messageElement, isSpam);

    const undoButton = document.createElement('button');
    undoButton.textContent = 'Undo';
    undoButton.style.display = 'none';
    undoButton.onclick = () => undoDeleteMessage(messageElement, isSpam);

    buttonsDiv.appendChild(deleteButton);
    buttonsDiv.appendChild(undoButton);

    messageElement.appendChild(buttonsDiv);

    return messageElement;
}

function deleteMessage(messageElement, isSpam) {
    const parentDiv = messageElement.parentElement;
    parentDiv.removeChild(messageElement);
    deletedMessages.push({ messageElement, isSpam });
    updateUndoButton();
}

function undoDeleteMessage(messageElement, isSpam) {
    const parentDiv = isSpam ? document.getElementById('spamMessages') : document.getElementById('allMessages');
    parentDiv.appendChild(messageElement);
    deletedMessages = deletedMessages.filter(msg => msg.messageElement !== messageElement);
    updateUndoButton();
}

function updateUndoButton() {
    if (deletedMessages.length > 0) {
        const lastDeletedMessage = deletedMessages[deletedMessages.length - 1];
        const messageElement = lastDeletedMessage.messageElement;
        const undoButton = messageElement.querySelector('.message-buttons button:nth-child(2)');
        undoButton.style.display = 'inline-block';
    }
}

function searchMessages() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const allMessagesDiv = document.getElementById('allMessages');
    const spamMessagesDiv = document.getElementById('spamMessages');
    const combinedMessagesDiv = document.getElementById('combinedMessages');

    const allMessages = allMessagesDiv.getElementsByClassName('message');
    const spamMessages = spamMessagesDiv.getElementsByClassName('message');
    const combinedMessages = combinedMessagesDiv.getElementsByClassName('message');

    filterMessages(allMessages, searchInput);
    filterMessages(spamMessages, searchInput);
    filterMessages(combinedMessages, searchInput);
}

function filterMessages(messages, searchInput) {
    for (let message of messages) {
        const messageText = message.firstChild.textContent.toLowerCase();
        if (messageText.includes(searchInput)) {
            message.style.display = 'block';
        } else {
            message.style.display = 'none';
        }
    }
}

function showAllMessages() {
    document.getElementById('allMessagesColumn').classList.add('active');
    document.getElementById('spamMessagesColumn').classList.remove('active');
    document.getElementById('combinedMessagesColumn').classList.remove('active');
}

function showSpamMessages() {
    document.getElementById('allMessagesColumn').classList.remove('active');
    document.getElementById('spamMessagesColumn').classList.add('active');
    document.getElementById('combinedMessagesColumn').classList.remove('active');
}

function showCombinedMessages() {
    document.getElementById('allMessagesColumn').classList.remove('active');
    document.getElementById('spamMessagesColumn').classList.remove('active');
    document.getElementById('combinedMessagesColumn').classList.add('active');
}

let deletedMessages = [];
