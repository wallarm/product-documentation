To check the NGINX‑Wallarm and separate postanalytics modules interaction, you can send the request with test attack to the address of the protected application:

```bash
curl http://localhost/etc/passwd
```

If the NGINX‑Wallarm and separate postanalytics modules are configured properly, the attack will be uploaded to the Wallarm Cloud and displayed in the **Attacks** section of Wallarm Console:

![Attacks in the interface][img-attacks-in-interface]

If the attack was not uploaded to the Cloud, please check that there are no errors in the services operation:

* Analyze the postanalytics module logs

    ```bash
    sudo cat /opt/wallarm/var/log/wallarm/wstore-out.log
    ```

    If there is the record like `SystemError binary: failed to bind: Cannot assign requested address`, make sure that the server accepts connection on specified address and port.
* On the server with the NGINX‑Wallarm module, analyze the NGINX logs:

    ```bash
    sudo cat /var/log/nginx/error.log
    ```

    If there is the record like `[error] wallarm: <address> connect() failed`, make sure that the address of separate postanalytics module is specified correctly in the NGINX‑Wallarm module configuration files and separate postanalytics server accepts connection on specified address and port.
* On the server with the NGINX‑Wallarm module, get the statistics on processed requests using the command below and make sure that the value of `tnt_errors` is 0

    ```bash
    curl http://127.0.0.8/wallarm-status
    ```

    [Description of all parameters returned by the statistics service →][statistics-service-all-parameters]