* Versão da plataforma Kubernetes 1.22-1.26
* Recursos K8s Ingress que configuram o Kong para rotear chamadas de API para os microserviços que você deseja proteger
* Compatibilidade dos recursos K8s Ingress com o Kong 3.1.x
* Gerenciador de pacotes [Helm v3](https://helm.sh/)
* Acesso a `https://us1.api.wallarm.com` para trabalhar com o US Wallarm Cloud ou a `https://api.wallarm.com` para trabalhar com o EU Wallarm Cloud
* Acesso a `https://charts.wallarm.com` para adicionar os gráficos Helm da Wallarm
* Acesso aos repositórios Wallarm no Docker Hub `https://hub.docker.com/r/wallarm`
* Acesso aos endereços IP do Google Cloud Storage listados neste [link](https://www.gstatic.com/ipranges/goog.json). Quando você [permite, nega ou cinza lista][ip-lists-docs] países inteiros, regiões ou data centers em vez de endereços de IP individuais, o nó Wallarm recupera endereços IP precisos relacionados às entradas nas listas de IP a partir do banco de dados agregado hospedado no Google Storage
* Acesso à conta com a função de **Administrador** no Wallarm Console para a [Nuvem dos EUA](https://us1.my.wallarm.com/) ou a [Nuvem da UE](https://my.wallarm.com/)