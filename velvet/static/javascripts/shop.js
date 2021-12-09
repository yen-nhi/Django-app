let counter = 0;

document.addEventListener('DOMContentLoaded', () => {
    let category = 'All';
    load_items(category);

    document.getElementById('categories').querySelectorAll('.nav-item').forEach((elememt) =>{
        elememt.onclick = () => {
            counter = 0;
            document.querySelector('#items').innerHTML = '';
            category = elememt.innerHTML.trim();
            load_items(category);
        }
    });

    document.querySelector('#filter-apply').onclick = () =>{
        counter = 0;
        category = 'filter';
        document.querySelector('#items').innerHTML = '';
        load_items(category);
    }
    document.querySelector('#search-btn').onclick = () =>{
        counter = 0;
        category = 'search';
        document.querySelector('#items').innerHTML = '';
        load_items(category);
    }

    window.onscroll = ()=>{
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight){
            console.log('Load more posts in category:', category);
            load_items(category);
        }
    };
});

function load_items(category){
    const start = counter;
    const end = start + 7;
    counter += 8;
    if (category === 'filter'){
        var animal_type = new Array();
        var categories = new Array();
        var prior = 0;
        document.querySelectorAll('input[name="animal"]').forEach((checkbox) =>{
            if (checkbox.checked == true){
                animal_type.push(checkbox.value);
            }
        });
        document.querySelectorAll('input[name="category"]').forEach((checkbox) =>{
            if (checkbox.checked == true){
                categories.push(checkbox.value);
            }
        });
        const prior_checked = document.querySelector('input[name="prior"]:checked');
        if (prior_checked != null){
            prior = prior_checked.value;
        }
        fetch(`api/items/${category}?start=${start}&end=${end}`, {
            method: 'PUT',
            body: JSON.stringify({
                animal_type: animal_type,
                categories: categories,
                prior: prior
            })
        }).then(response => response.json())
        .then(data => {
            console.log('filter result', data, `from ${start} to ${end}`);
            data.forEach(build_card);
        })
    }else if (category === 'search'){
        const q = document.querySelector('#search-bar').value;
        fetch(`api/items/${category}?q=${q}&start=${start}&end=${end}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.forEach(build_card);    
        });
    }else {
        fetch(`api/items/${category}?start=${start}&end=${end}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(build_card);    
        });
    }
}


function build_card(item){

    ///Create a product card and add to element '#items'.
    const card = document.createElement('div');
    card.className = 'item';

    const photo = document.createElement('div');
    photo.className = 'photo';
    fetch(`api/images/${item.id}`)
    .then(response => response.json())
    .then(data => {
        photo.innerHTML = `<img src="${data[0].url}" alt="Product image">`;
    })
    
    const details = document.createElement('div');
    details.style.marginTop = "20px";
    details.className = 'details';
    const name = document.createElement('p');
    name.innerHTML = item.name;
    name.style.fontSize = "large"
    const price = document.createElement('p');
    price.innerHTML = `$ ${item.price}`;
    price.style.color = "darkturquoise";
    const score = document.createElement('p');
    score.innerHTML = `Score: ${item.average_score}/10`;
    const button = document.createElement('button');
    button.className = 'btn';
    button.innerHTML = 'Add to cart';
    details.append(name);
    details.append(price);
    details.append(score);
    details.append(button);

    card.append(photo);
    card.append(details);
    document.querySelector('#items').append(card);

    // Add event to card
    photo.onclick = () =>{
        window.location = `/item/${item.id}`;
    };

    /// Add event to button
    button.onclick = () => {
        add_to_cart(item.id);
        document.querySelector('.alert').style.display = 'block';
        setTimeout(function(){document.querySelector('.alert').style.display = 'none';}, 2000);
    };
}

function add_to_cart(item_id){
    const cart = document.querySelector('#cart-badge');
    fetch(`api/add_to_cart/${item_id}`)
    .then(response => response.json())
    .then(result => {
        cart.innerHTML = parseInt(cart.innerHTML) + result;
        cart.style.display = 'block';
    });
}

function build_review(review){
    const element = document.createElement('div');
    element.className = "list-group-item";
    const user = document.createElement('div');
    user.innerHTML = `<img src="${review.user_avatar}" width="30px"><strong>  ${review.user}</strong><br><br>`;
    element.append(user);
    element.innerHTML += `<p>${review.message}</p>
                    <small style="color: grey;">Wrote at ${review.time}</small>`;
    document.querySelector('#reviews').append(element);
}