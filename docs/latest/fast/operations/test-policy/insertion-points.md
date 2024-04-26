[img-remove-point]:         ../../../images/fast/operations/common/test-policy/policy-editor/remove-point.png         
[img-point-help]:           ../../../images/fast/operations/common/test-policy/policy-editor/point-help.png                

[link-get-point]:           ../../dsl/points/parsers/http.md#get-filter
[link-post-point]:          ../../dsl/points/parsers/http.md#post-filter
[link-path-point]:          ../../dsl/points/parsers/http.md#path-filter
[link-action-name-point]:   ../../dsl/points/parsers/http.md#action_name-filter
[link-action-ext-point]:    ../../dsl/points/parsers/http.md#action_ext-filter
[link-uri-point]:           ../../dsl/points/parsers/http.md#uri-filter

[doc-point-list]:           ../../dsl/points/parsers.md

# Configuration of Point Processing Rules

Points are configured in the **Insertion Points** section of the policy editor on your Wallarm account. This section is divided into two blocks:

* **Where in the request to include** for points allowed for processing
* **Where in the request to exclude** for points not allowed for processing

To add the formed list of points, use the **Add insertion point** button in the required block.

To delete the point, use the «—» symbol next to it:

![Deleteing a point][img-remove-point]

!!! info "Basic points"
    When creating a policy, typical points are automatically added to the **Where in the request to include** section:

    * `URI_value`: [URI][link-uri-point]
    * `PATH_.*`: any part of the URI [path][link-path-point]
    * `ACTION_NAME`: [action][link-action-name-point]
    * `ACTION_EXT`: [extension][link-action-ext-point]
    * `GET_.*`: any [GET parameter][link-get-point]
    * `POST_.*`: any [POST parameter][link-post-point]
    
    The list of points in the **Where in the request to exclude** section is empty by default.

    The same list of points is configured for the default policy. This policy cannot be changed.

 
!!! info "Point reference"
    When creating or editing points, you can click on the **How to use** link to get additional details regarding points.

    ![Point reference][img-point-help]

    The full list of points which FAST can process is available by the [link][doc-point-list].
