# Configurando os direitos de acesso aos arquivos necessários para a operação do nó

Os serviços `wallarm-worker` e `nginx` geralmente recebem automaticamente a permissão para ler o conteúdo dos arquivos necessários para a operação do nó de filtragem, como o arquivo proton.db e o arquivo de conjunto de regras personalizadas. No entanto, se o teste não mostrar acesso, leia a descrição abaixo de como as permissões são fornecidas e como podem ser configuradas manualmente.

## Configurando o acesso a arquivos

Os parâmetros que fornecem acesso aos arquivos necessários para a operação do nó podem ser definidos explicitamente no arquivo `node.yaml`. Este arquivo é criado automaticamente após a execução do script `register-node`. O caminho padrão para o arquivo é `/etc/wallarm/node.yaml`. Este caminho pode ser alterado através da diretiva [`wallarm_api_conf`](configure-parameters-en.md#wallarm_api_conf).

O arquivo `node.yaml` pode conter os seguintes parâmetros de acesso a arquivos:

| Parâmetro    | Descrição |
|--------------|-------------|
| `syncnode.owner` | Proprietário dos arquivos necessários para a operação do nó de filtragem. |
| `syncnode.group` | Grupo dos arquivos necessários para a operação do nó de filtragem. |
| `syncnode.mode`  | Direitos de acesso aos arquivos necessários para a operação do nó de filtragem. |

O algoritmo procura as permissões do arquivo realizando as seguintes etapas (vai para a próxima etapa apenas se a anterior não resolva):

1. Parâmetros `syncnode.(TYPE).(user,group,mode)` configurados explicitamente no arquivo `node.yaml`.

    `(TYPE)` permite que você especifique o arquivo específico para o qual o parâmetro é definido. Os valores possíveis são `proton.db` ou `lom`.

    !!! aviso "significado do valor `lom`"
         Preste atenção que o valor `lom` aponta para o arquivo de [conjunto de regras personalizadas](../user-guides/rules/rules.md) `/etc/wallarm/custom_ruleset`.

1. Parâmetros `syncnode.(user,group,mode)` configurados explicitamente no arquivo `node.yaml`.
1. Para instalação baseada em NGINX, valor do `nginx_group` no arquivo `/usr/share/wallarm-common/engine/*`.

   Todos os pacotes do motor instalados fornecem o arquivo `/usr/share/wallarm-common/engine/*` contendo `nginx_group=<VALUE>`.

   Cada pacote com o módulo define o valor para o parâmetro `group` dependendo do NGINX para o qual foi destinado:

   * Os módulos do NGINX de nginx.org definem `group` para `nginx`.
   * Os módulos para distribuições do NGINX definem `group` para `www-data`.
   * Os módulos personalizados usam valores fornecidos pelo cliente.

1. Padrões:
   * `owner`: `root`
   * `group`: `wallarm`
   * `mode`: `0640`

Observe que você só precisa configurar os direitos de acesso explicitamente se o resultado obtido pelo algoritmo automaticamente não atender suas necessidades. Após configurar os direitos de acesso, certifique-se de que os serviços `wallarm-worker` e `nginx` podem ler o conteúdo dos arquivos necessários para a operação do nó de filtragem.

## Exemplo de configuração

Note que, além dos parâmetros de acesso a arquivos (seção `syncnode`, descrita neste artigo), o arquivo `node.yaml` também conterá parâmetros fornecendo ao nó de filtragem [acesso à Nuvem](configure-cloud-node-synchronization-en.md) (seções gerais e `api`).

--8<-- "../include-pt-BR/node-cloud-sync-configuration-example.md"
