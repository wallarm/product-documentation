When upgrading modules with all-in-one installer, you cannot upgrade an old package installation - instead you need to use a clean machine. Thus, as step 1, prepare a machine with one of the supported OS:

* Debian 10, 11 and 12.x
* Ubuntu LTS 18.04, 20.04, 22.04
* CentOS 7, 8 Stream, 9 Stream
* Alma/Rocky Linux 9
* RHEL 8.x
* Oracle Linux 8.x
* Oracle Linux 9.x
* Redox
* SuSe Linux
* Others (the list is constantly widening, contact [Wallarm support team](mailto:support@wallarm.com) to check if your OS is in the list)

Using new clean machine will lead to that at some moment you will have both old and new node, which is good: you can test the new one working properly without stopping the old one.