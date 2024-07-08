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

# Instalação do Módulo Dinâmico Wallarm OOB para NGINX Stable usando Pacotes Linux

Estas instruções descrevem os passos para instalar Wallarm como um módulo dinâmico [OOB](../overview.md) usando pacotes Linux para NGINX `estável` do nginx.org.

Wallarm suporta os seguintes sistemas operacionais:

* Debian 11.x (bullseye)
* Ubuntu 18.04 LTS (bionic)
* Ubuntu 20.04 LTS (focal)
* Ubuntu 22.04 LTS (jammy)
* CentOS 7.x
* Amazon Linux 2.0.2021x e inferior
* AlmaLinux, Rocky Linux ou Oracle Linux 8.x
* RHEL 8.x

## Casos de uso

--8<-- "../include-pt-BR/waf/installation/linux-packages/nginx-stable-use-cases.md"

## Requisitos

--8<-- "../include-pt-BR/waf/installation/linux-packages/requirements-nginx-stable.md"

--8<-- "../include-pt-BR/waf/installation/linux-packages/common-steps-to-install-node-nginx-stable.md"

## 6. Habilitar Wallarm para analisar o tráfego

--8<-- "../include-pt-BR/waf/installation/oob/steps-for-mirroring-linux.md"

## 7. Reiniciar NGINX

--8<-- "../include-pt-BR/waf/root_perm_info.md"

--8<-- "../include-pt-BR/waf/restart-nginx-4.4-and-above.md"

## 8. Configurar o envio de tráfego para a instância Wallarm

--8<-- "../include-pt-BR/waf/installation/sending-traffic-to-node-oob.md"

## 9. Testar operação do nó Wallarm

--8<-- "../include-pt-BR/waf/installation/test-waf-operation-no-stats.md"

## 10. Ajuste fino da solução implantada

O módulo dinâmico Wallarm com as configurações padrão está instalado para NGINX `estável`. O nó de filtragem pode requerer alguma configuração adicional após a implementação.

As configurações Wallarm são definidas por meio das [diretrizes NGINX](../../../../admin-en/configure-parameters-en.md) ou da Wallarm Console UI. As diretrizes devem ser configuradas nos seguintes arquivos na máquina com o nó Wallarm:

* `/etc/nginx/conf.d/default.conf` com as configurações NGINX
* `/etc/nginx/conf.d/wallarm.conf` com as configurações globais do nó de filtragem

    Este arquivo é usado para configurações aplicadas a todos os domínios. Para aplicar diferentes configurações a grupos de domínios diferentes, use o arquivo `default.conf` ou crie novos arquivos de configuração para cada grupo de domínios (por exemplo, `example.com.conf` e `test.com.conf`). Mais informações detalhadas sobre os arquivos de configuração NGINX estão disponíveis na [documentação oficial do NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` com as configurações de monitoramento do nó Wallarm. Descrição detalhada está disponível no [link][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` or `/etc/sysconfig/wallarm-tarantool` com as configurações do banco de dados Tarantool

Abaixo estão alguns dos ajustes típicos que você pode aplicar se necessário:

--8<-- "../include-pt-BR/waf/installation/linux-packages/common-customization-options.md"

* [Configurando resolução dinâmica de DNS no NGINX][dynamic-dns-resolution-nginx]
