# Gerando um SBOM para Imagens Docker Wallarm

A Bill of Materials de Software (SBOM) é um inventário que lista os componentes de software e suas dependências em um aplicativo, incluindo versões, licenças e vulnerabilidades. Este artigo orienta você a gerar SBOM para imagens Docker Wallarm.

Você pode precisar obter o SBOM para imagens Docker Wallarm para avaliar e mitigar possíveis riscos de segurança associados às dependências usadas nas imagens. O SBOM oferece transparência nos componentes de software e ajuda a garantir a conformidade.

## A lista de imagens Docker Wallarm

Abaixo está a lista de imagens Docker Wallarm [assinadas](verify-docker-image-signature.md). Você pode gerar SBOM para qualquer tag dessas imagens.

<!-- * [wallarm/node](https://hub.docker.com/r/wallarm/node): [Imagem Docker baseada em NGINX](../admin-en/installation-docker-en.md) que inclui todos os módulos Wallarm, atuando como artefato autônomo para implantação Wallarm
* [wallarm/envoy](https://hub.docker.com/r/wallarm/envoy): [Imagem Docker baseada em Envoy](../admin-en/installation-guides/envoy/envoy-docker.md) que inclui todos os módulos Wallarm, atuando como artefato autônomo para implantação Wallarm --> 
* Imagens Docker usadas pelo gráfico Helm para [Implantação do Controlador de Ingresso baseado em NGINX](../admin-en/installation-kubernetes-en.md):

    * [wallarm/ingress-nginx](https://hub.docker.com/r/wallarm/ingress-nginx)
    * [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
    * [wallarm/ingress-controller-chroot](https://hub.docker.com/r/wallarm/ingress-controller-chroot)
    * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
    * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
    * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
    * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)
* Imagens Docker usadas pelo gráfico Helm para [Implantação de Sidecar](../installation/kubernetes/sidecar-proxy/deployment.md):

    * [wallarm/sidecar](https://hub.docker.com/r/wallarm/sidecar)
    * [wallarm/sidecar-controller](https://hub.docker.com/r/wallarm/sidecar-controller)
    * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
    * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
    * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
    * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)

## Requerimentos

Para gerar um SBOM para imagens Docker Wallarm, você precisará usar a ferramenta CLI [syft](https://github.com/anchore/syft).

Antes de continuar com a geração do SBOM, certifique-se de [instalar](https://github.com/anchore/syft#installation) o **syft** na sua máquina local ou dentro da sua pipeline de CI/CD.

## Procedimento de geração do SBOM

Para gerar um SBOM para uma imagem Docker, use o seguinte comando, substituindo a tag de imagem especificada pela desejada:

```bash
syft wallarm/ingress-controller:4.6.2-1
```

Por padrão, o **syft** retorna o SBOM no formato de texto. Você também pode gerá-lo em outros formatos, como CycloneDX, SPDX, e salvar a saída para um arquivo, por exemplo:

```bash
syft wallarm/ingress-controller:4.6.2-1 --output spdx-json >> syft_json_sbom.spdx
syft wallarm/ingress-controller:4.6.2-1 --output cyclonedx-json >> cyclonedx_json_sbom.cyclonedx
```

Depois de gerar o SBOM, você pode usá-lo na sua pipeline de CI/CD para diversas ações, como varredura de vulnerabilidades, verificações de conformidade de licença, auditorias de segurança ou geração de relatórios.

Para verificar que todas as dependências realmente pertencem à Wallarm, você pode simplesmente [verificar a assinatura da imagem](verify-docker-image-signature.md) como um todo. Ao assinar digitalmente nossas imagens, garantimos que a imagem assinada é realmente nossa. Consequentemente, essa garantia se estende ao SBOM, pois ele estará associado à imagem verificada da Wallarm.