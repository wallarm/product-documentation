[link-doc-image-creation]:              create-image.md
[link-doc-template-creation]:           creating-instance-template.md
[link-doc-managed-autoscaling-group]:   creating-autoscaling-group.md
[link-doc-lb-guide]:                    load-balancing-guide.md

# Configurando o auto scaling do nodo de filtragem na Plataforma do Google Cloud: Visão geral 

Você pode configurar o auto scaling do nodo de filtragem Wallarm na Plataforma do Google Cloud (GCP) para garantir que os nodos de filtragem sejam capazes de lidar com flutuações de tráfego (se houver). Habilitar o auto scaling permite o processamento de solicitações de entrada para o aplicativo usando os nodos de filtragem mesmo quando o tráfego aumenta significativamente.

!!! Aviso "Pré-requisitos"
    A configuração do auto scaling requer a imagem da máquina virtual com o nodo de filtragem Wallarm.
    
    Para informações detalhadas sobre como criar uma imagem da máquina virtual com o nodo de filtragem Wallarm no GCP, prossiga para este [link][link-doc-image-creation].

--8<-- "../include-pt-BR/gcp-autoscaling-connect-ssh.md"

Para auto escalar nodos de filtragem na Plataforma do Google Cloud, execute as seguintes etapas:

1.  [Criar uma Imagem da Máquina](create-image.md)
1.  Configurar o auto scaling do nodo de filtragem:
    1.  [Criar um template de instância do nodo de filtragem][link-doc-template-creation];
    2.  [Criar um grupo de instâncias gerenciadas com auto scaling habilitado][link-doc-managed-autoscaling-group];
1.  [Configurar o balanceamento de solicitações de entrada][link-doc-lb-guide].

!!! informação "Direitos necessários"
    Antes de configurar o auto scaling, certifique-se de que sua conta GCP possui a função `Compute Admin`.