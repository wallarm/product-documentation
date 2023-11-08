!!! info "A versão do pacote `wallarm-node-tarantool`"
    O pacote `wallarm-node-tarantool` deve ser da mesma versão ou superior aos pacotes do módulo principal NGINX-Wallarm instalados em um servidor separado.

    Para verificar as versões:

    === "Debian"
        ```bash
        # execute no servidor com o módulo principal NGINX-Wallarm
        apt list wallarm-node-nginx
        # execute no servidor com o módulo pós-analítico
        apt list wallarm-node-tarantool
        ```
    === "Ubuntu"
        ```bash
        # execute no servidor com o módulo principal NGINX-Wallarm
        apt list wallarm-node-nginx
        # execute no servidor com o módulo pós-analítico
        apt list wallarm-node-tarantool
        ```
    === "CentOS ou Amazon Linux 2.0.2021x e inferior"
        ```bash
        # execute no servidor com o módulo principal NGINX-Wallarm
        yum list wallarm-node-nginx
        # execute no servidor com o módulo pós-analítico
        yum list wallarm-node-tarantool
        ```
    === "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
        ```bash
        # execute no servidor com o módulo principal NGINX-Wallarm
        yum list wallarm-node-nginx
        # execute no servidor com o módulo pós-analítico
        yum list wallarm-node-tarantool
        ```
    === "RHEL 8.x"
        ```bash
        # execute no servidor com o módulo principal NGINX-Wallarm
        yum list wallarm-node-nginx
        # execute no servidor com o módulo pós-analítico
        yum list wallarm-node-tarantool
        ```