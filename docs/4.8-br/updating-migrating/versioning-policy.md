# Política de versionamento do nó de filtragem

Esta política descreve o método de versionamento de diferentes artefatos do nó de filtragem Wallarm: pacotes Linux, containers Docker, gráficos Helm, etc. Você pode usar este documento para selecionar a versão do nó de filtragem para instalação e programar atualizações dos pacotes instalados.

!!! info "Artefato"
    O artefato é o resultado do desenvolvimento dos nós Wallarm que é usado para instalar o nó de filtragem na plataforma. Por exemplo: pacotes Linux, módulos API Kong, containers Docker, etc.

## Lista de Versões

| Versão do Nó | Data de Lançamento   | Suporte até |
|------------------|----------------|---------------|
|2.18 e inferiores 2.x|                | novembro 2021 |
| 3.6 e inferiores 3.x| outubro 2021   | novembro 2022 |
| 4.0              | junho 2022      | fevereiro 2023 |
| 4.2              | agosto 2022    | junho 2023     |
| 4.4              | novembro 2022  |               |
| 4.6              | abril 2023     |               |
| 4.8              | outubro 2023   |               |

## Formato da versão

As versões do artefato do nó de filtragem Wallarm têm o seguinte formato:

```bash
<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>[-<BUILD_NUMBER>]
```

| Parâmetro                    | Descrição                                                                                                                                                                                                                                                                                                         | Taxa média de lançamento        |
|--------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|
| `<MAJOR_VERSION>`              | Versão principal do nó Wallarm:<ul><li>Reformulação importante do componente</li><li>Mudanças incompatíveis</li></ul>O valor inicial é `2`. O valor aumenta de 1, por exemplo: `3.6.0`, `4.0.0`.                                                                                                                    | Nenhum lançamento esperado              |
| `<MINOR_VERSION>`              | Versão secundária do nó Wallarm:<ul><li>Novos recursos do produto</li><li>Correções importantes de bugs</li><li>Outras mudanças compatíveis</li></ul>O valor aumenta de 2, por exemplo: `4.0`, `4.2`.                                                                                                             | Uma vez por trimestre                         |
| `<PATCH_VERSION>`              | Versão de correção do nó:<ul><li>Correções menores de bugs</li><li>Novos recursos adicionados após um pedido especial</li></ul>O valor inicial é `0`. O valor aumenta de 1, por exemplo: `4.2.0`, `4.2.1`.                                                                                                                                     | Uma vez por mês                        |
| `<BUILD_NUMBER>` (opcional) | Versão de construção do nó. O valor é atribuído automaticamente pela plataforma de construção de pacotes empregada. O valor não será atribuído a artefatos construídos usando um processo manual.<br />O valor aumenta de 1, por exemplo: `4.2.0-1`, `4.2.0-2`. Se a primeira construção falhar, a construção é executada novamente e o valor é incrementado. | Conforme novas `<PATCH_VERSION>` são lançadas |

Recomendamos o uso de diferentes formatos de versão do nó Wallarm ao baixar os pacotes ou imagens. O formato depende da [forma de instalação do nó Wallarm](../installation/supported-deployment-options.md):

* `<MAJOR_VERSION>.<MINOR_VERSION>` para pacotes Linux
* `<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>` para gráficos Helm
* `<MAJOR_VERSION>.<MINOR_VERSION>.<PATCH_VERSION>[-<BUILD_NUMBER>]` para imagens Docker e na nuvem

    Ao puxar imagens Docker Wallarm, você também pode especificar a versão do nó de filtragem no formato `<MAJOR_VERSION>.<MINOR_VERSION>`. Uma vez que a versão puxada do nó de filtragem contém as mudanças da última versão de correção disponível, o comportamento da mesma imagem da versão `<MAJOR_VERSION>.<MINOR_VERSION>` puxada em diferentes períodos de tempo pode diferir.

As versões dos pacotes de nós Wallarm podem diferir dentro do mesmo artefato. Por exemplo, se apenas um pacote precisa ser atualizado, os demais pacotes mantêm a versão anterior.

## Suporte de versão

Wallarm suporta apenas as 3 últimas versões do nó de filtragem da seguinte maneira:

* Para a versão mais recente (por exemplo, 4.2): permite o download do pacote, lança correções de bugs e atualiza componentes de terceiros, se detectar vulnerabilidades na versão usada. Pode lançar novos recursos após um pedido especial.
* Para a versão anterior (por exemplo, 4,0): permite download de pacote e libera correções de bugs.
* Para a terceira versão disponível (por exemplo, 3.6): permite o download do pacote e libera correções de bugs por 3 meses após a data de lançamento da versão mais recente. Em 3 meses, a versão será depreciada.

Os artefatos de nós de versões depreciadas estão disponíveis para download e instalação, mas correções de bugs e novos recursos não são lançados em versões depreciadas.

Ao instalar um nó de filtragem pela primeira vez, é recomendável usar a versão mais recente disponível. Ao instalar um nó de filtragem adicional no ambiente com nós já instalados, é recomendável usar a mesma versão em todas as instalações para total compatibilidade.

## Atualização NGINX

A maioria dos módulos Wallarm são distribuídos com componentes NGINX de suas próprias versões. Para manter os módulos Wallarm trabalhando com as versões mais recentes dos componentes NGINX, atualizamos-os da seguinte maneira:

* Os pacotes DEB e RPM do Wallarm são baseados nos módulos oficiais do NGINX e NGINX Plus. Uma vez que a nova versão do NGINX / NGINX Plus é lançada, Wallarm se compromete em fornecer uma atualização de sua versão em 1 dia. Wallarm publica essa atualização como a nova versão secundária/versão de correção das versões de nó suportadas.
* O Controlador de Ingress Wallarm é baseado no [Controlador de Ingress NGINX da Comunidade](https://github.com/kubernetes/ingress-nginx). Quando uma nova versão do Controlador de Ingress NGINX da Comunidade é lançada, o Wallarm se compromete a fornecer uma atualização de sua versão nos próximos 30 dias. Wallarm publica esta atualização como a nova versão secundária do último controlador de Ingress.

## Atualização de versão

Presume-se que você esteja usando a versão mais recente disponível do nó de filtragem ao instalar, atualizar ou configurar o produto. As instruções do nó Wallarm descrevem comandos que instalam automaticamente a correção mais recente e a compilação disponível.

### Notificação de nova versão

Wallarm publica informações sobre as novas versões principais e secundárias das seguintes fontes:

* Documentação pública
* [Portal de notícias](https://changelog.wallarm.com/)
* Console Wallarm

    ![Notificação sobre uma nova versão no Console Wallarm](../images/updating-migrating/wallarm-console-new-version-notification.png)

Informações sobre atualizações disponíveis para as versões principais e secundárias do nó Wallarm e para as versões de correção do nó Wallarm também são exibidas no Console Wallarm → **Nós** para nós regulares. Cada pacote tem o status **Atualizado** ou a lista de atualizações disponíveis. Por exemplo, o cartão do nó de filtragem com as últimas versões dos componentes instalados tem a seguinte aparência:

![Cartão de nó](../images/user-guides/nodes/view-regular-node-comp-vers.png)

### Procedimento de atualização

Junto com o lançamento das novas versões principais e secundárias do nó de filtragem, também são publicadas instruções de instalação. Para acessar as instruções sobre como atualizar artefatos instalados, use as instruções adequadas da seção **Atualização e Migração**.
