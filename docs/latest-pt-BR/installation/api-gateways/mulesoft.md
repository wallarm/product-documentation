[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Mulesoft com Política Wallarm

[MuleSoft](https://www.mulesoft.com/) é uma plataforma de integração que permite uma conectividade e integração de dados perfeitas entre os serviços, com um gateway de API funcionando como ponto de entrada para que os aplicativos do cliente acessem as APIs. Com a Wallarm, você pode proteger as APIs na plataforma Mulesoft Anypoint usando a política da Wallarm. Este artigo explica como anexar e utilizar a política.

O diagrama abaixo ilustra o fluxo de tráfego de alto nível quando a política Wallarm está anexada às APIs na plataforma MuleSoft Anypoint, e a Wallarm está configurada para bloquear atividades maliciosas.

![Mulesoft com política Wallarm](../../images/waf-installation/gateways/mulesoft/traffic-flow-inline.png)

A solução envolve a implantação do nó Wallarm externamente e a injeção de código personalizado ou políticas na plataforma específica. Isso permite que o tráfego seja direcionado para o nó Wallarm externo para análise e proteção contra ameaças potenciais. Conhecidos como conectores Wallarm, eles servem como o elo essencial entre plataformas como Azion Edge, Akamai Edge, Mulesoft, Apigee e AWS Lambda, e o nó Wallarm externo. Esta abordagem garante uma integração perfeita, análise segura de tráfego, mitigação de riscos e segurança geral da plataforma.

## Casos de uso

Entre todas as [opções de implantação Wallarm suportadas](../supported-deployment-options.md), esta solução é a recomendada para os seguintes casos de uso:

* Proteger as APIs implantadas na plataforma MuleSoft Anypoint com apenas uma política.
* Requerer uma solução de segurança que ofereça observação abrangente de ataques, relatórios e bloqueio instantâneo de solicitações maliciosas.

## Limitações

A solução apresenta certas limitações, pois só funciona com solicitações recebidas:

* A descoberta de vulnerabilidades usando o método de [detecção passiva](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) não funciona corretamente. A solução determina se uma API é vulnerável ou não com base nas respostas do servidor a solicitações maliciosas típicas das vulnerabilidades que testa.
* O [Wallarm API Discovery](../../api-discovery/overview.md) não pode explorar o inventário da API com base no seu tráfego, pois a solução depende da análise das respostas.
* A [proteção contra navegação forçada](../../admin-en/configuration-guides/protecting-against-bruteforce.md) não está disponível, pois requer análise do código de resposta.

## Requisitos

Para prosseguir com a implantação, certifique-se de que você atende aos seguintes requisitos:

* Entendimento da plataforma Mulesoft.
* [Maven (`mvn`)](https://maven.apache.org/install.html) 3.8 ou uma versão anterior instalada. Versões mais recentes do Maven podem encontrar problemas de compatibilidade com o plugin Mule.
* Você foi atribuído ao papel de contribuidor do Mulesoft Exchange, permitindo o upload de artefatos para a conta da plataforma Mulesoft Anypoint da sua organização.
* Suas [credenciais do Mulesoft Exchange (nome de usuário e senha)](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange#deploying-a-policy-created-using-the-maven-archetype) são especificadas no arquivo `<MAVEN_DIRECTORY>/conf/settings.xml`.
* Seu aplicativo e API estão linkados e funcionando no Mulesoft.

## Implantação

Para proteger as APIs na plataforma Mulesoft Anypoint usando a política Wallarm, siga essas etapas:

1. Implementar um nó Wallarm usando uma das opções de implantação disponíveis.
1. Obter a política Wallarm e enviá-la para o Mulesoft Exchange.
1. Anexar a política Wallarm à sua API.

### 1. Implementar um nó Wallarm

Ao utilizar a política Wallarm, o fluxo de tráfego é [in-line](../inline/overview.md).

1. Escolha uma das [soluções de implantação do nó Wallarm suportadas ou artefatos](../supported-deployment-options.md#in-line) para implantação in-line e siga as instruções de implantação fornecidas.
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

        real_ip_header X-REAL-IP;
        set_real_ip_from unix:;

        location / {
            echo_read_request_body;
        }
    }
    ```

    Por favor, certifique-se de prestar atenção nas seguintes configurações:

    * Certificados TLS/SSL para tráfego HTTPS: Para permitir que o nó Wallarm gerencie o tráfego HTTPS seguro, configure os certificados TLS/SSL de acordo. A configuração específica dependerá do método de implantação escolhido. Por exemplo, se você estiver usando o NGINX, pode consultar [seu artigo](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/) para obter orientação.
    * Configuração do [modo de operação Wallarm](../../admin-en/configure-wallarm-mode.md).

1. Uma vez que a implantação esteja completa, anote o IP da instância do nó, pois você precisará dele mais tarde para definir o endereço de encaminhamento das solicitações recebidas.

### 2. Obtenha e envie a política Wallarm para o Mulesoft Exchange

Para adquirir e [enviar](https://docs.mulesoft.com/mule-gateway/policies-custom-upload-to-exchange) a política Wallarm para o Mulesoft Exchange, siga estas etapas:

1. Entre em contato com [support@wallarm.com](mailto:support@wallarm.com) para obter a política Wallarm Mulesoft.
1. Extraia o arquivo da política quando você o receber.
1. Navegue até o diretório da política:

    ```
    cd <DIRETORIO_DA_POLITICA>/wallarm
    ```
1. No arquivo `pom.xml` → parâmetro `groupId` no topo do arquivo, especifique o ID da sua organização Mulesoft.

    Você pode encontrar o ID da sua organização navegando até Mulesoft Anypoint Platform → **Access Management** → **Organization** → escolha a sua organização → copie o ID dela.
1. No seu diretório Maven `.m2`, atualize o arquivo `settings.xml` com suas credenciais do Exchange:

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
      <servers>
        <server>
          <id>exchange-server</id>
          <username>meunomeusuario</username>
          <password>minhasenha</password>
        </server>
      </servers>
    </settings>
    ```
1. Implantar a política no Mulesoft usando o seguinte comando:

    ```
    mvn clean deploy
    ```

A sua política personalizada agora está disponível na Exchange da sua Plataforma Mulesoft Anypoint.

![Mulesoft com política Wallarm](../../images/waf-installation/gateways/mulesoft/wallarm-policy-in-exchange.png)

### 3. Anexar a política Wallarm à sua API

Você pode anexar a política Wallarm a todas as APIs ou a uma API individual.

#### Anexando a política a todas as APIs

Para aplicar a política Wallarm a todas as APIs usando a opção de política automatizada do [Mulesoft](https://docs.mulesoft.com/mule-gateway/policies-automated-overview), siga estes passos:

1. Na sua Plataforma Anypoint, navegue até **API Manager** → **Automated Policies**.
1. Clique em **Add automated policy** e selecione a política Wallarm do Exchange.
1. Especifique `WLRM REPORTING ENDPOINT` que é o endereço IP da [instância do nó Wallarm](#1-implantar-um-no-wallarm) , incluindo o `http://` ou `https://`.
1. Se necessário, modifique o período máximo para a Wallarm processar uma única solicitação, alterando o valor de `WALLARM NODE REQUEST TIMEOUT`.
1. Aplique a política.

![Política Wallarm](../../images/waf-installation/gateways/mulesoft/automated-policy.png)

#### Anexando a política a uma API individual

Para proteger uma API individual com a política Wallarm, siga estes passos:

1. Na sua Plataforma Anypoint, navegue até **API Manager** e selecione a API desejada.
1. Navegue até **Policies** → **Add policy** e selecione a política Wallarm.
1. Especifique `WLRM REPORTING ENDPOINT` que é o endereço IP da [instância do nó Wallarm](#1-implantar-um-no-wallarm) , incluindo o `http://` ou `https://`.
1. Se necessário, modifique o período máximo para a Wallarm processar uma única solicitação, alterando o valor de `WALLARM NODE REQUEST TIMEOUT`.
1. Aplique a política.

![Política Wallarm](../../images/waf-installation/gateways/mulesoft/policy-for-an-api.png)

## Testando

Para testar a funcionalidade da política implantada, siga estas etapas:

1. Envie a solicitação com o teste de ataque [Path Traversal][ptrav-attack-docs] para a sua API:

    ```
    curl http://<SEU_IP_OU_DOMINIO_DO_APP>/etc/passwd
    ```
1. Abra o Console Wallarm → seção **Events** no [US Cloud](https://us1.my.wallarm.com/attacks) ou [EU Cloud](https://my.wallarm.com/attacks) e certifique-se de que o ataque está exibido na lista.
    
    ![Ataques na interface][attacks-in-ui-image]

    Se o modo do nó Wallarm estiver definido para bloqueio, a solicitação também será bloqueada.

Se a solução não funcionar conforme esperado, consulte os logs da API acessando Mulesoft Anypoint Platform → **Runtime Manager** → sua aplicação → **Logs**.

Você também pode verificar se a política foi aplicada à API navegando até a API no **API Manager** e revisar as políticas aplicadas na aba **Policies**. Para políticas automatizadas, você pode usar a opção **See covered APIs** para ver as APIs cobertas e as razões de quaisquer exclusões.

## Atualização e desinstalação

Para atualizar a política Wallarm implantada, siga estas etapas:

1. Remova a política Wallarm atualmente implantada usando a opção **Remove policy** na lista de política automatizada ou na lista de políticas aplicadas a uma API individual.
1. Adicione a nova política seguindo as etapas 2-3 acima.
1. Reinicie os aplicativos anexados no **Runtime Manager** para aplicar a nova política.

Para desinstalar a política, simplesmente execute o primeiro passo do processo de atualização.

## Precisa de ajuda?

Se você encontrar algum problema ou precisar de ajuda com a implantação descrita da política Wallarm em conjunto com o MuleSoft, você pode entrar em contato com a equipe de [suporte da Wallarm](mailto:support@wallarm.com). Eles estão disponíveis para fornecer orientação e ajudar a resolver quaisquer problemas que você possa enfrentar durante o processo de implementação.