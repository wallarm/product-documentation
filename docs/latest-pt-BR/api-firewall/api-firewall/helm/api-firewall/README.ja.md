# Gráfico Helm para o Wallarm API Firewall 

Este gráfico inicializa o deployment do Wallarm API Firewall em um cluster do [Kubernetes](http://kubernetes.io/) usando o gerenciador de pacotes [Helm](https://helm.sh/).

Este gráfico ainda não foi carregado no registro público do Helm. Para o deployment do gráfico Helm, use este repositório.

## Pré-requisitos 

* Kubernetes 1.16 ou superior 
* Helm 2.16 ou superior 

## Deployment

Para efetuar o deployment do gráfico Helm do Wallarm API Firewall:

1. Se ainda não adicionou, adicione o repositório: 

```bash 
helm repo add wallarm https://charts.wallarm.com 
```

2. Obtenha a versão mais recente do gráfico helm:

```bash 
helm fetch wallarm/api-firewall 
tar -xf api-firewall*.tgz 
```

3. De acordo com os comentários do código, mude o arquivo `api-firewall/values.yaml` para configurar o gráfico.

4. Efetue o deployment do Wallarm API Firewall a partir deste gráfico Helm.

Se quiser verificar um exemplo de deployment deste gráfico Helm, você pode executar nossa [demonstração Kuberentes](https://github.com/wallarm/api-firewall/tree/main/demo/kubernetes).