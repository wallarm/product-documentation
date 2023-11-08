!!! info "Se você implantar vários nós Wallarm"
    Todos os nós Wallarm implantados em seu ambiente devem ser das **mesmas versões**. Os módulos de pós-análise instalados em servidores separados também devem ser das **mesmas versões**.

    Antes da instalação do nó adicional, certifique-se de que sua versão corresponde à versão dos módulos já implantados. Se a versão do módulo implantado estiver [obsoleta ou será obsoleta em breve (`4.0` ou inferior)][versioning-policy], atualize todos os módulos para a versão mais recente.

    A versão da imagem do nó de filtragem Wallarm implantada é especificada no modelo de Implantação → seção `spec.template.spec.containers` → `image` do contêiner Wallarm.