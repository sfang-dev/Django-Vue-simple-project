from django.db import models


class GameScore(models.Model):
    user_name = models.TextField()
    game = models.TextField()
    score = models.IntegerField()
    created = models.DateTimeField(auto_now_add=True)
