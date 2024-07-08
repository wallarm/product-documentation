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
[configure-proxy-balancer-instr]:   ../../../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[update-instr]:                     ../../../../updating-migrating/nginx-modules.md
[install-postanalytics-docs]:        ../../../../../admin-en/installation-postanalytics-en/
[dynamic-dns-resolution-nginx]:     ../../../../admin-en/configure-dynamic-dns-resolution-nginx.md
[waf-mode-recommendations]:          ../../../../about-wallarm/deployment-best-practices.md#follow-recommended-onboarding-steps
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[versioning-policy]:                ../../../../updating-migrating/versioning-policy.md#version-list
[install-postanalytics-instr]:      ../../../../admin-en/installation-postanalytics-en.md
[waf-installation-instr-latest]:     /installation/nginx/dynamic-module/
[img-node-with-several-instances]:  ../../../../images/user-guides/nodes/wallarm-node-with-two-instances.png
[img-create-wallarm-node]:      ../../../../images/user-guides/nodes/create-cloud-node.png
[nginx-custom]:                 ../../../../faq/nginx-compatibility.md#is-wallarm-filtering-node-compatible-with-the-custom-build-of-nginx
[node-token]:                       ../../../../quickstart/getting-started.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[platform]:                         ../../../supported-deployment-options.md
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md

# Implantação com o Instalador All-in-One

Um **instalador all-in-one** foi projetado para simplificar e padronizar o processo de instalação do nodo Wallarm como um módulo dinâmico para o NGINX em diversos ambientes. Este instalador identifica automaticamente as versões do sistema operacional e do NGINX e instala todas as dependências necessárias.

Em comparação com os pacotes Linux individuais oferecidos pela Wallarm para [NGINX](individual-packages-nginx-stable.md), [NGINX Plus](individual-packages-nginx-plus.md) e [NGINX fornecido pela distribuição](individual-packages-nginx-distro.md), o **instalador all-in-one** simplifica o processo, executando automaticamente as seguintes ações:

1. Verifica a versão do seu sistema operacional e do NGINX.
1. Adiciona os repositórios Wallarm para a versão do SO e do NGINX detectada.
1. Instala os pacotes Wallarm a partir desses repositórios.
1. Conecta o módulo Wallarm instalado ao seu NGINX.
1. Conecta o nodo de filtro à nuvem Wallarm usando o token fornecido.

![Comparação entre all-in-one e manual](../../../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## Casos de uso

--8<-- "../include-pt-BR/waf/installation/all-in-one/use-cases.md"

## Requisitos

--8<-- "../include-pt-BR/waf/installation/all-in-one-requirements.md"

## Passo 1: Instalar NGINX e dependências

--8<-- "../include-pt-BR/waf/installation/all-in-one-nginx.md"

## Passo 2: Preparar token Wallarm

--8<-- "../include-pt-BR/waf/installation/all-in-one-token.md"

## Passo 3: Baixar instalador all-in-one Wallarm

--8<-- "../include-pt-BR/waf/installation/all-in-one-installer-download.md"

## Passo 4: Executar instalador all-in-one Wallarm

--8<-- "../include-pt-BR/waf/installation/all-in-one-installer-run.md"

Os comandos nos próximos passos são os mesmos para instalações x86_64 e ARM64.

## Passo 5: Ativar o nodo Wallarm para analisar o tráfego

--8<-- "../include-pt-BR/waf/installation/common-steps-to-enable-traffic-analysis-inline.md"

## Passo 6: Reiniciar o NGINX

--8<-- "../include-pt-BR/waf/installation/restart-nginx-systemctl.md"

## Passo 7: Configurar o envio de tráfego para o nodo Wallarm

--8<-- "../include-pt-BR/waf/installation/sending-traffic-to-node-inline.md"

## Passo 8: Testar operação do nodo Wallarm

--8<-- "../include-pt-BR/waf/installation/test-waf-operation-no-stats.md"

## Passo 9: Ajustar a solução implantada

O módulo dinâmico Wallarm com configurações padrão está instalado. O nodo de filtragem pode necessitar de alguma configuração adicional após a implantação.

As configurações do Wallarm são definidas usando as [diretivas NGINX](../../../../admin-en/configure-parameters-en.md) ou a interface do usuário do console Wallarm. As diretivas devem ser configuradas nos seguintes arquivos na máquina com o nodo Wallarm:

* `/etc/nginx/nginx.conf` com as configurações do NGINX
* `/etc/nginx/wallarm-status.conf` com as definições de monitoramento do nodo Wallarm. Uma descrição detalhada está disponível no [link][wallarm-status-instr]
* `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf` com as configurações para o plugin `collectd` que coleta estatísticas do Tarantool

Abaixo, algumas das configurações típicas que você pode aplicar, se necessário:

* [Configuração do modo de filtragem][waf-mode-instr]
* [Alocando recursos para os nodos Wallarm][memory-instr]
* [Registrando variáveis do nodo Wallarm][logging-instr]
* [Usando o balanceador do servidor proxy atrás do nodo de filtragem][proxy-balancer-instr]
* [Limitando o tempo de processamento de uma única solicitação na diretiva `wallarm_process_time_limit`][process-time-limit-instr]
* [Limitando o tempo de espera da resposta do servidor na diretiva `proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [Limitando o tamanho máximo da solicitação na diretiva `client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Configurando a resolução dinâmica do DNS no NGINX][dynamic-dns-resolution-nginx]

## Opções de lançamento

Assim que você tiver o script all-in one baixado, você pode obter ajuda com ele através do seguinte comando:

```
sudo sh ./wallarm-4.8.0.x86_64-glibc.sh -- -h
```

Que retorna:

```
...
Uso: setup.sh [options]... [arguments]... [filtering/postanalytics]

OPÇÃO                      DESCRIÇÃO
-b, --batch                 Modo em lote, instalação não interativa.
-t, --token TOKEN           Token do nodo, usado apenas em modo em lote.
-c, --cloud CLOUD           Nuvem Wallarm, um dos EUA/UE, padrão é UE, usado apenas em modo em lote.
-H, --host HOST             Endereço da API Wallarm, por exemplo, api.wallarm.com ou us1.api.wallarm.com, usado apenas em modo em lote.
-P, --port PORT             Porta da API Wallarm, por exemplo, 443.
    --no-ssl                Desativar SSL para acesso à API Wallarm.
    --no-verify             Desativar verificação de certificados SSL.
-f, --force                 Se houver um nodo com o mesmo nome, crie uma nova instância.
-h, --help
    --version
```

Note que: 

* A opção `--batch` habilita um **modo em lote (não interativo)**. Neste modo, se você não usar parâmetros adicionais, o nodo é instalado imediatamente após o lançamento do script, sem requerer interação adicional ou entrada de dados do usuário. O modo em lote:
 
    * Requer `--token`
    * Instala o nodo na nuvem UE por padrão
    * Permite modificações do comportamento do script com opções adicionais

* O alternador `filtering/postanalytics` permite instalar [separadamente](../../../../admin-en/installation-postanalytics-en.md#postanalytics-module-installation-via-all-in-one-installation-script) o módulo postanalítico. Se o alternador não for usado, a parte de filtragem e pós-análise é instalada junta.