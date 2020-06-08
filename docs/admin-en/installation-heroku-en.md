[anchor1]:      #language-and-app-server-agnostic
[anchor2]:      #environment-variables
[anchor3]:      #customizable-nginx-configuration
[anchor4]:      #application-and-dyno-coordination
[doc-monitoring]: monitoring/intro.md

# Installing as a Heroku App

!!! warning "Installation prerequisites"
    Before installing the filter node please make sure the following requirements are respected:
    
    * Your app is using the Heroku-16 or Heroku-18 stack. Detailed information about stacks is available in [Heroku documentation](https://devcenter.heroku.com/articles/stack).
    * You have a Wallarm account with the Administrator role.

Wallarm can protect web-applications and API deployed on the Heroku platform. The Wallarm filter node can be installed by connecting the application to a Buildpack that was built specifically for Heroku apps.

You can get the Heroku Buildpack from the [Wallarm public repository](https://github.com/wallarm/heroku-buildpack-wallarm-node).

The Buildpack contains the following features:
* [L2met](https://github.com/ryandotsmith/l2met) friendly NGINX log format.
* [Heroku request IDs](https://devcenter.heroku.com/articles/http-request-id) embedded in NGINX logs. 
* The app crashes dyno when NGINX or an app server crashes. Safety first.
* [Language/App Server agnostic][anchor1].
* [Environment variables for filter node configuration][anchor2]
* [Customizable NGINX configuration][anchor3].
* [Application-coordinated dyno starts][anchor4].

### Language and App Server Agnostic

The Wallarm Node buildpack provides the `wallarm/bin/start-wallarm` command. This command takes your app server's startup command as an argument.

For example, to get Wallarm Node and Unicorn up and running, run the following command:

```
cat Procfile
web: wallarm/bin/start-wallarm bundle exec unicorn -c config/unicorn.rb 
```

### Environment Variables

You can use the following environment variables:

* `WALLARM_API_HOST`&nbsp;— The Wallarm API address.
* `WALLARM_USER`&nbsp;— The user on the Wallarm portal in the [EU](https://my.wallarm.com/settings/users) or [US](https://us1.my.wallarm.com/settings/users) cloud that has rights to add new nodes.
* `WALLARM_PASSWORD`&nbsp;— The user password.
* `WALLARM_MODE`&nbsp;— The request handling mode: *off*, *monitoring* (default), *blocking*.
* `WALLARM_TARANTOOL_MEMORY`&nbsp;— The amount of memory in gigabytes allocated to postanalytics; 50% of total memory by default.

For example, to set your `WALLARM_MODE` to the blocking mode, run the following command:

```
heroku config:set WALLARM_MODE=block
```

### Customizable NGINX Configuration

You can provide your own NGINX configuration by creating a file named `nginx.conf.erb` in the directory `wallarm/etc/nginx`.

Start by copying the buildpack's [default configuration file](https://github.com/wallarm/heroku-buildpack-wallarm-node/blob/master/nginx.conf.erb).

!!! info "Monitoring the filter node"
    By modifying this configuration file, you can enable monitoring of a filter node deployed on the Heroku platform.
    
    To do so, add the `allow <MONITORING_SERVER_IP_ADDRESS>` directive containing the `<MONITORING_SERVER_IP_ADDRESS>` public IP address of your monitoring system to the `/wallarm-status` location block in this file:
    
    ```
    location = /wallarm-status {
        allow <MONITORING_SERVER_IP_ADDRESS>;
        allow 127.0.0.1;
        allow ::1;
        deny all;
        wallarm_status on;
        access_log off;
    }
    ```
   Read how to monitor a filter node [here][doc-monitoring].

### Application and Dyno Coordination

The buildpack will not start NGINX with the Wallarm module until a file is written to `/tmp/app‑initialized`. Since NGINX binds to the dyno's $PORT and since $PORT determines if the app can receive traffic, you can delay NGINX traffic reception until your application is ready to handle it. The examples below show how and when you should write the file when working with Unicorn.

## Filter Node Setup Example

Here are the two setup examples. The first example demonstrates the installation of a new app; The second one demonstrates the installation of an existing app. In both cases, we are using Ruby & Unicorn. However, you can use the Buildpack to install Wallarm for applications which are written in other programming languages or use other servers.

### Existing Application

Update the buildpacks using the following command:

```
heroku buildpacks:add https://github.com/wallarm/heroku-buildpack-wallarm-node.git
```

Update the Procfile to contain the following:

```
web: wallarm/bin/start-wallarm bundle exec unicorn -c config/unicorn.rb
```

```
git add Procfile
git commit -m 'Update procfile for Wallarm Node buildpack'
```

Update Unicorn configuration to include the following :

```
require 'fileutils'
listen '/tmp/nginx.socket'
before_fork do |server,worker|
  FileUtils.touch('/tmp/app-initialized')
end
```

Commit the changes using the following commands:

```
git add config/unicorn.rb
git commit -m 'Update unicorn config to listen on NGINX socket.'
```

Connect to the Wallarm cloud by running the command depending on the [cloud](../quickstart-en/how-wallarm-works/qs-intro-en.md#cloud) you are using: 

=== "EU cloud"
    ``` bash
    heroku config:set WALLARM_USER=<your email>
    heroku config:set WALLARM_PASSWORD=<your password>
    ```
=== "US cloud"
    ``` bash
    heroku config:set WALLARM_API_HOST=us1.api.wallarm.com
    heroku config:set WALLARM_USER=<your email>
    heroku config:set WALLARM_PASSWORD=<your password>
    ```

Deploy the changes using the following command:

```bash
git push heroku master
```

### New Application
!!! info
    We are using Ruby & Unicorn. However, you can use the Buildpack to install Wallarm for applications which are written in other programming languages or use other servers.
    
    These are the components you need to have installed on your system for the following instructions to work: gcc, [heroku cli](https://devcenter.heroku.com/articles/heroku-cli), [bundler](https://bundler.io/).

Create a directory for the app using the following command:

```
mkdir myapp; cd myapp
git init
```

Create a Gemfile containing the following code:

```
source 'https://rubygems.org'
gem 'unicorn'
gem 'rack'
```

Create a `config.ru` file using the following command:

```
run Proc.new {[200,{'Content-Type' => 'text/plain'}, ["hello world"]]}
```

Create a `config/unicorn.rb` file containing the following configurations for an application server that receives connections through the local socket:

```
require 'fileutils'
preload_app true
timeout 5
worker_processes 4
listen '/tmp/nginx.socket', backlog: 1024

before_fork do |server,worker|
  FileUtils.touch('/tmp/app-initialized')
end
```

Install Gems using the following command:

```
bundle install
```

Create a Procfile containing the following:

```
web: wallarm/bin/start-wallarm bundle exec unicorn -c config/unicorn.rb
```

Create & push the Heroku app by running the command depending on the [cloud] you are using: 

=== "EU cloud"
    ``` bash
    heroku create
    heroku buildpacks:add heroku/ruby
    heroku buildpacks:add https://github.com/wallarm/heroku-buildpack-wallarm-node.git
    heroku config:set WALLARM_USER=<your email>
    heroku config:set WALLARM_PASSWORD=<your password>
    git add .
    git commit -am "init"
    git push heroku master
    heroku logs -t
    ```
=== "US cloud"
    ```bash
    heroku create
    heroku buildpacks:add heroku/ruby
    heroku buildpacks:add https://github.com/wallarm/heroku-buildpack-wallarm-node.git
    heroku config:set WALLARM_API_HOST=us1.api.wallarm.com
    heroku config:set WALLARM_USER=<your email>
    heroku config:set WALLARM_PASSWORD=<your password>
    git add .
    git commit -am "init"
    git push heroku master
    heroku logs -t
    ```

Check the app using the following command:

```
heroku open
```
