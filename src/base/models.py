import uuid
from django.db import models
from django.contrib.postgres.fields import JSONField
from accounts.models import User


class Neighborhood(models.Model):
    uuid = models.UUIDField(
            unique=True, default=uuid.uuid4, editable=False,
            primary_key=True)
    name = models.CharField(max_length=128)
    date_created = models.DateTimeField(auto_now_add=True)


class Building(models.Model):
    uuid = models.UUIDField(
            unique=True, default=uuid.uuid4, editable=False,
            primary_key=True)
    title = models.CharField(max_length=128)
    description = models.TextField()
    latitude = models.DecimalField(max_digits=10, decimal_places=6)
    longitude = models.DecimalField(max_digits=10, decimal_places=6)
    photos = JSONField(blank=True, null=True)
    amenities = JSONField(blank=True, null=True)
    neighborhood = models.ForeignKey(Neighborhood)
    creator = models.ForeignKey(User)
    date_created = models.DateTimeField(auto_now_add=True)


class Unit(models.Model):
    uuid = models.UUIDField(
           unique=True, default=uuid.uuid4, editable=False,
           primary_key=True)
    building = models.ForeignKey(Building)
    type_lease = models.CharField(max_length=64)
    number = models.CharField(max_length=64, blank=True, null=True)
    num_beds = models.PositiveIntegerField()
    num_baths = models.PositiveIntegerField()
    title = models.CharField(max_length=128)
    amenities = JSONField(blank=True, null=True)
    description = models.TextField()
    rent = models.PositiveIntegerField()
    security_deposit = models.PositiveIntegerField(blank=True, null=True)
    photos = JSONField(blank=True, null=True)
    contact_name = models.CharField(max_length=128, blank=True, null=True)
    contact_phone = models.CharField(max_length=128, blank=True, null=True)
    contact_secondary_phone = models.CharField(
            max_length=128, blank=True, null=True)
    contact_facebook = models.CharField(max_length=128, blank=True, null=True)
    contact_email = models.CharField(max_length=128, blank=True, null=True)
    contact_whatsapp = models.CharField(max_length=128, blank=True, null=True)
    contact_relation_property = models.CharField(
            max_length=128, blank=True, null=True)
    creator = models.ForeignKey(User)
    date_created = models.DateTimeField(auto_now_add=True)


class Review(models.Model):
    uuid = models.UUIDField(
           unique=True, default=uuid.uuid4, editable=False,
           primary_key=True)
    building = models.ForeignKey(Building)
    rating = models.PositiveIntegerField()
    comments = models.TextField()
    anonymous = models.BooleanField()
    creator = models.ForeignKey(User)
    date_created = models.DateTimeField(auto_now_add=True)


class Favorite(models.Model):
    uuid = models.UUIDField(
           unique=True, default=uuid.uuid4, editable=False,
           primary_key=True)

    # A building OR unit can be favorited
    unit = models.ForeignKey(Unit, blank=True, null=True)
    building = models.ForeignKey(Building, blank=True, null=True)

    active = models.BooleanField(default=True)
    creator = models.ForeignKey(User)
    date_created = models.DateTimeField(auto_now_add=True)
