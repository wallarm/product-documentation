# Instalação do nó de filtragem a partir de pacotes DEB ou RPM na AWS

Este guia rápido fornece os passos para instalar o nó de filtragem a partir dos pacotes de fonte em uma instância Amazon EC2 separada. Ao seguir este guia, você criará uma instância a partir da imagem do sistema operacional suportado e instalará o nó de filtragem Wallarm neste sistema operacional.

!!! Aviso "Limitações das instruções"
    Essas instruções não abrangem a configuração de balanceamento de carga e dimensionamento automático do nó. Se estiver configurando esses componentes você mesmo, recomendamos que você revise as [instruções da AWS sobre o serviço de balanceamento de carga elástico](https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html).

## Requisitos

* Conta AWS e usuário com as permissões de **admin**
* Acesso à conta com a função de **Administrador** e autenticação de dois fatores desativada no Console Wallarm para a [Nuvem dos EUA](https://us1.my.wallarm.com/) ou [Nuvem EU](https://my.wallarm.com/)

## Opções de instalação do nó de filtragem

Como o nó de filtragem opera como o servidor web ou módulo de [gateway de API](https://www.wallarm.com/what/the-concept-of-an-api-gateway), os pacotes do servidor web ou gateway de API devem ser instalados no sistema operacional juntamente com os pacotes do nó de filtragem.

Você pode selecionar o servidor web ou gateway de API que seja mais adequado para a arquitetura de sua aplicação da seguinte lista:

* [Instalar o nó de filtragem como o módulo NGINX Stable](#instalando-o-nó-de-filtragem-como-o-módulo-nginx-stable)
* [Instalar o nó de filtragem como o módulo NGINX Plus](#instalando-o-nó-de-filtragem-como-o-módulo-nginx-plus)

## Instalando o nó de filtragem como o módulo NGINX Stable

Para instalar o nó de filtragem como o módulo NGINX Stable na instância Amazon EC2:

1. Crie uma instância Amazon EC2 a partir da imagem do sistema operacional suportada pelo Wallarm seguindo as [instruções da AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance):

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
    * Amazon Linux 2.0.2021x e inferiores
2. Conecte-se à instância criada seguindo as [instruções da AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html).
3. Na instância, instale os pacotes do NGINX Stable e do nó de filtragem Wallarm seguindo as [instruções do Wallarm](../../../installation/nginx/dynamic-module.md).

Para instalar o módulo de pós-análise em uma instância separada, por favor, repita os passos 1-2 e instale o módulo de pós-análise seguindo as [instruções do Wallarm](../../../admin-en/installation-postanalytics-en.md).

## Instalando o nó de filtragem como o módulo NGINX Plus

Para instalar o nó de filtragem como o módulo NGINX Plus na instância Amazon EC2:

1. Crie uma instância Amazon EC2 a partir da imagem do sistema operacional suportada pelo Wallarm seguindo as [instruções da AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html#ec2-launch-instance):

    * Debian 11.x Bullseye
    * Ubuntu 18.04 Bionic
    * Ubuntu 20.04 Focal
    * Ubuntu 22.04 Jammy
    * CentOS 7.x
    * AlmaLinux
    * Rocky Linux
    * Oracle Linux 8.x
    * Amazon Linux 2.0.2021x e inferiores
2. Conecte-se à instância criada seguindo as [instruções da AWS](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstances.html).
3. Na instância, instale os pacotes do NGINX Plus e do nó de filtragem Wallarm seguindo as [instruções do Wallarm](../../../installation/nginx/dynamic-module.md).

Para instalar o módulo de pós-análise em uma instância separada, por favor, repita os passos 1-2 e instale o módulo de pós-análise seguindo as [instruções do Wallarm](../../../admin-en/installation-postanalytics-en.md).