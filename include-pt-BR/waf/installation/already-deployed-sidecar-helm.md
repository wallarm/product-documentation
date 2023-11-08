!!! info "Se você implantar vários nós Wallarm"
    Todos os nós Wallarm implantados em seu ambiente devem ser da **mesma versão**. Os módulos de pós-análise instalados em servidores separados também devem ser da **mesma versão**.

    Antes de instalar o nó adicional, certifique-se de que sua versão corresponda à versão dos módulos já implantados. Se a versão do módulo implantado estiver [desatualizada ou será desatualizada em breve (`4.0` ou inferior)][versioning-policy], atualize todos os módulos para a versão mais recente.

    A versão da imagem do nó de filtragem Wallarm implantado é especificada no arquivo de configuração do gráfico Helm → `wallarm.image.tag`.