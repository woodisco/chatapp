let username = prompt("아이디를 입력하세요");
let roomNum = prompt("채팅방 번호를 입력하세요");

const eventSource = new EventSource(`http://localhost:8080/chat/roomNum/${roomNum}}`);

eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.sender === username) { // 로그인한 유저가 보낸 메세지
        // 파란박스
        initMyMessage(data);
    } else {
        // 회색박스

    }

}

function getSendMsgBox(data) {
    return `<div class="sent_msg">
    <p>${data.msg}</p>
    <span class="time_date"> ${data.createdAt} / ${data.sender} </span>
  </div>`;
}

function getReceiveMsgBox(data) {
    return `<div class="received_width_msg">
    <p>${data.msg}</p>
    <span class="time_date"> ${data.createdAt} / ${data.sender} </span>
  </div>`;
}

// 최초 초기화 할 때, 1번방에 3건이 있는 경우 모두 가져오기
// addMessage() 메서드가 호출시, DB에 insert 되고, 그 데이터가 자동적으로 흘러 들어온다 (SSE)
function initMyMessage(data) {
    let chatBox = document.querySelector("#chat-box");
    let sendBox = document.createElement("div");

    sendBox.className = "outgoing_msg";
    sendBox.innerHTML = getSendMsgBox(data);
    chatBox.append(sendBox);
}

function initYourMessage(data) {
    let chatBox = document.querySelector("#chat-box");
    let receivedBox = document.createElement("div");

    receivedBox.className = "received_msg";
    receivedBox.innerHTML = getReceiveMsgBox(data);
    chatBox.append(receivedBox);
}

async function addMessage() {
    let msgInput = document.querySelector("#chat-outgoing-msg");

    // 메세지를 서버에 전송
    let chat = {
        sender : username,
        roomNum : roomNum,
        mas : msgInput.value
    };

    fetch("http://localhost:8080/chat", {
        method : "post",
        body : JSON.stringify(chat), // JS -> JSON
        headers : {
            "Content-Type" : "application/json; charset=utf-8"
        }
    });

    msgInput.value = "";
}

document.querySelector("#chat-outgoing-btn").addEventListener("click", () => {
    addMessage();
});

document.querySelector("#chat-outgoing-msg").addEventListener("keydown", (e) => {
    if(e.keyCode === 13) {
        addMessage();
    }
});