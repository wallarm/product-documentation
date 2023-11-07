# Instalação do nó de filtragem a partir de pacotes DEB ou RPM no Azure

Este guia rápido fornece os passos para instalar o nó de filtragem a partir dos pacotes de origem em uma instância separada no Azure. Seguindo este guia, você criará uma instância a partir da imagem do sistema operacional suportado e instalará o nó de filtragem Wallarm neste sistema operacional.

!!! Atenção "Limitações das instruções"
    Estas instruções não cobrem a configuração do balanceamento de carga e o dimensionamento automático do nó. Se for configurar estes componentes por conta própria, recomendamos que você consulte as [instruções do Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/tutorial-load-balancer).

## Requisitos

* Assinatura ativa do Azure
* Acesso à conta com a função **Administrador** e autenticação de dois fatores desativada no Console Wallarm para a [Nuvem dos EUA](https://us1.my.wallarm.com/) ou [Nuvem da UE](https://my.wallarm.com/)

## Opções de instalação do nó de filtragem

Como o nó de filtragem opera como o módulo do servidor web ou [gateway de API](https://www.wallarm.com/what/the-concept-of-an-api-gateway), os pacotes do servidor web ou gateway de API devem ser instalados no sistema operacional juntamente com os pacotes do nó de filtragem.

Você pode selecionar o servidor web ou gateway de API mais adequado para a arquitetura de sua aplicação a partir da lista a seguir:

* [Instale o nó de filtragem como o módulo NGINX Stable](#installing-the-filtering-node-as-the-nginx-stable-module)
* [Instale o nó de filtragem como o módulo NGINX Plus](#installing-the-filtering-node-as-the-nginx-plus-module)

## Instalando o nó de filtragem como o módulo NGINX Stable

Para instalar o nó de filtragem como o módulo NGINX Stable na instância do Azure:

1. Crie uma instância Azure a partir da imagem de sistema operacional suportada pela Wallarm seguindo as [instruções do Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-portal):

   * Debian 11.x Bullseye
   * Ubuntu 18.04 Bionic
   * Ubuntu 20.04 Focal
   * Ubuntu 22.04 Jammy
   * AlmaLinux
   * Rocky Linux
   * Oracle Linux 8.x
2. Conecte-se à instância criada seguindo as [instruções do Azure](https://docs.microsoft.com/en-us/azure/bastion/bastion-connect-vm-ssh).
3. Na instância, instale os pacotes do NGINX Stable e do nó de filtragem Wallarm seguindo as [instruções do Wallarm](../../../installation/nginx/dynamic-module.md).

Para instalar o módulo postanalytics em uma instância separada, por favor repita os passos 1-2 e instale o módulo postanalytics seguindo as [instruções do Wallarm](../../../admin-en/installation-postanalytics-en.md).

## Instalando o nó de filtragem como o módulo NGINX Plus

Para instalar o nó de filtragem como o módulo NGINX Plus na instância do Azure:

1. Crie uma instância Azure a partir da imagem do sistema operacional suportada pela Wallarm seguindo as [instruções do Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-portal):

   * Debian 11.x Bullseye
   * Ubuntu 18.04 Bionic
   * Ubuntu 20.04 Focal
   * Ubuntu 22.04 Jammy
   * CentOS 7.x
   * AlmaLinux
   * Rocky Linux
   * Oracle Linux 8.x
2. Conecte-se à instância criada seguindo as [instruções do Azure](https://docs.microsoft.com/en-us/azure/bastion/bastion-connect-vm-ssh).
3. Na instância, instale os pacotes do NGINX Plus e do nó de filtragem Wallarm seguindo as [instruções do Wallarm](../../../installation/nginx/dynamic-module.md).

Para instalar o módulo postanalytics em uma instância separada, por favor repita os passos 1-2 e instale o módulo postanalytics seguindo as [instruções do Wallarm](../../../admin-en/installation-postanalytics-en.md).