import {JiraApiBase} from "./JiraApiBase";

import JiraCloudApi from './JiraCloudApi'
import JiraServerApi from './JiraServerApi'
import * as JiraMocksApi from './JiraMocksApi'

function detectApi(): JiraApiBase {
    if (process.env.NODE_ENV === 'dev') {
        return JiraMocksApi;
    } else if (window.AP && window.AP.jira && window.AP.user) {
        return new JiraCloudApi();
    } else if (window.top.JIRA && window.top.JIRA.Ajax) {
        // It's important that window.top line above is not executed on Cloud as it throws cross domain error there.
        return new JiraServerApi();
    }
    return JiraMocksApi;
}

export default class JiraApi {
    private api = detectApi();

    getProject(projectKeyOrId: string): Promise<Jira.Project> {
        return this.api.isMock
            ? JiraMocksApi.getProject(projectKeyOrId)
            : this.api.get(`/rest/api/2/project/${projectKeyOrId}`);
    }

    getProjects(): Promise<Array<Jira.Project>> {
        return this.api.isMock
            ? JiraMocksApi.getProjects()
            : this.api.get('/rest/api/2/project');
    }

    getUser(userKey: string): Promise<Jira.User> {
        return this.api.isMock
            ? JiraMocksApi.getUser(userKey)
            : this.api.get(`/rest/api/2/user?key=${userKey}`);
    }

    getUsers(username: string): Promise<Array<Jira.User>> {
        return this.api.isMock
            ? JiraMocksApi.getUsers(username)
            : this.api.get(`/rest/api/2/user/search?username=${username}`);
    }

    getGroupsForPicker({query}: { query: string }) {
        return this.api.isMock
            ? JiraMocksApi.getGroupsForPicker(query)
            : this.api.get(`/rest/api/2/groups/picker?query=${query}`);
    }

    getIssueCreateMeta(): Promise<object> {
        return this.api.isMock
            ? JiraMocksApi.getIssueCreateMeta()
            : this.api.get(`/rest/api/2/issue/createmeta`);
    }
}