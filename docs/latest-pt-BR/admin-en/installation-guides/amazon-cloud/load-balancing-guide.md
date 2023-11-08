[link-doc-asg-guide]:               autoscaling-group-guide.md  
[link-docs-check-operation]:        ../../installation-check-operation-en.md

[link-aws-lb-comparison]:           https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html?icmpid=docs_elbv2_console#elb-features   

[img-lb-basics]:                    ../../../images/installation-ami/auto-scaling/common/load-balancing-guide/lb-create-1.png
[img-lb-routing]:                   ../../../images/installation-ami/auto-scaling/common/load-balancing-guide/lb-create-3.png
[img-checking-operation]:           ../../../images/admin-guides/test-attacks-quickstart.png

[anchor-create]:        #1-creating-a-load-balancer
[anchor-configure]:     #2-setting-up-an-auto-scaling-group-for-using-the-created-balancer

# Criando um Load Balancer na AWS

Agora, uma vez que você possui um nó de filtragem com Auto Scaling Group [configurado][link-doc-asg-guide], você precisa criar e configurar um Load Balancer que distribui as conexões HTTP e HTTPS de entrada entre vários nós de filtragem do Auto Scaling Group.

O processo de criação de Load Balancer inclui as seguintes etapas:
1.  [Criando um Load Balancer][anchor-create]
2.  [Configurando um Auto Scaling Group para Utilizar o Balanceador Criado][anchor-configure]

##  1.  Criando um Load Balancer

Você pode configurar os seguintes tipos de Load Balancers na nuvem da Amazon:
*   Classic Load Balancer
*   Network Load Balancer
*   Application Load Balancer

!!! info "Diferenças entre os Load Balancers"
    Para visualizar informações detalhadas sobre as diferenças entre os Load Balancers, acesse este [link][link-aws-lb-comparison].

Este documento demonstra a configuração e o uso do Network Load Balancer que distribui o tráfego no nível de transporte do modelo de rede OSI/ISO.

Crie um Load Balancer completando as seguintes ações:
1.  Navegue até a aba **Load Balancers** no painel do Amazon EC2 e clique no botão **Criar Load Balancer**.

2.  Crie um Network Load Balancer clicando no botão **Criar** correspondente.

3.  Configure os parâmetros básicos do Load Balancer:

    ![Configuração dos parâmetros gerais do Load Balancer][img-lb-basics]
    
    1.  O nome do balanceador (parâmetro **Nome**).
    
    2.  O tipo de balanceador (parâmetro **Esquema**). Selecione o tipo **internet-facing** para que o balanceador esteja disponível na internet. 
    
    3.  Especifique as portas para o balanceador ouvir usando o grupo de parâmetros **Listeners**.
    
    4.  Especifique o VPC e as Zones de Disponibilidade necessários nos quais o balanceador deve estar operando.
        
        !!! info "Verifique a disponibilidade do Auto Scaling Group"
            Verifique se você selecionou o VPC e as Zonas de Disponibilidade que contém o Auto Scaling Group [criado anteriormente][link-doc-asg-guide] para o correto funcionamento do balanceador de carga.
        
4.  Prossiga para a próxima etapa clicando no botão **Próximo: Configurar Configurações de Segurança**.

    Configure os parâmetros de segurança se necessário.
    
5.  Continue para a próxima etapa clicando no botão **Próximo: Configurar Rotas**.

    Configure o roteamento das solicitações de entrada para os nós de filtragem no Auto Scaling Group.

    ![Configurando o roteamento das conexões de entrada][img-lb-routing]
    
    1.  Crie um novo grupo de destino e especifique seu nome no campo **Nome**. O Load Balancer encaminhará as solicitações de entrada para as instâncias localizadas no grupo de destino especificado (por exemplo, `demo-target`).
        
    2.  Configure o protocolo e a porta a serem usados para o roteamento de solicitações.
    
        Especifique o protocolo TCP e as portas 80 e 443 (se você tiver tráfego HTTPS) para o nó de filtragem.
        
    3.  Se necessário, configure as verificações de disponibilidade usando o grupo de parâmetros **Health Checks**.
    
6.  Prossiga para a próxima etapa clicando no botão **Próximo: Registrar Alvos**.

    Esta etapa não requer ações.
    
7.  Mude para a próxima etapa clicando no botão **Próximo: Revisão**.
    
    Verifique se todos os parâmetros estão especificados corretamente e inicie o processo de criação do Load Balancer clicando no botão **Criar**.

!!! info "Aguarde até que o Load Balancer esteja inicializado"
    Após a criação do Load Balancer, é necessário um tempo para que esteja pronto para receber tráfego.

##  2.  Configurando um Auto Scaling Group para utilizar o balanceador criado

Configure seu Auto Scaling Group para utilizar o Load Balancer criado anteriormente. Isso permitirá que o balanceador direcione o tráfego para as instâncias do nó de filtragem que são lançadas no grupo.

Para fazer isso, complete as seguintes ações:
1.  Navegue até a aba **Auto Scaling Groups** no painel do Amazon EC2 e selecione o Auto Scaling Group [criado anteriormente][link-doc-asg-guide].

2.  Abra o diálogo de edição de configuração do grupo selecionando *Edit* no menu suspenso **Ações**.

3.  Selecione o grupo de destino **demo-target** [criado][anchor-create] ao configurar o Load Balancer na lista suspensa **Grupos de destino**.

4.  Aplique as mudanças clicando no botão **Salvar**.

Agora o conjunto de nós de filtragem Wallarm de escalonamento dinâmico processará o tráfego de entrada para o seu aplicativo.

Para verificar a operação dos nós de filtragem implantados, execute as seguintes etapas:

1.  Verifique se o seu aplicativo está acessível através do Load Balancer e dos nós de filtragem Wallarm referindo-se ao endereço IP do balanceador ou ao nome do domínio usando o navegador.

2.  Verifique se os serviços Wallarm protegem seu aplicativo [realizando um ataque de teste][link-docs-check-operation].

![Checando a operação do nó de filtragem][img-checking-operation]