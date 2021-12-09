document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('footer').style.display = 'none';
    view_cart();
   
});


function view_cart(){
    fetch("/api/load_cart")
    .then(response => response.json())
    .then(data =>{
        console.log(data)
        var counter = 0;
        var total = 0;
        data.forEach((item) => {
            counter += 1;
            build_cart(counter, item);
            total += item.cost;
        });
        document.querySelector('#cart-total').innerHTML = total;
    });    
}

function build_cart(counter, item){
    const line = document.createElement('tr');
    const num = document.createElement('td');
    num.innerHTML = `<td>${counter}</td>`;
    const item_name = document.createElement('td');
    item_name.innerHTML = `<td>${item.name}</td>`;
    const td = document.createElement('td');
    const minus = document.createElement('button');
    minus.innerHTML = "-";
    const plus = document.createElement('button');
    plus.innerHTML = "+";
    const quantity = document.createElement('span');
    quantity.innerHTML = item.quantity;
    quantity.style.margin = "10px";
    const price = document.createElement('td');
    price.innerHTML = `<td>${item.price}</td>`;
    const cost = document.createElement('td');
    cost.innerHTML = `<td>${item.cost}</td>`;
    td.append(minus);
    td.append(quantity);
    td.append(plus);
    line.append(num);
    line.append(item_name);
    line.append(td);
    line.append(price);
    line.append(cost);
                             
    document.querySelector('#cart-list').append(line);

    /// Add event to plus and minus button to increase or decrease quantity 
    minus.onclick = () =>{
        if (quantity.innerHTML <= 1){
            update_cart('remove', item.id);
            document.querySelector('#cart-list').innerHTML = "";
            setTimeout(view_cart, 500);
        } else{
            update_cart('minus', item.id);
            quantity.innerHTML = parseInt(quantity.innerHTML) - 1;
            cost.innerHTML = parseInt(cost.innerHTML) - item.price;
            document.querySelector('#cart-total').innerHTML = parseInt(document.querySelector('#cart-total').innerHTML) - item.price;
        }
        
    };
    plus.onclick = () => {
        quantity.innerHTML = parseInt(quantity.innerHTML) + 1;
        cost.innerHTML = parseInt(cost.innerHTML) + item.price;
        document.querySelector('#cart-total').innerHTML = parseInt(document.querySelector('#cart-total').innerHTML) + item.price;
        update_cart('plus', item.id);
    };
}

function update_cart(instruction, id){
    fetch(`/api/update_cart`, {
        method: "PUT",
        body: JSON.stringify({
            instruction: instruction,
            cart_id: id
        })
    })
}