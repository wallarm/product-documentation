[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Firewall Azion Edge com Funções Wallarm

As [Funções Edge da Azion](https://www.azion.com/en/products/edge-functions/) permitem a execução de código personalizado na borda da rede, possibilitando a implementação de regras do cliente para lidar com solicitações. Ao incorporar código personalizado da Wallarm, o tráfego de entrada pode ser proxy para o nó Wallarm para análise e filtragem. Esta configuração realça as medidas de segurança já fornecidas pelo [Firewall Edge da Azion](https://www.azion.com/en/products/edge-firewall/). Este guia fornece instruções sobre como integrar o nó Wallarm com a Azion Edge para proteger os serviços em execução na Azion Edge.

A solução implica a implementação do nó Wallarm externamente e a injeção de código personalizado ou políticas na plataforma específica. Isso permite que o tráfego seja direcionado para o nó Wallarm externo para análise e proteção contra possíveis ameaças. Chamadas de conectores Wallarm, elas servem como o link essencial entre plataformas como Azion Edge, Akamai Edge, Mulesoft, Apigee e AWS Lambda, e o nó Wallarm externo. Essa abordagem garante integração perfeita, análise de tráfego segura, mitigação de risco e segurança geral da plataforma.

## Casos de uso

Dentre todas as [opções de implementação Wallarm suportadas](../supported-deployment-options.md), esta solução é a recomendada para os seguintes casos de uso:

* Proteger APIs ou tráfego em execução na Azion Edge.
* Necessidade de uma solução de segurança que ofereça observação abrangente de ataques, relatórios e bloqueio instantâneo de solicitações mal-intencionadas.

## Limitações

A solução tem determinadas limitações, pois só funciona com solicitações de entrada:

* A descoberta das vulnerabilidades utilizando o método de [detecção passiva](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) não funciona corretamente. A solução determina se uma API é vulnerável ou não baseada em respostas do servidor à solicitações maliciosas típicas para vulnerabilidades que ela testa.
* O [Wallarm API Discovery](../../api-discovery/overview.md) não pode explorar o inventário de API baseado em seu tráfego, uma vez que a solução depende de análise de resposta.
* A [proteção contra a navegação forçada](../../admin-en/configuration-guides/protecting-against-bruteforce.md) não está disponível, uma vez que requer uma análise do código de resposta.

## Requisitos

Para prosseguir com a implementação, certifique-se de que atende aos seguintes requisitos:

* Compreensão das tecnologias Azion Edge
* APIs ou tráfego em execução na Azion Edge.

## Implementação

Para proteger APIs na Azion Edge com a Wallarm, siga estas etapas:

1. Implemente um nó Wallarm usando uma das opções de implementação disponíveis.
1. Obtenha o código Wallarm para Funções Edge e execute-o na Azion.

### 1. Implementar um nó Wallarm

Ao utilizar a Wallarm na Azion Edge, o fluxo de tráfego é [inline](../inline/overview.md).

1. Escolha uma das [soluções de implementação de nó Wallarm suportadas ou artefatos](../supported-deployment-options.md#in-line) para implementação inline e siga as instruções de implementação fornecidas.
1. Configure o nó implementado usando o seguinte template:

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

        server_name yourdomain-for-wallarm-node.tld;

        ### SSL configuration here

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

    * Certificados TLS/SSL para tráfego HTTPS: Para permitir que o nó Wallarm lide com tráfego seguro HTTPS, configure os certificados TLS/SSL de acordo. A configuração específica dependerá do método de implementação escolhido. Por exemplo, se você estiver usando NGINX, você pode se referir ao [seu artigo](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/) para orientação.
    * Configuração do [modo de operação Wallarm](../../admin-en/configure-wallarm-mode.md).
1. Uma vez que a implementação esteja completa, anote o IP da instância do nó, pois você precisará dele depois para definir o endereço para o encaminhamento de solicitações de entrada.

### 2. Obter o código Wallarm para Funções Edge e executá-lo na Azion

Para adquirir e executar o código Wallarm para Funções Edge da Azion, siga estas etapas:

1. Entre em contato com [support@wallarm.com](mailto:support@wallarm.com) para obter o código Wallarm.
1. Na Azion Edge, vá para **Billing & Subscriptions** e ative a assinatura em **Application Acceleration** e **Edge Functions**.
1. Crie uma nova **Aplicação Edge** e salve-a.
1. Abra a aplicação criada → **Main Settings** e habilite **Application Acceleration** e **Edge Functions**.
1. Navegue até **Domains** e clique em **Add Domain**.
1. Navegue até **Edge Functions**, clique em **Add Function** e escolha o tipo `Edge Firewall`.
1. Cole o código de fonte Wallarm substituindo `wallarm.node.tld` pelo endereço do [nó Wallarm implantado previamente](#1-deploy-a-wallarm-node).
1. Vá para **Edge Firewall** → **Add Rule Set** → digite **Name** → selecione **Domains** e ligue **Edge Functions**.
1. Alterne para a aba **Functions**, clique em **Add Function** e selecione a função criada anteriormente.
1. Alterne para a aba **Rules Engine** → **New Rule** e defina os critérios para o tráfego a ser filtrado pelo Wallarm:

    * Para analisar e filtrar todas as solicitações, selecione `If Request URI starts with /`.
    * Em **Behaviors**, escolha `Then Run Function` e selecione a função criada anteriormente.

## Testando

Para testar a funcionalidade da política implementada, siga estas etapas:

1. Envie a solicitação com o ataque de teste [Path Traversal][ptrav-attack-docs] para a sua API:

    ```
    curl http://<SEU_APP_IP_OU_DOMINIO>/etc/passwd
    ```
1. Abra o Console Wallarm → seção **Events** no [US Cloud](https://us1.my.wallarm.com/attacks) ou [EU Cloud](https://my.wallarm.com/attacks) e verifique se o ataque está exibido na lista.
    
    ![Attacks in the interface][attacks-in-ui-image]

    Se o modo do nó Wallarm estiver definido para bloqueio, a solicitação também será bloqueada.

## Precisa de ajuda?

Se você encontrar algum problema ou precisar de ajuda com a implementação descrita da Wallarm em conjunto com a Azion Edge, pode contatar a equipe de [suporte Wallarm](mailto:support@wallarm.com). Eles estão disponíveis para fornecer orientações e ajudar a resolver quaisquer problemas que você enfrentar durante o processo de implementação.
