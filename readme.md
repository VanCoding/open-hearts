open-hearts
===========
An open source, web-based, multiplayer hearts game.

installation
------------
- run `git clone https://github.com/VanCoding/open-hearts.git` to get the source code
- run `npm install` to install the dependencies
- create a `config.json` file, and set properties according to the `configuration` section
- run `node ./` to start the server
- visit `http://localhost:PORT` with port being the port configured in the config.json file, to see the match list and start a game

configuration
-------------
A file called `config.json` must be present in the applications working directory. Possible properties:

**port**: The TCP port the application will listen on

technology stack
----------------

### server (JS)
- **Node.js** A javascript runtime
- **Koa** A HTTP framework for Node.js
- **ws** A WebSocket library for Node.js
- **watchify** A javascript bundler to build the client and merge all JavaScript files into one

### client (HTML/CSS/JS)
- **Firefox/Chrome** A modern web browser that supports modern JavaScript features
- **react** A JavaScript view-library to build user interfaces
- **react-playing-cards** A react playing card component to render playing cards
- **bootstrap** A CSS library to quickly build user interfaces

license
-------
GPLv3
