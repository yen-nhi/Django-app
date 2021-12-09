1. Introduction
  * Learner: Nguyen Thi Yen Nhi.
  * Project name: Capstone.
  * Application name: Velvet
  * Languages: Python, Javascripts, HTML, CSS.
  * Framework: Django.
  * This is a shopping website run under administration of petshop's staffs.
  * Time finish: 17 July 2021
  * The content of this application is my idea, the shop is not real.

2. Structure of the website
  * Home page: include posts and articles, allow user write there story but under approval od admin.
  * Shopping page: Allow user search items in shop, add the items into cart, procceed their orders and review the product after buying.
  * Service page: Allow user reserve an appointment for their coming service.
  * Find vet page: Allow user look for Vet around their location.
  * Contact page: Some information about our shop.
  * Application can be used even the user has an account or not. For shopping and service, user can also order without an account. With an account, data history of every transaction will be saved.

3. How to run this web application
  This web application has not deployed yet and has not been used in real life, you can run only by local server, by calling "python3 manage.py runserver".
  
4. Distinctiveness and Complexity
  * Why Velvet application satisfies the distinctiveness and complexity requirements mentioned in the course:
    It has a shop but not an ecommerce website where everone can become seller or buyer, there is only for one specific petshop, who can manage and add more products to sell.
    It has a articles page where people can write something but not the same as an social network where people can write without approval, everything user write on Velvet will be added to a collection of the shop's articles, used to make page look more friendly, admin can reject undelight, inapproriate articles.
    It is responsive for every device, from mobile phone to desktop.
    
  * models.py: (16 models) contains the objects table used in application.
    User
    Article
    Comment
    Animal_type
    Item
    Image
    Shop_banner
    Item_review
    Appointment
    City
    District
    Cart_item
    Anonymous_Cart_item
    Order
    Order_item
    Bank_account
  * views.py: contains the functions of each route, include API route.
    login_view()
    logout_view()
    register()
    index()
    find_vet()
    shop()
    view_item()
    write_post()
    view_posts()
    view_post()
    service()
    contact()
    profile()
    load_item()
    review()
    anonymous_cart()
    * API functions:
    	load_posts()
    	load_districts()
    	load_items()
    	load_images()
    	add_to_cart()
    	load_cart()
    	update_cart()
    	load_reviews()
	proceed_order()
	load_orders()
	order_details()
	update_reviewed()
	load_appointments()
	save_comment()
	load_comments()
	is_anonymous_user()
	set_session()
  * forms.py: contains model form for the application.
      Post_Form
      Service_Booking
      Anonymous_Service_Booking
  * urls.py : contains all the routes fo this application, includes API urls.
  * management/commands/remove_anonymous_cart.py : a custom management command to delete Anonymous_cart_item objects in database when they are expired. Call command: "python3 manage.py remove_anonymous_cart". 
  * templates: Folder contains all the .html file for every route
  * static : Folder contains 3 sub directories. They are static files for front-end.
      css: styles.css file for styling html objects. There is only one css file for all pages. Some small page, css inside "style" tag in html document.
      javascripts : contains all the .js file written by javascript language for front-end action. Each html document has its own javascripts file. Some small pages, javascipts inside "script" tag in html document.
      images : contains images, photos used as source of static images in every page.
  * media : folder contains files, images uploaded by user.
  
  
