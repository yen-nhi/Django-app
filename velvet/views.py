import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from .models import *
from .forms import * 
import time


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
            following_posts = Following_posts(user=user)
            following_posts.save()
        except IntegrityError:
            return render(request, "register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "register.html")


def index(request):
    user = request.user
    cart_count = 0
    if user.is_authenticated:
        cart_count = Cart_item.objects.filter(user=request.user).count()
    posts = Article.objects.filter(important=True).order_by('-time')[0:3]
    articles = Article.objects.filter(important=False, approved=True).order_by('-time')[0:3]
    return render(request, 'index.html', {
        'user': request.user,
        'cart_count': cart_count,
        'posts': posts,
        'articles': articles
    })

def find_vet(request):
    cities = City.objects.all().order_by('city')
    src = f'https://www.google.com/maps/embed/v1/search?key=AIzaSyB3yfXvfce5AruLbVQuFtFTuVG-P74446Y&q=vet+in+District+1+Ho Chi Minh+Vietnam'   
    return render(request, 'findvet.html', {
        'src': src,
        'cities': cities
    })

def shop(request):
    return render(request, 'petshop.html')

def view_item(request, item_id):
    item = Item.objects.get(pk=item_id)
    images = Image.objects.filter(item=item)
    print(images, type(images))
    return render(request, 'item.html', {
        'item': item,
        'images': images
    })

def write_post(request):
    form = Post_Form(request.POST, request.FILES)
    if request.user.is_authenticated:
        if request.method == 'POST':
            if form.is_valid():
                f = form.save(commit=False)
                f.user = request.user
                f.save()
                return HttpResponseRedirect(reverse('index'))
    
    return render(request, 'write_post.html', {
        'form': form,
    })

def view_post(request, post_id):
    post = Article.objects.get(pk=post_id)
    return render(request, 'post_page.html', {
        'post': post
    })

def view_posts(request, _type):
    return render(request, 'posts.html', {
        'type': _type
    })
   
def service(request):
    if request.user.is_authenticated:
        form = Service_Booking()
    else:
        form = Anonymous_Service_Booking()
    if request.method == 'POST':
        if form.is_valid:
            f = form.save(commit=False)
            time_from = request.POST['datetime_from']
            time_to = request.POST['datetime_to']
            f.datetime_from = time_from
            f.datetime_to = time_to
            if request.user.is_authenticated:
                f.user = request.user
            f.save()
            print(f)
            return render(request, 'reserve.html', {
                'appmt': f.id
            })
    return render(request, 'petservice.html', {
        'form': form
    })

def contact(request):
    return render(request, 'contact.html')

def profile(request):
    user = request.user
    if user.is_authenticated:
        if 'save-profile' in request.POST:
            new_phone = request.POST['1']
            new_addr = request.POST['2']
            user.phone = new_phone
            user.address = new_addr
            if request.FILES['pic']:
                new_avatar = request.FILES['pic']
                user.avatar = new_avatar
            user.save()
    return render(request, 'profile.html', {
        'profile_user': user
    })

def load_item(request, item_id):
    item = Item.objects.get(pk=item_id)
    return render(request, 'item.html', {
        'item': item
    })

def review(request, item_id):
    item = Item.objects.get(pk=item_id)
    images = Image.objects.filter(item=item)
    if request.method == 'POST':
        message = request.POST['review-message']
        score = request.POST['score']
        # Save review
        Item_review(user=request.user, item=item, message=message, score=score).save()
        
        # Re-calculate item's average_score
        reviews = Item_review.objects.filter(item=item)
        total_score = 0
        for review in reviews:
            total_score += review.score
        avg_score = total_score / reviews.count()
        item.average_score = avg_score
        item.save()
        return HttpResponseRedirect(reverse('profile'))
    return render(request, 'review.html', {
        'item': item,
        'image': images[0]
    })

def anonymous_cart(request):
    items = Anonymous_Cart_item.objects.filter(session=request.session.session_key)
    total = 0
    for item in items:
        total += item.item.price * item.quantity
    return render(request, 'anonymous_cart.html', {
        'items': items,
        'total': total
    })

### API
def load_posts(request, _type):
    start = int(request.GET.get('start') or 0)
    end = int(request.GET.get('end') or start + 9)
    if _type == 'important':
        posts = Article.objects.filter(important=True).order_by('-time')[start:end+1]
    else:
        posts = Article.objects.filter(important=False, approved=True).order_by('-time')[start:end+1]
    return JsonResponse([post.serialize() for post in posts], safe=False)

def load_districts(request, city_id):
    city = City.objects.get(pk=city_id)
    districts = District.objects.filter(city=city)
    return JsonResponse({
        'districts': [district.district for district in districts],
        'city': city.city},
         safe=False)



@csrf_exempt
def load_items(request, category):
    start = int(request.GET.get('start') or 0)
    end = int(request.GET.get('end') or start + 7)
    if category == 'All':
        items = Item.objects.all().order_by('-time')[start:end+1]
    elif category == 'search':
        query = request.GET.get('q')
        items = Item.objects.filter(name__contains=query).order_by('-time')[start:end+1]
    elif category == 'filter':
        if request.method == 'PUT':
            data = json.loads(request.body)
            animal_type = data.get("animal_type")
            categories = data.get("categories")
            prior = data.get("prior")
            print('----------------------', animal_type, categories, prior)
            items = Item.objects.all()
            if animal_type != []:
                items = items.filter(animal__in=animal_type).distinct()
            if categories != []:
                items = items.filter(category__in=categories)
            if prior != 0:
                if prior == 'low-to-high':
                    items = items.order_by('price')
                elif prior == 'high-to-low':
                    items = items.order_by('-price')
                elif prior == 'newest':
                    items = items.order_by('-time')
                else:
                    items = items.order_by('-average_score')
            items = items[start:end+1]
            print('items filter', items)
    else:
        items = Item.objects.filter(category=category).order_by('-time')[start:end+1]
    if start != 0:
        time.sleep(1)
    return JsonResponse([item.serialize() for item in items], safe=False)

def load_images(request, item_id):
    item = Item.objects.get(pk=item_id)
    images = Image.objects.filter(item=item)
    return JsonResponse([image.serialize() for image in images], safe=False)

def add_to_cart(request, item_id):
    count = 0
    item = Item.objects.get(pk=item_id)
    if request.user.is_authenticated:
        try: 
            cart = Cart_item.objects.get(user=request.user, item=item)
        except Cart_item.DoesNotExist:
            cart = Cart_item(user=request.user, item=item)
            cart.save()
            count += 1
        else:
            cart.quantity += 1
            cart.save()
    else:
        set_session(request)
        try: 
            cart = Anonymous_Cart_item.objects.get(user=None, session=request.session.session_key, item=item)
        except Anonymous_Cart_item.DoesNotExist:
            cart = Anonymous_Cart_item(session=request.session.session_key, item=item)
            cart.save()
            count += 1
        else:
            cart.quantity += 1
            cart.save()
    return JsonResponse(count, safe=False)

def load_cart(request):
    if request.user.is_authenticated:
        cart_list = Cart_item.objects.filter(user=request.user)
    else:
        cart_list = Anonymous_Cart_item.objects.filter(session=request.session.session_key)
    return JsonResponse([item.serialize() for item in cart_list], safe=False)

def load_reviews(request, item_id):
    item = Item.objects.get(pk=item_id)
    reviews = Item_review.objects.filter(item=item)
    return JsonResponse([review.serialize() for review in reviews], safe=False)

@csrf_exempt
def update_cart(request):
    if request.method == 'PUT':
        data = json.loads(request.body)
        instruction = data.get('instruction')
        cart_id = data.get('cart_id')
        if request.user.is_authenticated:
            cart_item = Cart_item.objects.get(pk=cart_id)
        else:
            cart_item = Anonymous_Cart_item.objects.get(pk=cart_id)
        if instruction == 'plus':
            cart_item.quantity += 1
            cart_item.save()
        elif instruction == 'minus':
            cart_item.quantity -= 1
            cart_item.save()
        elif instruction == 'remove':
            cart_item.delete()
        return HttpResponse(status=204)
    else:
        return JsonResponse({
            "error":  "PUT request required."
        }, status=400)

@csrf_exempt
def proceed_order(request):
    user = request.user
    if user.is_authenticated:
        cart = Cart_item.objects.filter(user=user)
    else:
        cart = Anonymous_Cart_item.objects.filter(session=request.session.session_key)
    bill_amount = 0
    for item in cart:
        bill_amount += item.quantity * item.item.price
    if request.method == 'POST':
        list_items = []
        if user.is_authenticated:
            order = Order(user=user, bill_total=bill_amount)
            order.save() 
        else:
            reciever = request.POST['reciever']
            email = request.POST['email']
            phone = request.POST['phone']
            address = request.POST['address']
            order = Order(bill_total=bill_amount, reciever=reciever, email=email, phone=phone, address=address)
            order.save()
        for item in cart:
            order_item = Order_item(order=order, item=item.item, quantity=item.quantity)
            order_item.save()
            list_items.append(order_item)
            item.delete()
        return render(request, 'successful_order.html', {
            'order_id': order.id
        })
    return render(request, 'proceed_order.html', {
        'items': cart,
        'bill_amount': bill_amount,
        'accounts': Bank_account.objects.all()
    })

def load_orders(request, completed):
    if completed == 'true':
        orders = Order.objects.filter(user=request.user, completed=True)
    else:
        orders = Order.objects.filter(user=request.user, completed=False)
    return JsonResponse([order.serialize() for order in orders], safe=False)

def order_details(request, order_id):
    order = Order.objects.get(pk=order_id)
    items = Order_item.objects.filter(order=order)
    return JsonResponse([item.serialize() for item in items], safe=False)

@csrf_exempt
def update_reviewed(request, item_id):
    if request.method == 'PUT':
        item = Order_item.objects.get(pk=item_id)
        item.reviewed = True
        item.save()
        return JsonResponse('Item has been reviewed.')
    return JsonResponse({"error":  "PUT request required."}, status=400)

def load_appointments(request):
    appmts = Appointment.objects.filter(user=request.user)
    return JsonResponse([appmt.serialize() for appmt in appmts], safe=False)

@csrf_exempt
def save_comment(request):
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse('not_login', safe=False)
        data = json.loads(request.body)
        post_id = data.get('post_id')
        post=Article.objects.get(pk=post_id)
        user = data.get('user')
        message = data.get('message')
        Comment(user=request.user, post=post, message=message).save()
        return JsonResponse('Comment saved', safe=False)
    return JsonResponse({"error":  "POST request required."}, status=400)
        
def load_comments(request, post_id):
    comments = Comment.objects.filter(post=Article.objects.get(pk=post_id)).order_by('-time')
    return JsonResponse([comment.serialize() for comment in comments], safe=False)

def is_anonymous_user(request):
    if request.user.is_authenticated:
        return JsonResponse('false', safe=False)
    return JsonResponse('true', safe=False)

def set_session(request):
    if not request.session or not request.session.session_key:
        request.session.save()
