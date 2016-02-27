<p align=center>
 <img src="/client/logo_with_text.png">
</p>


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
### Physical Files
In order to change the content of the website, there are two main folders to look at:

1. At "/client/" we have "about.php" and "notation.php". The first one houses the content for the site's landing page and the second is the notation that is mentioned on this site. 

2. At "/content/" we have the rest. Inside there will be folders for each different subject. When looking at each subject there will be two html files associated that load the content of the subject alongside folders that represent the topics. Then looking inside any of the topics associated to the subject will have a single html file associated to the topic alongside folders that represent the sections. Finally looking inside any of the sections associated to the topic will have a single html file associated to the section alongside html files that represent the examples associated to the section. Sometimes there may also be image files inside the section folders, but these are just images used inside either the notes or examples.

### Changing the Database
To begin with, the database is setup according to the following ERR diagram:

<p align="center">
 <img width=500 height=500 src="/client/database_setup.png">
</p>

I provide a current build of mine that can be found in "/content/db". After setting up, add subjects, topics, sections, and examples into the database as needed. As far as names go inside the database, for any object they must match the file name and adhere to the rules:

* All " " spaces must be replaced with "_"
* All "-" characters must be replaced with "AND"
* All "'" characters must be replaced with "APOSTROPHE"
* All ":" characters must be replaced with "COLON"
* All "," characters must be replaced with "COMMA"
* Subject name, sname, is unique to a given subject

The id given to any object is completely arbitrary so long as the id is unique to that object, which essentially means that when looking at sections there can only be a single section with an id of 7, but there may exist a subject, topic, and even example that have the same id. The order is what helps provide a "natural" ordering to the objects as needed. 


# Styling
All styles associated to the website can be found inside the "/styles" folder. This site is mobile-friendly and to make it easier to read, there exist different files for different screen widths. 


# Front-End Functionality
All of the functionality associated to the actual website can be found inside the "/scripts" folder. 


# Using the API
### Getting All Objects of a Certain Type
The API used for this website has been written in PHP and can be found inside the "/api" folder. Now to use the actual API, there exist ways to extract the subjects, topics, sections, and examples from the database. So lets say that you want to get either all of the subjects, topics, sections, or examples that are available in the database. You would call on:
```
localhost/api/param
```
where "localhost" can remain if you are running a local build or replaced with the domain name and param represents what we want to get which can be one of four things:
* subjects
* topics
* sections
* examples

### Getting Specific Object(s)
Now what if we want to get a specific object given that we know some information that can be used to identify it. Overall I can summarize all of the calls into a single generalization:
```
localhost/api/param1/param2/param3/param4
```
where:

* param1: This represents the object we want. Specifically this can be one of four things:
  * subjects
  * topics
  * sections
  * examples
* param2: This represents the object whose data is going to be provided. Specifically this can be one of four things:
  * subject
  * topic
  * section
  * example
* param3: This represents the type of data associated to the object in param2. Specifically this can be one of two things:
  * id
  * name
* param4: This represents the actual data value that is either the id or the name.

So for example, if I wanted to get the all the subjects associated with a topic whose id is 7 I would call:
```
localhost/api/subjects/topic/id/7
```
Now if I wanted to get the example whose name is "example_1":
```
localhost/api/examples/example/name/example_1
```
Note that since example names are not unique, this will return all of the examples who have such a name. The only time when a name is going to be unique is for any subject, otherwise expect that you might get back more than one result.

### Getting File Contents
The API also has calls to get back the html content associated to any given section or examples. To get the contents of a subject, topic, section, or example call:
```
localhost/api/get_example_content/id
localhost/api/get_section_content/id
localhost/api/get_topic_content/id
localhost/api/get_subject_content/id

```
where "id" in all cases has to be replaced with the actual id of the object. Notice that unlike getting objects, I only allow you to use the id here as a parameter since the id guarantees a unique object.


# Version History

### v.0.0.4
* Logo Redesign
* Hamburger Button Fix for Mobile
* Official Documentation
* Consolidated the Initial Development Process into a Single Command
* Content++

### v.0.0.3
* Logo Redesign
* Math Formula Rendering Issue Fixed
* Images not Loading Fixed
* No More About Link on the Landing Page Menu
* Fixed Some of the Content

### v.0.0.2
* Mobile Support
* About Page - Nore More Home Page
* Subject Page - Gives a Brief Overview on a Subject and its Notation
* Topic Page - Gives a Brief Overview on a Topic
* Menu Selection Coloring
* Logo and Favicon

### v.0.0.1
* Initial Release


# Future Plans
In the near future I see a couple of things that I want to change about the website:
* Design a CMS, content management system, that will provide a user with the ability to control the contents of the website through a simple web interface rather than having to add content through a development environment
* Rewrite the API in Node.js
* Add the subjects (these represent the main ones of interest, over time the list may evolve):
 * Precalculus
 * Differential Calculus
 * Integral Calculus
 * Linear Algebra
 * Vector Calculus
 * Complex Variables
 * Probability

# License
<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">manualmath.com</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="https://github.com/nathanmarianovsky/manualmath.com" property="cc:attributionName" rel="cc:attributionURL">nathanmarianovsky</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.
