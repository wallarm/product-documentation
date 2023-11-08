[link-doc-aws-as]:          https://docs.aws.amazon.com/autoscaling/plans/userguide/what-is-aws-auto-scaling.html
[link-doc-ec2-as]:          https://docs.aws.amazon.com/autoscaling/ec2/userguide/GettingStartedTutorial.html
[link-doc-as-faq]:          https://aws.amazon.com/autoscaling/faqs/

[link-doc-ami-creation]:    create-image.md
[link-doc-asg-guide]:       autoscaling-group-guide.md
[link-doc-lb-guide]:        load-balancing-guide.md
[link-doc-create-template]: autoscaling-group-guide.md#1-creating-a-launch-template
[link-doc-create-asg]:      autoscaling-group-guide.md#2-creating-an-auto-scaling-group
[link-doc-create-lb]:       load-balancing-guide.md#1-creating-a-load-balancer
[link-doc-set-up-asg]:      load-balancing-guide.md#2-setting-up-an-auto-scaling-group-for-using-the-created-balancer


# Visão geral da configuração de auto escalonamento do nó de filtragem no AWS

Você pode configurar o auto escalonamento do nó de filtragem da Wallarm para garantir que os nós de filtragem sejam capazes de lidar com flutuações de tráfego, se houver alguma. Ativar o auto escalonamento permite processar as solicitações de entrada para o aplicativo usando os nós de filtragem, mesmo quando o tráfego aumenta significativamente.

A nuvem Amazon suporta os seguintes métodos de auto escalonamento:
*   AWS Autoscaling:
    A nova tecnologia de auto escalonamento com base nas métricas que são coletadas pelo AWS.
    
    Para ver informações detalhadas sobre o Auto Escalonamento AWS, vá para este [link][link-doc-aws-as]. 

*   EC2 Autoscaling:
    A tecnologia de auto escalonamento legado que permite criar variáveis personalizadas para definir as regras de escalonamento.
    
    Para ver informações detalhadas sobre o Auto Escalonamento EC2, vá para este [link][link-doc-ec2-as]. 
    
!!! info "Informação sobre métodos de auto escalonamento"
    Para ver perguntas frequentes detalhadas sobre métodos de auto escalonamento fornecidos pela Amazon, vá para este [link][link-doc-as-faq]. 

Este guia explica como configurar o auto escalonamento dos nós de filtragem usando o Auto Escalonamento EC2, mas você também pode usar o Auto Escalonamento AWS, se necessário.

!!! warning "Pré-requisitos"
    Uma imagem de máquina virtual (Amazon Machine Image, AMI) com o nó de filtragem da Wallarm é necessária para configurar o auto escalonamento.
    
    Para ver informações detalhadas sobre a criação de uma AMI com o nó de filtragem, prossiga com este [link][link-doc-ami-creation].

!!! info "Chave SSH privada"
    Certifique-se de ter acesso à chave privada SSH (armazenada no formato PEM) que você criou anteriormente para se conectar ao nó de filtragem.

Para ativar o auto escalonamento do nó de filtragem na nuvem Amazon, faça as seguintes etapas:

1.  [Crie uma Amazon Machine Image](create-image.md)
1.  [Configure o auto escalonamento do nó de filtragem][link-doc-asg-guide]
    1.  [Crie um Modelo de Inicialização][link-doc-create-template]
    2.  [Crie um Grupo de Auto Escalonamento][link-doc-create-asg]
1.  [Configure o balanceamento de solicitações de entrada][link-doc-lb-guide]
    1.  [Crie um balanceador de carga][link-doc-create-lb]
    2.  [Configure um Grupo de Auto Escalonamento para usar o balanceador de carga criado][link-doc-set-up-asg]