const loader = document.getElementById('loader');
const get_started = document.getElementById("get-started");
get_started.addEventListener("click",()=>{
    loader.classList.add("add-loader");
    createAccount();
})
// Initializing new Object of (Api) Clsss
let temp = new Mailjs();
// Function to create Account
async function createAccount(){
    const data = await temp.createOneAccount();
    localStorage.setItem('tempUserNameEmailID',data.data.username);
    localStorage.setItem('tempEmailIDPasswordforUser',data.data.password);
    localStorage.setItem('isPathOk','true');
    window.location = 'inbox.html';
}
