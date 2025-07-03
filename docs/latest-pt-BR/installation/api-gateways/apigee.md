[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart-sqli-xss.png

# Apigee Edge com Wallarm Proxy Bundle

[Apigee Edge](https://docs.apigee.com/api-platform/get-started/what-apigee-edge) é uma plataforma de gerenciamento de API com um gateway de API servindo como ponto de entrada para aplicações cliente acessarem APIs. Para aumentar a segurança da API no Apigee, você pode integrar o bundle de proxy de API da Wallarm, conforme detalhado neste artigo.

A solução envolve a implementação do nó Wallarm externamente e a injeção de código personalizado ou políticas na plataforma específica. Isso permite que o tráfego seja direcionado para o nó Wallarm externo para análise e proteção contra ameaças potenciais. Referidos como conectores da Wallarm, eles servem como o elo essencial entre plataformas como Azion Edge, Akamai Edge, MuleSoft, Apigee e AWS Lambda, e o nó Wallarm externo. Esta abordagem garante integração perfeita, análise de tráfego seguro, mitigação de risco e segurança geral da plataforma.

## Casos de uso

Entre todas as [opções de implementação da Wallarm](../supported-deployment-options.md) suportadas, esta solução é a recomendada para os seguintes casos de uso:

* Protegendo APIs implementadas na plataforma Apigee com apenas um proxy de API.
* Requerendo uma solução de segurança que oferece observação abrangente de ataques, relatórios e bloqueio instantâneo de solicitações maliciosas.

## Limitações

A solução tem certas limitações, pois só funciona com solicitações de entrada:

* A descoberta de vulnerabilidades usando o método de [detecção passiva](../../about-wallarm/detecting-vulnerabilities.md#passive-detection) não funciona corretamente. A solução determina se uma API é vulnerável ou não com base nas respostas do servidor para solicitações maliciosas que são típicas 
* O [Wallarm API Discovery](../../api-discovery/overview.md) não pode explorar o inventário de APIs com base em seu tráfego, pois a solução depende da análise de resposta.
* A [proteção contra navegação forçada](../../admin-en/configuration-guides/protecting-against-bruteforce.md) não está disponível, pois requer análise do código de resposta.

## Requisitos

Para prosseguir com a implementação, certifique-se de que cumpre os seguintes requisitos:

* Compreensão da plataforma Apigee.
* Suas APIs estão sendo executadas no Apigee.

## Implementação

Para proteger APIs na plataforma Apigee, siga estas etapas:

1. Implemente um nó Wallarm na instância GCP.
1. Obtenha o pacote de proxy Wallarm e faça o upload para o Apigee.

### 1. Implementar um nó Wallarm

Ao usar o proxy Wallarm no Apigee, o fluxo de tráfego opera [em linha](../inline/overview.md). Portanto, escolha uma das artefatos de implementação de nó Wallarm suportados para implementação em linha no Google Cloud Platform:

* [Imagem de máquina GCP](../packages/gcp-machine-image.md)
* [Google Compute Engine (GCE)](../cloud-platforms/gcp/docker-container.md)

Configure o nó implementado usando o seguinte modelo:

```
server {
	listen 80 default_server;
	listen [::]:80 default_server;

	server_name _;

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
	
	wallarm_mode block;
	real_ip_header X-LAMBDA-REAL-IP;
	set_real_ip_from unix:;

	location / {
		echo_read_request_body;
	}
}
```

Após a implementação ser concluída, anote o endereço IP da instância do nó, pois será necessário para configurar o encaminhamento de solicitações de entrada. Observe que o IP pode ser interno; não é necessário que seja externo.

### 2. Obter o pacote de proxy Wallarm e enviá-lo para o Apigee

A integração envolve a criação de um proxy de API no Apigee que irá rotear o tráfego legítimo para suas APIs. Para isso, a Wallarm fornece um pacote de configuração personalizado. Siga estas etapas para adquirir e [utilizar](https://docs.apigee.com/api-platform/fundamentals/build-simple-api-proxy) o pacote Wallarm para o proxy de API no Apigee:

1. Entre em contato com [support@wallarm.com](mailto:support@wallarm.com) para obter o pacote de proxy Wallarm para o Apigee.
1. Na UI do Apigee Edge, navegue até **Develop** → **API Proxies** → **+Proxy** → **Upload proxy bundle**.
1. Faça o upload do pacote fornecido pela equipe de suporte da Wallarm.
1. Abra o arquivo de configuração importado e especifique o [endereço IP da instância do nó Wallarm](#1-deploy-a-wallarm-node) em `prewall.js` e `postwall.js`.
1. Salve e implemente a configuração.

## Teste

Para testar a funcionalidade da política implementada, siga estas etapas:

1. Envie a solicitação com o teste de ataque [Path Traversal][ptrav-attack-docs] para sua API:

    ```
    curl http://<YOUR_APP_IP_OR_DOMAIN>/etc/passwd
    ```

1. Abra o Console da Wallarm → Seção **Events** na [Nuvem dos EUA](https://us1.my.wallarm.com/attacks) ou [Nuvem da UE](https://my.wallarm.com/attacks) e certifique-se de que o ataque é exibido na lista.
    
    ![Ataques na interface][attacks-in-ui-image]

    Se o modo de nó Wallarm estiver configurado para bloqueio, a solicitação também será bloqueada.

## Precisa de assistência?

Se você encontrar algum problema ou precisar de assistência com a implementação descrita da Wallarm em conjunto com o Apigee, você pode entrar em contato com a equipe de [suporte da Wallarm](mailto:support@wallarm.com). Eles estão disponíveis para fornecer orientação e ajudar a resolver qualquer problema que você possa enfrentar durante o processo de implementação.