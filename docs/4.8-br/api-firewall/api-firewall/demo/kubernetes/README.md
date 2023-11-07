# Demonstração do Wallarm API Firewall com Kubernetes

Esta demonstração implementa a aplicação [**httpbin**](https://httpbin.org/) e o Wallarm API Firewall como um proxy protegendo a API **httpbin**. Ambas as aplicações estão em execução nos contêineres Docker em Kubernetes.

## Requisitos do sistema

Antes de executar esta demonstração, certifique-se de que seu sistema atende aos seguintes requisitos:

* Docker Engine 20.x ou posterior instalado para [Mac](https://docs.docker.com/docker-for-mac/install/), [Windows](https://docs.docker.com/docker-for-windows/install/), ou [Linux](https://docs.docker.com/engine/install/#server)
* [Docker Compose](https://docs.docker.com/compose/install/) instalado
* **make** instalado para [Mac](https://formulae.brew.sh/formula/make), [Windows](https://sourceforge.net/projects/ezwinports/files/make-4.3-without-guile-w32-bin.zip/download), ou Linux (usando utilitários de gerenciamento de pacotes adequados)

Executar este ambiente de demonstração pode ser intensivo em recursos. Certifique-se de ter os seguintes recursos disponíveis:

* Pelo menos 2 núcleos de CPU
* Pelo menos 6GB de memória volátil

## Recursos utilizados

Os seguintes recursos são utilizados nesta demonstração:

* [Imagem Docker **httpbin**](https://hub.docker.com/r/kennethreitz/httpbin/)
* [Imagem Docker do API Firewall](https://hub.docker.com/r/wallarm/api-firewall)

## Descrição do código de demonstração

O [código de demonstração](https://github.com/wallarm/api-firewall/tree/main/demo/kubernetes) executa o cluster Kubernetes com o **httpbin** e o API Firewall implementados.

Para executar o cluster Kubernetes, esta demonstração usa a ferramenta [**kind**](https://kind.sigs.k8s.io/) que permite executar o cluster K8s em minutos usando contêineres Docker como nós. Ao usar várias camadas de abstração, o **kind** e suas dependências são empacotados na imagem Docker que inicia o cluster Kubernetes.

A implementação da demonstração é configurada através dos seguintes diretórios/arquivos:

* A especificação OpenAPI 3.0 para a API **httpbin** está localizada no arquivo `volumes/helm/api-firewall.yaml` sob o caminho `manifest.body`. Usando esta especificação, o API Firewall validará se as solicitações e respostas enviadas ao endereço da aplicação correspondem ao esquema da API da aplicação.

Esta especificação não define o [esquema original da API do **httpbin**](https://httpbin.org/spec.json). Para demonstrar de forma mais transparente os recursos do API Firewall, nós explicitamente convertemos e complicamos o esquema original OpenAPI 2.0 e salvamos a especificação modificada para `volumes/helm/api-firewall.yaml` > `manifest.body`.
* `Makefile` é o arquivo de configuração que define rotinas Docker.
* `docker-compose.yml` é o arquivo que define a seguinte configuração para executar o cluster Kubernetes temporário:

   * A construção do nó [**kind**](https://kind.sigs.k8s.io/) com base em [`docker/Dockerfile`](https://github.com/wallarm/api-firewall/blob/main/demo/kubernetes/docker/Dockerfile).
   * Implementação do servidor DNS proporcionando descoberta simultânea de serviços Kubernetes e Docker.
   * Implementação do registro Docker local e do serviço `dind`.
   * Configuração das imagens Docker [API Firewall](https://docs.wallarm.com/api-firewall/installation-guides/docker-container/) e **httpbin**.

## Passo 1: Executando o código de demonstração

Para executar o código de demonstração:

1. Clone o repositório do GitHub que contém o código de demonstração:

    ```bash
    git clone https://github.com/wallarm/api-firewall.git
    ```
2. Acesse o diretório `demo/kubernetes` do repositório clonado:

    ```bash
    cd api-firewall/demo/kubernetes
    ```
3. Execute o código de demonstração usando o comando abaixo. Por favor, observe que a execução desta demonstração pode ser intensiva em recursos. Pode levar até 3 minutos para iniciar o ambiente de demonstração.

    ```bash
    make start
    ```

   * A aplicação **httpbin** protegida pelo API Firewall estará disponível em http://localhost:8080.
   * A aplicação **httpbin** não protegida pelo API Firewall estará disponível em http://localhost:8090. Ao testar a implementação de demonstração, você pode enviar solicitações para a aplicação não protegida para conhecer a diferença.
4. Prossiga para o teste de demonstração.

## Passo 2: Testando a demonstração

Usando a seguinte solicitação, você pode testar o API Firewall implementado:

* Verifique se o API Firewall bloqueia as solicitações enviadas para o caminho não exposto:

    ```bash
    curl -sD - http://localhost:8080/unexposed/path
    ```
 
    Resposta esperada:

    ```bash
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 06:58:29 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```
* Verifique se o API Firewall bloqueia solicitações com valor de string passado no parâmetro que requer tipo de dados inteiros:

    ```bash
    curl -sD - http://localhost:8080/cache/arewfser
    ```

    Resposta esperada:

    ```bash
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 06:58:29 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```

    Este caso demonstra que o API Firewall protege a aplicação contra ataques Cache-Poisoned DoS.
* Verifique se o API Firewall bloqueia solicitações com o parâmetro de consulta obrigatório `int` que não corresponde à seguinte definição:

    ```json
    ...
    {
      "in": "query",
      "name": "int",
      "schema": {
        "type": "integer",
        "minimum": 10,
        "maximum": 100
      },
      "required": true
    },
    ...
    ```

    Teste a definição usando as seguintes solicitações:

    ```bash
    # Solicitação com parâmetro de consulta obrigatório ausente
    curl -sD - http://localhost:8080/get

    # Resposta esperada
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:08 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # Solicitação com o valor do parâmetro int que está em um intervalo válido
    curl -sD - http://localhost:8080/get?int=15

    # Resposta esperada
    HTTP/1.1 200 OK
    Server: gunicorn/19.9.0
    Date: Mon, 31 May 2021 07:09:38 GMT
    Content-Type: application/json
    Content-Length: 280
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Credentials: true
    ...


    # Solicitação com o valor do parâmetro int que está fora do intervalo
    curl -sD - http://localhost:8080/get?int=5

    # Resposta esperada
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:27 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # Solicitação com o valor do parâmetro int que está fora do intervalo
    curl -sD - http://localhost:8080/get?int=1000

    # Resposta esperada
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:09:53 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # Solicitação com o valor do parâmetro int que está fora do intervalo
    # POTENTIAL EVIL: Transbordamento de inteiro de 8 bytes pode responder com eliminação de pilha
    curl -sD - http://localhost:8080/get?int=18446744073710000001

    # Resposta esperada
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:04 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```
* Verifique se o API Firewall bloqueia solicitações com o parâmetro de consulta `str` que não corresponde à seguinte definição:

    ```json
    ...
    {
      "in": "query",
      "name": "str",
      "schema": {
        "type": "string",
        "pattern": "^.{1,10}-\\d{1,10}$"
      }
    },
    ...
    ```

    Teste a definição usando as seguintes solicitações (o parâmetro `int` ainda é obrigatório):

    ```bash
    # Solicitação com o valor do parâmetro str que não corresponde à expressão regular definida
    curl -sD - "http://localhost:8080/get?int=15&str=fasxxx.xxxawe-6354"

    # Resposta esperada
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:42 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # Solicitação com o valor do parâmetro str que não corresponde à expressão regular definida
    curl -sD - "http://localhost:8080/get?int=15&str=faswerffa-63sss54"
    
    # Resposta esperada
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:10:42 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # Solicitação com o valor do parâmetro str que corresponde à expressão regular definida
    curl -sD - http://localhost:8080/get?int=15&str=ri0.2-3ur0-6354

    # Resposta esperada
    HTTP/1.1 200 OK
    Server: gunicorn/19.9.0
    Date: Mon, 31 May 2021 07:11:03 GMT
    Content-Type: application/json
    Content-Length: 331
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Credentials: true
    ...


    # Solicitação com o valor do parâmetro str que não corresponde à expressão regular definida
    # POTENTIAL EVIL: SQL Injection
    curl -sD - 'http://localhost:8080/get?int=15&str=";SELECT%20*%20FROM%20users.credentials;"'

    # Resposta esperada
    HTTP/1.1 403 Forbidden
    Date: Mon, 31 May 2021 07:12:04 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```

## Passo 4: Parando o código de demonstração

Para parar a implementação de demonstração e limpar seu ambiente, use o comando:

```bash
make stop
```