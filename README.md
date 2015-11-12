<h1 align=center>Documentation</h1>
[![NPM version][npm-image]][npm-url]


# Setting Up
In order to get started first copy the repository over to your local machine. Now I have to assume that you have npm installed, and so inside the root directory of the project as administrator run:
```js
npm run install_everything
```
This will handle the installation of all node_modules, bower_components, and build the necessary gulp files. The next thing is to make sure that the database credentials are correct inside the file located at "/api/config.php":
```php
$mysql_hostname = "localhost";
$mysql_user = "user";
$mysql_password = "password";
$mysql_database = "database";
```
With this the project is ready to go.


# Changing the Content
In order to change the content of the website, there are two main folders to look at:

1. At "/client/" we have "about.php" and "notation.php". The first one houses the content for the site's landing page and the second is the notation that is mentioned on this site. 

2. At "/content/" we have the rest. Inside there will be folders for each different subject. When looking at each subject there will be two html files associated that load the content of the subject alongside folders that represent the topics. Then looking inside any of the topics associated to the subject will have a single html file associated to the topic alongside folders that represent the sections. Finally looking inside any of the sections associated to the topic will have a single html file associated to the section alongside html files that represent the examples associated to the section. Sometimes there may also be image files inside the section folders, but these are just images used inside either the notes or examples.


# Styling
All styles associated to the website can be found inside the "/styles" folder. This site is mobile-friendly and to make it easier to read, there exist different files for different screen widths. 


# Front-End Functionality
All of the functionality associated to the actual website can be found inside the "/scripts" folder. 


# Using the API
## Getting Objects
The API used for this website has been written in PHP and can be found inside the "/api" folder. Now to use the actual API, there exist ways to extract the subjects, topics, sections, and examples from the database. Overall I can summarize all of the endpoints into a single generalization:
```
localhost/api/type_of_object_wanted/type_of_object_whose_data_is_passing_in/object_type_of_parameter/object_parameter
```
Here localhost represents the local build but can obviously be replaced with the actual domain. As for the rest:

* type_of_object_wanted: This represents what we want to get. Specifically this can be one of four things:
  * subjects
  * topics
  * sections
  * examples
* type_of_object_whose_data_is_passing_in: This represents the object of whose data is going to be provided. Specifically this can be one of four things:
  * subject
  * topic
  * section
  * example
* object_type_of_parameter: This represents the type of parameter that we are going to use from "type_of_object_whose_data_is_passing_in". Specifically this can be one of two things:
  * id
  * name
* object_parameter: This represents the actual parameter value that is either the id or the name.

So for example, if I wanted to get the all the subjects associated with a topic whose id is 7 I would call:
```
localhost/api/subjects/topic/id/7
```
Now how about if I wanted to get the example whose name is "example_1":
```
localhost/api/examples/example/name/example_1
```
Note that since example names are not unique, this will return all of the examples who have such a name. The only time when a name is going to be unique is for any subject, otherwise expect that you might get back more than one result.

## Getting File Contents
The API also has calls to get back the html content associated to any given section or examples. To get the contents of a section call:
```
localhost/api/get_section_content/id
```
and for examples:
```
localhost/api/get_example_content/id
```
where "id" in both cases has to be replaced with the actual id of the section or example. Notice that unlike getting objects, I only allow you to use the id here as a parameter since the id guarantees a unique object.

# License
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">manualmath.com</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="https://github.com/nathanmarianovsky/manualmath.com" property="cc:attributionName" rel="cc:attributionURL">nathanmarianovsky</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

[npm-url]: https://npmjs.org/package/gulp
[npm-image]: http://img.shields.io/npm/v/gulp.svg
