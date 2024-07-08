[img-wl-console-users]:             ../../images/check-user-no-2fa.png
[wallarm-status-instr]:             ../../admin-en/configure-statistics-service.md
[memory-instr]:                     ../../admin-en/configuration-guides/allocate-resources-for-node.md
[waf-directives-instr]:             ../../admin-en/configure-parameters-en.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:           ../../images/admin-guides/test-attacks-quickstart.png
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[configure-selinux-instr]:          ../../admin-en/configure-selinux.md
[configure-proxy-balancer-instr]:   ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../../admin-en/installation-postanalytics-en/
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:          ../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]:     /installation/nginx/dynamic-module/
[img-node-with-several-instances]:  ../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../custom/custom-nginx-version.md
[node-token]:                       ../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../user-guides/settings/api-tokens.md
[wallarm-token-types]:              ../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[platform]:                         ../../installation/supported-deployment-options.md
[inline-docs]:                      ../inline/overview.md
[oob-docs]:                         ../oob/overview.md
[oob-advantages-limitations]:       ../oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring
[img-grouped-nodes]:                ../../images/user-guides/nodes/grouped-nodes.png

# Instalando como um Módulo Dinâmico para o NGINX Estável

Estas instruções descrevem as etapas para instalar o nó de filtragem Wallarm como um módulo dinâmico para a versão de código aberto do NGINX `estável` que foi instalado a partir do repositório da NGINX.

!!! info "Instalação completa"
    A partir do nó Wallarm 4.6, é recomendado utilizar a [instalação completa](all-in-one.md) que automatiza todas as atividades listadas nas etapas abaixo e facilita muito a implantação do nó.

## Casos de uso

--8<-- "../include-pt-BR/waf/installation/linux-packages/nginx-stable-use-cases.md"

## Requisitos

--8<-- "../include-pt-BR/waf/installation/linux-packages/requirements-nginx-stable.md"

--8<-- "../include-pt-BR/waf/installation/linux-packages/common-steps-to-install-node-nginx-stable.md"

## 6. Habilitar o Wallarm para analisar o tráfego

--8<-- "../include-pt-BR/waf/installation/common-steps-to-enable-traffic-analysis.md"

## 7. Reiniciar o NGINX

--8<-- "../include-pt-BR/waf/root_perm_info.md"

--8<-- "../include-pt-BR/waf/restart-nginx-4.4-and-above.md"

## 8. Configurar o envio de tráfego para a instância Wallarm

--8<-- "../include-pt-BR/waf/installation/sending-traffic-to-node-inline-oob.md"

## 9. Testar a operação do nó Wallarm

--8<-- "../include-pt-BR/waf/installation/test-waf-operation-no-stats.md"

## 10. Ajustar a solução implantada

O módulo dinâmico Wallarm com definições padrão está instalado para o NGINX `estável`. O nó de filtragem pode necessitar de algumas configurações adicionais após a implantação.

As definições do Wallarm são definidas utilizando as [diretivas de NGINX](../../admin-en/configure-parameters-en.md) ou o UI do Console Wallarm. As diretivas devem ser definidas nos seguintes arquivos na máquina com o nó Wallarm:

* `/etc/nginx/conf.d/default.conf` com as definições de NGINX
* `/etc/nginx/conf.d/wallarm.conf` com definições globais do nó de filtragem

    O arquivo é usado para definições aplicadas a todos os domínios. Para aplicar definições diferentes a grupos de domínios diferentes, use o arquivo `default.conf` ou crie novos arquivos de configuração para cada grupo de domínio (por exemplo, `example.com.conf` e `test.com.conf`). Informações mais detalhadas sobre arquivos de configuração do NGINX estão disponíveis na [documentação oficial do NGINX](https://nginx.org/en/docs/beginners_guide.html).
* `/etc/nginx/conf.d/wallarm-status.conf` com definições de monitoramento do nó Wallarm. A descrição detalhada está disponível no [link][wallarm-status-instr]
* `/etc/default/wallarm-tarantool` ou `/etc/sysconfig/wallarm-tarantool` com as definições do banco de dados Tarantool

Abaixo estão algumas das definições típicas que você pode aplicar, se necessário:

* [Configuração do modo de filtragem][waf-mode-instr]

--8<-- "../include-pt-BR/waf/installation/linux-packages/common-customization-options.md"

* [Configuração da resolução DNS dinâmico no NGINX][dynamic-dns-resolution-nginx]
