SelfHostNancyWorkflow
=====================

My workflow when creating AngularJS applications with a self-hosted NancyFx application on the server.

Assumes you have node and bower installed globally. 

Run the NancyFx server through Visual Studio then open `cmd` and `cd` into the project directory and then run `npm install` and `bower install`.

Finally run either `gulp` or `gulp --build production` and open a browser at `http://localhost:5000` to view the page. Start making changes to client files and watch it automatically refresh and update.


Issues
======

Sometimes when you run `gulp` or `gulp --build production` it will error, simply running it again will resolve this, I dont know why it doesnt work sometimes yet.

Make sure to use `/* @ngInject */` when you want to inject dependencies into your angular files (look at `home.js` for a sample)
