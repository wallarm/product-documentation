!!! info "Concedendo permissão de `root` ao usuário"
    Se você está executando o NGINX como um usuário que não possui permissão de `root`, adicione este usuário ao grupo `wallarm` utilizando o seguinte comando:
    
    ```
    usermod -aG wallarm <nome_do_usuário>;
    ```
    
    onde `<nome_do_usuário>` é o nome do usuário sem permissão de `root`.