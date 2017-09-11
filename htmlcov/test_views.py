from django.test import RequestFactory
from django.contrib.auth.models import AnonymousUser
from mixer.backend.django import mixer
import pytest
pytestmark = pytest.mark.django_db

from musilux.views import homepage


class TestMusiluxView:
    def test_view(self):
        req = RequestFactory().get('/')
        resp = homepage(req)
        assert resp.status_code == 200, 'Should be callable by anyone'