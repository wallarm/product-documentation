[img-wl-console-users]:             ../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                    ../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:      ../../../admin-en/installation-postanalytics-en/
[versioning-policy]:               ../../updating-migrating/versioning-policy.md#version-list
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[install-postanalytics-instr]:      ../../admin-en/installation-postanalytics-en.md
[img-node-with-several-instances]:  ../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:          ../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                     ../custom/custom-nginx-version.md
[node-token]:                       ../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../installation/supported-deployment-options.md
[inline-docs]:                      ../inline/overview.md
[oob-docs]:                         ../oob/overview.md
[oob-advantages-limitations]:       ../oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[img-grouped-nodes]:                ../../images/user-guides/nodes/grouped-nodes.png

# Instalando como um Módulo Dinâmico para NGINX fornecido pela distribuição

Essas instruções descrevem os passos para instalar o nó de filtragem do Wallarm como um módulo dinâmico para a versão de código aberto do NGINX instalada a partir dos repositórios Debian/CentOS.

!!! info "Instalação completa"
    A partir do nó Wallarm 4.6, recomenda-se o uso da [instalação completa](all-in-one.md) que automatiza todas as atividades listadas nos passos abaixo e facilita muito a implementação do nó.

O NGINX Open Source pode ser obtido do nginx.org ou dos repositórios padrão do Debian/CentOS, dependendo das suas necessidades, preferências de versão do NGINX e políticas de gerenciamento de repositório. O Wallarm fornece pacotes tanto para [nginx.org](dynamic-module.md) como para versões fornecidas pela distribuição. Este guia foca no NGINX dos repositórios Debian/CentOS.

## Casos de uso

--8<-- "../include-pt-BR/waf/installation/linux-packages/nginx-distro-use-cases.md"

## Requisitos

--8<-- "../include-pt-BR/waf/installation/linux-packages/requirements-nginx-distro.md"

--8<-- "../include-pt-BR/waf/installation/linux-packages/common-steps-to-install-node-nginx-distro.md"

## 5. Ative o Wallarm para analisar o tráfego

--8<-- "../include-pt-BR/waf/installation/common-steps-to-enable-traffic-analysis.md"

## 6. Reiniciar o NGINX

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

## 7. Configurar o envio de tráfego para a instância do Wallarm

--8<-- "../include-pt-BR/waf/installation/sending-traffic-to-node-inline-oob.md"

## 8. Testar a operação do nó Wallarm

--8<-- "../include-pt-BR/waf/installation/test-waf-operation-no-stats.md"

## 9. Ajustar a solução implantada

O módulo dinâmico Wallarm com configurações padrão é instalado para o NGINX `estável`. O nó de filtragem pode necessitar de alguma configuração adicional após a implantação.

As configurações do Wallarm são definidas usando as [diretivas NGINX](../../admin-en/configure-parameters-en.md) ou a interface do usuário do Console Wallarm. As diretivas devem ser definidas nos seguintes arquivos na máquina com o nó Wallarm:

* `/etc/nginx/conf.d/default.conf` com configurações do NGINX
* `/etc/nginx/conf.d/wallarm.conf` com configurações globais do nó de filtragem

    Este arquivo é usado para configurações aplicadas a todos os domínios. Para aplicar configurações diferentes para diferentes grupos de domínio, usa-se o arquivo `default.conf` ou criar novos arquivos de configuração para cada grupo de domínio (por exemplo, `example.com.conf` e `test.com.conf`). Mais informações detalhadas sobre os arquivos de configuração do NGINX estão disponíveis na [documentação oficial do NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` com configurações de monitoramento do nó Wallarm. A descrição detalhada está disponível no [link][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` ou `/etc/sysconfig/wallarm-tarantool` com as configurações do banco de dados Tarantool

Abaixo estão algumas das configurações típicas que você pode aplicar, se necessário:

* [Configuração do modo de filtração][waf-mode-instr]

--8<-- "../include-pt-BR/waf/installation/linux-packages/common-customization-options.md"

* [Configurando a resolução dinâmica de DNS no NGINX][dynamic-dns-resolution-nginx]