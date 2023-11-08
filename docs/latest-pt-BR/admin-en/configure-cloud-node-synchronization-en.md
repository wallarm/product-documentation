# Configurando a sincronização entre o nó Wallarm e a Cloud 

O nó de filtragem sincroniza regularmente com a Wallarm Cloud para:

* Obter atualizações para [regras de processamento de tráfego (LOM)](../about-wallarm/protecting-against-attacks.md#custom-rules-for-request-analysis)
* Obter atualizações de [proton.db](../about-wallarm/protecting-against-attacks.md#library-libproton)
* Enviar dados sobre ataques e vulnerabilidades detectados
* Enviar métricas para o tráfego processado

Estas instruções descrevem os parâmetros e métodos usados para configurar a sincronização do nó de filtragem e da Nuvem Wallarm.

## Parâmetros de acesso

O arquivo `node.yaml` contém os parâmetros que fornecem ao nó de filtragem acesso à Cloud. 

Este arquivo é criado automaticamente após a execução do script `register-node` e inclui o nome e UUID do nó de filtragem, e a chave secreta da API Wallarm. O caminho padrão para o arquivo é `/etc/wallarm/node.yaml`. Esse caminho pode ser alterado através da diretiva [`wallarm_api_conf`](configure-parameters-en.md#wallarm_api_conf).

O arquivo `node.yaml` pode conter os seguintes parâmetros de acesso:

| Parâmetro | Descrição | Valor padrão |
| --------- | ----------- | ------------- |
| `hostname`       | Nome do nó de filtragem. Esta variável é **obrigatória** para ser definida no arquivo `node.yaml`. | Fornecido por `register-node` |
| `regtoken`       | Token para o nó poder acessar a API Wallarm. | Fornecido por `register-node` |
| `uuid`           | UUID do nó de filtragem. Esta variável é **obrigatória** para ser definida no arquivo `node.yaml`. | Fornecido por `regtoken` |
| `secret`         | Chave secreta para acessar a API Wallarm. Esta variável é **obrigatória** para ser definida no arquivo `node.yaml`. | Fornecido por `regtoken` |
| `api.host`       | Endpoint da API Wallarm. Pode ser:<ul><li>`us1.api.wallarm.com` para a Nuvem US</li><li>`api.wallarm.com` para a Nuvem EU</li></ul> | `api.wallarm.com` |
| `api.port`       | Porta da API Wallarm. | `443` |
| `api.use_ssl`  | Se deve usar SSL ao se conectar à API Wallarm. | `true` |
| `api.ca_verify`  | Se deve habilitar/desabilitar a verificação do certificado do servidor API Wallarm. Pode ser:<ul><li>`true` para habilitar a verificação</li><li>`false` para desabilitar a verificação</li></ul>. | `true` |
| `api.ca_file`  | Caminho para o arquivo de certificado SSL. | `/usr/share/wallarm-common/ca.pem` |
| `api.localhost` | IP local do interface de rede através do qual as solicitações para a API Wallarm são enviadas. Este parâmetro é necessário se a interface de rede usada por padrão restringe o acesso à API Wallarm (por exemplo, o acesso à Internet pode estar fechado). | - |
| `api.localport` | Porta da interface de rede através do qual as solicitações para a API Wallarm são enviadas. Este parâmetro é necessário se a interface de rede utilizada por padrão restringe o acesso à API Wallarm (por exemplo, o acesso à Internet pode estar fechado). | - |

Para alterar os parâmetros de sincronização, proceda com as seguintes etapas:

1. Faça alterações no arquivo `node.yaml` adicionando os parâmetros necessários e atribuindo os valores desejados para eles.
1. Reinicie o NGINX para aplicar as configurações atualizadas ao processo de sincronização:

    --8<-- "../include-pt-BR/waf/restart-nginx-4.4-and-above.md"

## Intervalo de sincronização

Por padrão, o nó de filtragem sincroniza com a Wallarm Cloud a cada 120-240 segundos (2-4 minutos). Você pode alterar o intervalo de sincronização através da variável de ambiente do sistema `WALLARM_SYNCNODE_INTERVAL`.

Para alterar o intervalo entre as sincronizações do nó de filtragem e da Wallarm Cloud:

1. Abra o arquivo `/etc/environment`.
2. Adicione a variável `WALLARM_SYNCNODE_INTERVAL` ao arquivo e defina um valor desejado para a variável em segundos. O valor não pode ser menor que o valor padrão (`120` segundos). Por exemplo:

    ```bash
    WALLARM_SYNCNODE_INTERVAL=800
    ```
3. Salve o arquivo alterado `/etc/environment`. O novo valor do intervalo será aplicado ao processo de sincronização automaticamente.

## Exemplo de configuração

Observe que, além dos parâmetros que fornecem ao nó de filtragem acesso à Cloud (seções gerais e `api`, descritas neste artigo), o arquivo `node.yaml` também pode conter parâmetros que fornecem a diferentes processos [o acesso aos arquivos](configure-access-to-files-needed-for-node.md) necessários para a operação do nó (seção `syncnode`).

--8<-- "../include-pt-BR/node-cloud-sync-configuration-example.md"
