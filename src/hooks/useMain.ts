import { Issue } from "../types";
import { submitIssueURL } from "./urls";
import useHttpData from "./useHttpData";

export default () => {
  const {
    data: submitAnswer,
    loading: submitLoading,
    error: submitError,
    putData: updateIssueData,
  } = useHttpData<Issue>();


  const updateIssue = (issue: Issue): Promise<Issue | undefined> => {
    console.log("updating");
    return updateIssueData(submitIssueURL(), issue);
  };

  return {
    submitAnswer,
    submitLoading,
    submitError,
    updateIssue,
  };
};
