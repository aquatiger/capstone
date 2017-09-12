from .. import forms
from forms import CustomUserCreationForm

class TestPostForm:
    def test_form(self):
        form = forms.PostForm(data={})
        assert form.is_valid() is False. ('Should be invalid if no data is given')

        data = {'body': 'Hello'}