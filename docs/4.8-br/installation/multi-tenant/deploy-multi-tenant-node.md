[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[logging-instr]:                    ../../admin-en/configure-logging.md
[proxy-balancer-instr]:             ../../admin-en/using-proxy-or-balancer-en.md
[process-time-limit-instr]:         ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[dynamic-dns-resolution-nginx]:     ../../admin-en/configure-dynamic-dns-resolution-nginx.md

# Implantando e Configurando o Nó Multi-inquilino

O nó [multi-inquilino](overview.md) protege simultaneamente várias infraestruturas de empresas independentes ou ambientes isolados.

## Opções de implantação do nó multi-inquilino

Escolha a opção de implantação de nó multi-inquilino com base em sua infraestrutura e no problema abordado:

* Implante um nó Wallarm para filtrar o tráfego de todos os clientes ou ambientes isolados da seguinte forma:

    ![Esquema do nó parceiro](../../images/partner-waf-node/partner-traffic-processing-4.0.png)
    
    * Um único nó Wallarm processa o tráfego de vários inquilinos (Inquilino 1, Inquilino 2).

        --8<-- "../include/waf/features/multi-tenancy/partner-client-term.md"
        
    * O nó Wallarm identifica o inquilino que recebe o tráfego pelo identificador único de um inquilino ([`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) ou [`partner_client_uuid`](../../admin-en/configuration-guides/envoy/fine-tuning.md#configuration-options-for-the-envoy‑based-wallarm-node) na instalação do Envoy).
    * Para os domínios `https://tenant1.com` e `https://tenant2.com`, os registros DNS A com o endereço IP do parceiro ou cliente `225.130.128.241` são configurados. Esta configuração é mostrada como um exemplo, uma configuração diferente pode ser usada do lado do parceiro e do inquilino.
    * No lado do parceiro, o proxy de solicitações legítimas para os endereços do inquilino Inquilino 1 (`http://upstream1:8080`) e Inquilino 2 (`http://upstream2:8080`) é configurado. Esta configuração é mostrada como um exemplo, uma configuração diferente pode ser usada do lado do parceiro e do inquilino.

    !!! warning "Se o nó Wallarm é do tipo CDN"
        Como a configuração `wallarm_application` não é suportada pelo [Nó Wallarm CDN](../cdn-node.md), este método de implantação também não é suportado pelo tipo de nó CDN. Se o tipo de nó em uso é CDN, por favor, implante vários nós cada um filtrando o tráfego de um inquilino específico.

* Implante vários nós Wallarm, cada um filtrando o tráfego de um inquilino específico da seguinte forma:

    ![Esquema de vários nós do cliente](../../images/partner-waf-node/client-several-nodes.png)

    * Vários nós Wallarm, cada um filtrando o tráfego de um inquilino específico (Inquilino 1, Inquilino 2).
    * Para o domínio https://tenant1.com, o registro DNS com o endereço IP do cliente 225.130.128.241 é configurado.
    * Para o domínio https://tenant2.com, o registro DNS com o endereço IP do cliente 225.130.128.242 é configurado.
    * Cada nó está fazendo o proxy de solicitações legítimas para os endereços de seu inquilino:
        * Nó 1 para Inquilino 1 (http://upstream1:8080).
        * Nó 2 para Inquilino 2 (http://upstream2:8080).

## Características do Nó Multi-inquilino

Nó multi-inquilino:

* Pode ser instalado nas mesmas [plataformas](../../installation/supported-deployment-options.md) e de acordo com as mesmas instruções que um nó de filtragem regular.
* Pode ser instalado no nível de **inquilino técnico** ou **inquilino**. Se você deseja fornecer a um inquilino acesso ao Console Wallarm, o nó de filtragem deve ser instalado no nível de inquilino correspondente.
* Pode ser configurado de acordo com as mesmas instruções que um nó de filtragem regular.
* A diretiva [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid) é usada para dividir o tráfego pelos inquilinos.
* A diretiva [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application) é usada para dividir as configurações pelas aplicações.

## Requisitos para implantação

* [Contas de inquilino configuradas](configure-accounts.md)
* Execução de comandos adicionais pelo usuário com a função de **Administrador global** adicionado na [conta do inquilino técnico](configure-accounts.md#tenant-account-structure)
* [Plataforma suportada para a instalação do nó de filtragem](../../installation/supported-deployment-options.md)

## Recomendações para a implantação de um nó multi-inquilino

* Se for necessário para o inquilino acessar o Console Wallarm, crie o nó de filtragem dentro de uma conta de inquilino apropriada.
* Configure o nó de filtragem por meio do arquivo de configuração NGINX do inquilino.

## Procedimento para a implantação de um nó multi-inquilino

1. No Console Wallarm → **Nós**, clique em **Criar nó** e selecione **Nó Wallarm**.

    !!! info "Mudando um nó Wallarm existente para o modo multi-inquilino"
        Se você deseja mudar um nó Wallarm existente para o modo multi-inquilino, use a opção **Torná-lo multi-inquilino** no menu do nó necessário na seção **Nós**.

        Uma vez mudado e confirmado, prossiga para a 4ª etapa.1. Selecione a opção **Nó multi-inquilino**.

    ![Criação do Nó Multi-inquilino](../../images/user-guides/nodes/create-multi-tenant-node.png)
1. Defina um nome para o nó e clique em **Criar**.
1. Copie o token do nó de filtragem.
1. Dependendo da forma de implantação do nó de filtragem, execute as etapas das [instruções apropriadas](../../installation/supported-deployment-options.md).
1. Divida o tráfego entre os inquilinos usando seus identificadores únicos.

    === "NGINX e NGINX Plus"
        Abra o arquivo de configuração do NGINX do inquilino e divida o tráfego entre os inquilinos usando a diretiva [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid). Veja exemplo abaixo.
    === "Controlador de Ingresso NGINX"
        Use a [anotação](../../admin-en/configure-kubernetes-en.md#ingress-annotations) `nginx.ingress.kubernetes.io/wallarm-partner-client-uuid` do Ingress para definir o UUID do inquilino para cada recurso Ingress. Um recurso está relacionado a um inquilino:

        ```
        kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-partner-client-uuid=VALUE
        ```
    === "Imagem Docker baseada em NGINX"
        1. Abra o arquivo de configuração do NGINX e divida o tráfego entre os inquilinos usando a diretiva [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid). Veja exemplo abaixo.
        1. Execute o container docker [montando o arquivo de configuração](../../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file).
    === "Imagem Docker baseada em Envoy"
        1. Abra o arquivo de configuração `envoy.yaml` e divida o tráfego entre os inquilinos usando o parâmetro [`partner_client_uuid`](../../admin-en/configuration-guides/envoy/fine-tuning.md#partner_client_id_param).
        1. Execute o container docker [montando `envoy.yaml` preparado](../../admin-en/installation-guides/envoy/envoy-docker.md#run-the-container-mounting-envoyyaml).
    === "Kubernetes Sidecar"
        1. Abra o arquivo de configuração do NGINX e divida o tráfego entre os inquilinos usando a diretiva [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid).
        1. Monte um arquivo de configuração do NGINX no [contêiner do servidor de sidecar Wallarm](../../installation/kubernetes/sidecar-proxy/customization.md#using-custom-nginx-configuration).

    Exemplo do arquivo de configuração do NGINX para o nó de filtragem que processa o tráfego de dois clientes:

    ```
    server {
        listen       80;
        server_name  tenant1.com;
        wallarm_mode block;
        wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
        
        location / {
            proxy_pass      http://upstream1:8080;
        }
    }
    
    server {
        listen       80;
        server_name  tenant2.com;
        wallarm_mode monitoring;
        wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222;
        
        location / {
            proxy_pass      http://upstream2:8080;
        }
    }
    ```

    * Do lado do inquilino, os registros DNS A com o endereço IP do parceiro são configurados
    * Do lado do parceiro, é configurado o proxy de solicitações para os endereços dos inquilinos (`http://upstream1:8080` para o inquilino com `wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111` e `http://upstream2:8080` para o inquilino com `wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222`)
    * Todas as solicitações de entrada são processadas no endereço do parceiro, solicitações legítimas são encaminhadas para `http://upstream1:8080` para o inquilino com `wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111` e para `http://upstream2:8080` para o inquilino com `wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222`

1. Se necessário, especifique os IDs das aplicações do inquilino usando a diretiva [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application).

    Exemplo:

    ```
    server {
        listen       80;
        server_name  tenant1.com;
        wallarm_mode block;
        wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
        
        location / {
            proxy_pass      http://upstream1:8080;
        }

        location /login {
            wallarm_application 21;
            ...
        }
        location /users {
            wallarm_application 22;
            ...
        }
    }
    ```

    Dois aplicativos pertencem ao inquilino `11111111-1111-1111-1111-111111111111`:
    
    * `tenant1.com/login` é a aplicação `21`
    * `tenant1.com/users` é a aplicação `22`

## Configurando um Nó Multi-inquilino

Para personalizar as configurações do nó de filtragem, use as [diretivas disponíveis](../../admin-en/configure-parameters-en.md).

--8<-- "../include/waf/installation/common-customization-options-nginx-4.4.md"