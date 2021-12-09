document.addEventListener('DOMContentLoaded', () =>{
    fetch(`/api/load_reviews/${item_id}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data.forEach(build_review);
    });
})


function add_to_cart(item_id){
    fetch(`api/add_to_cart/${item_id}`)
    .then(response => response.json())
    .then(result => {
        document.querySelector('#cart-badge').innerHTML = parseInt(document.querySelector('#cart-badge').innerHTML) + result;
    });
}

function build_review(review){
    const element = document.createElement('div');
    element.className = "list-group-item";
    const user = document.createElement('div');
    user.innerHTML = `<strong>${review.username}</strong><small style="color: grey; margin-left: 30px;">${review.time}</small><br><br>`;
    element.append(user);
    element.innerHTML += `<p>${review.message}</p>
                    <p>Score: ${review.score}/10</p>
                    `;
    document.querySelector('#reviews').append(element);
}