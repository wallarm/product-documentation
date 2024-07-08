[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Akamai EdgeWorkers com Pacote de Código Wallarm

[Akamai EdgeWorkers](https://techdocs.akamai.com/edgeworkers/docs) é uma poderosa plataforma de computação de borda que permite a execução de lógica personalizada e a implantação de funções JavaScript leves na borda da plataforma. Para clientes que têm suas APIs e tráfego rodando no Akamai EdgeWorkers, a Wallarm fornece um pacote de código que pode ser implantado no Akamai EdgeWorkers para garantir a segurança de sua infraestrutura.

A solução envolve a implantação do nó Wallarm externamente e a injeção de código personalizado ou políticas na plataforma específica. Isso permite que o tráfego seja direcionado ao nó Wallarm externo para análise e proteção contra possíveis ameaças. Referidos como conectores Wallarm, eles servem como o elo essencial entre plataformas como Azion Edge, Akamai Edge, Mulesoft, Apigee e AWS Lambda, e o nó Wallarm externo. Esta abordagem garante a integração perfeita, a análise segura do tráfego, a mitigação do risco e a segurança geral da plataforma.

## Casos de uso

Entre todas as [opções de implantação da Wallarm](../supported-deployment-options.md), esta solução é a recomendada para os seguintes casos de uso:

* Garantindo APIs ou tráfego rodando no Akamai EdgeWorkers.
* Necessitando de uma solução de segurança que ofereça observação abrangente de ataques, relatórios e bloqueio instantâneo de solicitações maliciosas.

## Limitações

A solução tem certas limitações, pois só funciona com solicitações recebidas:

* A descoberta de vulnerabilidades usando o método [detecção passiva](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) não funciona adequadamente. A solução determina se uma API é vulnerável ou não com base nas respostas do servidor a solicitações maliciosas que são típicas para as vulnerabilidades que ela testa.
* O [Descoberta de API Wallarm](../../api-discovery/overview.md) não pode explorar o inventário da API com base no seu tráfego, pois a solução relies on na análise de resposta.
* A [proteção contra navegação forçada](../../admin-en/configuration-guides/protecting-against-bruteforce.md) não está disponível pois requer análise do código de resposta.

Também existem limitações causadas pelas [limitações do produto EdgeWorkers](https://techdocs.akamai.com/edgeworkers/docs/limitations) e [solicitação HTTP](https://techdocs.akamai.com/edgeworkers/docs/http-request):

* O único método de entrega de tráfego suportado é o TLS aprimorado.
* O tamanho máximo do cabeçalho de resposta é de 8000 bytes.
* O tamanho máximo do corpo é de 1 MB.
* Métodos HTTP não suportados: `CONNECT`, `TRACE`, `OPTIONS` (métodos suportados: `GET`, `POST`, `HEAD`, `PUT`, `PATCH`, `DELETE`).
* Cabeçalhos não suportados: `connection`, `keep-alive`, `proxy-authenticate`, `proxy-authorization`, `te`, `trailers`, `transfer-encoding`, `host`, `content-length`, `vary`, `accept-encoding`, `content-encoding`, `upgrade`.

## Requisitos

Para prosseguir com a implantação, certifique-se de que você atende aos seguintes requisitos:

* Entendimento das tecnologias Akamai EdgeWorkers
* APIs ou tráfego passando pelos Akamai EdgeWorkers.

## Implantação

Para proteger as APIs no Akamai EdgeWorkers com a Wallarm, siga estas etapas:

1. Implante um nó Wallarm usando uma das opções de implantação disponíveis.
1. Obtenha o pacote de código Wallarm e execute-o no Akamai EdgeWorkers.

### 1. Implante um nó Wallarm

Ao utilizar a Wallarm no Akamai EdgeWorkers, o fluxo de tráfego é [em linha](../inline/overview.md).

1. Escolha uma das [soluções de implantação do nó Wallarm](../supported-deployment-options.md#in-line) para implantação em linha e siga as instruções de implantação fornecidas.
1. Configure o nó implantado usando o seguinte modelo:

    ```
    server {
        listen 80;

        server_name _;

        access_log off;
        wallarm_mode off;

        location / {
            proxy_set_header Host $http_x_forwarded_host;
            proxy_pass http://unix:/tmp/wallarm-nginx.sock;
        }
    }

    server {
        listen 443 ssl;

        server_name seu-dominio-para-no-wallarm.tld;

        ### Configuração SSL aqui

        access_log off;
        wallarm_mode off;

        location / {
            proxy_set_header Host $http_x_forwarded_host;
            proxy_pass http://unix:/tmp/wallarm-nginx.sock;
        }
    }


    server {
        listen unix:/tmp/wallarm-nginx.sock;
        
        server_name _;
        
        wallarm_mode monitoring;
        #wallarm_mode block;

        real_ip_header X-EDGEWRK-REAL-IP;
        set_real_ip_from unix:;

        location / {
            echo_read_request_body;
        }
    }
    ```

    Por favor, preste atenção nas seguintes configurações:

    * Certificados TLS/SSL para tráfego HTTPS: Para habilitar o nó Wallarm para lidar com tráfego seguro HTTPS, configure os certificados TLS/SSL de acordo. A configuração específica dependerá do método de implantação escolhido. Por exemplo, se você estiver usando o NGINX, você pode se referir ao [seu artigo](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/) para orientação.
    * Configuração do [modo de operação da Wallarm](../../admin-en/configure-wallarm-mode.md).
1. Depois que a implantação estiver completa, anote o IP da instância do nó, pois você precisará dele mais tarde para definir o endereço para o encaminhamento de solicitações recebidas.

### 2. Obtenha o pacote de código Wallarm e execute-o no Akamai EdgeWorkers

Para adquirir e [executar](https://techdocs.akamai.com/edgeworkers/docs/deploy-hello-world-1) o pacote de código Wallarm no Akamai EdgeWorkers, siga estas etapas:

1. Entre em contato com [support@wallarm.com](mailto:support@wallarm.com) para obter o pacote de código Wallarm.
1. [Adicione](https://techdocs.akamai.com/edgeworkers/docs/add-edgeworkers-to-contract) EdgeWorkers ao seu contrato no Akamai.
1. [Crie](https://techdocs.akamai.com/edgeworkers/docs/create-an-edgeworker-id) um ID de EdgeWorker.
1. Abra o ID criado, pressione **Criar Versão** e [faça o upload](https://techdocs.akamai.com/edgeworkers/docs/deploy-hello-world-1) do pacote de código Wallarm.
1. **Ative** a versão criada, inicialmente no ambiente de preparação.
1. Depois de confirmar que tudo está funcionando corretamente, repita a publicação da versão no ambiente de produção.
1. No **Gerenciador de Propriedades da Akamai**, escolha ou crie uma nova propriedade onde você deseja instalar a Wallarm.
1. [Crie](https://techdocs.akamai.com/edgeworkers/docs/add-the-edgeworker-behavior-1) um novo comportamento com o EdgeWorker recém-criado, chame-o de **Borda Wallarm** e adicione os seguintes critérios:

    ```
    Se
    Cabeçalho da solicitação
    X-EDGEWRK-REAL-IP 
    não existir
    ```
1. Crie outro comportamento **Nó Wallarm** com **Servidor de origem** apontando para [nó implantado anteriormente](#1-implante-um-nó-wallarm). Mude o **Encaminhamento do Cabeçalho do Host** para **Hostname de Origem** e adicione os seguintes critérios:

    ```
    Se
    Cabeçalho da solicitação
    X-EDGEWRK-REAL-IP 
    existir
    ```
1. Adicione a nova variável de propriedade `PMUSER_WALLARM_MODE` com o [valor](../../admin-en/configure-wallarm-mode.md) `monitoring` (padrão) ou `block`. 
    
    Escolha **Oculto** para as configurações de segurança.
1. Salve a nova versão e implante-a inicialmente no ambiente de preparação, e [então](https://techdocs.akamai.com/api-acceleration/docs/test-stage) na produção.

## Testando

Para testar a funcionalidade da política implantada, siga estas etapas:

1. Envie a solicitação com o teste de ataque [Path Traversal][ptrav-attack-docs] para sua API:

    ```
    curl http://<SEU_IP_DO_APP_OU_DOMINIO>/etc/passwd
    ```
1. Abra a **Seção de Eventos** do Wallarm Console no [US Cloud](https://us1.my.wallarm.com/search) ou [EU Cloud](https://my.wallarm.com/search) e certifique-se de que o ataque é exibido na lista.
    
    ![Ataques na interface][attacks-in-ui-image]

    Se o modo de operação do nó Wallarm estiver configurado para bloqueio, a solicitação também será bloqueada.

## Precisa de ajuda?

Se encontrar algum problema ou precisar de assistência com a implantação descrita da Wallarm em conjunto com Akamai EdgeWorkers, você pode contatar a equipe de [suporte Wallarm](mailto:support@wallarm.com). Eles estão disponíveis para fornecer orientação e ajudar a resolver qualquer problema que você possa encontrar durante o processo de implementação.