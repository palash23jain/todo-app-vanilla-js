const btnAddItem = document.querySelector('.btn-add-item');
const btnEditItem = document.querySelector('.btn-edit-item');
const clearBtn = document.querySelector(".btn-clear-all");
const inputItem = document.querySelector('.input-item');
const ul = document.querySelector('.ul-display');
const localStorageArr = [];
let editTempId;

if(localStorage.getItem('itemTodo')){
        JSON.parse(localStorage.getItem('itemTodo')).forEach(i=>{
            ul.innerHTML = ul.innerHTML + `<li id="${i.id}">${i.item}<span class="img-group"><img src="check.svg" class="check"><img src="edit.svg" class="edit"><img src="cross.svg" class="cross"></span></li>`;
            if(i.status === "complete"){
                document.querySelector(`#${CSS.escape(i.id)}`).style.textDecoration = "line-through";
            }
            localStorageArr.push(i);
        })
}

const displayItemOnStatus = status => {
    ul.innerHTML= '';
    localStorageArr.forEach(i=>{
        if(status === "all" && (i.status ==="active" || i.status === "complete")){
            ul.innerHTML = ul.innerHTML + `<li id="${i.id}">${i.item}<span class="img-group"><img src="check.svg" class="check"><img src="edit.svg" class="edit"><img src="cross.svg" class="cross"></span></li>`;
           if(status==="complete") {
               document.querySelector(`#${CSS.escape(i.id)}`).style.textDecoration = "line-through";
            }
            document.getElementById('all').style.color = "blue";
            document.getElementById('active').style.color = document.getElementById('complete').style.color = "black";
        }
        if(status === "active" && i.status ==="active"){
            ul.innerHTML = ul.innerHTML + `<li id="${i.id}">${i.item}<span class="img-group"><img src="check.svg" class="check"><img src="edit.svg" class="edit"><img src="cross.svg" class="cross"></span></li>`;
            document.getElementById('active').style.color = "blue";
            document.getElementById('all').style.color = document.getElementById('complete').style.color = "black";
        }
        if(status === "complete" && i.status ==="complete"){
            ul.innerHTML = ul.innerHTML + `<li id="${i.id}">${i.item}<span class="img-group"><img src="check.svg" class="check"><img src="edit.svg" class="edit"><img src="cross.svg" class="cross"></span></li>`;
            document.querySelector(`#${CSS.escape(i.id)}`).style.textDecoration = "line-through";
            document.getElementById('complete').style.color = "blue";
            document.getElementById('active').style.color = document.getElementById('all').style.color = "black";
        }
    })
}
const create_UUID = () => {
    let dt = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

const setTodoLocally = (inputItem) => {
            const tempObj = {};
            tempObj.id = `${create_UUID()}`;
            tempObj.item = inputItem;
            tempObj.status = 'active';
            const d = new Date();
            tempObj.date = `${d.toLocaleString('en-US', {timeZone:"Asia/Kolkata"})}`
            localStorageArr.push(tempObj);
            return tempObj.id;
}
const setTodoItemLocalStorage = () => {
    localStorage.setItem('itemTodo', JSON.stringify(localStorageArr));
}

const crossImgClick = (e) => {
    localStorageArr.forEach((i, index)=>{
        if(i.id === e.target.parentNode.parentNode.id){
            localStorageArr.splice(index, 1);
        }
    })
    e.target.parentNode.parentNode.remove();
}

const checkImgClick = (e) => {
    if(e.target.parentNode.parentNode.style.textDecoration != "line-through"){
        localStorageArr.forEach((i, index)=> {
            if(i.id === e.target.parentNode.parentNode.id){
                localStorageArr[index].status = 'complete';
                const d = new Date();
                localStorageArr[index].date = `${d.toLocaleString('en-US', {timeZone:"Asia/Kolkata"})}`
            }
        })
        e.target.parentNode.parentNode.style.textDecoration = "line-through"
        document.querySelectorAll("a").forEach(i=>{
            if(i.style.color === 'blue'){
                displayItemOnStatus(i.id);
            }
        })
    } else{
        localStorageArr.forEach((i, index)=> {
            if(i.id === e.target.parentNode.parentNode.id){
                localStorageArr[index].status = 'active';
                const d = new Date();
                localStorageArr[index].date = `${d.toLocaleString('en-US', {timeZone:"Asia/Kolkata"})}`
            }
        })
        e.target.parentNode.parentNode.style.textDecoration = "none";
    }
}

const editImgClick = (e) => {
    btnAddItem.style.display = 'none';
    editTempId = e.target.parentNode.parentNode.id;
    inputItem.value = e.target.parentNode.parentNode.innerText;
    inputItem.focus();
    btnEditItem.style.display = "inline";   
}

const editBtnClick = (e) => {
    localStorageArr.forEach((i, index)=>{
        if(i.id === editTempId){
            localStorageArr[index].item = inputItem.value;
            document.querySelector(`#${CSS.escape(editTempId)}`).innerHTML = `${inputItem.value}<span class="img-group"><img src="check.svg" class="check"><img src="edit.svg" class="edit"><img src="cross.svg" class="cross"></span>`;
            inputItem.value = '';
            btnEditItem.style.display = 'none';
            btnAddItem.style.display = 'inline'; 
        }
    })
}

const addClick = () => {
    if(inputItem.value){
            ul.innerHTML = ul.innerHTML + `<li id="${setTodoLocally(inputItem.value)}">${inputItem.value}<span class="img-group"><img src="check.svg" class="check"><img src="edit.svg" class="edit"><img src="cross.svg" class="cross"></span></li>`
            setTodoItemLocalStorage();
            inputItem.value = '';
    }
}

const inputEnter = (e) => {
    if(btnEditItem.style.display === 'inline'){
        localStorageArr.forEach((i, index)=>{
            if(i.id === editTempId){
                localStorageArr[index].item = inputItem.value;
                document.querySelector(`#${CSS.escape(editTempId)}`).innerHTML = `${inputItem.value}<span class="img-group"><img src="check.svg" class="check"><img src="edit.svg" class="edit"><img src="cross.svg" class="cross"></span>`;
                inputItem.value = '';
                btnEditItem.style.display = 'none';
                btnAddItem.style.display = 'inline'; 
            }
        })     
    } else {
        addClick();
    }
}

document.body.addEventListener('click', (e)=>{
    if(e.target.className === 'edit'){
        editImgClick(e);
    }
    if(e.target.className === 'cross'){
        crossImgClick(e);
    }
    if(e.target.className === 'check'){
        checkImgClick(e);
    }
    if(e.target.className === 'btn-add-item'){
        addClick();
    }
    if(e.target.className === "btn-clear-all"){
            ul.innerHTML = '';
            localStorageArr.length =0;
    }
    if(e.target.className === "btn-edit-item"){
        editBtnClick(e);
    }
    if(e.target.id === "all" || e.target.id === "active" || e.target.id === "complete"){
        displayItemOnStatus(e.target.id);
    }
    setTodoItemLocalStorage();
})

inputItem.addEventListener('keyup', e=>{
    if(e.keyCode ===13 && inputItem.value){
        inputEnter(e);
        setTodoItemLocalStorage();
    }
})
