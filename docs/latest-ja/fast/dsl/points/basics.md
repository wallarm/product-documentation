[link-fast]:                ../intro.md
[link-parsers]:             parsers.md

# Basic Concepts

[FAST extensions][link-fast] describe the logic of baseline request element processing that is used to create new test requests. The main purpose of *points* is to specify which piece of data from the baseline request should undergo the actions that are described in the extension.

A point is a string that points to the part of the baseline request that the action specified in the extension should be applied to. This string comprises a sequence of the names of parsers and filters that should be applied to the baseline request in order to obtain the required data.

* *Parsers* create data structures based on the received string input. 
* *Filters* are used to 
obtain certain values from the data structures created by parsers. 

Other filters and parsers can be applied to the values that filters point to. By sequentially applying parsers and filters to the request, you can extract the request element values that are required for further processing.  

The variety of parsers and filters that can be used in a point allows for the creation of extensions that use the target web application’s requests format.

The [following subsections][link-parsers] describe parsers and filters that can be used in FAST DSL extension points.