# Instalação do nó de filtragem a partir de pacotes DEB ou RPM no Alibaba Cloud

Este breve guia fornece as etapas para instalar o nó de filtragem a partir dos pacotes de origem em uma instância separada do Alibaba Cloud. Seguindo este guia, você criará uma instância a partir da imagem do sistema operacional suportada e instalará o nó de filtragem da Wallarm neste sistema operacional.

!!! aviso "Limitações das instruções"
    Estas instruções não cobrem a configuração do balanceamento de carga e do autoscaling do nó. Se estiver configurando esses componentes por conta própria, recomendamos que você revise as [instruções no Alibaba Cloud Elastic Compute Service (ECS)](https://www.alibabacloud.com/product/ecs).

## Requisitos

* Acesso ao [Console do Alibaba Cloud](https://account.alibabacloud.com/login/login.htm)
* Acesso à conta com a função **Administrador** e autenticação de dois fatores desativada no Console da Wallarm para a [Nuvem dos EUA](https://us1.my.wallarm.com/) ou [Nuvem da UE](https://my.wallarm.com/)

## Opções de instalação do nó de filtragem

Como o nó de filtragem opera como o servidor web ou módulo do [gateway de API](https://www.wallarm.com/what/the-concept-of-an-api-gateway), os pacotes do servidor web ou gateway de API devem ser instalados no sistema operacional junto com os pacotes do nó de filtragem.

Você pode selecionar o servidor web ou gateway de API mais adequado para a arquitetura de sua aplicação na seguinte lista:

* [Instale o nó de filtragem como o módulo NGINX Stable](#instalando-o-no-de-filtragem-como-o-modulo-nginx-stable)
* [Instale o nó de filtragem como o módulo NGINX Plus](#instalando-o-no-de-filtragem-como-o-modulo-nginx-plus)

## Instalando o nó de filtragem como o módulo NGINX Stable

Para instalar o nó de filtragem como o módulo NGINX Stable na instância do Alibaba Cloud:

1. Crie uma instância do Alibaba Cloud a partir da imagem do sistema operacional suportado pela Wallarm seguindo as [instruções do Alibaba Cloud](https://www.alibabacloud.com/help/doc-detail/87190.htm):

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
2. Conecte-se à instância criada seguindo as [instruções do Alibaba Cloud](https://www.alibabacloud.com/help/doc-detail/71529.htm).
3. Na instância, instale os pacotes do NGINX Stable e do nó de filtragem da Wallarm seguindo as [instruções da Wallarm](../../../installation/nginx/dynamic-module.md).

Para instalar o módulo de pós-análise em uma instância separada, por favor, repita as etapas 1-2 e instale o módulo de pós-análise seguindo as [instruções da Wallarm](../../../admin-en/installation-postanalytics-en.md).

## Instalando o nó de filtragem como o módulo NGINX Plus

Para instalar o nó de filtragem como o módulo NGINX Plus na instância do Alibaba Cloud:

1. Crie uma instância do Alibaba Cloud a partir da imagem do sistema operacional suportado pela Wallarm seguindo as [instruções do Alibaba Cloud](https://www.alibabacloud.com/help/doc-detail/87190.htm):

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
2. Conecte-se à instância criada seguindo as [instruções do Alibaba Cloud](https://www.alibabacloud.com/help/doc-detail/71529.htm).
3. Na instância, instale os pacotes do NGINX Plus e do nó de filtragem da Wallarm seguindo as [instruções da Wallarm](../../../installation/nginx/dynamic-module.md).

Para instalar o módulo de pós-análise em uma instância separada, por favor, repita as etapas 1-2 e instale o módulo de pós-análise seguindo as [instruções da Wallarm](../../../admin-en/installation-postanalytics-en.md).