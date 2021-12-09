from django.core.management.base import BaseCommand
from velvet.models import Anonymous_Cart_item
import datetime

class Command(BaseCommand):
    help = 'Delete items in anonymous carts after 3 days.'
    def handle(self, *args, **options):
        today = datetime.date.today()
        objects = Anonymous_Cart_item.objects.filter(expired_date__lt=today)
        print('delete objects:', objects)
        objects.delete()
    
