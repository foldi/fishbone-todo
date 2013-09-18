#Fishbone-ToDo: A fishbone.js ToDo example.

This project was inspired by a talk from [Martin Kleppe at JSConfEU2013](http://2013.jsconf.eu/speakers/martin-kleppe-1024-seconds-of-js-wizardry.html) where he talked about fishbone.js. The project attempts to create the classic Todo web app example using the smallest libraries I could find. The app code plus libraries weigh in at ~14K.

* MVC - [fishbone.js](https://github.com/aemkei/fishbone.js)
* Routing - [route-recognizer](https://github.com/tildeio/route-recognizer)
* HTML Templating - [doT.js](https://github.com/olado/doT)


Building this project
======

This project uses [Grunt](http://gruntjs.com). To build the project first install the node modules.

```
npm install
```

Next, run grunt.

```
grunt
```

A pre-commit hook is defined in /pre-commit that runs jshint. To use the hook, run the following:

```
ln -s ../../pre-commit .git/hooks/pre-commit
```

A post-commit hook is defined in /post-commit that runs the Plato complexity analysis tools. To use the hook, run the following:

```
ln -s ../../post-commit .git/hooks/post-commit
```