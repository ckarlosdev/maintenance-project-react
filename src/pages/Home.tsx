import { Badge, Button, Col, Container, Row } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import hmbLogo from "../assets/hmbLogo.png";
import { useNavigate } from "react-router-dom";
import "../styles/logo.css";
import { useEffect, useState } from "react";
import { searchIssuesURL } from "../hooks/urls";
import useHttpData from "../hooks/useHttpData";
import { Issue } from "../types";

function Home() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[] | undefined>();

  const { data: issuesData, search: searchIssues } = useHttpData<Issue[]>();

  useEffect(() => {
    const url = searchIssuesURL();
    searchIssues(url);
  }, []);

  useEffect(() => {
    if (issuesData) {
      setIssues(issuesData);
    }
  }, [issuesData]);

  return (
    <div className="app-wrapper">
      <Container className="app-container">
        <Row className="justify-content-center">
          <Col md={8} className="mb-3">
            <Image src={hmbLogo} rounded className="logo-img" />
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Button
            variant="outline-primary"
            className="logo-img fs-1"
            onClick={() => navigate("/problems/Pending")}
            style={{ fontWeight: "bold" }}
          >
            Pending{" "}
            <Badge pill bg="danger">
              {issues?.filter((issue) => issue.flow === "Pending").length}
            </Badge>
            <span className="visually-hidden">unread messages</span>
          </Button>
        </Row>
        <Row className="justify-content-center">
          <Button
            variant="outline-primary"
            className="logo-img fs-1"
            style={{ fontWeight: "bold" }}
            // onClick={() => navigate("/problems/In Progress")}
            onClick={() => {
              const inProgressIssuesCount = issues ? issues.filter((issue) => issue.flow === "In Progress").length : 0;
              if (inProgressIssuesCount === 0) {
                alert("No data.");
              } else {
                navigate("/problems/In Progress");
              }
            }}
          >
            In Progress{" "}
            <Badge pill bg="secondary">
              {issues?.filter((issue) => issue.flow === "In Progress").length}
            </Badge>
          </Button>
        </Row>
        <Row className="justify-content-center">
          <Button
            variant="outline-primary"
            className="logo-img fs-1"
            style={{ fontWeight: "bold" }}
            onClick={() => navigate("/problems/Fixed")}
            // onClick={() => navigate("/records")}
          >
            Fixed{" "}
            <Badge pill bg="success">
              {issues?.filter((issue) => issue.flow === "Fixed").length}
            </Badge>
          </Button>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
