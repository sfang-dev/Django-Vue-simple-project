# Django-Vue入门项目开发实践

原文来自：https://www.webucator.com/article/connecting-django-and-vue/

```
Django   |    V4.1
Vue-cli  |    V5.0.8
```



## 1. 创建Django环境

1. 创建Python虚拟环境，这里我用的Conda。创建后进入django环境

    `conda create -n django`

2. `conda install django` 安装Django库

3. `django-admin startproject djangovue_project` 初始化Django，在当前路径下生成名为 `djangovue_project` 的文件夹，结构如下

    ```
    ├── djangovue_project
    │   ├── __init__.py
    │   ├── asgi.py
    │   ├── settings.py
    │   ├── urls.py
    │   └── wsgi.py
    └── manage.py
    ```

    测试一下 `python manage.py runserver`

    ![3](https://cdn.jsdelivr.net/gh/feng-sifang/pichost/imgs/3.png)



## 2. 搭建Django

1. `python manage.py startapp games ` 创建app `games` 后目录如下

    ```
    ├── db.sqlite3
    ├── djangovue_project
    │   ├── __init__.py
    │   ├── __pycache__
    │   ├── asgi.py
    │   ├── settings.py
    │   ├── urls.py
    │   └── wsgi.py
    ├── games
    │   ├── __init__.py
    │   ├── admin.py
    │   ├── apps.py
    │   ├── migrations
    │   ├── models.py
    │   ├── tests.py
    │   └── views.py
    └── manage.py
    ```

2. 添加新建的app到Django的配置文件 `djangovue_project/settings.py` 

    ```
    INSTALLED_APPS = [
        'django.contrib.admin',
        'django.contrib.auth',
        'django.contrib.contenttypes',
        'django.contrib.sessions',
        'django.contrib.messages',
        'django.contrib.staticfiles',
    
        # local apps
        'games.apps.GamesConfig'
    ]
    
    ```

## 3. 配置视图/URLs/模版

### 视图

打开 `games/views.py` 创建三个视图。这些视图在后面分别是主页和两个游戏。

```python
from django.views.generic import TemplateView

class HomeView(TemplateView):
    template_name = "home.html"

class MathGameView(TemplateView):
    template_name = "math-game.html"

class AnagramGameView(TemplateView):
    template_name = "anagram-game.html"
```

### URLs

1. 创建 `games/urls.py` ，添加以下代码

```python
from django.urls import path
from games.views import HomeView, MathGameView, AnagramGameView

app_name = "games"
urlpatterns = [
    path('', HomeView.as_view(), name="homepage"),
    path('math-game/', MathGameView.as_view(), name="math-game"),
    path('anagram-game/', AnagramGameView.as_view(), name="anagram-game")
]
```

2. 打开Django的 `djangovue_project/urls.py` 做一些配置，把 `games/urls.py` 连接起来。

    ```python
    from django.contrib import admin
    from django.urls import path, include
    
    urlpatterns = [
        path('admin/', admin.site.urls),
        path('', include("games.urls"))
    ]
    ```

### 网页模版

1. 在项目根目录创建 `templates` 文件夹。

2. 在 `djangovue_project/settings.py` 里配置一下模版的路径。

    ```python
    TEMPLATES = [
        {
            'BACKEND': 'django.template.backends.django.DjangoTemplates',
            'DIRS': [BASE_DIR / 'templates'],
            'APP_DIRS': True,
            'OPTIONS': {
                'context_processors': [
                    'django.template.context_processors.debug',
                    'django.template.context_processors.request',
                    'django.contrib.auth.context_processors.auth',
                    'django.contrib.messages.context_processors.messages',
                ],
            },
        },
    ]
    ```

    在templates目录下创建三个页面的模版。

    ```
    templates
    ├── anagram-game.html
    ├── home.html
    └── math-game.html
    ```

    简单模版如下，另外两个页面也参考这样的模式先编写一个简单的html文件进行访问。把 `title` 和 `body` 的内容换成对应页面。

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Home</title>
    </head>
    <body>
      <h1>Home</h1>
    </body>
    </html>
    ```

    此时你可以在以下访问你的三个网址：

    1. http://127.0.0.1:8000/
    2. http://127.0.0.1:8000/math-game/
    3. http://127.0.0.1:8000/anagram-game/

    但是此时三个网址都是互相独立的，下面我们会在首页做一个导航进行页面之间的跳转。

## 4. 模版提升

鉴于我们需要重复使用类似结构的设计，可以编写一个 `html` 模版，在别的 `html` 文件中调用这个模版。

1. 建立 `templates/_base.html`

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>
            {% block title %}{% endblock %} | Games
        </title>
    </head>
    <body>
        {% block main %}{% endblock %}
    </body>
    </html>
    ```

    该模版的目的是为了减少重复出现的代码。其实这里才是真正意义上的模版。

    这里 `{% block title %}{% endblock %}` 在下面的文件中对应，拓展 `_base.html` 的文件将可以自定义替换其中的内容。类似于变量，`block` 后跟变量名。

    下面以 `math-game.html` 为例子：

    ```html
    {% extends "_base.html" %}
    
    {% block title %}
        Math-Game
    {% endblock %}
    
    {% block main %}
        <h1>
            Math-Game
        </h1>
    {% endblock %}
    ```

    实际就会生成之前一样内容的网页，title有变化，可以观察一下。然后完成另外两个网页的设计。

    <img src="https://cdn.jsdelivr.net/gh/feng-sifang/pichost/imgs/image-20230325204556296.png" alt="image-20230325204556296" style="zoom:50%;" />

## 5. 在模版中添加导航链接

此处使用Django的内置url标签。

`{% url 'namespace:url-pattern-name' %}` 

更改 `templates/_base.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>
        {% block title %}{% endblock %} | Games
    </title>
</head>
<body>
    <header>
        <nav>
            <a href="{% url 'games:homepage' %}">Home</a> |
            <a href="{% url 'games:math-game' %}">Math Game</a> |
            <a href="{% url 'games:anagram-game' %}">Anagram Game</a>
        </nav>
    </header>
    {% block main %}{% endblock %}
</body>
</html>
```

## 6. 添加Vue

新打开一个terminal窗口

1. 如果没有安装过Vue，运行 `npm install -g @vue/cli`

2. 运行 `vue create app_name vue-games ` ，选vue-3，我这里先在桌面创建了叫 `vue-games` 的工程文件，后面我们再整合。

<img src="https://cdn.jsdelivr.net/gh/feng-sifang/pichost/imgs/image-20230325210737379.png" alt="image-20230325210737379"  />

3. 目录结构

    ```
    ├── README.md
    ├── babel.config.js
    ├── jsconfig.json
    ├── node_modules
    ├── package.json
    ├── public
    ├── src
    ├── vue.config.js
    └── yarn.lock
    ```

    运行  `npm run serve`

    ![image-20230325211226558](https://cdn.jsdelivr.net/gh/feng-sifang/pichost/imgs/image-20230325211226558.png)

​	看到Vue图标就是成功了。

4. 删除 `.git` 文件，将 `vue-games` 添加至 `djangovue_project` 项目路径，与`games` 平级。

    ```
    .
    ├── db.sqlite3
    ├── djangovue_project
    ├── games
    ├── manage.py
    ├── static
    ├── templates
    └── vue-games
    ```

## 7. 更改模版文件

1. 首先更改Vue的配置文件 `vue-games/vue.config.js` ，没有就创建。

    ```javascript
    module.exports = {
      publicPath: 'http://localhost:8080',  // the base URL where your app will be deployed
      outputDir: '../static/dist',          // the path for where files will be output when the app is built
      indexPath: '../../templates/_base_vue.html', // the path for the generated index file
    
      configureWebpack: {
        devServer: {
          devMiddleware: {
            writeToDisk: true
          }
        }
      }
    }
    ```

2. 根据目录创建一个 `static/dist` 这里注意拼写，不要写错。该目录与 `games` 平级。这里会放一些应用文件。

3. 在 `djangovue_project/settings.py` 找到 `STATIC_URL = 'static/'` ，在下添加，让Django定位路径。

    ```python
    STATIC_URL = 'static/'
    STATICFILES_DIRS = [
        BASE_DIR / 'static',
    ]
    ```

4. 修改 `templates/_base.html` ，为后面使用。

    ```html
    <!DOCTYPE html>
    {% block html %}
        <html lang="en">
    
        <head>
            {% block head %}
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>
                    {% block title %}{% endblock %} | Games
                </title>
            {% endblock %}
        </head>
    
        <body>
            {% block body %}
                <header>
                    <nav>
                        <a href="{% url 'games:homepage' %}">Home</a> |
                        <a href="{% url 'games:math-game' %}">Math Game</a> |
                        <a href="{% url 'games:anagram-game' %}">Anagram Game</a>
                    </nav>
                </header>
                {% block main %}{% endblock %}
            {% endblock %}
        </body>
        </html>
    {% endblock %}
    ```

    这里主要修改了几个 `block` ，后面会调用这里的内容。下面编辑 `vue-games/public/index.html`

    ```html
    {% extends '_base.html' %}
    
    {% block html %}
    <html lang="en">
    <head>
        {% block head %}
        {{ block.super }}
        {% endblock %}
    </head>
    
    <body>
        {% block body %}
        {{ block.super }}
        <noscript>
            <strong>
                We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work
                properly without JavaScript enabled. Please enable it to continue.
            </strong>
        </noscript>
        <div id="app"></div>
        <!-- built files will be auto injected -->
        {% endblock body %}
    </body>
    </html>
    {% endblock html %}
    ```

    跟之前的语法很像，`block` 里还是之前的用法，但是这里 `block.super` 作用是取用模版里的内容。[`block.super`](https://docs.djangoproject.com/en/4.0/howto/overriding-templates/#extending-an-overridden-template)

5. 让之前的页面调用Vue的模版，同理作用其他两个页面。

    ```html
    {% extends "_base_vue.html" %}
    
    {% block title %}
        Home
    {% endblock %}
    
    {% block main %}
        <h1>
            Home
        </h1>
    {% endblock %}
    ```

6. 运行服务器

    在根目录下执行 `python manage.py runserver` 

    在`vue-games ` 下执行  `npm run serve`

    ![image-20230325234743032](https://cdn.jsdelivr.net/gh/feng-sifang/pichost/imgs/image-20230325234743032.png)

    ![image-20230325234730773](https://cdn.jsdelivr.net/gh/feng-sifang/pichost/imgs/image-20230325234730773.png)

​	打开http://127.0.0.1:8000/

![image-20230325234818198](https://cdn.jsdelivr.net/gh/feng-sifang/pichost/imgs/image-20230325234818198.png)

## 8. 编写不同的游戏界面

现在所有的页面都是相同的，我们接下来分别创建不同的页面。这里我们要用到vue-router。

vue-router是Vue.js官方的路由插件，它和vue.js是深度集成的，适合用于构建单页面应用。vue的单页面应用是基于路由和组件的，路由用于设定访问路径，并将路径和组件映射起来。传统的页面应用，是用一些超链接来实现页面切换和跳转的。在vue-router单页面应用中，则是路径之间的切换，也就是组件的切换。路由模块的本质 就是建立起url和页面之间的映射关系。
————————————————
版权声明：本文为CSDN博主「艾艾猫dori」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/m0_45899013/article/details/106680880

1. 将两个服务器停止运行，使用 `control-c` 退出。

2. 创建 `vue-games/src/apps` 文件夹

3. 创建 `vue-games/src/apps/AnagramGame.vue` 和 `vue-games/src/apps/MathGame.vue`

4. 在 `vue-games` 下运行 `npm install vue-router@4`

5. 在 `vue-games` 创建 `vue-games/src/router.js`

    ```javascript
    import {createWebHistory, createRouter} from "vue-router";
    import AnagramGame from "./apps/AnagramGame.vue";
    import MathGame from "./apps/MathGame.vue";
    
    const routes = [
        {
            path: '/anagram-game',
            component: AnagramGame
        },
        {
            path: '/math-game',
            component: MathGame
        }
    ];
    
    const router = createRouter({
        history: createWebHistory(),
        routes: routes
    });
    
    export default router;
    ```

6. 打开 `vue-games/src/main.js`

    ```javascript
    import {createApp} from 'vue';
    import router from './router';
    
    import App from './App';
    
    const app = createApp(App);
    
    app.use(router);  // tell app to use router
    app.mount("#app");  // mount our app on the div#app element in our template
    ```

7. 编辑 `vue-games/src/App.vue`

    ```vue
    <template>
        <router-view/>
    </template>
    ```

<img src="https://cdn.jsdelivr.net/gh/feng-sifang/pichost/imgs/image-20230326005959346.png" alt="image-20230326005959346" style="zoom:50%;" />

## 9. Django和Vue的数据交流

为了充分利用我们的Vue前端，我们需要能够与我们的Django后端数据交换。在这个例子中，我们将创建极其简化的Vue游戏版本，并在后台更新分数。到目前为止，我们还没有创建任何Django模型，它代表了我们存储数据的方式。我们将创建一个单一的GameScore模型来存储游戏分数，为哪场比赛的分数，得到分数的用户的名字，以及取得分数的时间。

1. 建立简单模型，打开 `games/models.py` 

    ```python
    from django.db import models
    
    
    class GameScore(models.Model):
        user_name = models.TextField()
        game = models.TextField()
        score = models.IntegerField()
        created = models.DateTimeField(auto_now_add=True)
    ```

​	`auto_now_add=True` 当我们记录分数的时候会自动添加当前时间。

2. 运行 `python manage.py makemigrations` 让Django来为我们的数据库制作一个新的迁移文件。
3. 运行 `python manage.py migrate` 将我们的模型（以及所有默认模型）添加到数据库中。

![image-20230326115732569](https://cdn.jsdelivr.net/gh/feng-sifang/pichost/imgs/image-20230326115732569.png)

<img src="https://cdn.jsdelivr.net/gh/feng-sifang/pichost/imgs/image-20230326115751119.png" alt="image-20230326115751119" style="zoom: 67%;" />

## 10. 新建游戏选项

我们成功地创建了我们的GameScore模型，但让我们做一个小小的改进。目前，我们的游戏字段只是一个普通的文本字段。让我们使用选择选项来使它，游戏只能是 "MATH "或 "ANAGRAM"。改变 `games/models.py` ，使游戏使用选择。

编辑 `games/models.py`

```python
from django.db import models

class GameScore(models.Model):
    MATH = "MATH"
    ANAGRAM = "ANAGRAM"

    GAME_CHOICES = [
        (MATH, "Math Game"),
        (ANAGRAM, "Anagram Game")
    ]

    user_name = models.TextField()
    game = models.TextField(choices=GAME_CHOICES, default=MATH)
    score = models.IntegerField()
    created = models.DateTimeField(auto_now_add=True)
```

运行 `python manage.py makemigrations && python manage.py migrate`

![image-20230326122541188](https://cdn.jsdelivr.net/gh/feng-sifang/pichost/imgs/image-20230326122541188.png)

## 11. 构建新页面

为了让Vue更新Django，我们需要一个它可以发布的URL。为了设置这个，我们需要一个新的Django视图和URL。

1. 编辑 `games/views.py`

    ```python
    from django.views.generic import TemplateView
    import json
    from django.http import JsonResponse
    from games.models import GameScore
    
    
    class HomeView(TemplateView):
        template_name = "home.html"
    
    
    class MathGameView(TemplateView):
        template_name = "math-game.html"
    
    
    class AnagramGameView(TemplateView):
        template_name = "anagram-game.html"
    
    
    def record_score(request):
        data = json.loads(request.body)
    
        user_name = data["user-name"]
        game = data["game"]
        score = data["score"]
    
        new_score = GameScore(user_name=user_name, game=game, score=score)
        new_score.save()
    
        response = {
            "success": True
        }
    
        return JsonResponse(response)
    
    ```

2. 这个函数视图接收一个请求，从其主体中读取数据，用这些数据创建一个新的GameScore实例，然后返回一个简单的json响应。

    编辑 `games/urls.py`

    ```python
    from django.urls import path
    from games.views import HomeView, MathGameView, AnagramGameView, record_score
    
    app_name = "games"
    urlpatterns = [
        path('', HomeView.as_view(), name="homepage"),
        path('math-game/', MathGameView.as_view(), name="math-game"),
        path('anagram-game/', AnagramGameView.as_view(), name="anagram-game"),
        path('record-score/', record_score, name="record-score")
    ]
    ```

    我们已经创建了一个你可以从你的前端发布的URL，以保存游戏分数。现在让我们更新我们的Vue游戏，以便我们可以提交分数。要做到这一点，我们需要使用Ajax。

3. Ajax是一种让前端的JavaScript与后端通信而不刷新页面的方法。这是由fetch()方法或XMLHttpRequest提供的，然而还有一些额外的库可以使这个过程更加容易。我推荐 `axios`。

    在 `vue-games` 目录下运行 `npm install --save axios vue-axios` 安装axios和vue-axios，它是一个额外的库，使axios与Vue的使用更加容易。

    编辑 `vue-games/src/main.js`

    ```javascript
    import {createApp} from 'vue';
    import router from './router';
    
    import App from './App';
    import axios from 'axios';
    import VueAxios from "vue-axios";
    
    const app = createApp(App);
    
    app.use(router);  // tell app to use router
    app.use(VueAxios, axios);  // tell app to use axios
    app.mount("#app");  // mount our app on the div#app element in our template
    ```

    编辑 `vue-games/src/apps/MathGame.vue`

    ```html
    <template>
        <p>This is the math game Vue.</p>
        <div>
            <div>
                <label for="user-name">Username</label>
                <input name="user-name" id="user-name"/>
            </div>
            <div>
                <label for="score">Score</label>
                <input name="score" type="number" id="user-name"/>
            </div>
            <button>Record Score</button>
        </div>
    </template>
    
    <style>
    div, label {
        padding: 0.2rem;
    }
    </style>
    ```

    现在你应该可以看到这样的界面

    ![image-20230326125151543](https://cdn.jsdelivr.net/gh/feng-sifang/pichost/imgs/image-20230326125151543.png)

    现在我们给按钮添加功能

    ```html
    <template>
        <p>This is the math game Vue.</p>
        <div>
            <div>
                <label for="user-name">Username</label>
                <input name="user-name" id="user-name" v-model="userName"/>
            </div>
            <div>
                <label for="score">Score</label>
                <input name="score" type="number" id="user-name" v-model="score"/>
            </div>
            <button @click="recordScore">Record Score</button>
        </div>
    </template>
    
    <style>
    div, label {
        padding: 0.2rem;
    }
    </style>
    
    <script>
    export default {
        name: "MathGame",
        data() {
            return {
                userName: "",
                score: 0
            }
        },
        methods: {
            async recordScore() {
                const data = {
                    "user-name": this.userName,
                    "socre": this.score,
                    "game": "MATH"
                };
    
                const response = (await this.axios.post("/record-score/", data)).data;
                console.log(response);
            }
        }
    }
    </script>
    ```

    `name` 是Vue组件的一个选项，它用于指定该组件的名称。在这个例子中，组件名称被设置为"MathGame"。当在父组件中使用该组件时，可以使用这个名称来引用它。

    `data` 是Vue组件的一个选项，用于定义组件的数据。在这个例子中，`data`方法返回一个包含两个属性的对象：`userName` 和`score`。`userName` 属性初始化为一个空字符串，而 `score` 属性初始化为0。这些数据属性将存储在组件实例中，并可以通过 `this` 关键字在组件中的其他选项中进行访问。

4. 我们已经添加了两个数据变量来跟踪用户名和分数值`userName, score` 。我们将在稍后把这些变量与我们的输入连接起来。`recordScore` 是一个异步 `async` 函数，使用 `axios` 将我们的用户名和分数数据发送到后端。请注意，我们也在为游戏值发送 `MATH` ，因为我们要知道是哪个游戏。我们可以使用 `v-model` 和 `@click` 来连接我们的数据和输入，并确保在按钮被点击时调用 `recordData` 。

5. 但是现在，如果你点击按钮提交用户和分数，在终端中可以看到报错。

    ![image-20230326153441704](https://cdn.jsdelivr.net/gh/feng-sifang/pichost/imgs/image-20230326153441704.png)

    这是一个跨网站请求伪造错误，它是一项安全预防措施，以防止不良分子编写代码从其他网站发布到我们的服务器。

    为了解决这个错误，我们需要做两件事：

    1. 打开 `templates/_base_vue.html` ，在` {% endblock body %}` 标签的正上方添加 `{% csrf_token %}` 。现在我们将能够访问这个令牌，以验证我们的请求是来自我们控制的网站。

        ![image-20230326153753083](https://cdn.jsdelivr.net/gh/feng-sifang/pichost/imgs/image-20230326153753083.png)

    2. 再次打开 `vue-games/src/main.js` ，在 `const app = createApp(App);` 上面添加以下内容：

        ![image-20230326153830021](https://cdn.jsdelivr.net/gh/feng-sifang/pichost/imgs/image-20230326153830021.png)

        这段代码告诉 `axios` 在每个请求中自动包含CSRF令牌值。这意味着我们不需要为每个请求添加它，这可能会变得很麻烦。现在，如果我们重启浏览器，并尝试再次提交分数，它应该是有效的！记得是重启，不是刷新。

        ![image-20230326153957062](https://cdn.jsdelivr.net/gh/feng-sifang/pichost/imgs/image-20230326153957062.png)

## 12. 显示分数界面

1. 编辑 `games/views.py` 创建新类

    ```python
    class GameScoresView(TemplateView):
        template_name = "game-scores.html"
    
        def get_context_data(self, **kwargs):
            context = super(GameScoresView, self).get_context_data(**kwargs)
            context['anagram_scores'] = GameScore.objects.filter(game__exact='ANAGRAM').order_by('-score')
            context['math_scores'] = GameScore.objects.filter(game__exact='MATH').order_by('-score')
            return context
    ```

2. 创建 `templates/game-scores.html`

    ```html
    {% extends "_base.html" %}
    
    {% block title %}Game Scores{% endblock %}
    {% block main %}
        <h1>Game Scores</h1>
        <h2>Math Game</h2>
        <ol>
            {% for score in math_scores %}
                <li>{{ score.score }}: ({{ score.user_name }} - {{ score.created }})</li>
            {% endfor %}
        </ol>
    
        <h2>Anagram Game</h2>
        <ol>
            {% for score in anagram_scores %}
                <li>{{ score.score }}: ({{ score.user_name }} - {{ score.created }})</li>
            {% endfor %}
        </ol>
    {% endblock %}
    ```

    `get_context_data()` 函数使 `anagram_scores` 和 `math_scores` 变量可以在 `templates/game-scores.html` 模板中访问。 `filter(game__exact=[Game Type])` 用来过滤所有的游戏分数对象，`order_by('-score')` 用来按分数降序排序。

3. 打开`games/urls.py` ，就像你之前做的那样，导入新的视图并创建一个新路径

    ```python
    from django.urls import path
    from games.views import *  # lazy way 
    
    app_name = "games"
    urlpatterns = [
        path('', HomeView.as_view(), name="homepage"),
        path('math-game/', MathGameView.as_view(), name="math-game"),
        path('anagram-game/', AnagramGameView.as_view(), name="anagram-game"),
        path('record-score/', record_score, name="record-score"),
        path('game-scores/', GameScoresView.as_view(), name='game-scores')
    ]
    ```

4. 最后，你可以到 `templates/_base.html` ，在页眉处有一个新的链接到游戏分数页面

    ![image-20230326213116865](https://cdn.jsdelivr.net/gh/feng-sifang/pichost/imgs/image-20230326213116865.png)



![image-20230326213203131](https://cdn.jsdelivr.net/gh/feng-sifang/pichost/imgs/image-20230326213203131.png)

![image-20230326213215466](https://cdn.jsdelivr.net/gh/feng-sifang/pichost/imgs/image-20230326213215466.png)

# 如何使用Git仓库

初次 `clone` 仓库的时候直接运行 `python manage.py migrate` 和 `npm run serve` 后Vue会报错，数据库也会报错。

1. 在 `vue-games`目录运行 `rm -rf node_modules && npm install` 重新安装一下环境。这时候Vue有了。
2. 在项目根目录运行 `python manage.py migrate` 重新链接数据库。



















































