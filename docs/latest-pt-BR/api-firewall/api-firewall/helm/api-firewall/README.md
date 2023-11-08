# Gráfico Helm para Wallarm API Firewall

Este gráfico inicializa a implantação do Wallarm API Firewall em um cluster [Kubernetes](http://kubernetes.io/) usando o gerenciador de pacotes [Helm](https://helm.sh/).

Este gráfico ainda não foi carregado em nenhum registro público do Helm. Para implantar o gráfico do Helm, use este repositório.

## Requisitos

* Kubernetes 1.16 ou posterior
* Helm 2.16 ou posterior

## Implantação

Para implantar o gráfico Helm do Wallarm API Firewall:

1. Adicione nosso repositório, caso ainda não tenha feito:

```bash
helm repo add wallarm https://charts.wallarm.com
```

2. Recupere a última versão do gráfico helm:

```bash
helm fetch wallarm/api-firewall
tar -xf api-firewall*.tgz
```

3. Configure o gráfico alterando o arquivo `api-firewall/values.yaml` seguindo os comentários do código.

4. Implantar o Wallarm API Firewall a partir deste gráfico Helm.

Para ver o exemplo desta implantação do gráfico Helm, você pode executar nossa [demonstração Kuberentes](https://github.com/wallarm/api-firewall/tree/main/demo/kubernetes).