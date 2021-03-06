
//get a reference to the unordered list
const postList = document.querySelector('.posts');


const loginCheck = (user) => {
    const loggedOutLinks = document.querySelectorAll('.logged-out');
    const loggedInLinks = document.querySelectorAll('.logged-in');
    const adminLinks = document.querySelectorAll('.admin');
    const adminControls = document.querySelectorAll('.adminControls'); 
    if(user){
        loggedInLinks.forEach(link => link.style.display='block');
        loggedOutLinks.forEach(link => link.style.display = 'none');
        user.getIdTokenResult().then(idTokenResult => {

            if(idTokenResult.claims.admin){
                adminLinks.forEach(link => link.style.display = 'block');
                adminControls.forEach(adminControl => adminControl.style.display = "block");
            }else{
                adminControls.forEach(adminControl => adminControl.style.display = "none");
            }
        })
    }else{
        loggedInLinks.forEach(link => link.style.display='none');
        loggedOutLinks.forEach(link => link.style.display = 'block');
        adminLinks.forEach(link => link.style.display = 'none');
    }
}





//setup posts...takes the data and cycles through it with a for each loop
const setupPosts = (data)=> {
if(data.length){
let html = '';
    data.forEach(doc =>{
        const post = doc.data();

        const li = `
        <li>
            <div class="collapsible-header grey lighten-3" style="display:block">${post.title}
                <div class="adminControls right">
                    <div id="${doc.id}" title="${post.title}" content="${post.content}" style="display:block">
                        <i class="edit material-icons modal-trigger" href="#modal-update">edit</i>
                        <i class="delete material-icons red-text">delete</i>
                     </div>   
                </div>
            </div>
            <div class="collapsible-body white">${post.content}</div>
        <li>
        `;
        html += li;
    });
    postList.innerHTML = html

    const editIcons = document.querySelectorAll('.edit');
    editIcons.forEach(editIcon =>{
        editIcon.addEventListener('click', (e)=>{
            let id = e.target.parentElement.getAttribute('id');
            let postTitle = e.target.parentElement.getAttribute('title');
            let postContent = e.target.parentElement.getAttribute('content');

            const updatePost = document.querySelector('#update-form');
            updatePost.title.value = postTitle;
            updatePost.content.value = postContent;

            updatePost.addEventListener('submit', (e)=>{
                e.preventDefault();
                fs.collection('posts').doc(id).set({
                    title: updatePost.title.value,
                    content: updatePost.content.value
                }).then(()=>{
                    const modal = document.querySelector('#modal-update');
                    M.Modal.getInstance(modal).close();
                    updatePost.reset();
                    console.log('Document updated successfully');
                }).catch(function(error){
                    console.error("Error updating document:", error);
                });
            })

        })
    })


    const deleteIcons = document.querySelectorAll('.delete');
    deleteIcons.forEach(deleteIcon =>{
        deleteIcon.addEventListener('click', (e)=>{
            e.stopPropagation();
            let id = e.target.parentElement.getAttribute('id');
            fs.collection('posts').doc(id).delete();
        })
    })





}else{
    if(auth.currentUser != null){
        postList.innerHTML = '<h4 class="center-align">There are no posts!</h4>'
    }else{
        postList.innerHTML = '<h4 class="center-align">Login to see posts</h4>'
    }
    
}
    
}



// setup materialize components

//this listens for when all the DOM content has been loaded then executes this function
document.addEventListener('DOMContentLoaded', function() {

    //this line initializes the modals
        var modals = document.querySelectorAll('.modal');
        M.Modal.init(modals);
      
        //this line initializes the items
        var items = document.querySelectorAll('.collapsible');
        M.Collapsible.init(items);
      
      });