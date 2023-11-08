# Visão geral das opções de instalação

[img-postanalytics-options]:    ../images/installation-nginx-overview/postanalytics-options.png
[img-nginx-options]:            ../images/installation-nginx-overview/nginx-options.png

[anchor-mod-overview]:              #modules-overview
[anchor-mod-installation]:          #installing-and-configuring-the-modules
[anchor-mod-inst-nginx]:            #module-for-nginx
[anchor-mod-inst-nginxplus]:        #module-for-nginx-plus
[anchor-mod-inst-postanalytics]:    #postanalytics-module

[link-ig-nginx]:                    ../installation/nginx/dynamic-module.md
[link-ig-nginx-distr]:              ../installation/nginx/dynamic-module-from-distr.md
[link-ig-nginxplus]:                ../installation/nginx-plus.md

O nó de filtragem Wallarm utilizado com NGINX ou NGINX Plus consiste nos seguintes módulos:
*   O módulo que se conecta ao NGINX (NGINX Plus)
*   O módulo pós-análise

A ordem de instalação e configuração dos módulos depende da maneira como você instala o NGINX ou NGINX Plus.

Este documento contém as seguintes seções:

*   [Visão geral dos módulos][anchor-mod-overview]
*   [Links][anchor-mod-installation] para instruções de instalação e configuração do módulo específico

##  Visão geral dos módulos

Quando o nó de filtragem é utilizado para processar solicitações, o tráfego de entrada passa sequencialmente pelo processamento inicial e em seguida pelo processamento pelos módulos Wallarm.

1.  O processamento inicial de tráfego é realizado pelo módulo que se conecta ao [NGINX][anchor-mod-inst-nginx] ou [NGINX Plus][anchor-mod-inst-nginxplus] já instalado no sistema.
2.  O processamento de tráfego adicional é realizado pelo [módulo pós-análise][anchor-mod-inst-postanalytics], que requer uma quantidade significativa de memória para funcionar corretamente. Portanto, você pode escolher uma das seguintes opções de instalação:
    *   Instalado nos mesmos servidores que NGINX/NGINX Plus (se as configurações do servidor permitirem)
    *   Instalado em um grupo de servidores separados do NGINX/NGINX Plus

![Opções de Instalação do Módulo Pós-análise][img-postanalytics-options]

##  Instalando e configurando os módulos

### Módulo para NGINX

!!! warning "Selecionando o módulo para instalar"
    Os procedimentos de instalação e conexão do módulo Wallarm dependem do método de instalação do NGINX que você está usando.

O módulo Wallarm para NGINX pode ser conectado por um dos seguintes métodos de instalação (links para instruções de cada uma das opções de instalação estão listadas nos parênteses):

![Opções de Instalação do Módulo para NGINX][img-nginx-options]

*   Construindo NGINX a partir dos arquivos de origem ([instrução][link-ig-nginx])
*   Instalando pacotes NGINX do repositório NGINX ([instrução][link-ig-nginx])
*   Instalando pacotes NGINX do repositório Debian ([instrução][link-ig-nginx-distr])
*   Instalando pacotes NGINX do repositório CentOS ([instrução][link-ig-nginx-distr])

### Módulo para NGINX Plus

[Estas][link-ig-nginxplus] instruções descrevem como conectar o Wallarm a um módulo NGINX Plus.

### Módulo pós-análise

As instruções sobre a instalação e configuração do módulo pós-análise (seja no mesmo servidor com NGINX/NGINX Plus ou em um servidor separado) estão localizadas na seção de instalação do módulo [NGINX][anchor-mod-inst-nginx] e na seção de instalação do módulo [NGINX Plus][anchor-mod-inst-nginxplus].