document.addEventListener('DOMContentLoaded', () =>{
    document.querySelectorAll('.card').forEach((card) =>{
        card.onclick = () =>{        
            const post_id = card.getAttribute('data-post');
            window.location = `/post/${post_id}`;
        }
    });
})