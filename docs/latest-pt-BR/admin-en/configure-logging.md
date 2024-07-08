[link-nginx-logging-docs]:  https://docs.nginx.com/nginx/admin-guide/monitoring/logging/
[doc-vuln-list]:            ../attacks-vulns-list.md
[doc-monitor-node]:         monitoring/intro.md
[doc-lom]:                  ../user-guides/rules/rules.md

#   Trabalhando com Logs do Nó de Filtro

Um nó de filtro armazena os seguintes arquivos de log no diretório `/var/log/wallarm`:

*   `brute-detect.log`: o log da recuperação dos contadores relacionados ao ataque de força bruta no cluster do nó de filtro.
*   `export-attacks.log`: o log da exportação dos dados dos ataques do módulo pós-analítico para a nuvem Wallarm.
*   `export-counters.log`: o log da exportação dos dados dos contadores (veja [“Monitorando o Nó de Filtro”][doc-monitor-node]).
*   `export-environment.log`: o log da coleta das versões do pacote Wallarm instalado e do upload desses dados para a nuvem Wallarm a serem exibidos nos detalhes do nó de filtragem no console Wallarm. Esses processos são executados uma vez por hora.
*   `syncnode.log`: o log da sincronização do nó de filtro com a nuvem Wallarm (isso inclui a busca dos arquivos [LOM][doc-lom] e proton.db da nuvem).
*   `tarantool.log`: o log das operações do módulo pós-analítico.
*   `sync-ip-lists.log` (nomeado como `sync-blacklist.log` nas versões anteriores do nó): o log da sincronização do nó de filtragem com os endereços IP adicionados às [listas IP](../user-guides/ip-lists/overview.md) como objetos únicos ou sub-redes.
*   `sync-ip-lists-source.log` (nomeado como `sync-mmdb.log` nas versões anteriores do nó): o log da sincronização do nó de filtragem com os endereços IP registrados em países, regiões e data centers a partir das [listas IP](../user-guides/ip-lists/overview.md).
*   `appstructure.log` (somente nos contêineres Docker): o log da atividade do módulo [Descoberta de API](../api-discovery/overview.md).
*   `registernode_loop.log` (somente nos contêineres Docker): o log da atividade do script de início que executa o script `register-node` enquanto ele é executado com sucesso.
*   `weak-jwt-detect.log`: o log da detecção da [vulnerabilidade JWT](../attacks-vulns-list.md#weak-jwt).

##  Configurando o Log Extendido para o Nó de Filtro Baseado em NGINX

NGINX escreve logs das solicitações processadas (logs de acesso) em um arquivo de log separado, usando o formato de log `combined` predefinido por padrão.

```
log_format combined '$remote_addr - $remote_user [$time_local] '
                    '"$request" $request_id $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" ';
```

Você pode definir e usar um formato de log personalizado incluindo uma ou várias variáveis do nó de filtro (além de outras variáveis do NGINX, se necessário). O arquivo de log NGINX permitirá diagnósticos de nó de filtro muito mais rápidos.

### Variáveis do Nó de Filtro

Você pode usar as seguintes variáveis do nó de filtro ao definir o formato de log do NGINX:

|Nome|Tipo|Valor|
|---|---|---|
|`request_id`|String|Identificador de solicitação<br>Tem a seguinte forma de valor: `a79199bcea606040cc79f913325401fb`|
|`wallarm_request_cpu_time`|Flutuante|Tempo em segundos que a CPU da máquina com o nó de filtragem passou processando a solicitação.|
|`wallarm_request_mono_time`|Flutuante|Tempo em segundos que a CPU passou processando a solicitação + tempo na fila. Por exemplo, se a solicitação estava na fila por 3 segundos e processada pela CPU por 1 segundo, então: <ul><li>`"wallarm_request_cpu_time":1`</li><li>`"wallarm_request_mono_time":4`</li></ul>|
|`wallarm_serialized_size`|Inteiro|Tamanho da solicitação serializada em bytes|
|`wallarm_is_input_valid`|Inteiro|Validade da solicitação<br>`0`: solicitação é válida. A solicitação foi verificada pelo nó de filtro e corresponde às regras LOM.<br>`1`: solicitação é inválida. A solicitação foi verificada pelo nó de filtro e não corresponde às regras LOM.|
| `wallarm_attack_type_list` | String | [Tipos de ataques][doc-vuln-list] detectados na solicitação com a biblioteca [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton). Os tipos são apresentados em formato de texto:<ul><li>xss</li><li>sqli</li><li>rce</li><li>xxe</li><li>ptrav</li><li>crlf</li><li>redir</li><li>nosqli</li><li>infoleak</li><li>overlimit_res</li><li>data_bomb</li><li>vpatch</li><li>ldapi</li><li>scanner</li><li>mass_assignment</li><li>ssrf</li><li>ssi</li><li>mail_injection</li><li>ssti</li><li>invalid_xml</li></ul>Se vários tipos de ataques forem detectados em uma solicitação, eles serão listados com o símbolo `|`. Por exemplo: se ataques XSS e SQLi forem detectados, o valor da variável é `xss|sqli`. |
|`wallarm_attack_type`|Inteiro|[Tipos de ataques][doc-vuln-list] detectados na solicitação com a biblioteca [libproton](../about-wallarm/protecting-against-attacks.md#library-libproton). Os tipos são apresentados em formato de string de bit:<ul><li>`0x00000000`: sem ataque: `"0"`</li><li>`0x00000002`: xss: `"2"`</li><li>`0x00000004`: sqli: `"4"`</li><li>`0x00000008`: rce: `"8"`</li><li>`0x00000010`: xxe: `"16"`</li><li>`0x00000020`: ptrav: `"32"`</li><li>`0x00000040`: crlf: `"64"`</li><li>`0x00000080`: redir: `"128"`</li><li>`0x00000100`: nosqli: `"256"`</li><li>`0x00000200`: infoleak: `"512"`</li><li>`0x20000000`: overlimit_res: `"536870912"`</li><li>`0x40000000`: data_bomb: `"1073741824"`</li><li>`0x80000000`: vpatch: `"2147483648"`</li><li>`0x00002000`: ldapi: `"8192"`</li><li>`0x4000`: scanner: `"16384"`</li><li>`0x20000`: mass_assignment: `"131072"`</li><li>`0x80000`: ssrf: `"524288"`</li><li>`0x02000000`: ssi: `"33554432"`</li><li>`0x04000000`: mail_injection: `"67108864"`</li><li>`0x08000000`: ssti: `"134217728"`</li><li>`0x10000000`: invalid_xml: `"268435456"`</li></ul>Se vários tipos de ataques forem detectados em uma solicitação, os valores são resumidos. Por exemplo: se ataques XSS e SQLi forem detectados, o valor da variável é `6`. |

### Exemplo de Configuração

Vamos supor que você precise especificar o formato de log estendido chamado `wallarm_combined` que inclui as seguintes variáveis:
*   todas as variáveis usadas no formato `combined`
*   todas as variáveis do nó de filtro

Para fazer isso, execute as seguintes ações:

1.  As linhas abaixo descrevem o formato de log desejado. Adicione-as ao bloco `http` do arquivo de configuração do NGINX.

    ```
    log_format wallarm_combined '$remote_addr - $remote_user [$time_local] '
                                '"$request" $request_id $status $body_bytes_sent '
                                '"$http_referer" "$http_user_agent" '
                                '$wallarm_request_cpu_time $wallarm_request_mono_time $wallarm_serialized_size $wallarm_is_input_valid $wallarm_attack_type $wallarm_attack_type_list';
    ```

2.  Ative o formato de log estendido adicionando a seguinte diretiva ao mesmo bloco como na primeira etapa:

    `access_log /var/log/nginx/access.log wallarm_combined;`
    
    Os logs de solicitações processadas serão escritos no formato `wallarm_combined` no arquivo `/var/log/nginx/access.log`.
    
    !!! info "Logging Condicional"
        Com a diretiva listada acima, todas as solicitações processadas serão registradas em um arquivo de log, inclusive aquelas que não estão relacionadas a um ataque.
        
        Você pode configurar o log condicional para gravar logs apenas para as solicitações que fazem parte de um ataque (o valor da variável `wallarm_attack_type` não é zero para essas solicitações). Para fazer isso, adicione uma condição à diretiva mencionada: `access_log /var/log/nginx/access.log wallarm_combined if=$wallarm_attack_type;`
        
        Isso pode ser útil se você quiser reduzir o tamanho de um arquivo de log, ou se você integrar um nó de filtro com uma das [soluções SIEM](https://www.wallarm.com/what/siem-whats-security-information-and-event-management-technology-part-1).          

3.  Reinicie o NGINX executando um dos seguintes comandos, dependendo do sistema operacional que você está usando:

    --8<-- "../include-pt-BR/waf/restart-nginx-4.4-and-above.md"

!!! info "Informação detalhada"
    Para ver informações detalhadas sobre a configuração de logs no NGINX, prossiga para este [link][link-nginx-logging-docs].