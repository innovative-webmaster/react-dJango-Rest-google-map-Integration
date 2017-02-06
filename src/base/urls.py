from django.conf.urls import url, include

from base import views as base_views
from rest_framework.routers import SimpleRouter

router = SimpleRouter(trailing_slash=False)
router.register(r'buildings', base_views.BuildingViewset,
                base_name='buildings')
router.register(r'units', base_views.UnitViewset)
router.register(r'reviews', base_views.ReviewViewset)
router.register(r'users', base_views.UserViewSet)
router.register(r'favorites', base_views.FavoriteViewset)
router.register(r'neighborhoods', base_views.NeighborhoodViewset)

urlpatterns = [
        url(r'^', include(router.urls)),
]
