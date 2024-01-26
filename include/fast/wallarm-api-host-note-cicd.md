!!! warning "Connecting FAST node to one of the Wallarm clouds"
    A FAST node interacts with one of the [available Wallarm clouds](../../cloud-list.md). By default, a FAST node works with the Wallarm API server that is located in the American cloud.
    
    To instruct a FAST node to use the API server from another cloud, pass to the node container the `WALLARM_API_HOST` environment variable that points to the address of the necessary Wallarm API server.
    
    Example (for a FAST node using the API server located in the European Wallarm cloud):

    ```
    WALLARM_API_HOST=api.wallarm.com      
    ```