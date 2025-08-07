const base = "https://checklist-api-8j62.onrender.com/api/v1";

export const searchIssuesURL = () => `${base}/issues`;

export const searchIssuesByFlowURL = (flow: string) => `${base}/issues/${flow}`;

export const searchIssueByIdURL = (id: string) => `${base}/issue/${id}`;

export const submitIssueURL = () => `${base}/issue`;
