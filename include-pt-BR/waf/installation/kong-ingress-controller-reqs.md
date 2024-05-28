* Versão da plataforma Kubernetes 1.22-1.26
* Recursos K8s Ingress que configuram o Kong para rotear chamadas de API para os microserviços que você deseja proteger
* Compatibilidade dos recursos K8s Ingress com o Kong 3.1.x
* Gerenciador de pacotes [Helm v3](https://helm.sh/)
* Acesso a `https://us1.api.wallarm.com` para trabalhar com o US Wallarm Cloud ou a `https://api.wallarm.com` para trabalhar com o EU Wallarm Cloud
* Acesso a `https://charts.wallarm.com` para adicionar os gráficos Helm da Wallarm
* Acesso aos repositórios Wallarm no Docker Hub `https://hub.docker.com/r/wallarm`
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
* Acesso à conta com a função de **Administrador** no Wallarm Console para a [Nuvem dos EUA](https://us1.my.wallarm.com/) ou a [Nuvem da UE](https://my.wallarm.com/)