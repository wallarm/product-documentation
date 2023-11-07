---
search:
  exclude: true
---

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
[node-token]:                       ../../../../quickstart.md#deploy-the-wallarm-filtering-node
[api-token]:                        ../../../../user-guides/settings/api-tokens.md
[platform]:                         ../../../supported-deployment-options.md
[img-grouped-nodes]:                ../../../../images/user-guides/nodes/grouped-nodes.png
[wallarm-token-types]:              ../../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[ip-lists-docs]:                    ../../../../user-guides/ip-lists/overview.md
[oob-advantages-limitations]:       ../../../oob/overview.md#advantages-and-limitations
[web-server-mirroring-examples]:    ../../../oob/web-server-mirroring/overview.md#examples-of-web-server-configuration-for-traffic-mirroring

# Implantando com o instalador All-in-One

Estas instruções descrevem os passos para instalar o Wallarm como um módulo dinâmico [OOB](../overview.md) usando um **instalador all-in-one** projetado para simplificar e padronizar o processo de instalação do nó Wallarm como um módulo dinâmico para NGINX em vários ambientes. Este instalador identifica automaticamente as versões do seu sistema operacional e do NGINX, e instala todas as dependências necessárias.

Em comparação com os pacotes Linux individuais oferecidos pelo Wallarm para [NGINX](nginx-stable.md), [NGINX Plus](nginx-plus.md), e [NGINX fornecido pela distribuição](nginx-distro.md), o **instalador all-in-one** simplifica o processo realizando automaticamente as seguintes ações:

1. Verificando a versão do seu SO e do NGINX.
1. Adicionando os repositórios Wallarm para o SO detectado e a versão NGINX.
1. Instalando pacotes Wallarm desses repositórios.
1. Conectando o módulo Wallarm instalado ao seu NGINX.
1. Conectando o nó de filtragem ao Wallarm Cloud usando o token fornecido.

![Comparação entre All-in-One e Manual](../../../../images/installation-nginx-overview/manual-vs-all-in-one.png)

## Casos de uso

--8<-- "../include/waf/installation/all-in-one/use-cases.md"

## Requisitos

--8<-- "../include/waf/installation/all-in-one-requirements.md"

## Passo 1: Instalar o NGINX e as dependências

--8<-- "../include/waf/installation/all-in-one-nginx.md"

## Passo 2: Preparar o token Wallarm

--8<-- "../include/waf/installation/all-in-one-token.md"

## Passo 3: Baixar o instalador Wallarm all-in-one

--8<-- "../include/waf/installation/all-in-one-installer-download.md"

## Passo 4: Executar o instalador Wallarm all-in-one

--8<-- "../include/waf/installation/all-in-one-installer-run.md"

Os comandos nos próximos passos são os mesmos para as instalações x86_64 e ARM64.

## Passo 5: Habilitar o nó Wallarm para analisar o tráfego

--8<-- "../include/waf/installation/oob/steps-for-mirroring-linux-all-in-one.md"

## Passo 6: Reiniciar o NGINX

--8<-- "../include/waf/installation/restart-nginx-systemctl.md"

## Passo 7: Configurar o envio de tráfego para o nó Wallarm

--8<-- "../include/waf/installation/sending-traffic-to-node-oob.md"

## Passo 8: Testar a operação do nó Wallarm

--8<-- "../include/waf/installation/test-waf-operation-no-stats.md"

## Passo 9: Ajustar a solução implantada

O módulo Wallarm dinâmico com as configurações padrão está instalado. O nó de filtragem pode exigir alguma configuração adicional após a implantação.

As configurações Wallarm são definidas usando as [diretivas NGINX](../../../../admin-en/configure-parameters-en.md) ou a UI do Console Wallarm. As diretivas devem ser definidas nos seguintes arquivos na máquina com o nó Wallarm:

* `/etc/nginx/nginx.conf` com as configurações NGINX
* `/etc/nginx/wallarm-status.conf` com as configurações de monitoramento do nó Wallarm. Uma descrição detalhada está disponível no [link][wallarm-status-instr]
* `/opt/wallarm/etc/collectd/wallarm-collectd.conf.d/wallarm-tarantool.conf` com as configurações para o plugin `collectd` que coleta estatísticas do Tarantool

Abaixo estão algumas das configurações típicas que você pode aplicar se necessário:

* [Alocando recursos para os nós Wallarm][memory-instr]
* [Fazendo logging das variáveis do nó Wallarm][logging-instr]
* [Usando o balanceador do servidor proxy atrás do nó de filtragem][proxy-balancer-instr]
* [Limitando o tempo de processamento de uma única solicitação na diretiva `wallarm_process_time_limit`][process-time-limit-instr]
* [Limitando o tempo de espera da resposta do servidor na diretiva NGINX `proxy_read_timeout`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_read_timeout)
* [Limitando o tamanho máximo da solicitação na diretiva NGINX `client_max_body_size`](https://nginx.org/en/docs/http/ngx_http_core_module.html#client_max_body_size)
* [Configurando a resolução dinâmica de DNS no NGINX][dynamic-dns-resolution-nginx]

## Opções de lançamento

Assim que você tiver o script all-in-one baixado, você pode obter ajuda sobre ele com:

```
sudo sh ./wallarm-4.8.0.x86_64-glibc.sh -- -h
```

Que retorna:

```
...
Uso: setup.sh [opções]... [argumentos]... [filtragem/pós-análitica]

OPÇÃO                      DESCRIÇÃO
-b, --batch                 Modo batch, instalação não interativa.
-t, --token TOKEN           Token do nó, usado apenas no modo batch.
-c, --cloud CLOUD           Wallarm Cloud, uma das US/EU, padrão é EU, usado apenas no modo batch.
-H, --host HOST             Endereço da API Wallarm, por exemplo, api.wallarm.com ou us1.api.wallarm.com, usado apenas no modo batch.
-P, --port PORT             Pot da API Wallarm, por exemplo, 443.
    --no-ssl                Desativar SSL para acesso à API Wallarm.
    --no-verify             Desativar a verificação de certificados SSL.
-f, --force                 Se houver um nó com o mesmo nome, criar uma nova instância.
-h, --help
    --version
```

Note que: 

* A opção `--batch` habilita o **modo batch (não interativo)**. Neste modo, se você não usar parâmetros adicionais, o nó é instalado imediatamente após o lançamento do script, não requerendo nenhuma interação adicional ou entrada de dados do usuário. O modo batch:
 
    * Requer `--token`
    * Instala o nó no Cloud do EU por padrão
    * Permite modificações no comportamento do script com opções adicionais

* O alternador `filtering/postanalytics` permite instalar [separadamente](../../../../admin-en/installation-postanalytics-en.md#postanalytics-module-installation-via-all-in-one-installation-script) o módulo de pós-análise. Se o alternador não for usado, as partes de filtragem e pós-análise são instaladas juntas.
