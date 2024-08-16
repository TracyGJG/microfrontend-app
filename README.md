# microfrontend-app

A sampler demonstrating dynamic configuration of screens comprising of multiple micro-frontends using iframes.

## start-up

The URL for the host application use port 5501 as employed by Visual Studio Code and the Live Server extention.

The remote applications (micro-frontends) use port 5502 and are served by json-server. This is started using the `npm test` script.

There is no build process required and configuration is loaded and processed at run-time, consequently can be modified and reloaded rapidly.
