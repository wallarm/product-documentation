[img-wl-console-users]:             ../../../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../../../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../../../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../../../admin-en/installation-postanalytics-en.md
[dynamic-dns-resolution-nginx]:     ../../../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:          ../../../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../../../admin-en/installation-postanalytics-en.md
[img-node-with-several-instances]:  ../../../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../../custom/custom-nginx-version.md
[node-token]:                       ../../../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../../../installation/supported-deployment-options.md
[oob-advantages-limitations]:       ../../overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png

# Instalando o Módulo Dinâmico Wallarm OOB para Distribuição Provida de NGINX

Estas instruções descrevem os passos para instalar o Wallarm como um módulo dinâmico [OOB](../overview.md) usando pacotes Linux para distribuição provida de NGINX.

NGINX Open Source pode ser obtido a partir de nginx.org ou dos repositórios default de Debian/CentOS dependendo das suas necessidades, preferências de versão do NGINX e políticas de gerenciamento de repositórios. Wallarm fornece pacotes para ambas versões 
[nginx.org](nginx-stable.md) e fornecidas pela distribuição. Este guia se foca no NGINX de repositórios Debian/CentOS.

O módulo Wallarm é compatível com NGINX provida pela distribuição nos seguintes sistemas operacionais:

* Debian 10.x (buster)
* Debian 11.x (bullseye)
* CentOS 7.x
* AlmaLinux, Rocky Linux ou Oracle Linux 8.x
* RHEL 8.x

## Casos de uso

--8<-- "../include-pt-BR/waf/installation/linux-packages/nginx-distro-use-cases.md"

## Requisitos

--8<-- "../include-pt-BR/waf/installation/linux-packages/requirements-nginx-distro.md"

--8<-- "../include-pt-BR/waf/installation/linux-packages/common-steps-to-install-node-nginx-distro.md"

## 5. Ativar Wallarm para analisar o tráfego

--8<-- "../include-pt-BR/waf/installation/oob/steps-for-mirroring-linux.md"

## 6. Reiniciar NGINX

--8<-- "../include-pt-BR/waf/root_perm_info.md"

=== "Debian"
    ```bash
    sudo systemctl restart nginx
    ```
=== "CentOS"
    ```bash
    sudo systemctl restart nginx
    ```
=== "AlmaLinux, Rocky Linux ou Oracle Linux 8.x"
    ```bash
    sudo systemctl restart nginx
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart nginx
    ```

## 7. Configurar o envio de tráfego para a instância Wallarm

--8<-- "../include-pt-BR/waf/installation/sending-traffic-to-node-oob.md"

## 8. Testar a operação do nó Wallarm

--8<-- "../include-pt-BR/waf/installation/test-waf-operation-no-stats.md"

## 9. Ajustar finamente a solução implantada

O módulo dinâmico Wallarm com configurações default é instalado para o NGINX `stable`. O nó de filtragem pode exigir alguma configuração adicional após a implantação.

As configurações do Wallarm são definidas usando as [diretivas do NGINX](../../../../admin-en/configure-parameters-en.md) ou a interface de usuário Wallarm Console. As directivas devem ser definidas nos seguintes arquivos na máquina com o nó Wallarm:

* `/etc/nginx/conf.d/default.conf` com configurações do NGINX
* `/etc/nginx/conf.d/wallarm.conf` com configurações globais do nó de filtragem

    O arquivo é usado para configurações aplicadas a todos os domínios. Para aplicar configurações diferentes a diferentes grupos de domínios, use o arquivo `default.conf` ou crie novos arquivos de configuração para cada grupo de domínio (por exemplo, `example.com.conf` e `test.com.conf`). Informações mais detalhadas sobre os arquivos de configuração do NGINX estão disponíveis na [documentação oficial do NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` com as configurações de monitoramento do nó Wallarm. Uma descrição detalhada está disponível [aqui][wallarm-status-instr].
* `/etc/default/wallarm-tarantool` ou `/etc/sysconfig/wallarm-tarantool` com as configurações de banco de dados do Tarantool

Abaixo estão algumas das configurações típicas que você pode aplicar se necessário:

--8<-- "../include-pt-BR/waf/installation/linux-packages/common-customization-options.md"

* [Configurando a resolução dinâmica do DNS no NGINX][dynamic-dns-resolution-nginx]