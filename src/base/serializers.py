from rest_framework import serializers
from base.models import Building, Unit, Review, User, Favorite,\
        Neighborhood
from django.db.models import Min, Max
from django.core.exceptions import ValidationError
from PIL import Image
import json


def validate_photos(files):
    for name in files:
        if (len(files[name]) > 10000000):
            raise ValidationError(
                    'This image is bigger than 10mb. Please make it smaller.')

            try:
                im = Image.open(files[name])
                if im.format != "JPEG" and im.format != "PNG" and\
                        im.format != "GIF":
                            raise ValidationError('Invalid file type.')
            except:
                raise ValidationError('This is not an image.')


class FavoriteSerializer(serializers.ModelSerializer):
    creator = serializers.UUIDField(required=False, write_only=True)
    title = serializers.SerializerMethodField()

    def get_title(self, favorite):
        if favorite.building is not None:
            return favorite.building.title
        else:
            return favorite.unit.title

    class Meta:
        model = Favorite


class PasswordRecoverySerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField()
    code = serializers.UUIDField()


class ShareFavoriteSerializer(serializers.Serializer):
    emails = serializers.ListField(
            child=serializers.EmailField())


class UserSerializer(serializers.ModelSerializer):
    active_favorites = serializers.SerializerMethodField()

    def get_active_favorites(self, user):
        return FavoriteSerializer(
                user.favorite_set.filter(active=True), many=True).data

    class Meta:
        model = User
        exclude = (
                'activation_key', 'confirmed_email', 'date_joined',
                'is_active', 'is_staff', 'is_superuser',
                'last_login', 'password', 'email')


class NeighborhoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Neighborhood


class BuildingSerializer(serializers.ModelSerializer):
    photos = serializers.JSONField(
            read_only=True, required=False, allow_null=True)
    amenities = serializers.JSONField(
            required=False, allow_null=True)
    creator = serializers.UUIDField(required=False)
    unit_summary = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()
    neighborhood_name = serializers.SerializerMethodField(read_only=True)
    existing_photos = serializers.JSONField(write_only=True, required=False)

    def get_is_favorite(self, building):
        if self.context['request'].user.is_authenticated:
            count = Favorite.objects.filter(
                    creator=self.context['request'].user,
                    building=building, active=True).count()
            return True if count > 0 else False
        return {}

    def get_unit_summary(self, building):
        qs = building.unit_set
        agg = qs.aggregate(
                Max('rent'), Min('rent'), Min('num_beds'), Max('num_beds'))
        agg['lease_types'] = qs.values_list('type_lease').distinct()
        agg['unit_count'] = qs.count()
        return agg

    def get_neighborhood_name(self, building):
        return building.neighborhood.name

    # Validate uploaded images
    def validate(self, data):
        validate_photos(self.context['request'].FILES)
        return data

    # Convert json array string to obj
    def validate_amenities(self, data):
        return json.loads(data)

    class Meta:
        model = Building


class ReviewSerializer(serializers.ModelSerializer):
    creator = serializers.UUIDField(required=False, write_only=True)
    reviewee = serializers.SerializerMethodField()

    def validate_rating(self, value):
        if (1 <= value <= 5) is False:
            raise serializers.ValidationError("This needs to between 1 and 5.")
        return value

    def get_reviewee(self, review):
        if review.anonymous is False:
            user = {}
            user['first_name'] = review.creator.first_name
            user['last_name'] = review.creator.last_name
            return user
        return None

    class Meta:
        model = Review


class UnitSerializer(serializers.ModelSerializer):
    building_data = BuildingSerializer(read_only=True, source='building')
    building_reviews = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()
    creator = serializers.SerializerMethodField(required=False)
    amenities = serializers.JSONField(
            required=False, allow_null=True)
    security_deposit = serializers.IntegerField(required=False)
    existing_photos = serializers.JSONField(write_only=True, required=False)

    def get_is_favorite(self, unit):
        if self.context['request'].user.is_authenticated:
            count = Favorite.objects.filter(
                    creator=self.context['request'].user,
                    unit=unit, active=True).count()
            return True if count > 0 else False
        return {}

    def get_building_reviews(self, unit):
        return ReviewSerializer(unit.building.review_set, many=True).data

    # TODO - figure out why we need this here but no up above
    # for the building serializer
    def get_creator(self, unit):
        return unit.creator.pk

    # Validate uploaded images
    def validate(self, data):
        validate_photos(self.context['request'].FILES)
        return data

    # Convert json array string to obj
    def validate_amenities(self, data):
        return json.loads(data)

    class Meta:
        model = Unit


class FullBuildingSerializer(serializers.ModelSerializer):
    unit_set = UnitSerializer(many=True)
    review_set = ReviewSerializer(many=True, read_only=True)
    is_favorite = serializers.SerializerMethodField()
    neighborhood = NeighborhoodSerializer()

    def get_is_favorite(self, building):
        if self.context['request'].user.is_authenticated:
            count = Favorite.objects.filter(
                    creator=self.context['request'].user,
                    building=building, active=True).count()
            return True if count > 0 else False
        return {}

    class Meta:
        model = Building
