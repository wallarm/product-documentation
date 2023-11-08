[link-doc-asg-guide]:               creating-autoscaling-group.md  
[link-docs-check-operation]:        /admin-en/installation-check-operation-en.md
[link-lb-comparison]:               https://cloud.google.com/load-balancing/docs/load-balancing-overview
[link-creating-instance-group]:     creating-autoscaling-group.md
[link-backup-resource]:             https://cloud.google.com/load-balancing/docs/target-pools#backupPool
[link-health-check]:                https://cloud.google.com/load-balancing/docs/health-checks
[link-session-affinity]:            https://cloud.google.com/load-balancing/docs/target-pools#sessionaffinity
[link-test-attack]:                 ../../installation-check-operation-en.md
[link-network-service-tier]:        https://cloud.google.com/network-tiers/docs/

[img-backend-configuration]:        ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/backend-configuration.png
[img-creating-lb]:                  ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/creating-load-balancer.png
[img-creating-tcp-lb]:              ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/creating-tcp-load-balancer.png
[img-new-frontend-ip-and-port]:     ../../../images/installation-gcp/auto-scaling/common/load-balancing-guide/frontend-configuration.png
[img-checking-attacks]:             ../../../images/admin-guides/test-attacks-quickstart.png


# Configurando o balanceamento de solicitações de entrada no GCP

Agora que você tem um [grupo de instâncias gerenciadas configurado][link-doc-asg-guide] com auto escalonamento ativado, você precisa criar e configurar um Load Balancer que distribui as conexões HTTP e HTTPS que chegam entre vários nós de filtragem do grupo de instâncias.

Você pode configurar os seguintes tipos de Load Balancers na Google Cloud Platform:
* Load Balancer HTTP(S)
* Load Balancer TCP
* Load Balancer UDP

!!! info "As diferenças entre os Load Balancers"
    Para informações detalhadas sobre as diferenças entre Load Balancers, prossiga para este [link][link-lb-comparison]. 

Este documento demonstra como configurar e usar o Load Balancer TCP que distribui o tráfego no nível de transporte do modelo de rede OSI/ISO.

Crie um Load Balancer TCP para seu grupo de instâncias, completando as seguintes ações: 

1.  Navegue até a página **Balanceamento de carga** na seção **Serviços de rede** do menu e clique no botão **Criar balanceador de carga**.

2.  Clique no botão **Iniciar configuração** no cartão **Balanceamento de carga TCP**.

3.  Selecione as opções necessárias nas seguintes configurações:

    1.  Selecione a opção **Da Internet para minhas VMs** na configuração **Voltado para a internet ou apenas para uso interno** para que o balanceador de carga controle as solicitações de entrada do cliente para seu servidor.
    
    2.  Selecione a opção **Apenas uma região** na configuração **Múltiplas regiões ou apenas uma região**.
    
        !!! info "Balanceamento de tráfego para recursos localizados em diferentes regiões"
            Este guia descreve a configuração do balanceador de carga para um grupo de instâncias localizado em uma única região.
            
            No caso de balanceamento de tráfego para vários recursos localizados em várias regiões, selecione a opção **Múltiplas regiões (ou ainda não tenho certeza)**.

    ![Criando um balanceador de carga][img-creating-lb]

    Clique no botão **Continuar**.

4.  Insira o nome do balanceador de carga no campo **Nome**.

5.  Clique em **Backend configuration** para usar o [grupo de instâncias criado][link-creating-instance-group] como backend para o qual o balanceador de carga roteará as solicitações de entrada.

