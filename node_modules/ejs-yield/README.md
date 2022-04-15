# EJS layout template for ExpressJS

> NODE: v6.12.2

> NPM: 5.6.0

## Example Use

file: `app.js`

```js
var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(require('ejs-yield'))
```

> require('ejs-yield')


file: `views/layout.ejs`

```ejs
<!DOCTYPE html>
<html>
<head>
	<title><%= title %></title>
	<link rel='stylesheet' href='/stylesheets/style.css' />
</head>
<body>
	<%- yield %>
</body>
</html>
```

> Add `<%- yield %>`

> `layout.ejs` is required


file: `views/index.ejs`

```ejs
	<h1><%= title %></h1>
	<p>Welcome to <%= title %></p>
```


file: `routes/index.js`

```js
var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
	res.layout('index', { title: 'Express' })
})

module.exports = router
```

## Use different/custom layout

Load own layout

file: `views/custom-layout.ejs`

```ejs
<!DOCTYPE html>
<html>
<head>
	<title>Custom Layout | <%= title %></title>
	<link rel='stylesheet' href='/stylesheets/style.css' />
</head>
<body>
	<%- yield %>
</body>
</html>
```

file: `routes/index.js`

```js
var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
	res.layout('index', {
		layout: 'custom-layout',
		title: 'Express'
	})
})

module.exports = router
```

> `layout: 'custom-layout'`


## Work In Progress (WIP)

> Work In Progress (WIP)
