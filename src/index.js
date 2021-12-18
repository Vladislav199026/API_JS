import './main.scss';

// 1. Создать страницу.
// 2. Вытянуть пользователей и вставить через список (ul > li) последние 
//три юзера https://jsonplaceholder.typicode.com/users
// 3. По клику на юзера (li) получить конкретный пост по айди юзера из 
//https://jsonplaceholder.typicode.com/posts и вставить в модалку
// 4. в модалке добавить кнопку добавления и удаление поста, если удалите 
//последний пост то модалка должна закрыться сама и плюс сделать крестик 
//чтоб можно было закрыть ее самостоятельно.

// https://jsonplaceholder.typicode.com/guide/

'use strict'

const wrapper = document.getElementById('wrapper');
const main = document.createElement('main');
const ul = document.createElement('ul');
let attr = null;

ul.classList.add('user-info');
wrapper.appendChild(main);
main.classList.add('main');
main.appendChild(ul);

function getRequest(data) {
    data.forEach( (users, index) => {
        if (index > data.length - 4 && index < data.length) {
            const li = document.createElement('li');
            li.setAttribute('data-id', users.id);

            li.innerHTML = `
                <ul>
                    <li>
                        <p><span>Name:</span> ${users.name};</p>
                    </li>
                    <li>
                        <p><span>Email:</span> ${users.email};</p>
                    </li>
                    <li>
                        <p><span>Address:</span> ${users.address.city}, ${users.address.street};</p>
                    </li>
                    <li>
                        <p><span>Phone:</span> ${users.phone};</p>
                    </li>
                </ul>
            `;
            ul.appendChild(li);
        };
    });
    const dataIdUserColection = Array.from(document.querySelectorAll('.user-info > li'));

    dataIdUserColection.forEach( (item) => {
        item.addEventListener('click', (e) => {
            if (e.currentTarget) {
                attr = item.getAttribute('data-id');
            };
        });
    });
};

function getPostByUser() {
    const modal = document.createElement('div');
    const wrapModal = document.createElement('div');
    const mainItem = Array.from(ul.children);
    let ulPost = null;
    let addNewPost = null;
    let btnCloseModal = null;

    wrapModal.classList.add('wrapper-modal');
    modal.classList.add('modal');

    mainItem.forEach( item => {
        item.addEventListener('click', (e) => {
            wrapper.prepend(wrapModal);
            wrapModal.prepend(modal);

            if (e.currentTarget) {
                fetch('https://jsonplaceholder.typicode.com/posts')
                    .then( respons => respons.json())
                    .then( json =>  {
                        getPost(json); 
                        functionalModal();
                    })
                    .catch( error => alert(error))
            };
        });
    });

    function functionalModal() {
        const modalUl = document.querySelector('.modal ul');
        let arrDeleteBtns = null;
        btnCloseModal = document.createElement('button');
        
        btnCloseModal.classList.add('btn-close-modal');
        btnCloseModal.innerHTML = 'back';
        modal.prepend(btnCloseModal);

        function createDeleteListener() {
            const modalUlItems = Array.from(document.querySelectorAll('.modal li'));

            modalUlItems.forEach( (item, index) => {
                const btnDeletePost = document.createElement('button');

                btnDeletePost.innerHTML = `&Chi;`;
                btnDeletePost.classList.add('close-button');
                item.append(btnDeletePost);

                btnDeletePost.addEventListener('click', (e) => {
                    if (e.currentTarget) {
                        fetch(`https://jsonplaceholder.typicode.com/posts/${index}`, {
                            method: 'DELETE',
                        })
                        .then( () => item.remove())
                        .catch( error => alert(error))
                    };
                    let amountUlChildren = modalUl.children.length;
                    
                    if (amountUlChildren === 1) {
                        ulPost.remove();
                        btnCloseModal.remove();
                        addNewPost.remove();
                        wrapModal.remove();
                    };
                });
            });
            arrDeleteBtns = Array.from(document.getElementsByClassName('close-button'));
        };
        createDeleteListener();

        addNewPost = document.createElement('div');
        addNewPost.classList.add('edit-zone');
        addNewPost.innerHTML = `
            <form>
                <div>
                    <p>Add new post:</p>
                    <input type="text" placeholder="new title" />
                    <textarea placeholder="new post"></textarea>
                </div>
                <button type="button">add</button>
                <button type="reset">clean</button>
            </form>
        `;
        modal.append(addNewPost);

        const btnAdd = document.querySelector('.edit-zone button');

        btnAdd.addEventListener('click', () => {
            const titleText = document.querySelector('.edit-zone input').value;
            const postText = document.querySelector('.edit-zone textarea').value;
            const newPost = document.createElement('li');

            if (titleText && postText) {
                newPost.innerHTML = `
                    <p class="title">Title: ${titleText}</p>
                    <p>Body: ${postText}</p>
                `;

                fetch('https://jsonplaceholder.typicode.com/posts', {
                    method: 'POST',
                    body: JSON.stringify({
                        title: `${titleText}`,
                        body: `${postText}`,
                    }),
                })
                .then( response => alert(response.status))
                .then(() => modalUl.append(newPost))
                .then(() => {
                    arrDeleteBtns.forEach( (item) => item.remove())
                })
                .then(() => createDeleteListener())
                .catch( error => alert(error))
                
            } else {
                alert('Form is empty! Please, fill all items!');
            };
        });

        btnCloseModal.addEventListener('click', () => {
            ulPost.remove();
            btnCloseModal.remove();
            addNewPost.remove();
            wrapModal.remove();
        });
    };

    function getPost(users) {
        const jsonPost = users;
        ulPost = document.createElement('ul');

        modal.append(ulPost);
        
        jsonPost.forEach( item => {
            if (item.userId === Number(attr)) {
                const ulPostItem = document.createElement('li');
                const pTitle = document.createElement('p');
                const pBody = document.createElement('p');

                pTitle.classList.add('title')

                pTitle.innerHTML = `Title: ${item.title}`;
                pBody.innerHTML = `Body: ${item.body}`;

                ulPost.append(ulPostItem);
                ulPostItem.append(pTitle, pBody);
            };
        });
    };

    document.addEventListener('click', (e) => { 
        if(e.target === wrapModal) { 
            ulPost.remove();
            wrapModal.remove();
            addNewPost.remove();
            btnCloseModal.remove();
        };
    });
};

fetch('https://jsonplaceholder.typicode.com/users')
    .then( response => response.json()) 
    .then( json => getRequest(json))
    .then( () => getPostByUser())
    .catch( error => alert(error))
