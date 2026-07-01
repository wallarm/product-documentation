#   Wallarm Clouds List

FAST relies on two clouds for its operation. These clouds are divided based on geographical location. They are:
* American cloud (aka *US cloud*).
* European cloud (aka *EU cloud*).

During its operation, FAST interacts with the Wallarm portal and API server that are located in one of the clouds:
* US cloud:
    * Wallarm portal: <https://us1.my.wallarm.com>
    * Wallarm API server: `us1.api.wallarm.com`
* EU cloud:
    * Wallarm portal: <https://my.wallarm.com>
    * Wallarm API server: `api.wallarm.com`

!!! warning "Please, pay attention"
    **Rules of interaction with Wallarm clouds:**
        
    You can only interact with a Wallarm portal and API server that are located in the same cloud.
        
    **Wallarm clouds and FAST documentation:** 

    * For the sake of simplicity, it is assumed throughout the documentation that FAST interacts with the American Wallarm cloud.
    * All information from the documentation is equally applicable to all available clouds, unless stated otherwise.   
    * If you interact with the European cloud, then use the corresponding addresses of the Wallarm portal and the API server when working with FAST and the documentation.
