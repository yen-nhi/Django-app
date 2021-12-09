document.addEventListener('DOMContentLoaded', () =>{
    load_comments();

    document.querySelector('#comment-btn').onclick = () =>{
        const message = document.querySelector('#message').value;
        document.querySelector('#message').value = "";
        if (message.trim() === ""){
            alert('Oops! You forgot to write something.')
        }else{
            fetch(`/api/save_comment`, {
                method: 'POST',
                body: JSON.stringify({
                    post_id: post_id,
                    message: message
                })
            }).then(response => response.json())
            .then(result =>{
                console.log(result);
                if (result === 'not_login'){
                    window.location = "/login";
                }
            })
            setTimeout(function(){ load_comments(); }, 1500);
        }
        
    }
})

function load_comments(){
    document.querySelector('#comments-list').innerHTML = "";
    fetch(`/api/load_comments/${post_id}`)
    .then(response => response.json())
    .then(data =>{
        console.log(data);
        data.forEach(build_comment)
    })
}

function build_comment(comment){
    const li = document.createElement('li')
    li.className = "list-group-item";
    li.innerHTML = `<span><strong>${comment.user.charAt(0).toUpperCase() + comment.user.slice(1)}</strong></span><span style="margin-left: 30px;"><small>${comment.time}</small></span>
                    <p>${comment.message}</p>`;
    document.querySelector('#comments-list').append(li);
}