from django.urls import path
from games.views import HomeView, MathGameView, AnagramGameView, record_score

app_name = "games"
urlpatterns = [
    path('', HomeView.as_view(), name="homepage"),
    path('math-game/', MathGameView.as_view(), name="math-game"),
    path('anagram-game/', AnagramGameView.as_view(), name="anagram-game"),
    path('record-score/', record_score, name="record-score")
]
