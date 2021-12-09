document.addEventListener('DOMContentLoaded', () =>{
    view_cart();
    show_element('cart');

    document.querySelector('#cart-button').onclick = () =>{
        show_element('cart');
        document.querySelector(`#cart-button`).style.backgroundColor = 'mintcream';
    };

    document.querySelector('#coupon-button').onclick = () =>{
        show_element('coupon');
        document.querySelector(`#coupon-button`).style.backgroundColor = 'mintcream';
    };

    document.querySelector('#processing-button').onclick = () =>{
        show_element('orders');
        document.querySelector(`#processing-button`).style.backgroundColor = 'mintcream';
        view_orders('false');
    };

    document.querySelector('#completed-button').onclick = () =>{
        show_element('orders');
        document.querySelector(`#completed-button`).style.backgroundColor = 'mintcream';
        view_orders('true');
    };

    document.querySelector('#appointment-button').onclick = () =>{
        show_element('appointment');
        document.querySelector(`#appointment-button`).style.backgroundColor = 'mintcream';
        load_appointments();
    };

    if (document.querySelector('#cart-badge').innerHTML === 0){
        document.querySelector('.btn-proceed').style.display = 'none';
    }
    document.querySelector('.btn-proceed').onclick = () =>{
        window.location = "/proceed_order";
    };
})


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
        quantity.innerHTML = parseInt(quantity.innerHTML) - 1;
        cost.innerHTML = parseInt(cost.innerHTML) - item.price;
        document.querySelector('#cart-total').innerHTML = parseInt(document.querySelector('#cart-total').innerHTML) - item.price;
        if (quantity.innerHTML <= 0){
            update_cart('remove', item.id);
            document.querySelector('#cart-list').innerHTML = "";
            view_cart();
        } else{
            update_cart('minus', item.id);
        }
    };
    plus.onclick = () => {
        quantity.innerHTML = parseInt(quantity.innerHTML) + 1;
        cost.innerHTML = parseInt(cost.innerHTML) + item.price;
        document.querySelector('#cart-total').innerHTML = parseInt(document.querySelector('#cart-total').innerHTML) + item.price;
        update_cart('plus', item.id);
    };
}

function show_element(element){
    document.querySelector('#list-orders').innerHTML = "";
    document.querySelector('#order').innerHTML = "";
    document.querySelectorAll('.profile-btn-top').forEach((button) =>{
        button.style.backgroundColor = 'white';
    });
    document.querySelectorAll('.profile-element').forEach((element) => {
        element.style.display = 'none';
    });
    document.querySelector(`#${element}-element`).style.display = 'block';
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

function view_orders(completed){
    /// Show all order as requiring
    document.querySelector('#list-orders').innerHTML = "";
    fetch(`/api/load_orders/${completed}`)
    .then(response => response.json())
    .then(data => {
        console.log('orders', data);
        /// Build table of orders.
        var counter = 0;
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const tr1 = document.createElement('tr');
        tr1.innerHTML = `<th scope="col">#</th>
                        <th scope="col">Order ID</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Ordered time</th>`;
        thead.append(tr1);
        
        data.forEach((order) => {
            counter += 1;
            const tr2 = document.createElement('tr');
            tr2.innerHTML = `<td>${counter}</td>
                            <td>${order.id}</td>
                            <td>${order.bill_amount}</td>
                            <td>${order.time}</td>`;
            tbody.append(tr2);

            /// For each line of table of orders, when click it will show order's details.
            tr2.onclick = () => {
                document.querySelectorAll('tr').forEach((line) => {
                    line.style.backgroundColor = "white";
                })
                tr2.style.backgroundColor = "mintcream";
                document.querySelector('#order').innerHTML = "";
                fetch(`/api/order_details/${order.id}`)
                .then(response => response.json())
                .then(data => {
                    /// Build table of items in the order.
                    counter = 0;
                    const d_thead = document.createElement('thead');
                    const d_tbody = document.createElement('tbody');
                    const th = document.createElement('tr');
                    th.innerHTML = `<th scope="col">#</th>
                                    <th scope="col">Item</th>
                                    <th scope="col">Quantiy</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Cost</th>
                                    <th scope="col"></th>`;
                    d_thead.append(th);

                    data.forEach((item) => {
                        counter += 1;
                        const tr3 = document.createElement('tr');
                        tr3.innerHTML = `<td>${counter}</td>
                                        <td>${item.item_name}</td>
                                        <td>${item.quantity}</td>
                                        <td>${item.price}</td>
                                        <td>${item.price * item.quantity}</td>`;
                        if (completed === 'true'){
                            console.log('completed orders')
                            const review = document.createElement('button');
                            review.innerHTML = 'Review';
                            review.className = 'review-btn';
                            if (item.reviewed){
                                review.disabled = true;
                                review.style.backgroundColor = "lightgrey";
                                review.style.color = "white";
                            }
                            const td = document.createElement('td');
                            td.append(review);
                            tr3.append(td);

                            ///Review button
                            review.onclick = () =>{
                                update_reviewed(item.id);
                                window.location = `/review/${item.item_id}`;
                            }
                        }
                        d_tbody.append(tr3);
                    });
                    document.querySelector('#order').append(d_thead);
                    document.querySelector('#order').append(d_tbody);       
                });
            }
        });
        document.querySelector('#list-orders').append(thead);
        document.querySelector('#list-orders').append(tbody);
    }); 
}

function update_reviewed(item_id){
    fetch(`api/reviewed/${item_id}`, {
        method: 'PUT'
    }).then(response => response.json())
    .then(data =>{
        console.log(data);
    })
}

function load_appointments(){
    fetch("/api/load_appointments")
    .then(response => response.json())
    .then(data => {
        var counter = 0;
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const tr1 = document.createElement('tr');
        tr1.innerHTML = `<th scope="col">#</th>
                        <th scope="col">ID</th>
                        <th scope="col">Pet name</th>
                        <th scope="col">Type</th>
                        <th scope="col">Service</th>
                        <th scope="col">From</th>
                        <th scope="col">To</th>
                        <th scope="col">Status</th>`;
        thead.append(tr1);
        data.forEach((appmt) => {
            counter += 1;
            if(appmt.canceled){
                var status = 'canceled';
            } else if( appmt.finished){
                status = 'finished';
            }else{
                status = 'pending';
            }
            const tr2 = document.createElement('tr');
            tr2.innerHTML = `<td>${counter}</td>
                            <td>${appmt.id}</td>
                            <td>${appmt.pet_name}</td>
                            <td>${appmt.pet_type}</td>
                            <td>${appmt.service}</td>
                            <td>${appmt.datetime_from}</td>
                            <td>${appmt.datetime_to}</td>
                            <td>${status}</td>`;
            tbody.append(tr2);
        });
        document.querySelector('#list-appointments').append(thead);
        document.querySelector('#list-appointments').append(tbody);

    });
}