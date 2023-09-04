let counter = 0;

document.addEventListener('DOMContentLoaded', () =>{
    load_posts(type);
    window.onscroll = ()=>{
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight){
          load_posts(type);
        }
    };    
})

function load_posts(type){
    const start = counter;
    const end = start + 9;
    counter += 10;
    fetch(`/api/posts/${type}?start=${start}&end=${end}`)
    .then(response => response.json())
    .then(data => {
      if (type === 'important'){
          data.forEach(build_post);
      }else{
        data.forEach(build_article);
      }
        
    })
}

function build_post(post){
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<div class="card-body">
                        <h5 class="card-title"><a href="/post/${post.id}">${post.title}</a></h5>
                        <p class="card-text" class="bottom"><small>${post.time}</small></p>
                      </div>`;
    document.querySelector('#posts').append(card);
}

function build_article(post){
    const card = document.createElement('div');
    card.className = 'card mb-2';
    card.innerHTML = `<div class="row g-0">
    <div class="col-md-2">
      <img src="${post.head_image}" alt="..." width="100%">
    </div>
    <div class="col-md-10">
      <div class="card-body">
        <h5 class="card-title"><a href="/post/${post.id}">${ post.title }</a></h5>
        <p class="card-text">${ post.username }</p>
        <p class="card-text" class="bottom"><small>Updated ${ post.time }</small></p>
      </div>
    </div>
  </div>`;
  document.querySelector('#articles').append(card);
}