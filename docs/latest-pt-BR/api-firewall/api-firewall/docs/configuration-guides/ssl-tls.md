# Configuração SSL/TLS

Este guia explica como configurar variáveis de ambiente para conexões SSL/TLS entre o API Firewall e o aplicativo protegido, bem como para o próprio servidor do API Firewall. Forneça essas variáveis ao iniciar o container Docker do API Firewall para [REST API](../installation-guides/docker-container.md) ou [GraphQL API](../installation-guides/graphql/docker-container.md).

## Conexão SSL/TLS segura entre o API Firewall e o aplicativo

Para estabelecer uma conexão segura entre o API Firewall e o servidor do aplicativo protegido que utiliza certificados CA personalizados, utilize as seguintes variáveis de ambiente:

1. Monte o certificado CA personalizado no container do API Firewall. Por exemplo, em seu `docker-compose.yaml`, faça a seguinte modificação:

    ```diff
    ...
        volumes:
          - <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>
    +     - <HOST_PATH_TO_CA>:<CONTAINER_PATH_TO_CA>
    ...
    ```
1. Forneça o caminho do arquivo montado usando as seguintes variáveis de ambiente:

| Variável de ambiente | Descrição |
| -------------------- | ----------- |
| `APIFW_SERVER_ROOT_CA`<br>(apenas se o valor de `APIFW_SERVER_INSECURE_CONNECTION` for `false`) | Caminho dentro do container Docker para o certificado CA do servidor do aplicativo protegido. |

## Conexão insegura entre o API Firewall e o aplicativo

Para configurar uma conexão insegura (ou seja, ignorando a verificação SSL/TLS) entre o API Firewall e o servidor do aplicativo protegido, use essa variável de ambiente:

| Variável de ambiente | Descrição |
| -------------------- | ----------- |
| `APIFW_SERVER_INSECURE_CONNECTION` | Determina se a validação do certificado SSL/TLS do servidor do aplicativo protegido deve ser desativada. O endereço do servidor é indicado na variável `APIFW_SERVER_URL`. Por padrão (`false`), o sistema tenta uma conexão segura usando o certificado CA padrão ou o especificado em `APIFW_SERVER_ROOT_CA`. |

## SSL/TLS para o servidor API Firewall

Para garantir que o servidor que executa o API Firewall aceite conexões HTTPS, siga as etapas abaixo:

1. Monte a pasta do certificado e chave privada no container do API Firewall. Por exemplo, em seu `docker-compose.yaml`, faça a seguinte modificação:

    ```diff
    ...
        volumes:
          - <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>
    +     - <HOST_PATH_TO_CERT_DIR>:<CONTAINER_PATH_TO_CERT_DIR>
    ...
    ```
1. Forneça os caminhos dos arquivos montados usando as seguintes variáveis de ambiente:

| Variável de ambiente | Descrição |
| -------------------- | ----------- |
| `APIFW_TLS_CERTS_PATH`            | Caminho no container para a pasta onde o certificado e a chave privada do API Firewall estão montados. |
| `APIFW_TLS_CERT_FILE`             | Nome do arquivo do certificado SSL/TLS para o API Firewall, localizado dentro do diretório `APIFW_TLS_CERTS_PATH`. |
| `APIFW_TLS_CERT_KEY`              | Nome do arquivo da chave privada SSL/TLS para o API Firewall, encontrado no diretório `APIFW_TLS_CERTS_PATH`. |