# Blocking Part of a Website

You can enable blocking of a part of a website by using the Wallarm-NGINX
configuration file.

To enable blocking, use the directives:

* `location` – an NGINX directive.
* `wallarm_mode block` – a Wallarm directive.

Configuring blocking of a part of a website:

1. Open for editing the configuration file in the `/etc/nginx‑wallarm` directory.
2. Set the blocking rules in the `$wallarm_mode_real` variable and the location to apply the rules in the `location` block:

	```
	http {
	    ...
	    geo $wallarm_mode_real { 
	        default block;
	        1.1.1.1/24 monitoring;
	        2.2.2.2 off;
	    }
	    ...
	    server {
	        ...
	        location /<some_location>/ { 
	            wallarm_mode $wallarm_mode_real;
	        }
	    } 
	}
	```
    
    The blocking rules in the `$wallarm_mode_real` variable apply to requests that target URLs containing `/some_location/` as substrings:
	
    * `default block`&nbsp;— by default, process all the requests and block all the attacks;
    * `1.1.1.1/24 monitoring`&nbsp;— process all the requests coming from an IP address from the «1.1.1.1» — «1.1.1.254» pool, but do not block any, even if an attack is detected;
    * `2.2.2.2 off`&nbsp;— do not filter any requests coming from the «2.2.2.2» IP address.

--8<-- "../include/scanner-whitelist-warning.md"