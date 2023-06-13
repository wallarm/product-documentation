[doc-qsg]:              ../qsg/deployment-options.md


#   Introduction

This guide describes how to conduct an integration of FAST into the existing CI/CD workflow.

The guide contains the following pieces of information:
1.  Which requirements should be satisfied before performing the integration.
2.  Which steps the integration configuration process consists of.
3.  How to start and manage the process of the security testing. 

 --8<-- "../include/fast/cloud-note.md"

!!! info "Agreement on terms"
    The “API” term will be used as a shorter version of the “Wallarm API” term throughout the guide, unless stated otherwise.

!!! info "HTTPS support"
    This guide describes the integration of FAST to test an HTTP-based target application.
    
    However, the FAST node may test applications that work over HTTPS as well. The HTTPS-related topics are discussed in the [“Quick Start Guide”][doc-qsg]
