<p align=center>
    <img src="/img/logo_with_text.png">
</p>


# Table of Contents

- [Setting Up](#setting-up)
- [Configuring the Database](#configuring-the-database)
- [Content Management System](#content-management-system)
    - [Accessing the CMS](#accessing-the-cms)
    - [General Structure of a Page](#general-structure-of-a-page)
    - [Navigating the CMS Bar](#navigating-the-cms-bar)
    - [Editing a Page](#editing-a-page)
    - [Editing the Sidenav](#editing-the-sidenav)
- [Styling](#styling)
- [Front-End Functionality](#front-end-functionality)
- [Using the API](#using-the-api)
    - [Getting All Objects of a Certain Type (GET)](#getting-all-objects-of-a-certain-type-get)
    - [Getting the Content of the About Page (POST)](#getting-the-content-of-the-about-page-post)
    - [Getting the Content of the About Page for Client (POST)](#getting-the-content-of-the-about-page-for-client-post)
    - [Changing the Content of the About Page (POST)](#changing-the-content-of-the-about-page-post)
    - [Getting the Content of any Subject, Topic, Section, or Example (POST)](#getting-the-content-of-any-subject-topic-section-or-example-post)
    - [Getting the Content of any Subject, Topic, Section, or Example for Client (POST)](#getting-the-content-of-any-subject-topic-section-or-example-for-client-post)
    - [Adding & Changing the Content of any Subject, Topic, Section, or Example (POST)](#adding--changing-the-content-of-any-subject-topic-section-or-example-post)
    - [Deleting any Subject, Topic, Section, or Example (POST)](#deleting-any-subject-topic-section-or-example-post)
    - [Adding a Contributor (POST)](#adding-a-contributor-post)
    - [Deleting a Contributor (POST)](#deleting-a-contributor-post)
    - [Grabbing a Contributor's Profile Information (POST)](#grabbing-a-contributors-profile-information-post)
    - [Grabbing a Contributor's Security Question (POST)](#grabbing-a-contributors-security-question-post)
    - [Changing a Contributor's Profile Information (POST)](#changing-a-contributors-profile-information-post)
    - [Changing a Contributor's Password (POST)](#changing-a-contributors-password-post)
    - [Changing a Contributor's Status (POST)](#changing-a-contributors-status-post)
    - [Changing a Contributor's Approval (POST)](#changing-a-contributors-approval-post)
    - [Changing a Contributor's Rank Approval (POST)](#changing-a-contributors-rank-approval-post)
    - [Checking the Answer of a Security Question (POST)](#checking-the-answer-of-a-security-question-post)
    - [Grabbing Administrator Information (POST)](#grabbing-administrator-information-post)
    - [Getting List of all Contributors (POST)](#getting-list-of-all-contributors-post)
    - [Getting List of Unapproved Contributors (POST)](#getting-list-of-unapproved-contributors-post)
    - [Getting List of Non-Committee Members (POST)](#getting-list-of-non-committee-members-post)
    - [Recording a Contributor's Live Session (POST)](#recording-a-contributors-live-session-post)
    - [Checking if a Contributor's is Live (POST)](#checking-if-a-contributors-is-live-post)
    - [Removing a Contributor's Live Session (POST)](#removing-a-contributors-live-session-post)
    - [Checking the Existence of an Email (POST)](#checking-the-existence-of-an-email-post)
    - [Checking Login Credentials (POST)](#checking-login-credentials-post)
    - [Adding a Contributor to the Committee (POST)](#adding-a-contributor-to-the-committee-post)
    - [Checking if a Contributor is on the Committee (POST)](#checking-if-a-contributor-is-on-the-committee-post)
    - [Removing a Contributor from the Committee (POST)](#removing-a-contributor-from-the-committee-post)
    - [Counting the Number of Contributors (GET)](#counting-the-number-of-contributors-get)
    - [Counting the Number of Committee Members (GET)](#counting-the-number-of-committee-members-get)
- [Running the Server](#running-the-server)
    - [Apache Server](#apache-server)
    - [NodeJS Server](#nodejs-server)
- [Future Plans](#future-plans)
- [License](#license)


# Setting Up
I have to assume that you have npm, git, and java installed. In order to get started first copy the repository over to your local machine and inside the root directory of the project, as administrator run:
```js
npm install -g bower gulp
npm install gulp gulp-install
gulp
```
This will handle the installation of all node_modules, bower_components, and build the necessary gulp files.


# Configuring the Database
The database is setup according to the following ERR diagram:

<p align="center">
    <img width=500 height=500 src="/img/database_setup.png">
</p>

Example builds can be found over at "/content/db".


# Content Management System
### Accessing the CMS
To access the system direct your browser to "localhost/login" where you will encounter:

<p align="center">
    <img width=500 height=500 src="/img/login.png">
</p>

As a first time user you will have to register a new account. Furthermore, if the system is of a fresh install the database will have to be manually accessed so as to change the "status" and "rank" values of the administrator to "1" and "admin" respectively.

### General Structure of a Page
Upon logging into the system you will hit something that looks like:

<p align="center">
    <img width=500 height=500 src="/img/cms.png">
</p>

### Navigating the CMS Bar
For any given page the bar found below the top nav:

<p align="center">
    <img src="/img/cms-bar.png">
</p>

provides all of the functionality to:
* view the content of any subject, topic, section, or example as is seen on the client side
* view the rendered changes that have not necessarily been pushed to the client side yet
* edit the content of any subject, topic, section, or example
* add a box with an associated title and body of content (only available in the edit view)
* approve the current changes to the content so as to push it live to the client side
* save any changes to the database permanently
It is important to note that any changes made on a page are not pushed to the database unless the save button is explicitly clicked. Moreover, for current changes to be pushed onto the client side the system uses a logarithmic scaling based on the number of active contributors to determine how many approvals are needed. If changes are made to the content of the page all previous approvals are reset by design to ensure that contributors do not provide approvals for content they may not have necessarily seen. 

### Editing a Page
Under the edit mode you can take a page with a clean slate and add a box using the cms-bar to obtain:

<p align="center">
    <img width=500 height=500 src="/img/cms-edit.png">
</p>

You can add as many boxes as your heart desires with each having the capability to:
* edit the title and body content by directly clicking on the text
* add inline mathematical text by invoking the dollar sign delimiters, i.e. $\sum\limits_{n=0}^\infty \frac{1}{n^2} = \frac{\pi^2}{6}$ (same as Latex)
* add a centered mathematical environment that supports a multiline format with alignment $\eqalign{2x + 2y &= 1 \\ 3x - 7y &= 5}$ (same as Latex)
* add a centered table that can be dynamically changed by inserting/removing rows and columns as needed
* add a centered image
* add a list (both ordered and unordered available)
* add a link
* add a note strictly for other contributors (will not appear on client side)
* move the selected box down
* move the selected box up
* delete itself
* toggle the display (this determines if the box will be hidden by default or not)
* show and hide the box content

### Editing the Sidenav
Every page will have a button located at the top of the sidenav:

<p align="center">
    <img src="/img/cms-nav.png">
</p>

where subjects, topics, sections, or examples can be added (depending on where you are located). Upon clicking you will find something similar to:

<p align="center">
    <img src="/img/cms-nav-modal.png">
</p>

It is here that new subjects, topics, sections, and examples can be added with the capability, like the current iterms, to have their names and order edited. Furthermore, each will have an associated approval and disapproval that functions in exactly the same manner as the content approval system. Therefore, an item will only be pushed to the client nav or deleted all together when the necessary number of approvals are given. It is important to note that like the content editing mode, any changes made to the sidenav are only pushed to the database when the button is explicitly clicked.

### Floating Action Button
At the bottom right of each page you will find the button which provides the following functionality:
* logout as a contributor
* update profile information
* approve/disapprove incoming contributors (only for committee members and administrator)
* provide an opinion on current non-committee members as to whether they should join the committee or not (only for committee members)
* add/remove a contributor from the committee and delete a contributor from the system (administrator only)


# Styling
All styles associated to the website can be found inside the "/styles/dev" folder. This site is mobile-friendly and to make it easier to read, there exist different files for different screen widths. 


# Front-End Functionality
All of the functionality associated to the actual website can be found inside the "/scripts/front-end" folder. 


# Using the API
For all of the following "localhost" can remain if you are running a local build or replaced with the domain name.
### Getting All Objects of a Certain Type (GET)
To get all subjects, topics, sections, or examples available in the database you would call on:
```
localhost/api/:objs
```
where "objs" represents what we want to get which can be one of four things:
* subjects
* topics
* sections
* examples

### Getting the Content of the About Page (POST)
To get the content of the about page you would call on:
```
localhost/api/cms/about/data
```

### Getting the Content of the About Page for Client (POST)
To get the content of the about page you would call on:
```
localhost/api/about/client
```
The difference between this and the previous call is that this does not grab the cms information for the client side as it is unnecessary.

### Changing the Content of the About Page (POST)
To change the content of the about page you would call on:
```
localhost/api/cms/about/change
```
where you would be required to provide the JSON data that has the parameters:
* heading
* title
* content
* heading_cms
* title_cms
* content_cms
* cms_approval

### Getting the Content of any Subject, Topic, Section, or Example (POST)
To get the content of the requested item you would call on:
```
localhost/api/:obj/data/cms
```
where "obj" represents what we want to get which can be one of four things:
* subject
* topic
* section
* example
alongside the JSON data that requires the parameter:
* param
which is the id of the object.

### Getting the Content of any Subject, Topic, Section, or Example for Client (POST)
To get the content of the requested item you would call on:
```
localhost/api/:obj/data/client
```
where "obj" represents what we want to get which can be one of four things:
* subject
* topic
* section
* example
alongside the JSON data that requires the parameter:
* param
which is the id of the object. The difference between this and the previous call is that this does not grab the cms information for the client side as it is unnecessary.

### Adding & Changing the Content of any Subject, Topic, Section, or Example (POST)
To add or change the content of the requested item you would call on:
```
localhost/api/:operation/:obj
```
where "obj" represents what we want to work with which can be one of four things:
* subject
* topic
* section
* example
alongside the JSON data that requires the parameter:
* param
which is the id of the object.

### Deleting any Subject, Topic, Section, or Example (POST)
To delete the requested item from the database you would call on:
```
localhost/api/delete/:obj
```
where "obj" represents what we want to get which can be one of four things:
* subject
* topic
* section
* example
alongside the JSON data that requires the parameter:
* param
which is the id of the object.

### Adding a Contributor (POST)
To add a contributor to the system you would call on:
```
localhost/api/cms/contributor/add
```
alongside the JSON data that requires the parameters:
* email
* fname
* lname
* passwd
* question
* answer
where by default a contributor is added with a status of "0". The password and answer are encrypted using the bcrypt library so as to provide anonymity, even from the administrator.  

### Deleting a Contributor (POST)
To delete a contributor from the system you would call on:
```
localhost/api/cms/contributor/remove
```
alongside the JSON data that requires the parameter:
* email

### Grabbing a Contributor's Profile Information (POST)
To grab a contributor's profile from the system you would call on:
```
localhost/api/cms/contributor/profile
```
alongside the JSON data that requires the parameter:
* email

### Grabbing a Contributor's Security Question (POST)
To grab a contributor's security question from the system you would call on:
```
localhost/api/cms/contributor/security
```
alongside the JSON data that requires the parameter:
* email

### Changing a Contributor's Profile Information (POST)
To change a contributor's profile in the system you would call on:
```
localhost/api/cms/contributor/change/profile
```
alongside the JSON data that requires the parameters:
* email
* fname
* lname
* question
* answer

### Changing a Contributor's Password (POST)
To change a contributor's password in the system you would call on:
```
localhost/api/cms/contributor/change/password
```
alongside the JSON data that requires the parameters:
* email
* password

### Changing a Contributor's Status (POST)
To change a contributor's status in the system you would call on:
```
localhost/api/cms/contributor/change/status
```
alongside the JSON data that requires the parameters:
* email
* value

### Changing a Contributor's Approval (POST)
To change a contributor's approval in the system you would call on:
```
localhost/api/cms/contributor/change/approval
```
alongside the JSON data that requires the parameter:
* email
* approval
* del

### Changing a Contributor's Rank Approval (POST)
To change a contributor's rank approval in the system you would call on:
```
localhost/api/cms/contributor/change/rankApproval
```
alongside the JSON data that requires the parameters:
* email
* rank_approval
* rank_disapproval

### Checking the Answer of a Security Question (POST)
To check an answer to the security question you would call on:
```
localhost/api/cms/contributor/check/security
```
alongside the JSON data that requires the parameters:
* email
* answer

### Grabbing Administrator Information (POST)
To grab the administrator's public information from the system you would call on:
```
localhost/api/cms/admin/info
```

### Getting List of all Contributors (POST)
To obtain the list of all contributors (besides the administrator) from the database you would call on:
```
localhost/api/cms/contributors/data
```
This strictly picks from the contributors that have a status of "1".

### Getting List of Unapproved Contributors (POST)
To obtain the list of unapproved contributors from the database you would call on:
```
localhost/api/cms/contributors/unapproved
```
This corresponds to all contributors that have a status of "0".

### Getting List of Non-Committee Members (POST)
To obtain the list of non-committee members from the database you would call on:
```
localhost/api/cms/contributors/nonmember
```
This strictly picks from the contributors that have a status of "1".

### Recording a Contributor's Live Session (POST)
To record a contributor's current session in the database you would call on:
```
localhost/api/cms/live/add
```
alongside the JSON data that requires the parameter:
* email

### Checking if a Contributor's is Live (POST)
To check if a contributor is currently live you would call on:
```
localhost/api/cms/live/check
```
alongside the JSON data that requires the parameter:
* email

### Removing a Contributor's Live Session (POST)
To remove a contributor's current session in the database you would call on:
```
localhost/api/cms/live/remove
```
alongside the JSON data that requires the parameter:
* email

### Checking the Existence of an Email (POST)
To record a contributor's current session in the database you would call on:
```
localhost/api/cms/live/add
```
alongside the JSON data that requires the parameter:
* email

### Checking Login Credentials (POST)
To check the login credentials against the database you would call on:
```
localhost/api/cms/check/login
```
alongside the JSON data that requires the parameter:
* email
* passwd

### Adding a Contributor to the Committee (POST)
To add a contributor to the committee you would call on:
```
localhost/api/cms/committee/add
```
alongside the JSON data that requires the parameter:
* email

### Checking if a Contributor is on the Committee (POST)
To check if a contributor is on the committee you would call on:
```
localhost/api/cms/committee/check
```
alongside the JSON data that requires the parameter:
* email

### Removing a Contributor from the Committee (POST)
To remove a contributor from the committee you would call on:
```
localhost/api/cms/committee/remove
```
alongside the JSON data that requires the parameter:
* email
This will not delete a contributor from the system, but rather lower the rank in the database.

### Counting the Number of Contributors (GET)
To count the number of contributors in the database you would call on:
```
localhost/api/cms/count/contributors
```
This corresponds to all contributors that have a status of "1".

### Counting the Number of Committee Members (GET)
To count the number of committee members in the database you would call on:
```
localhost/api/cms/count/committee
```

# Running the Server
### Apache Server (Deprecated)
Prior to running you need to modify the following code at "/api/config.php":
```php
$mysql_hostname = "";
$mysql_user = "";
$mysql_password = "";
$mysql_database = "";
```
and put in your credentials for the database. To configure the port you need to find the following lines inside the Apache "httpd.conf" file:
```sh
Listen 0.0.0.0:80
Listen [::0]:80
```
and change "80" to whichever port you wish to use. With Apache you may also have to change the default path so in the same configuration file find:
```sh
DocumentRoot "path"
```
and replace "path" with the project path. Lastly in the same file also change:
```sh
<Directory "path">
```
"path" once again to the desired path. While still on the topic of Apache configuration make sure that the following modules are turned on:
```sh
core_module
so_module
watchdog_module
http_module
log_config_module
logio_module
version_module
unixd_module
access_compat_module
alias_module
auth_basic_module
authn_core_module
authn_file_module
authz_core_module
authz_host_module
authz_user_module
autoindex_module
dir_module
env_module
filter_module
mime_module
mpm_prefork_module
negotiation_module
php5_module
rewrite_module
setenvif_module
status_module
deflate_module
```
Now we need to minify the necessary files so in the root directory run:
```sh
node minify.js
```
Finally you can run the Apache service!

### NodeJS Server
Prior to running you need to modify the following code at "/scripts/back-end/config.js":
```js
"host": "",
"user": "",
"password": "",
"database": ""
```
and put in your credentials for the database and at "/app.js":
```js
app.listen(8080, () => {
  console.log("The server is now listening!");
});
```
change "8080" to whichever port you wish to use. Now to minify all of the necessary documents and start the server run:
```js
node app.js
```
at the root directory. If you see:
```
Everything has been minified!
The server is now listening!
```
the server has officially been launched and is listening on the port you provided.


# Future Plans
* Add the subjects (these represent the main ones of interest, over time the list may evolve):
    * Precalculus
    * Integral Calculus
    * Linear Algebra
    * Vector Calculus
    * Complex Variables
    * Probability

# License
Located at "LICENSE.md".