let counter = 0;

document.addEventListener('DOMContentLoaded', () => {
    let category = 'All';
    load_items(category);

    window.onscroll = ()=>{
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight){
            console.log('Load more posts...')
            load_items(category);
        }
    };

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

    
});

function load_items(category){
    const start = counter;
    const end = start + 7;
    counter += 8;
    if (category === 'filter'){
        var animal_type = new Array();
        var category = new Array();
        document.querySelectorAll('input[name="animal"]').forEach((checkbox) =>{
            if (checkbox.checked == true){
                animal_type.push(checkbox.value);
                checkbox.checked = false;
            }
        });
        document.querySelectorAll('input[name="category"]').forEach((checkbox) =>{
            if (checkbox.checked == true){
                category.push(checkbox.value);
                checkbox.checked = false;
            }
        });
        var prior = 0;
        const prior_checked = document.querySelector('input[name="prior"]:checked');
        if (prior_checked != null){
            prior = prior_checked.value;
            prior_checked.checked = false;
        }
       
       
        console.log('////////', animal_type, category, prior);

        fetch(`api/items/${category}?start=${start}&end=${end}`, {
            method: 'PUT',
            body: JSON.stringify({
                animal_type: animal_type,
                category: category,
                prior: prior
            })
        }).then(response => response.json())
        .then(data => {
            console.log('filter result', data);
            data.forEach(build_card);
        })
    }
    else {
        fetch(`api/items/${category}?start=${start}&end=${end}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
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
    cart = document.querySelector('#cart-badge');
    fetch(`api/add_to_cart/${item_id}`)
    .then(response => response.json())
    .then(result => {
        cart.innerHTML = parseInt(cart.innerHTML) + result;
        if (parseInt(cart.innerHTML) > 0 ){
            cart.style.display = 'block';
        } else{
            cart.style.display = 'none';
        }
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