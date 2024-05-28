* Versão da plataforma Kubernetes 1.23-1.25
* Gerenciador de pacotes [Helm](https://helm.sh/)
* Compatibilidade de seus serviços com a versão 1.6.4 (ou inferior) do [Controlador NGINX Ingress da Comunidade](https://github.com/kubernetes/ingress-nginx)
* Acesso à conta com função de **Administrador** e autenticação de dois fatores desabilitada no Painel de controle Wallarm para a [Nuvem EUA](https://us1.my.wallarm.com/) ou [Nuvem UE](https://my.wallarm.com/)
* Acesso a `https://us1.api.wallarm.com` para trabalhar com a Nuvem Wallarm EUA ou a `https://api.wallarm.com` para trabalhar com a Nuvem Wallarm UE
* Acesso a `https://charts.wallarm.com` para adicionar os gráficos do Helm Wallarm. Certifique-se de que o acesso não está bloqueado por um firewall
* Acesso aos repositórios Wallarm no Docker Hub `https://hub.docker.com/r/wallarm`. Certifique-se de que o acesso não está bloqueado por um firewall
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    === "US Cloud"
        ```
        34.96.64.17
        34.110.183.149
        ```
    === "EU Cloud"
        ```
        34.160.38.183
        34.144.227.90
        ```
