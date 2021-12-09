from django.urls import path, include

from . import views

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("ckeditor", include('ckeditor_uploader.urls')),
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("write_post", views.write_post, name="write_post"),
    path("post/<str:post_id>", views.view_post, name="view_post"),
    path("posts/<str:_type>", views.view_posts, name="view_posts"),
    path("shop", views.shop, name="shop"),
    path("item/<str:item_id>", views.view_item, name="view_item"),
    path("vet", views.find_vet, name="vet"),
    path("service", views.service, name="service"),
    path("contact", views.contact, name="contact"),
    path("profile", views.profile, name="profile"),
    path("proceed_order", views.proceed_order, name="proceed_order"),
    path("review/<str:item_id>", views.review, name="review"),
    path("anonymous_cart", views.anonymous_cart, name="anonymous_cart"),
    
    # API routes
    path("api/load_districts/<str:city_id>", views.load_districts, name="load_districts"),
    path("api/posts/<str:_type>", views.load_posts, name="posts"),
    path("api/save_comment", views.save_comment, name="save_comment"),
    path("api/load_comments/<str:post_id>", views.load_comments, name="load_comments"),
    path("api/items/<str:category>", views.load_items, name="load_items"),
    path("api/images/<str:item_id>", views.load_images, name="load_images"),
    path("api/add_to_cart/<str:item_id>", views.add_to_cart, name="add_to_cart"),
    path("api/load_cart", views.load_cart, name="load_cart"),
    path("api/load_reviews/<str:item_id>", views.load_reviews, name="load_reviews"),
    path("api/update_cart", views.update_cart, name="update_cart"), 
    path("api/load_orders/<str:completed>", views.load_orders, name="load_orders"),
    path("api/order_details/<str:order_id>", views.order_details, name="order_details"),
    path("api/reviewed/<str:item_id>", views.update_reviewed, name="reviewed"),
    path("api/load_appointments", views.load_appointments, name="load_appointments"),
    path("api/is_anonymous_user", views.is_anonymous_user, name="is_anonymous_user"),
    ]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)