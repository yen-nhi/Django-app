from django.contrib.auth.models import AbstractUser
from django.db import models
import datetime
from datetime import timedelta
from ckeditor_uploader.fields import RichTextUploadingField

class User(AbstractUser):
    avatar = models.ImageField(upload_to='media/profile_pictures', default='media/profile_pictures/user.png')
    address = models.CharField(max_length=200)
    phone = models.CharField(max_length=16)

class Article(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name='post_user')
    head_image = models.ImageField(blank=True, upload_to="media/head_images")
    title = models.CharField(max_length=150)
    body = RichTextUploadingField(config_name='editor', blank=False, null=False)
    time = models.DateTimeField(auto_now_add=True)
    important = models.BooleanField(default=False)
    approved = models.BooleanField(default=False)
    def serialize(self):
        return {
            'id': self.id,
            'user': self.user.id,
            'username': self.user.username,
            'avatar': self.user.avatar.url,
            'title': self.title,
            'time': self.time.strftime("%m/%d/%Y"),
            'important': self.important,
            'body': self.body
        }

class Comment(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name='comment_user')
    post = models.ForeignKey("Article", on_delete=models.CASCADE, related_name='post')
    message = models.CharField(max_length=300)
    time = models.DateTimeField(auto_now_add=True)
    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "post": self.post.id,
            "message": self.message,
            "time": self.time.strftime("%m/%d/%Y at %H:%M"),
        }

class Animal_type(models.Model):
    _type = models.CharField(max_length=32)
    def __str__(self):
        return self._type

class Item(models.Model):
    CATEGORIES_CHOICES = (('Food', 'Food'), ('Shelter', 'Shelter'), ('Toys', 'Toys'), ('Accessories', 'Accessories'), ('Cleanser', 'Cleanser'), ('Others', 'Others'))
    name = models.CharField(max_length=100)
    price = models.IntegerField()
    category = models.CharField(max_length=32, choices=CATEGORIES_CHOICES)
    animal = models.ManyToManyField(Animal_type, related_name="animal", blank=True)
    description = models.CharField(max_length=500)
    time = models.DateTimeField(auto_now_add=True)
    average_score = models.FloatField(default=0)
    def __str__(self):
        return self.name
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "category": self.category,
            "description": self.description,
            "time": self.time.strftime("%m/%d/%Y at %H:%M"),
            "average_score": self.average_score,
        }

class Image(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE,related_name="image")
    image = models.ImageField(blank=True, upload_to='media/item_images')
    def serialize(self):
        return{
            'item': self.item.name,
            'url': self.image.url,
        }

class Shop_banner(models.Model):
    image = models.ImageField(upload_to='media/banner')
    active = models.BooleanField(default=False)

class Item_review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="review_user")
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='item')
    message = models.CharField(max_length=300)
    score = models.IntegerField()
    time = models.DateTimeField(auto_now_add=True)
    def serialize(self):
        return {
            "id": self.id,
            "username": self.user.username,
            "item_id": self.item.id,
            "message": self.message,
            "score": self.score,
            "time": self.time.strftime("%m/%d/%Y at %H:%M"),
        }

class Appointment(models.Model):
    CHOICES = (('Transportation', 'Transportation'), ('Spa', 'Spa'), ('Walk', 'Walk'), ('Hotel', 'Hotel'))
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="appoint_user", null=True, blank=True)
    pet_name = models.CharField(max_length=64)
    pet_type = models.CharField(max_length=64)
    datetime_from = models.DateTimeField(blank=True, null=True)
    datetime_to = models.DateTimeField(blank=True, null=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=16, blank=True)
    service = models.CharField(max_length=32, choices=CHOICES)
    canceled = models.BooleanField(default=False)
    finished = models.BooleanField(default=False)
    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.id,
            "pet_name": self.pet_name,
            "pet_type": self.pet_type,
            "datetime_from": self.datetime_from.strftime("%m/%d/%Y at %H:%M"),
            "datetime_to": self.datetime_to.strftime("%m/%d/%Y at %H:%M"),
            "service": self.service,
            "canceled": self.canceled,
            "finished": self.finished,
        }

class City(models.Model):
    city = models.CharField(max_length=64)
    def __str__(self):
        return self.city

class District(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="related_city")
    district = models.CharField(max_length=64)
    def serialize(self):
        return {
            "id": self.id,
            "city": self.city.city,
            "district": self.district,
        }

class Cart_item(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="cart_item")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart_user")
    quantity = models.IntegerField(default=1)
    def serialize(self):
        return {
            "id": self.id,
            "name": self.item.name,
            "item_id": self.item.id,
            "price": self.item.price,
            "quantity": self.quantity,
            "cost": self.item.price * self.quantity,
        }

class Anonymous_Cart_item(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="anonymous_cart_item")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="anonymous_cart_user",blank = True, null = True)
    session = models.CharField(max_length=64)
    quantity = models.IntegerField(default=1)
    exp_date = datetime.date.today() + datetime.timedelta(days=3)
    expired_date = models.DateField(default=exp_date)
    def serialize(self):
        return {
            "id": self.id,
            "name": self.item.name,
            "item_id": self.item.id,
            "price": self.item.price,
            "quantity": self.quantity,
            "cost": self.item.price * self.quantity,
        }


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ordering_user", blank = True, null = True)
    bill_total = models.FloatField(default=0)
    reciever = models.CharField(blank=True, max_length=64)
    email = models.CharField(blank=True, max_length=16)
    phone = models.CharField(blank=True, max_length=16)
    address = models.CharField(blank=True, max_length=100)
    created_time = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)
    completed_time = models.DateTimeField(blank=True, null=True)
    canceled = models.BooleanField(default=False)
    def serialize(self):
        if self.completed_time:
            comp_time = self.completed_time.strftime("%m/%d/%Y at %H:%M")
        else:
            comp_time = None
        return {
            "id": self.id,
            "bill_amount": self.bill_total,
            "time": self.created_time.strftime("%m/%d/%Y at %H:%M"),
            "completed": self.completed,
            "completed_time": comp_time,
        }

class Order_item(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="order")
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="order_item")
    quantity = models.IntegerField(default=1)
    reviewed = models.BooleanField(default=False)
    def serialize(self):
        return {
            "id": self.id,
            "order_id": self.order.id,
            "item_name": self.item.name,
            "item_id": self.item.id,
            "price": self.item.price,
            "quantity": self.quantity,
            "cost": self.item.price * self.quantity,
            "reviewed": self.reviewed
        }

class Coupon(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="coupon_user")
    discount = models.FloatField(default=0)
    code = models.CharField(max_length=24)
    applied = models.BooleanField()
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="for_order", blank=True, null=True)


class Filter(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="filter_user")
    animal_type = models.CharField(max_length=32, blank=True)
    category = models.CharField(max_length=100, blank=True)
    prior = models.CharField(max_length=32, blank=True)

class Bank_account(models.Model):
    name = models.CharField(max_length=64)
    number = models.CharField(max_length=20)
    bank = models.CharField(max_length=100)