6.  Preencha o formulário com os seguintes dados:

    1.  Selecione a região onde o grupo de instâncias está localizado na lista suspensa **Região**.
    
    2.  Navegue até a aba **Selecionar grupos de instâncias existentes** na configuração **Backends** e selecione o nome do grupo de instâncias na lista suspensa **Adicionar um grupo de instâncias**.
    
    3.  Se necessário, especifique o reservatório de backup selecionando a opção **Criar um reservatório de backup** na lista suspensa **Reservatório de backup**. 
    
        !!! info "Usando um reservatório de backup"
            Um reservatório de backup processa as solicitações se o grupo de instâncias selecionado na configuração anterior estiver indisponível. Para informações detalhadas sobre a configuração de um reservatório de backup, prossiga para este [link][link-backup-resource].
            
            Este documento não descreve a configuração do reservatório de backup.
    
    4.  Se necessário, configure a verificação de disponibilidade das instâncias do grupo selecionando a opção **Criar uma verificação de saúde** na lista suspensa **Verificação de saúde**. Para informações detalhadas sobre a verificação de disponibilidade da máquina, prossiga para este [link][link-health-check].
    
        !!! info "A verificação de disponibilidade"
            A verificação de disponibilidade não é configurada neste documento. Assim, aqui a opção **Sem verificação de saúde** é selecionada na lista suspensa **Verificação de saúde**.
    
    5.  Se necessário, configure o método de escolha de uma instância para processamento de solicitações selecionando a opção correspondente na lista suspensa **Afinidade de sessão**. Informações detalhadas sobre a seleção de uma instância para processamento de solicitações estão disponíveis neste [link][link-session-affinity].
    
        !!! info "Configurando um método de escolha de uma instância"
            O método de escolha de uma instância para processamento de solicitações não está no escopo deste documento. Assim, aqui a opção **Nenhuma** é selecionada na lista suspensa **Afinidade de sessão**.
    
        ![Configurando um backend][img-backend-configuration]

7.  Clique no botão **Frontend configuration** para especificar os endereços IP e as portas para as quais os clientes enviarão suas solicitações.

8.  Preencha o formulário para a criação de novos endereços de IP e portas com os dados necessários:

    1.  Se necessário, insira o nome do novo par de endereço IP e porta no campo **Nome**.
    
    2.  Selecione a categoria de serviço de rede necessária na configuração **Categoria de serviço de rede**. Para obter informações detalhadas sobre as classes de serviço de rede, prossiga para este [link][link-network-service-tier];
    
    3.  Selecione o endereço IP onde o balanceador de carga receberá solicitações na lista suspensa **IP**.
    
        1.  Selecione a opção **Efêmero** se você quiser que o balanceador de carga obtenha um novo endereço IP a cada inicialização da máquina virtual.
        
        2.  Selecione a opção **Criar endereço IP** para gerar um endereço IP estático para o seu balanceador de carga. 
        
        No formulário que aparece, insira o nome do novo endereço IP no campo **Nome** e clique no botão **Reservar**.
            
    4.  Insira a porta onde o balanceador de carga receberá solicitações no campo **Porta**. 
    
        !!! info "Escolhendo a porta"
            Neste documento, a porta `80` é especificada para receber solicitações via protocolo HTTP.
    
    ![Formulário de criação de novo IP e porta frontend][img-new-frontend-ip-and-port]
    
    Clique no botão **Concluído** para criar o par de endereço IP e porta configurados.
    
    !!! info "Portas frontend necessárias"
        Neste documento, o balanceador é configurado para receber solicitações via protocolo HTTP. Se o seu grupo de instâncias recebe solicitações via protocolo HTTPS, crie outro par de endereço IP e porta que especifica a porta `443`.

9.  Clique no botão **Criar** para criar o balanceador de carga configurado.

    ![Criando um balanceador de carga TCP][img-creating-tcp-lb]
    
Aguarde até que o processo de criação do balanceador de carga seja concluído e o balanceador de carga se conecte ao grupo de instâncias que você criou anteriormente.

Porque o balanceador de carga TCP criado usa o serviço de backend (que trabalha juntamente com o backend criado para o seu grupo de instâncias), o grupo de instâncias não requer nenhuma modificação de configuração para que o balanceador se conecte a ele.

Agora o conjunto de nós de filtragem Wallarm de escala dinâmica processará o tráfego de entrada para a sua aplicação.

Para verificar a operação dos nós de filtragem implantados, execute as seguintes etapas:
1.  Certifique-se de que sua aplicação é acessível através do balanceador de carga e dos nós de filtragem Wallarm referindo-se ao endereço IP do balanceador ou nome de domínio usando seu navegador.
2.  Certifique-se de que os serviços Wallarm protegem sua aplicação [realizando um ataque de teste][link-test-attack].

![A aba «Eventos» na interface web Wallarm][img-checking-attacks]