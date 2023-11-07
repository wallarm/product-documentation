# Verificando Assinaturas de Imagem Docker da Wallarm

A Wallarm assina e compartilha a [chave pública](https://repo.wallarm.com/cosign.pub) para suas imagens Docker, permitindo que você verifique sua autenticidade e atenue riscos como imagens comprometidas e ataques à cadeia de suprimentos. Este artigo fornece instruções para verificar as assinaturas de imagem Docker da Wallarm.

## Lista de imagens assinadas

A partir do lançamento 4.4, a Wallarm assina as seguintes imagens Docker:

* Todas as imagens Docker utilizadas pelo gráfico Helm para [Implantação do Controlador de Ingresso baseado em NGINX](../admin-en/installation-kubernetes-en.md):

    * [wallarm/ingress-nginx](https://hub.docker.com/r/wallarm/ingress-nginx)
    * [wallarm/ingress-controller](https://hub.docker.com/r/wallarm/ingress-controller)
    * [wallarm/ingress-controller-chroot](https://hub.docker.com/r/wallarm/ingress-controller-chroot)
    * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
    * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
    * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
    * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)
* Todas as imagens Docker utilizadas pelo gráfico Helm para [Implantação do Sidecar](../installation/kubernetes/sidecar-proxy/deployment.md):

    * [wallarm/sidecar](https://hub.docker.com/r/wallarm/sidecar)
    * [wallarm/sidecar-controller](https://hub.docker.com/r/wallarm/sidecar-controller)
    * [wallarm/ingress-collectd](https://hub.docker.com/r/wallarm/ingress-collectd)
    * [wallarm/ingress-tarantool](https://hub.docker.com/r/wallarm/ingress-tarantool)
    * [wallarm/ingress-ruby](https://hub.docker.com/r/wallarm/ingress-ruby)
    * [wallarm/ingress-python](https://hub.docker.com/r/wallarm/ingress-python)

## Requisitos

Para garantir a autenticidade das imagens Docker da Wallarm, [Cosign](https://docs.sigstore.dev/cosign/overview/) é utilizado para tanto assinatura quanto verificação. 

Antes de prosseguir com a verificação de assinatura da imagem Docker, certifique-se de [instalar](https://docs.sigstore.dev/cosign/installation/) a utilidade de linha de comando Cosign em sua máquina local ou em seu pipeline CI/CD.

## Executando verificação de assinatura de imagem Docker

Para verificar uma assinatura de imagem Docker, execute os seguintes comandos substituindo o valor `WALLARM_DOCKER_IMAGE` pela tag de imagem específica:

```bash
export WALLARM_DOCKER_IMAGE="wallarm/ingress-controller:4.6.2-1"
cosign verify --key https://repo.wallarm.com/cosign.pub $WALLARM_DOCKER_IMAGE
```

A [saída](https://docs.sigstore.dev/cosign/verify/) deve fornecer o objeto `docker-manifest-digest` com o digest da imagem, por exemplo:

```bash
[{"critical":{"identity":{"docker-reference":"index.docker.io/<WALLARM_DOCKER_IMAGE>"},
"image":{"docker-manifest-digest":"<HASH_ALGORITHM>"},"type":"cosign container image signature"},
"optional":{"Bundle":{"SignedEntryTimestamp":"<VALUE>","Payload":{"body":"<VALUE>",
"integratedTime":<VALUE>,"logIndex":<VALUE>,"logID":"<VALUE>"}}}}]
```

## Usando motor de política Kubernetes para verificação de assinatura

Motores como o Kyverno ou o Open Policy Agent (OPA) permitem a verificação da assinatura de imagem Docker dentro do seu cluster Kubernetes. Ao criar uma política com regras para verificação, o Kyverno inicia a verificação de assinatura da imagem com base em critérios definidos, incluindo repositórios ou tags. A verificação ocorre durante a implantação do recurso Kubernetes.

Aqui está um exemplo de como usar a política Kyverno para verificação de assinatura de imagem Docker da Wallarm:

1. [Instale o Kyverno](https://kyverno.io/docs/installation/methods/) em seu cluster e certifique-se de que todos os pods estão operacionais.
1. Crie a seguinte política YAML do Kyverno:

    ```yaml
    apiVersion: kyverno.io/v1
    kind: ClusterPolicy
    metadata:
      name: verify-wallarm-images
    spec:
      webhookTimeoutSeconds: 30
      validationFailureAction: Enforce
      background: false
      failurePolicy: Fail
      rules:
        - name: verify-wallarm-images
          match:
            any:
              - resources:
                  kinds:
                    - Pod
          verifyImages:
            - imageReferences:
                - docker.io/wallarm/ingress*
                - docker.io/wallarm/sidecar*
              attestors:
                - entries:
                    - keys:
                        kms: https://repo.wallarm.com/cosign.pub
    ```
1. Aplique a política:

    ```
    kubectl apply -f <PATH_TO_POLICY_FILE>
    ```
1. Implante o [Controlador de Ingresso NGINX da Wallarm](../admin-en/installation-kubernetes-en.md) ou [Controlador de Sidecar](../installation/kubernetes/sidecar-proxy/deployment.md), dependendo de suas necessidades. A política do Kyverno será aplicada durante a implantação para verificar a assinatura da imagem.
1. Analise os resultados da verificação executando:

    ```
    kubectl describe ClusterPolicy verify-wallarm-images
    ```

Você receberá um resumo detalhando o status da verificação da assinatura:

```
Events:
  Type    Reason         Age                From               Message
  ----    ------         ----               ----               -------
  Normal  PolicyApplied  50s (x2 over 50s)  kyverno-admission  Deployment wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-controller: pass
  Normal  PolicyApplied  48s                kyverno-admission  Pod wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-controller-9dcfddfc7-hjbhd: pass
  Normal  PolicyApplied  40s (x2 over 40s)  kyverno-admission  Deployment wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-postanalytics: pass
  Normal  PolicyApplied  35s                kyverno-admission  Pod wallarm-sidecar/wallarm-sidecar-wallarm-sidecar-postanalytics-554789546f-9cc8j: pass
```

A política `verify-wallarm-images` fornecida tem o parâmetro `failurePolicy: Fail`. Isso implica que se a autenticação da assinatura não for bem-sucedida, toda a implantação do gráfico falhará.
