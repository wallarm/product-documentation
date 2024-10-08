* Versão da plataforma Kubernetes 1.24-1.27
* Gerenciador de pacotes [Helm](https://helm.sh/)
* Compatibilidade dos seus serviços com o [Controlador Ingress NGINX da comunidade](https://github.com/kubernetes/ingress-nginx) versão 1.9.5
* Acesso à conta com a função de **Administrador** e autenticação de dois fatores desativada no Console Wallarm para a [Nuvem US](https://us1.my.wallarm.com/) ou [Nuvem EU](https://my.wallarm.com/)
* Acesso a `https://us1.api.wallarm.com` para trabalhar com a Nuvem Wallarm US ou a `https://api.wallarm.com` para trabalhar com a Nuvem Wallarm EU
* Acesso a `https://charts.wallarm.com` para adicionar os gráficos Helm da Wallarm. Certifique-se de que o acesso não está bloqueado por um firewall
* Acesso aos repositórios Wallarm no Docker Hub `https://hub.docker.com/r/wallarm`. Certifique-se de que o acesso não está bloqueado por um firewall
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    === "US Cloud"
        ```
        34.96.64.17
        34.110.183.149
        35.235.66.155
        ```
    === "EU Cloud"
        ```
        34.160.38.183
        34.144.227.90
        34.90.110.226
        ```
