var JiraClient = require('jira-connector');

var jira = new JiraClient( {
    host: 'hackersandslackers.atlassian.net',
    basic_auth: {
        username: 'integrations',
        password: 'a9tw3rjw'
    }
});

jira.issue.getIssue({
    issueKey: 'TD-29'
}, function(error, issue) {
    console.log(issue.fields.summary);
    console.log(error);
});
