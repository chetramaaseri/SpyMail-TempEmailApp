const showEmail = document.getElementById('email-address').firstElementChild;
const inboxList = document.getElementById('inbox-list');
const thanks_pop = document.getElementById("thanks-popup");
const ok_pop = document.getElementById("popup-ok");
const refreshBtn = document.getElementById('re-fresh');
const createNewBtn = document.getElementById('create');
const deleteOldBtn = document.getElementById('delete');
let temp = new Mailjs();
// Login to Email
async function loginToAccount() {
    const userName = localStorage.getItem('tempUserNameEmailID');
    const passWord = localStorage.getItem('tempEmailIDPasswordforUser');
    loader.classList.add("add-loader");
    const resp = await temp.login(userName,passWord);
    if (resp.message !== 'ok') {
        inboxList.innerHTML = `
            <div id="error">
                <h1>${resp.data.status}⚠️</h1>
                <h3>${resp.data.title}</h3>
                <p>We are not able to make you login Please try to create another account! Sorry for inconvenience🥲<br>Reload Page to Get Started</p>
            </div>
        `;
        localStorage.removeItem('isPathOk');
        loader.classList.remove("add-loader");
        return;
        
    }
    showEmail.innerText = userName;
    getAllEmails();
    
}
// Detail Email
async function deleteThisEmail(messageId) {
    inboxList.innerHTML = "";
    loader.classList.add("add-loader");
    const delConfirm = await temp.deleteMessage(messageId);
    goBackInbox();
}

async function goBackInbox(){
    getAllEmails();
}
// open email
async function openThisEmail(mail) {
    loader.classList.add("add-loader");
    const mailId = mail.id;
    const mailData = await temp.getMessage(mailId);
    let d = new Date(mailData.data.createdAt);
    inboxList.innerHTML = `
    <div id="single-mail">
        <div class="cap flex">
            <button class="btn" id="back-btn">Back</button>
            <button class="btn" id="delete-this">delete</button>
            <p>${d.getHours()}:${d.getMinutes()} - ${d.getDate()}/${d.getMonth()}/${d.getFullYear()}</p>
        </div>
        <h2>Subject: ${mailData.data.subject}</h2>
        <h5>from: ${mailData.data.from.address}</h5>
        <p id="mail-text"></p>
    </div>
    `;
    const mailText = document.getElementById('mail-text');
    const mailTextData = mailData.data.text;
    if ((mailTextData).includes('<html>')) {
        mailText.innerHTML = mailTextData;
    }else{
        mailText.innerText = mailTextData;
    }
    loader.classList.remove("add-loader");

// Button events
const deleteThis = document.getElementById('delete-this');
const backbtn = document.getElementById('back-btn');
deleteThis.addEventListener('click',function(){
    deleteThisEmail(mailData.data.id);
});

backbtn.addEventListener('click',goBackInbox);

}
// inboc update
async function getAllEmails() {
    loader.classList.add("add-loader");
    inboxList.innerHTML = "";
    const resp = await temp.getMessages();
    if(resp.data.length == 0){
        inboxList.innerHTML = `
        <div id="error">
        <h1>⚠️</h1>
        <h3>NO Email Found</h3>
        <p>Try Refreshing</p>
        </div>
        `;
        loader.classList.remove("add-loader");
        return;
    }
    resp.data.forEach(el => {
        const newElement = document.createElement('div');
        newElement.setAttribute('class', 'inbox-item');
        newElement.setAttribute('id',el.id);
        let d = new Date(el.createdAt);
        // let date = d.getDate();

        // let month = d.getMonth();
        newElement.innerHTML = `
        <h3 class="mail-sender">${el.from.name}</h3>
        <p class="mail-subject">${el.subject}</p><span class="mail-time">${d.getHours()}:${d.getMinutes()} - ${d.getDate()}/${d.getMonth()}/${d.getFullYear()}</span>
        `;
        inboxList.appendChild(newElement);

    });
    loader.classList.remove("add-loader");
    const inbox_item = document.getElementsByClassName('inbox-item');


    for (let index = 0; index < inbox_item.length; index++) {
        inbox_item[index].addEventListener('click',function(){
        openThisEmail(this);

    });
}

}
// delete account
async function deleteCurrent() {
    loader.classList.add("add-loader");
    const getDeleted = await temp.deleteMe();
    if(getDeleted.status === 'false'){
        inboxList.innerHTML = `
            <div id="error">
                <h1>${getDeleted.data.status}⚠️</h1>
                <h3>${getDeleted.data.title}</h3>
                <p>We are not able to delete your account currently<br>Please try after some time</p>
            </div>
        `;
        loader.classList.remove("add-loader");
        return;
    }
    localStorage.removeItem('isPathOk');
    localStorage.removeItem('tempUserNameEmailID');
    localStorage.removeItem('tempEmailIDPasswordforUser');
    loader.classList.remove("add-loader");
    thanks_pop.classList.add('launch-popup');
}

refreshBtn.addEventListener("click",getAllEmails);
deleteOldBtn.addEventListener("click",deleteCurrent);

ok_pop.addEventListener('click',()=>{
    thanks_pop.classList.remove('launch-popup');
    loader.classList.add("add-loader");
    setTimeout(() => {
        loader.classList.remove("add-loader");
        window.location = "index.html";
    }, 1500);
})

async function createNewEmail(){
    loader.classList.add("add-loader");
    const getDeleted = await temp.deleteMe();
    if(getDeleted.status === 'false'){
        inboxList.innerHTML = `
        <div id="error">
        <h1>${getDeleted.data.status}⚠️</h1>
        <h3>${getDeleted.data.title}</h3>
        <p>We are not able to delete your account currently<br>Please try after some time</p>
        </div>
        `;
        loader.classList.remove("add-loader");
        return;
    }
    localStorage.removeItem('tempUserNameEmailID');
    localStorage.removeItem('tempEmailIDPasswordforUser');
    temp = new Mailjs();
    const newEmail = await temp.createOneAccount();
    localStorage.setItem('tempUserNameEmailID',newEmail.data.username);
    localStorage.setItem('tempEmailIDPasswordforUser',newEmail.data.password);
    loginToAccount();
}
createNewBtn.addEventListener('click',createNewEmail);
// first login call
loginToAccount();

