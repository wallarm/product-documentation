[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Wallarm Node.js para AWS Lambda

[AWS Lambda@Edge](https://aws.amazon.com/lambda/edge/) é um serviço de computação sem servidor e orientado a eventos que permite que você execute código para vários tipos de aplicativos ou serviços de back-end sem a necessidade de provisionar ou gerenciar servidores. Ao incorporar o código Node.js do Wallarm, você pode direcionar o tráfego de entrada para o nó Wallarm para análise e filtragem. Este artigo fornece instruções sobre como configurar o Wallarm para análise e filtragem de tráfego especificamente para lambdas Node.js em seu aplicativo AWS.

<!-- ![Lambda](../../images/waf-installation/gateways/aws-lambda-traffic-flow.png) -->

A solução envolve a implantação do nó Wallarm externamente e a injeção de código ou políticas personalizadas na plataforma específica. Isso permite que o tráfego seja direcionado para o nó Wallarm externo para análise e proteção contra possíveis ameaças. Referidos como conectores Wallarm, eles servem como o elo essencial entre plataformas como Azion Edge, Akamai Edge, Mulesoft, Apigee, e AWS Lambda, e o nó Wallarm externo. Essa abordagem garante integração contínua, análise segura de tráfego, mitigação de riscos e segurança geral da plataforma.

## Casos de uso

Entre todas as [opções de implantação do Wallarm](../supported-deployment-options.md) compatíveis, esta solução é recomendada para os seguintes casos de uso:

* Proteger aplicativos na AWS que utilizam lambdas Node.js.
* Exigir uma solução de segurança que ofereça observação abrangente de ataques, relatórios e bloqueio instantâneo de solicitações maliciosas.

## Limitações

A solução tem certas limitações, pois só funciona com solicitações de entrada:

* A descoberta de vulnerabilidades usando o método de [detecção passiva](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) não funciona adequadamente. A solução determina se uma API é vulnerável ou não com base nas respostas do servidor a solicitações maliciosas que são típicas para as vulnerabilidades que ela testa.
* A [Descoberta de API do Wallarm](../../api-discovery/overview.md) não pode explorar o inventário da API com base no seu tráfego, pois a solução depende da análise da resposta.
* A [proteção contra navegação forçada](../../admin-en/configuration-guides/protecting-against-bruteforce.md) não está disponível, pois exige análise do código de resposta.

Existem também outras limitações:

* O tamanho do corpo do pacote HTTP é limitado a 40 KB quando interceptado no nível de solicitação do visualizador e 1MB no nível de solicitação de origem.
* O tempo máximo de resposta do nó Wallarm é limitado a 5 segundos para solicitações do visualizador e 30 segundos para solicitações de origem.
* O Lambda@Edge não funciona dentro de redes privadas (VPC).
* O número máximo de solicitações processadas simultaneamente por região é 1.000 (Quota Padrão), mas pode ser aumentado para dezenas de milhares.

## Requisitos

Para prosseguir com a implantação, certifique-se de que você atende aos seguintes requisitos:

* Entendimento das tecnologias AWS Lambda.
* APIs ou tráfego rodando na AWS.

## Implementação

Para proteger com Wallarm aplicações na AWS que usam lambdas Node.js, siga estas etapas:

1. Implemente um nó Wallarm na instância AWS.
1. Obtenha o script Node.js do Wallarm para AWS Lambda e execute-o.

### 1. Implementar um nó Wallarm

Ao integrar o Wallarm com o AWS Lambda, o fluxo de tráfego opera [in-line](../inline/overview.md). Portanto, escolha um dos artefatos de implementação do nó Wallarm suportados para implementação em linha na AWS:

* [AWS AMI](../packages/aws-ami.md)
* [Amazon Elastic Container Service (ECS)](../cloud-platforms/aws/docker-container.md)

Configure o nó implementado usando o seguinte template:

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

	real_ip_header X-Lambda-Real-IP;
	set_real_ip_from unix:;

	location / {
		echo_read_request_body;
	}
}
```

Por favor, certifique-se de prestar atenção nas seguintes configurações:

* Certificados TLS/SSL para tráfego HTTPS: Para permitir que o nó Wallarm trate o tráfego HTTPS seguro, configure os certificados TLS/SSL de acordo. A configuração específica dependerá do método de implementação escolhido. Por exemplo, se você estiver usando o NGINX, pode consultar [o seu artigo](https://docs.nginx.com/nginx/admin-guide/security-controls/terminating-ssl-http/) para obter orientação.
* Configuração do [modo de operação do Wallarm](../../admin-en/configure-wallarm-mode.md).

### 2. Obtenha o script Node.js do Wallarm para AWS Lambda e execute-o

Para adquirir e executar o script Node.js do Wallarm na AWS Lambda, siga estas etapas:

1. Entre em contato com [support@wallarm.com](mailto:support@wallarm.com) para obter o Node.js do Wallarm.
1. [Crie](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_create.html) uma nova política IAM com as seguintes permissões: 

    ```
    lambda:CreateFunction, 
    lambda:UpdateFunctionCode, 
    lambda:AddPermission, 
    iam:CreateServiceLinkedRole, 
    lambda:GetFunction, 
    lambda:UpdateFunctionConfiguration, 
    lambda:DeleteFunction, 
    cloudfront:UpdateDistribution, 
    cloudfront:CreateDistribution, 
    lambda:EnableReplication. 
    ```
1. No serviço AWS Lambda, crie uma nova função usando Node.js 14.x como tempo de execução e a função criada na etapa anterior. Escolha **Criar uma nova função com permissões básicas de Lambda**.
1. No editor de código fonte, cole o código recebido da equipe de suporte do Wallarm.
1. No código colado, atualize os valores `WALLARM_NODE_HOSTNAME` e `WALLARM_NODE_PORT` para apontar para o [nó Wallarm previamente implementado](#1-implementar-um-nó-wallarm).
    
    Para enviar o tráfego para o nó de filtragem via 443/SSL, use a seguinte configuração:

    ```
    const WALLARM_NODE_PORT = '443';

    var http = require('https');
    ```
    Se você estiver usando um certificado autoassinado, faça a seguinte alteração para desativar a aplicação rigorosa de certificado:

    ```
    var post_options = {
        host: WALLARM_NODE_HOSTNAME,
        port: WALLARM_NODE_PORT,
        path: request.uri + request.querystring,
        method: request.method,
        // only need if self-signed cert
        rejectUnauthorized: false, 
        // 
        headers: newheaders
        
    };
    ```
1. Volte para a seção IAM e edite a função recém-criada anexando as seguintes políticas: `AWSLambda_FullAccess`, `AWSLambdaExecute`, `AWSLambdaBasicExecutionRole`, `AWSLambdaVPCAccessExecutionRole`, e `LambdaDeployPermissions` criada na etapa anterior.
1. Em Trust relationships, adicione a seguinte alteração ao **Service**:

    ```
    "Service": [
                        "edgelambda.amazonaws.com",
                        "lambda.amazonaws.com"
                    ]
    ```
1. Navegue até Lambda → Functions → <YOUR_FUNCTION> e clique **Add Trigger**.
1. Nas opções de Deploy to Lambda@Edge, clique **Deploy to Lambda@Edge** e selecione a CloudFront Distribution que precisa ter o handler Wallarm adicionado ou crie uma nova.

    Durante o processo, escolha o **Viewer request** para o evento CloudFront e marque a caixa para **Include body**.

## Testando

Para testar a funcionalidade da política implementada, siga estas etapas:

1. Envie a solicitação com o ataque de teste [Path Traversal][ptrav-attack-docs] para sua API:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```
1. Abra Wallarm Console → seção **Events** no [US Cloud](https://us1.my.wallarm.com/search) ou [EU Cloud](https://my.wallarm.com/search) e certifique-se de que o ataque está exibido na lista.

    ![Ataques na interface][attacks-in-ui-image]

    Se o modo de nó Wallarm estiver configurado para bloqueio, a solicitação também será bloqueada.

## Precisa de ajuda?

Se você encontrar algum problema ou precisar de ajuda com a implantação descrita do Wallarm em conjunto com a AWS Lambda, pode entrar em contato com a equipe de suporte do [Wallarm](mailto:support@wallarm.com). Eles estão disponíveis para fornecer orientação e ajudar a resolver quaisquer problemas que você possa enfrentar durante o processo de implementação.
