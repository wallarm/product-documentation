* Versão da plataforma Kubernetes 1.19-1.25
* Gerenciador de pacotes [Helm v3](https://helm.sh/)
* Uma aplicação implantada como um Pod em um cluster Kubernetes
* Acesso a `https://us1.api.wallarm.com` para trabalhar com o Wallarm Cloud US ou a `https://api.wallarm.com` para trabalhar com o Wallarm Cloud EU
* Acesso a `https://charts.wallarm.com` para adicionar os gráficos Helm do Wallarm
* Acesso aos repositórios Wallarm no Docker Hub `https://hub.docker.com/r/wallarm`
* Acesso aos endereços IP do Google Cloud Storage listados dentro do [link](https://www.gstatic.com/ipranges/goog.json). Ao [permitir, negar ou listar][ip-lists-docs] países, regiões ou data centers inteiros em vez de endereços IP individuais, o nó Wallarm recupera endereços IP precisos relacionados às entradas nas listas de IP do banco de dados agregado hospedado no Google Storage
* Acesso à conta com a função de **Administrador** no Console Wallarm para o [Cloud US](https://us1.my.wallarm.com/) ou o [Cloud EU](https://my.wallarm.com/)